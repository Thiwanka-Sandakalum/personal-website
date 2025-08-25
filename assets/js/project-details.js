/**
 * Project Details Page JavaScript
 * Handles dynamic loading of project details based on URL parameter
 */

document.addEventListener('DOMContentLoaded', function () {
    // Get project ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (projectId) {
        loadProjectDetails(projectId);
    } else {
        // Redirect to projects page if no ID provided
        window.location.href = 'projects.html';
    }
});

/**
 * Load and display project details
 */
async function loadProjectDetails(projectId) {
    try {
        // Load projects data
        const dataManager = window.dataManager;
        const projectsData = await dataManager.loadProjects();

        // Find the specific project
        const project = projectsData.projects.find(p => p.id == projectId);

        if (!project) {
            throw new Error('Project not found');
        }

        // Update page title
        document.title = `${project.title} - Thiwanka Sandakalum`;

        // Render project details
        const renderer = window.templateRenderer;
        renderer.renderProjectDetails(project);

        // Initialize gallery lightbox
        initializeGallery();

        // Initialize AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }

    } catch (error) {
        console.error('Error loading project details:', error);
        showErrorMessage();
    }
}

/**
 * Show error message if project cannot be loaded
 */
function showErrorMessage() {
    const detailsContainer = document.querySelector('.project-details-content');
    if (detailsContainer) {
        detailsContainer.innerHTML = `
            <div class="error-message">
                <h2>Project Not Found</h2>
                <p>Sorry, the requested project could not be found.</p>
                <a href="projects.html" class="btn btn-primary">Back to Projects</a>
            </div>
        `;
    }
}

/**
 * Initialize gallery lightbox functionality
 */
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item img');

    galleryItems.forEach(img => {
        img.addEventListener('click', function () {
            openLightbox(this.src, this.alt);
        });
    });
}

/**
 * Open lightbox for image viewing
 */
function openLightbox(src, alt) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="${src}" alt="${alt}">
            <div class="lightbox-caption">${alt}</div>
        </div>
    `;

    // Add lightbox styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        text-align: center;
    `;

    const img = lightbox.querySelector('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        border-radius: 8px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
    `;

    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 0.5rem;
        line-height: 1;
    `;

    const caption = lightbox.querySelector('.lightbox-caption');
    caption.style.cssText = `
        color: white;
        margin-top: 1rem;
        font-size: 1rem;
    `;

    // Add to document
    document.body.appendChild(lightbox);

    // Animate in
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);

    // Close functionality
    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(lightbox);
        }, 300);
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}