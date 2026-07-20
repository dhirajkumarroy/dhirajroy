// Main JavaScript (Production-ready)

function initApp() {
    loadComponents();
    loadProjects();
    initContactForm();
    initSmoothScroll();
    initLazyLoading();
    initScrollAnimations();
    initTheme();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

/* =========================
   THEME STYLING & PERSISTENCE
========================= */
function initTheme() {
    // Check local storage or browser preference and apply immediately
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

function setupThemeToggleListener() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

/* =========================
   NAVBAR & STICKY BEHAVIOR
========================= */
function initNavbar() {
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        });
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

/* =========================
   LOAD COMPONENTS
========================= */
async function loadComponents() {
    try {
        const [navbarRes, footerRes] = await Promise.all([
            fetch('/components/navbar.html'),
            fetch('/components/footer.html')
        ]);

        document.getElementById('navbar-container').innerHTML = await navbarRes.text();
        document.getElementById('footer-container').innerHTML = await footerRes.text();

        initNavbar();
        setActiveNavLink();
        setupThemeToggleListener();

    } catch (error) {
        console.error('Component loading failed:', error);
    }
}

/* =========================
   ACTIVE NAV LINK
========================= */
function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || link.target === '_blank') return;

        link.classList.toggle('active', href.includes(currentPath));
    });
}

/* =========================
   SCROLL REVEAL ANIMATIONS
========================= */
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
        document.querySelectorAll('.progress-bar-fill').forEach(el => {
            el.style.width = el.getAttribute('data-progress') || '0%';
        });
        return;
    }

    // Observer for fade-in reveal elements
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    // Observer for progress bars and numeric counters
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Progress Bar animation
                if (entry.target.classList.contains('progress-bar-fill')) {
                    entry.target.style.width = entry.target.getAttribute('data-progress') || '0%';
                }
                
                // Stat Counter animation
                if (entry.target.classList.contains('stat-number') && !entry.target.classList.contains('counted')) {
                    animateCounter(entry.target);
                }
                
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    // Target elements
    setTimeout(() => {
        document.querySelectorAll('.reveal, .project-card, .timeline-card, .service-card, .building-card, .tech-group-card').forEach(el => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });

        document.querySelectorAll('.progress-bar-fill, .stat-number').forEach(el => {
            skillObserver.observe(el);
        });
    }, 200);
}

function animateCounter(element) {
    element.classList.add('counted');
    const textVal = element.textContent.trim();
    const finalVal = parseInt(textVal);
    if (isNaN(finalVal)) return;

    const suffix = textVal.replace(/[0-9]/g, ''); // Extract '+' or details
    let current = 0;
    const duration = 1200; // ms
    const stepTime = Math.max(Math.floor(duration / finalVal), 15);
    
    const interval = setInterval(() => {
        current += Math.ceil(finalVal / 40);
        if (current >= finalVal) {
            element.textContent = finalVal + suffix;
            clearInterval(interval);
        } else {
            element.textContent = current + suffix;
        }
    }, stepTime);
}

/* =========================
   PROJECTS SHOWCASE
========================= */
function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    if (typeof projectsData !== 'undefined' && projectsData.length > 0) {
        renderProjects(projectsData.slice(0, 3));
    } else {
        container.innerHTML = '<div class="loading-spinner">No projects available</div>';
    }
}

function getProjectIcon(title) {
    const t = title.toLowerCase();
    if (t.includes('connect')) return '💬';
    if (t.includes('cart') || t.includes('kart')) return '🛒';
    if (t.includes('next')) return '⚡';
    return '📁';
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-icon">
                ${getProjectIcon(project.title)}
            </div>
            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-title">${escapeHtml(project.title)}</h3>
                    <span class="badge badge-${project.status === 'Live' ? 'live' : project.status === 'In Development' ? 'dev' : 'upcoming'}">
                        ${project.status === 'Live' ? '● ' : ''}${project.status}
                    </span>
                </div>
                <p class="project-description">${escapeHtml(project.description)}</p>
                
                <div style="margin-bottom: 1.1rem;">
                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">Architecture:</span>
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">${escapeHtml(project.architecture)}</span>
                </div>

                <div class="project-tags">
                    ${(project.techBadges || []).map(tech => `<span class="project-tag">${escapeHtml(tech)}</span>`).join('')}
                </div>

                <div class="project-links">
                    <a href="${safeUrl(project.github)}"
                       class="project-link"
                       target="_blank"
                       rel="noopener noreferrer">
                        GitHub →
                    </a>

                    ${
                        project.demo
                        ? `<a href="${safeUrl(project.demo)}"
                              class="project-link"
                              target="_blank"
                              rel="noopener noreferrer">
                              Live Demo →
                           </a>`
                        : `<span class="project-link disabled">
                              Demo Coming Soon
                           </span>`
                    }

                    <a href="${safeUrl(project.caseStudy)}" class="project-link">
                        Case Study →
                    </a>
                </div>
            </div>
        </div>
    `).join('');
    
    // Re-init observer for dynamically added cards
    initScrollAnimations();
}

/* =========================
   CONTACT FORM VALIDATION
========================= */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        let valid = true;

        if (!name || name.length < 2) {
            showError('name', 'Minimum 2 characters required');
            valid = false;
        }

        if (!email || !isValidEmail(email)) {
            showError('email', 'Valid email required');
            valid = false;
        }

        if (!message || message.length < 10) {
            showError('message', 'Minimum 10 characters required');
            valid = false;
        }

        if (!valid) return;

        const feedback = document.getElementById('form-feedback');
        const submitBtn = form.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending Message...';

        const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5000/api/v1'
            : 'https://api.dhirajroy.com/api/v1';

        try {
            const response = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name: name,
                    email: email,
                    subject: 'General Inquiry from Portfolio Landing Page',
                    message: message
                })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                feedback.className = 'form-feedback success';
                feedback.textContent = result.message || "Thank you! Your message has been submitted.";
                feedback.style.display = 'block';
                feedback.style.color = '#22c55e';
                form.reset();
            } else {
                throw new Error(result.message || 'Failed to send message.');
            }
        } catch (err) {
            feedback.className = 'form-feedback error';
            feedback.textContent = err.message || 'Something went wrong. Please try again.';
            feedback.style.display = 'block';
            feedback.style.color = '#ef4444';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 5000);
        }
    });
}

/* =========================
   HELPERS
========================= */
function showError(id, msg) {
    const el = document.getElementById(`${id}-error`);
    if (el) {
        el.textContent = msg;
        el.style.display = 'block';
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(e => {
        e.textContent = '';
        e.style.display = 'none';
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =========================
   SMOOTH SCROLL
========================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/* =========================
   LAZY LOADING
========================= */
function initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.loading = 'lazy';
                observer.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => observer.observe(img));
}

/* =========================
   SECURITY
========================= */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function safeUrl(url) {
    try {
        if (url.startsWith('/')) return url; // Allow relative paths
        return new URL(url).href;
    } catch {
        return '#';
    }
}