// Projects page specific JS
let allProjects = [];

document.addEventListener('DOMContentLoaded', () => {
    loadAllProjects();
    initFilters();
});

function loadAllProjects() {
    const projectsContainer = document.getElementById('all-projects-container');
    if (!projectsContainer) return;

    // Show skeleton loader
    projectsContainer.innerHTML = `
        <div class="project-card skeleton">
            <div class="skeleton-icon"></div>
            <div class="project-content">
                <div class="skeleton-title"></div>
                <div class="skeleton-description"></div>
                <div class="skeleton-tags"></div>
                <div class="skeleton-links"></div>
            </div>
        </div>
    `.repeat(3);

    setTimeout(() => {
        if (typeof projectsData !== 'undefined' && projectsData.length > 0) {
            allProjects = projectsData;
            renderFilteredProjects();
        } else {
            projectsContainer.innerHTML = '<div class="loading-spinner">No projects available</div>';
        }
    }, 400);
}

function getProjectIcon(title) {
    const t = title.toLowerCase();
    if (t.includes('connect')) return '💬';
    if (t.includes('cart') || t.includes('kart')) return '🛒';
    if (t.includes('next')) return '⚡';
    return '📁';
}

function renderFilteredProjects() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const sortValue = document.getElementById('sortSelect')?.value || 'newest';

    let filtered = allProjects.filter(project => {
        const matchesSearch = searchTerm === '' ||
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm);

        let matchesTag = true;
        if (activeFilter !== 'all') {
            const techText = (project.title + ' ' + project.description + ' ' + project.techBadges.join(' ')).toLowerCase();
            const techKeywords = {
                java: ['java', 'spring', 'jpa', 'boot'],
                laravel: ['laravel', 'php'],
                node: ['node', 'express', 'javascript'],
                react: ['react'],
                automation: ['n8n', 'automation', 'workflow']
            };
            const keywords = techKeywords[activeFilter] || [activeFilter];
            matchesTag = keywords.some(keyword => techText.includes(keyword));
        }

        return matchesSearch && matchesTag;
    });

    // Apply sorting
    filtered = sortProjects(filtered, sortValue);

    // Update count
    const countSpan = document.getElementById('projectsCount');
    if (countSpan) countSpan.textContent = filtered.length;

    // Show/hide clear filters button
    const clearBtn = document.getElementById('clearFiltersBtn');
    const hasActiveFilter = activeFilter !== 'all' || searchTerm !== '';
    if (clearBtn) clearBtn.style.display = hasActiveFilter ? 'inline-flex' : 'none';

    const container = document.getElementById('all-projects-container');
    const noResults = document.getElementById('no-results');

    if (filtered.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    container.innerHTML = filtered.map(project => `
        <div class="project-card reveal active">
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
                
                <div style="margin-bottom: 1rem;">
                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">Architecture:</span>
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">${escapeHtml(project.architecture)}</span>
                </div>

                <div style="margin-bottom: 1.25rem;">
                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 0.4rem;">Key Features:</span>
                    <ul style="padding-left: 1.15rem; margin: 0; font-size: 0.85rem; color: var(--text-secondary); list-style: disc; display: flex; flex-direction: column; gap: 0.35rem;">
                        ${(project.features || []).map(feat => `<li>${escapeHtml(feat)}</li>`).join('')}
                    </ul>
                </div>

                <div class="project-tags" style="margin-bottom: 1.25rem;">
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
                        ? `<a href="${safeUrl(project.demo)}" class="project-link" target="_blank" rel="noopener noreferrer">Live Demo →</a>`
                        : `<span class="project-link disabled">Demo Coming Soon</span>`
                    }
                    <a href="${safeUrl(project.caseStudy)}" class="project-link">
                       Case Study →
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

function sortProjects(projects, sortBy) {
    const sorted = [...projects];
    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => b.id - a.id);
        case 'oldest':
            return sorted.sort((a, b) => a.id - b.id);
        case 'title-asc':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'title-desc':
            return sorted.sort((a, b) => b.title.localeCompare(a.title));
        default:
            return sorted;
    }
}

function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const clearBtn = document.getElementById('clearFiltersBtn');

    const applyFilters = () => {
        renderFilteredProjects();
    };

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            filterBtns.forEach(b => b.classList.remove('active'));
            const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if (allBtn) allBtn.classList.add('active');
            if (sortSelect) sortSelect.value = 'newest';
            applyFilters();
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function safeUrl(url) {
    try {
        if (url.startsWith('/')) return url;
        return new URL(url).href;
    } catch {
        return '#';
    }
}