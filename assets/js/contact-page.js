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
        const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
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
            const submitBtn = form.querySelector('button[type="submit"]');
            
            // Set loading state
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending Message...';
            
            feedback.style.display = 'none';
            feedback.className = 'form-feedback';

            // Auto-resolve base URL for local development and production domains
            const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5000/api/v1'
                : 'https://api.dhirajroy.com/api/v1';

            fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name: name,
                    email: email,
                    phone: phone || null,
                    subject: subject,
                    message: message
                })
            })
            .then(async (response) => {
                const result = await response.json();
                if (response.ok && result.status === 'success') {
                    feedback.className = 'form-feedback success';
                    feedback.textContent = result.message || 'Thank you! I\'ll get back to you within 24 hours.';
                    feedback.style.display = 'block';
                    form.reset();
                } else {
                    // Extract validation messages if present
                    let errorMsg = result.message || 'Failed to send message. Please try again.';
                    if (result.errors && Array.isArray(result.errors)) {
                        errorMsg = result.errors.map(err => err.message).join(' | ');
                    }
                    throw new Error(errorMsg);
                }
            })
            .catch((error) => {
                feedback.className = 'form-feedback error';
                feedback.textContent = error.message;
                feedback.style.display = 'block';
                // Customize styling for errors (red text fallback)
                feedback.style.color = '#ef4444';
            })
            .finally(() => {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
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