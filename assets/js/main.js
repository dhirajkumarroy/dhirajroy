// Main JavaScript for portfolio

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    loadComponents();
    loadProjects();
    initContactForm();
    initSmoothScroll();
    setActiveNavLink();
    initLazyLoading();
});

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a link
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

async function loadComponents() {
    try {
        const navbarResponse = await fetch('components/navbar.html');
        const navbarHtml = await navbarResponse.text();
        document.getElementById('navbar-container').innerHTML = navbarHtml;
        
        const footerResponse = await fetch('components/footer.html');
        const footerHtml = await footerResponse.text();
        document.getElementById('footer-container').innerHTML = footerHtml;
        
        initNavbar();
        setActiveNavLink();
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Skip external links
        if (link.getAttribute('target') === '_blank') {
            return;
        }
        
        // Handle Home link with hash
        if (href === '/index.html#home' && currentPath === 'index.html') {
            link.classList.add('active');
        }
        // Handle About page
        else if (href === '/about.html' && currentPath === 'about.html') {
            link.classList.add('active');
        }
        // Handle Projects page
        else if (href === '/projects.html' && currentPath === 'projects.html') {
            link.classList.add('active');
        }
        // Handle Contact page
        else if (href === '/contact.html' && currentPath === 'contact.html') {
            link.classList.add('active');
        }
    });
    
    // Also handle hash-based navigation for Home sections
    if (currentPath === 'index.html' && currentHash) {
        const homeLink = document.querySelector('a[href="/index.html#home"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
}

function loadProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '<div class="loading-spinner">Loading projects...</div>';
    
    setTimeout(() => {
        if (typeof projectsData !== 'undefined' && projectsData.length > 0) {
            renderProjects(projectsData.slice(0, 3)); // Show only 3 on homepage
        } else {
            projectsContainer.innerHTML = '<div class="loading-spinner">No projects available</div>';
        }
    }, 100);
}

function renderProjects(projects) {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = projects.map(project => `
        <div class="project-card">
            <img src="${project.image}" 
                 alt="${project.title}" 
                 class="project-image" 
                 loading="lazy" 
                 onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 200\'%3E%3Crect width=\'400\' height=\'200\' fill=\'%23667eea\'/%3E%3Ctext x=\'50%%\' y=\'50%%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'white\' font-size=\'16\' font-family=\'Inter\'%3E${escapeHtml(project.title)}%3C/text%3E%3C/svg%3E'">
            <div class="project-content">
                <h3 class="project-title">${escapeHtml(project.title)}</h3>
                <p class="project-description">${escapeHtml(project.description)}</p>
                <div class="project-links">
                    <a href="${project.github}" class="project-link" target="_blank" rel="noopener noreferrer">GitHub →</a>
                    <a href="${project.demo}" class="project-link" target="_blank" rel="noopener noreferrer">Live Demo →</a>
                </div>
            </div>
        </div>
    `).join('');
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        let isValid = true;
        
        if (!name) {
            showError('name', 'Name is required');
            isValid = false;
        } else if (name.length < 2) {
            showError('name', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!message) {
            showError('message', 'Message is required');
            isValid = false;
        } else if (message.length < 10) {
            showError('message', 'Message must be at least 10 characters');
            isValid = false;
        }
        
        if (isValid) {
            const feedback = document.getElementById('form-feedback');
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

function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearErrors() {
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

function initSmoothScroll() {
    // Only apply smooth scroll for anchor links on the same page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                history.pushState(null, null, targetId);
                setActiveNavLink();
            }
        });
    });
}

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.loading = 'lazy';
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}