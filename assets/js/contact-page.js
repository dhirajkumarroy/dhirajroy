// Contact page specific JS
document.addEventListener('DOMContentLoaded', () => {
    initFullContactForm();
});

function initFullContactForm() {
    const form = document.getElementById('full-contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearFullErrors();
        
        const name = document.getElementById('full-name').value.trim();
        const email = document.getElementById('full-email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('full-message').value.trim();
        
        let isValid = true;
        
        if (!name) {
            showFullError('full-name', 'Name is required');
            isValid = false;
        } else if (name.length < 2) {
            showFullError('full-name', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        if (!email) {
            showFullError('full-email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFullError('full-email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!subject) {
            showFullError('subject', 'Subject is required');
            isValid = false;
        }
        
        if (!message) {
            showFullError('full-message', 'Message is required');
            isValid = false;
        } else if (message.length < 10) {
            showFullError('full-message', 'Message must be at least 10 characters');
            isValid = false;
        }
        
        if (isValid) {
            const feedback = document.getElementById('full-form-feedback');
            feedback.className = 'form-feedback success';
            feedback.textContent = 'Thank you! I\'ll get back to you within 24 hours.';
            feedback.style.display = 'block';
            form.reset();
            
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 5000);
        }
    });
}

function showFullError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFullErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => {
        error.style.display = 'none';
        error.textContent = '';
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
}