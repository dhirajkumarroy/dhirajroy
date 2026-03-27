// Projects page specific JS
document.addEventListener('DOMContentLoaded', () => {
    loadAllProjects();
});

function loadAllProjects() {
    const projectsContainer = document.getElementById('all-projects-container');
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '<div class="loading-spinner">Loading projects...</div>';
    
    setTimeout(() => {
        if (typeof projectsData !== 'undefined' && projectsData.length > 0) {
            renderAllProjects(projectsData); // Show ALL projects
        } else {
            projectsContainer.innerHTML = '<div class="loading-spinner">No projects available</div>';
        }
    }, 100);
}

function renderAllProjects(projects) {
    const projectsContainer = document.getElementById('all-projects-container');
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = projects.map(project => `
        <div class="project-card">
            <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200?text=Project+Image'">
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}