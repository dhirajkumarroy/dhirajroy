// Main JavaScript (Production-ready)

document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    loadProjects();
    initContactForm();
    initSmoothScroll();
    initLazyLoading();
});

/* =========================
   NAVBAR
========================= */
function initNavbar() {
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
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
   PROJECTS
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

/* ICON LOGIC */
function getProjectIcon(title) {
    const t = title.toLowerCase();

    if (t.includes('e-commerce')) return '🛒';
    if (t.includes('automation') || t.includes('n8n')) return '🤖';
    if (t.includes('microservice')) return '🏗️';
    if (t.includes('analytics')) return '📊';

    return '📁';
}

/* RENDER PROJECTS */
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = projects.map(project => `
        <div class="project-card">

            <div class="project-icon">
                ${getProjectIcon(project.title)}
            </div>

            <div class="project-content">

                <h3 class="project-title">
                    ${escapeHtml(project.title)}
                </h3>

                <p class="project-description">
                    ${escapeHtml(project.description)}
                </p>

                <!-- SAME AS PROJECT PAGE -->
                <div class="project-tags">
                    ${generateTags(project)}
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

                </div>

            </div>
        </div>
    `).join('');
}

/* =========================
   CONTACT FORM
========================= */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
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
        feedback.className = 'form-feedback success';
        feedback.textContent = "Message sent successfully!";
        feedback.style.display = 'block';

        form.reset();

        setTimeout(() => {
            feedback.style.display = 'none';
        }, 4000);
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
            const target = document.querySelector(this.getAttribute('href'));
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
        return new URL(url).href;
    } catch {
        return '#';
    }
}

function generateTags(project) {
    const tags = [];
    const text = (project.title + ' ' + project.description).toLowerCase();

    if (text.includes('spring') || text.includes('java')) tags.push('Java');
    if (text.includes('n8n')) tags.push('n8n');
    if (text.includes('api')) tags.push('REST API');
    if (text.includes('microservice')) tags.push('Microservices');
    if (text.includes('automation')) tags.push('Automation');

    return tags.slice(0, 3)
        .map(tag => `<span class="project-tag">${escapeHtml(tag)}</span>`)
        .join('');
}