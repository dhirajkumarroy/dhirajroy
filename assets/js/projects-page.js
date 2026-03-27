// Projects page specific JS
let allProjects = [];

document.addEventListener('DOMContentLoaded', () => {
    loadAllProjects();
    initFilters();
});

function loadAllProjects() {
    const projectsContainer = document.getElementById('all-projects-container');
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '<div class="loading-spinner">Loading projects...</div>';
    
    setTimeout(() => {
        if (typeof projectsData !== 'undefined' && projectsData.length > 0) {
            allProjects = projectsData;
            renderFilteredProjects();
        } else {
            projectsContainer.innerHTML = '<div class="loading-spinner">No projects available</div>';
        }
    }, 100);
}

function renderFilteredProjects() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    
    let filtered = allProjects.filter(project => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm);
        
        // Tag filter (simulate tags based on description)
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
            <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200?text=Project+Image'">
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

function generateTags(project) {
    // Simple tag generation based on title/description
    const tags = [];
    const text = (project.title + ' ' + project.description).toLowerCase();
    
    if (text.includes('spring') || text.includes('java')) tags.push('Java');
    if (text.includes('n8n')) tags.push('n8n');
    if (text.includes('node')) tags.push('Node.js');
    if (text.includes('api')) tags.push('REST API');
    if (text.includes('microservice')) tags.push('Microservices');
    if (text.includes('automation')) tags.push('Automation');
    
    // Limit to first 3 tags
    return tags.slice(0, 3).map(tag => `<span class="project-tag">${tag}</span>`).join('');
}

function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderFilteredProjects();
        });
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderFilteredProjects();
        });
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}