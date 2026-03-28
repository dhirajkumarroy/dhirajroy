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
            <div class="project-icon skeleton-icon"></div>
            <div class="project-content">
                <div class="skeleton-title"></div>
                <div class="skeleton-description"></div>
                <div class="skeleton-tags"></div>
                <div class="skeleton-links"></div>
            </div>
        </div>
    `.repeat(6);

    setTimeout(() => {
        if (typeof projectsData !== 'undefined' && projectsData.length > 0) {
            allProjects = projectsData;
            renderFilteredProjects();
        } else {
            projectsContainer.innerHTML = '<div class="loading-spinner">No projects available</div>';
        }
    }, 500);
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
            const techKeywords = {
                java: ['java', 'spring', 'jpa'],
                spring: ['spring', 'boot', 'java'],
                n8n: ['n8n', 'automation', 'workflow'],
                node: ['node', 'express', 'javascript'],
                python: ['python', 'django', 'flask']
            };
            const keywords = techKeywords[activeFilter] || [];
            const projectText = (project.title + ' ' + project.description).toLowerCase();
            matchesTag = keywords.some(keyword => projectText.includes(keyword));
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
        <div class="project-card">
            <div class="project-icon">📁</div>
            <div class="project-content">
                <h3 class="project-title">${escapeHtml(project.title)}</h3>
                <p class="project-description">${escapeHtml(project.description)}</p>
                <div class="project-tags">
                    ${generateTags(project)}
                </div>
                <div class="project-links">
                    <a href="${project.github}" class="project-link" target="_blank" rel="noopener noreferrer">GitHub →</a>
                    <a href="${project.demo}" class="project-link" target="_blank" rel="noopener noreferrer">Live Demo →</a>
                </div>
            </div>
        </div>
    `).join('');
}

function sortProjects(projects, sortBy) {
    const sorted = [...projects];
    switch (sortBy) {
        case 'newest':
            // Assume projects have an id (newer = higher id)
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

function generateTags(project) {
    const tags = [];
    const text = (project.title + ' ' + project.description).toLowerCase();

    if (text.includes('spring') || text.includes('java')) tags.push('Java');
    if (text.includes('n8n')) tags.push('n8n');
    if (text.includes('node')) tags.push('Node.js');
    if (text.includes('api')) tags.push('REST API');
    if (text.includes('microservice')) tags.push('Microservices');
    if (text.includes('automation')) tags.push('Automation');

    return tags.slice(0, 3).map(tag => `<span class="project-tag">${escapeHtml(tag)}</span>`).join('');
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