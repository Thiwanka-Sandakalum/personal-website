/**
 * Template Renderer - Handles dynamic content rendering
 */
class TemplateRenderer {
    constructor() {
        this.templates = new Map();
    }

    /**
     * Render personal info in hero section
     * @param {Object} personalInfo - Personal information data
     */
    renderHeroSection(personalInfo) {
        // Update hero text
        const heroName = document.querySelector('.hero-name');
        if (heroName && personalInfo.name) {
            const names = personalInfo.name.split(' ');
            heroName.innerHTML = names.map((name, index) =>
                `<span class="name-part ${index === names.length - 1 ? 'highlight' : ''}">${name}</span>`
            ).join(' ');
        }

        const heroTitle = document.querySelector('.hero-title h2');
        if (heroTitle && personalInfo.title) {
            heroTitle.textContent = personalInfo.title;
        }

        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription && personalInfo.tagline) {
            heroDescription.innerHTML = personalInfo.tagline;
        }

        // Update stats
        this.renderStats(personalInfo.stats);

        // Update social links
        this.renderSocialLinks(personalInfo.social);

        // Update profile image
        const profileImg = document.querySelector('.profile-img');
        if (profileImg && personalInfo.profileImage) {
            profileImg.src = personalInfo.profileImage;
            profileImg.alt = `${personalInfo.name} - ${personalInfo.title}`;
        }
    }

    /**
     * Render statistics in hero section
     * @param {Array} stats - Statistics data
     */
    renderStats(stats) {
        const statsContainer = document.querySelector('.hero-stats');
        if (!statsContainer || !stats) return;

        statsContainer.innerHTML = stats.map(stat => `
            <div class="stat">
                <span class="stat-number">${stat.number}</span>
                <span class="stat-label">${stat.label}</span>
            </div>
        `).join('');
    }

    /**
     * Render social links
     * @param {Object} social - Social media links
     */
    renderSocialLinks(social) {
        const socialContainer = document.querySelector('.hero-social');
        if (!socialContainer || !social) return;

        const socialIcons = {
            github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>`,
            linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>`,
            medium: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75S24 8.83 24 12z"/>
            </svg>`,
            email: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.906L12 13.092l9.458-9.271h.906c.904 0 1.636.732 1.636 1.636z"/>
            </svg>`
        };

        socialContainer.innerHTML = Object.entries(social)
            .filter(([key, url]) => url && url !== '#')
            .map(([platform, url]) => `
                <a href="${url}" class="social-link" title="${platform.charAt(0).toUpperCase() + platform.slice(1)}" target="_blank">
                    ${socialIcons[platform] || ''}
                </a>
            `).join('');
    }

    /**
     * Render featured projects
     * @param {Object} projectsData - Projects data
     */
    renderFeaturedProjects(projectsData) {
        const projectsContainer = document.querySelector('.featured-projects-grid');
        if (!projectsContainer || !projectsData.projects) return;

        const featuredProjects = projectsData.projects
            .filter(project => projectsData.featured.includes(project.id))
            .slice(0, 3);

        projectsContainer.innerHTML = featuredProjects.map((project, index) => `
            <div class="project-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                <img src="${project.image}" alt="${project.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjM2I4MmY2Ii8+Cjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsIi4+UHJvamVjdDwvdGV4dD4KPC9zdmc+'">
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.shortDescription}</p>
                    <div class="project-tech">
                        ${project.technologies.slice(0, 5).map(tech =>
            `<span class="tech-tag">${tech}</span>`
        ).join('')}
                    </div>
                    <div class="project-links">
                        <a href="pages/project-details.html?id=${project.id}" class="project-link primary">View Details</a>
                        ${project.links.demo ? `<a href="${project.links.demo}" target="_blank" class="project-link">Live Demo</a>` : ''}
                        ${project.links.github ? `<a href="${project.links.github}" target="_blank" class="project-link">GitHub</a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }    /**
     * Render skills categories
     * @param {Object} skillsData - Skills data
     */
    renderSkills(skillsData) {
        const skillsContainer = document.querySelector('.skills-container');
        if (!skillsContainer || !skillsData.skillCategories) return;

        skillsContainer.innerHTML = skillsData.skillCategories.map(category => `
            <div class="skill-category">
                <h3>${category.icon} ${category.name}</h3>
                <div class="skills-grid">
                    ${category.skills.map(skill => `
                        <div class="skill-item">
                            <div class="skill-icon">${skill.icon}</div>
                            <h4>${skill.name}</h4>
                            <div class="skill-bar">
                                <div class="skill-progress" data-percentage="${skill.level}"></div>
                            </div>
                            <span class="skill-percentage">${skill.level}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // Trigger skill bar animations
        this.animateSkillBars();
    }

    /**
     * Render experience timeline
     * @param {Object} experienceData - Experience data
     */
    renderTimeline(experienceData) {
        const timelineContainer = document.querySelector('.timeline');
        if (!timelineContainer) return;

        // Combine experience and education, sort by date
        const allItems = [
            ...(experienceData.experience || []),
            ...(experienceData.education || [])
        ].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        timelineContainer.innerHTML = allItems.map(item => `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <h3>${item.position || item.degree}</h3>
                    <h4>${item.company || item.institution}</h4>
                    <span class="timeline-date">${item.startDate} - ${item.endDate}</span>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render blog posts
     * @param {Object} blogData - Blog data
     */
    renderBlogPosts(blogData) {
        const blogContainer = document.querySelector('.blog-posts');
        if (!blogContainer || !blogData.posts) return;

        blogContainer.innerHTML = blogData.posts.map(post => `
            <article class="blog-post">
                <img src="${post.image}" alt="${post.title}">
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-date">${this.formatDate(post.publishDate)}</span>
                        <span class="post-category">${post.category}</span>
                    </div>
                    <h3><a href="blog-detail.html?id=${post.id}">${post.title}</a></h3>
                    <p>${post.excerpt}</p>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
        `).join('');
    }

    /**
     * Animate skill progress bars
     */
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const percentage = entry.target.dataset.percentage;
                    entry.target.style.width = `${percentage}%`;
                }
            });
        });

        skillBars.forEach(bar => observer.observe(bar));
    }

    /**
     * Format date for display
     * @param {string} dateString - Date string
     * @returns {string} - Formatted date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Update page title and meta tags
     * @param {Object} personalInfo - Personal information
     * @param {string} pageTitle - Specific page title
     */
    updatePageMeta(personalInfo, pageTitle = '') {
        const title = pageTitle ?
            `${pageTitle} - ${personalInfo.name} | ${personalInfo.title}` :
            `${personalInfo.name} | ${personalInfo.title}`;

        document.title = title;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = personalInfo.tagline || personalInfo.shortBio || '';
        }
    }

    /**
     * Render all projects - Simple clean layout
     */
    renderAllProjects(projectsData) {
        const projectsContainer = document.querySelector('.projects-grid, .featured-projects-grid');
        if (!projectsContainer || !projectsData.projects) return;

        projectsContainer.innerHTML = projectsData.projects.map((project, index) => `
            <div class="project-card simple" data-category="${project.category.toLowerCase()}" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjM2I4MmY2Ii8+Cjx0ZXh0IHg9IjQwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iYm9sZCI+JHtwcm9qZWN0LnRpdGxlLnNwbGl0KCcgJylbMF19PC90ZXh0Pgo8dGV4dCB4PSI0MDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCI+UHJvamVjdCBJbWFnZTwvdGV4dD4KPHN2Zz4K'">
                   
                </div>
                
                <div class="project-content">
                    <div class="project-header">
                        <h3 class="project-title">${project.title}</h3>
                        <span class="project-category">${project.category}</span>
                    </div>
                    
                    <p class="project-description">${project.shortDescription}</p>
                    
                    <div class="project-technologies">
                        <h4>Tech Stack:</h4>
                        <div class="tech-list">
                            ${project.technologies.slice(0, 6).map(tech =>
            `<span class="tech-item">${tech}</span>`
        ).join('')}
                            ${project.technologies.length > 6 ? `<span class="tech-more">+${project.technologies.length - 6} more</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="project-actions">
                        <div class="project-links">
                            ${project.links.github ? `
                                <a href="${project.links.github}" target="_blank" class="btn btn-secondary">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                    </svg>
                                    GitHub
                                </a>
                            ` : ''}
                            ${project.links.demo ? `
                                <a href="${project.links.demo}" target="_blank" class="btn btn-primary">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7Z"/>
                                    </svg>
                                    Live Demo
                                </a>
                            ` : ''}
                        </div>
                        <a href="project-details.html?id=${project.id}" class="details-link">
                            View Details
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render project details page
     */
    renderProjectDetails(project) {
        const detailsContainer = document.querySelector('.project-details-content');
        if (!detailsContainer || !project) return;

        detailsContainer.innerHTML = `
            <div class="project-hero">
            <div class="project-hero-content">
                <div class="project-meta">
                <span class="project-category">${project.category}</span>
                <span class="project-timeline">${project.startDate} - ${project.endDate}</span>
                <span class="project-team">${project.teamSize}</span>
                </div>
                
                <h1 class="project-title">${project.title}</h1>
                <p class="project-subtitle">${project.shortDescription}</p>
                
                <div class="project-hero-actions">
                ${project.links.demo ? `
                    <a href="${project.links.demo}" target="_blank" class="btn btn-primary large"
                       style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;font-size:1.1rem;font-weight:600;background:#3b82f6;color:#fff;border:none;border-radius:6px;box-shadow:0 2px 8px rgba(59,130,246,0.08);transition:background 0.2s;cursor:pointer;text-decoration:none;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7Z"/>
                    </svg>
                    Live Demo
                    </a>
                ` : ''}
                ${project.links.github ? `
                    <a href="${project.links.github}" target="_blank" class="btn btn-secondary large"
                       style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;font-size:1.1rem;font-weight:600;background:#fff;color:#222;border:2px solid #3b82f6;border-radius:6px;box-shadow:0 2px 8px rgba(59,130,246,0.08);transition:background 0.2s,color 0.2s;border-radius:6px;cursor:pointer;text-decoration:none;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    View Code
                    </a>
                ` : ''}
                </div>
            </div>
            
            <div class="project-hero-image">
                <img src="${project.image}" alt="${project.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjM2I4MmY2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIzMiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iYm9sZCI+JHtwcm9qZWN0LnRpdGxlLnNwbGl0KCcgJylbMF19PC90ZXh0Pgo8dGV4dCB4PSIzMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCI+UHJvamVjdCBJbWFnZTwvdGV4dD4KPHN2Zz4K'">
            </div>
            </div>

            <div class="project-content-sections">
            <div class="project-main-content">
                <!-- Description Section -->
                        <p class="project-full-description">${project.fullDescription}</p>
                    </section>

                    <!-- Features Section -->
                    ${project.features && project.features.length > 0 ? `
                        <section class="project-section">
                            <h2>Key Features</h2>
                            <ul class="features-list">
                                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </section>
                    ` : ''}

                    <!-- Achievements Section -->
                    ${project.achievements && project.achievements.length > 0 ? `
                        <section class="project-section">
                            <h2>Achievements</h2>
                            <ul class="achievements-list">
                                ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                            </ul>
                        </section>
                    ` : ''}

                    <!-- Gallery Section -->
                    ${project.gallery && project.gallery.length > 0 ? `
                        <section class="project-section">
                            <h2>Project Gallery</h2>
                            <div class="project-gallery">
                                ${project.gallery.map((image, index) => `
                                    <div class="gallery-item" data-aos="fade-up" data-aos-delay="${index * 100}">
                                        <img src="${image}" alt="Project Screenshot ${index + 1}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjOGI1Y2Y2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9IkFyaWFsIj5TY3JlZW5zaG90ICR7aW5kZXggKyAxfTwvdGV4dD4KPHR4dCB4PSIyMDAiIHk9IjE3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCI+Q2xpY2sgdG8gZW5sYXJnZTwvdGV4dD4KPHN2Zz4K'">
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}
                </div>

                <div class="project-sidebar">
                    <!-- Technologies Section -->
                    <section class="sidebar-section">
                        <h3>Technologies Used</h3>
                        <div class="tech-stack">
                            ${project.technologies.map(tech => `
                                <span class="tech-badge">${tech}</span>
                            `).join('')}
                        </div>
                    </section>

                    <!-- Project Info Section -->
                    <section class="sidebar-section">
                        <h3>Project Information</h3>
                        <div class="project-info-grid">
                            <div class="info-item">
                                <strong>Category:</strong>
                                <span>${project.category}</span>
                            </div>
                            <div class="info-item">
                                <strong>Duration:</strong>
                                <span>${project.startDate} - ${project.endDate}</span>
                            </div>
                            <div class="info-item">
                                <strong>Team Size:</strong>
                                <span>${project.teamSize}</span>
                            </div>
                        </div>
                    </section>

                    <!-- Links Section -->
                    <section class="sidebar-section">
                        <h3>Project Links</h3>
                        <div class="project-links-sidebar">
                            ${project.links.demo ? `
                                <a href="${project.links.demo}" target="_blank" class="link-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7Z"/>
                                    </svg>
                                    Live Demo
                                </a>
                            ` : ''}
                            ${project.links.github ? `
                                <a href="${project.links.github}" target="_blank" class="link-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                    </svg>
                                    GitHub Repository
                                </a>
                            ` : ''}
                        </div>
                    </section>
                </div>
            </div>
        `;
    }
}

// Create global instance
window.templateRenderer = new TemplateRenderer();