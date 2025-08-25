/*
* Personal Portfolio Website - script.js
* Author: Thiwanka Sandakalum
* Version: 2.0
* Date: August 25, 2025
*/

// Global application state
const app = {
    data: {},
    initialized: false
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ======= Preloader =======
    const preloader = document.querySelector('.preloader');

    // Function to hide preloader
    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hidden');
            // Start animations after preloader is hidden
            setTimeout(() => {
                if (typeof animateOnScroll === 'function') animateOnScroll();
                if (typeof countStats === 'function') countStats();
            }, 500);
        }
    }

    // Hide preloader immediately
    hidePreloader();

    // Also ensure it's hidden when all resources are loaded
    window.addEventListener('load', hidePreloader);

    /**
     * Initialize the application
     */
    async function initApp() {
        try {
            // Load data based on current page
            await loadPageData();

            // Initialize UI components
            initializeMobileMenu();
            initializeDarkMode();
            initializeSmoothScrolling();
            initializeFormHandling();
            initializeBackToTop();

            // Initialize AOS animations
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    easing: 'ease-in-out',
                    once: true,
                    offset: 100
                });
            }

            app.initialized = true;
            console.log('App initialized successfully');

        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    /**
     * Load data based on current page
     */
    async function loadPageData() {
        const currentPage = getCurrentPage();

        try {
            // Load common data
            if (window.dataManager) {
                app.data.personal = await dataManager.loadPersonalData();
            }

            // Load page-specific data
            switch (currentPage) {
                case 'index':
                case 'home':
                    await loadHomePageData();
                    break;
                case 'projects':
                    await loadProjectsPageData();
                    break;
                case 'project-details':
                    await loadProjectDetailsData();
                    break;
                case 'about':
                    await loadAboutPageData();
                    break;
                case 'skills':
                    await loadSkillsPageData();
                    break;
                case 'contact':
                    await loadContactPageData();
                    break;
                default:
                    console.log('Unknown page:', currentPage);
            }

        } catch (error) {
            console.error('Error loading page data:', error);
        }
    }

    /**
     * Get current page name from URL
     */
    function getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().split('.')[0];
        return filename || 'index';
    }

    /**
     * Load home page data and render
     */
    async function loadHomePageData() {
        try {
            if (window.dataManager && window.templateRenderer) {
                const [personalData, projectsData] = await Promise.all([
                    dataManager.loadPersonalData(),
                    dataManager.loadProjectsData()
                ]);

                app.data.personal = personalData;
                app.data.projects = projectsData;

                // Render hero section if on home page
                if (document.querySelector('.hero-section')) {
                    templateRenderer.renderHeroSection(personalData);
                }

                // Render featured projects if section exists
                if (document.querySelector('.featured-projects-grid, .projects-preview')) {
                    templateRenderer.renderFeaturedProjects(projectsData);
                }
            }
        } catch (error) {
            console.error('Error loading home page data:', error);
        }
    }

    /**
     * Load and render projects page
     */
    async function loadProjectsPageData() {
        try {
            if (window.dataManager && window.templateRenderer) {
                const projectsData = await dataManager.loadProjectsData();
                app.data.projects = projectsData;

                // Render all projects
                templateRenderer.renderAllProjects(projectsData);

                // Initialize project filtering if filters exist
                if (document.querySelector('.project-filters')) {
                    initializeProjectFiltering(projectsData);
                }
            }
        } catch (error) {
            console.error('Error loading projects page data:', error);
        }
    }

    /**
     * Load and render project details page
     */
    async function loadProjectDetailsData() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const projectId = parseInt(urlParams.get('id'));

            if (projectId && window.dataManager && window.templateRenderer) {
                const projectsData = await dataManager.loadProjectsData();
                const project = projectsData.projects.find(p => p.id === projectId);

                if (project) {
                    app.data.currentProject = project;
                    templateRenderer.renderProjectDetails(project);

                    // Update page title
                    document.title = `${project.title} - Thiwanka Sandakalum`;
                } else {
                    console.error('Project not found:', projectId);
                    // Redirect to projects page
                    window.location.href = 'projects.html';
                }
            }
        } catch (error) {
            console.error('Error loading project details:', error);
        }
    }

    /**
     * Load about page data
     */
    async function loadAboutPageData() {
        try {
            if (window.dataManager && window.templateRenderer) {
                const [personalData, experienceData] = await Promise.all([
                    dataManager.loadPersonalData(),
                    dataManager.loadExperienceData()
                ]);

                app.data.personal = personalData;
                app.data.experience = experienceData;

                // Render timeline if exists
                if (document.querySelector('.timeline')) {
                    templateRenderer.renderTimeline(experienceData);
                }
            }
        } catch (error) {
            console.error('Error loading about page data:', error);
        }
    }

    /**
     * Load skills page data
     */
    async function loadSkillsPageData() {
        try {
            if (window.dataManager && window.templateRenderer) {
                const skillsData = await dataManager.loadSkillsData();
                app.data.skills = skillsData;

                // Render skills if container exists
                if (document.querySelector('.skills-container')) {
                    templateRenderer.renderSkills(skillsData);
                }
            }
        } catch (error) {
            console.error('Error loading skills page data:', error);
        }
    }

    /**
     * Load contact page data
     */
    async function loadContactPageData() {
        try {
            if (window.dataManager) {
                const personalData = await dataManager.loadPersonalData();
                app.data.personal = personalData;

                // Update contact information if needed
                updateContactInfo(personalData);
            }
        } catch (error) {
            console.error('Error loading contact page data:', error);
        }
    }

    /**
     * Update contact information on contact page
     */
    function updateContactInfo(personalData) {
        if (personalData.contact) {
            const emailEl = document.querySelector('.contact-email');
            const phoneEl = document.querySelector('.contact-phone');
            const locationEl = document.querySelector('.contact-location');

            if (emailEl) emailEl.textContent = personalData.contact.email;
            if (phoneEl) phoneEl.textContent = personalData.contact.phone;
            if (locationEl) locationEl.textContent = personalData.contact.location;
        }
    }

    /**
     * Mobile Menu Toggle
     */
    function initializeMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function () {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });

            // Close mobile menu when clicking on links
            const navLinks = document.querySelectorAll('.nav-menu a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', function (event) {
                if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        }
    }

    /**
     * Dark Mode Toggle
     */
    function initializeDarkMode() {
        const darkModeToggle = document.querySelector('.dark-mode-toggle');

        if (darkModeToggle) {
            // Check for saved theme preference or default to light mode
            const currentTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);

            darkModeToggle.addEventListener('click', function () {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    /**
     * Smooth Scrolling
     */
    function initializeSmoothScrolling() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');

        scrollLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Form Handling
     */
    function initializeFormHandling() {
        const contactForm = document.querySelector('.contact-form');

        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // Get form data
                const formData = new FormData(this);
                const formObject = Object.fromEntries(formData);

                // Basic validation
                if (validateContactForm(formObject)) {
                    // Show success message
                    showFormMessage('Thank you! Your message has been sent.', 'success');

                    // Reset form
                    this.reset();
                } else {
                    showFormMessage('Please fill in all required fields.', 'error');
                }
            });
        }
    }

    /**
     * Validate contact form
     */
    function validateContactForm(data) {
        return data.name && data.email && data.message &&
            data.email.includes('@') && data.email.includes('.');
    }

    /**
     * Show form message
     */
    function showFormMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;

        // Insert message
        const form = document.querySelector('.contact-form');
        if (form) {
            form.insertAdjacentElement('afterend', messageEl);

            // Remove message after 5 seconds
            setTimeout(() => {
                messageEl.remove();
            }, 5000);
        }
    }

    /**
     * Back to Top Button
     */
    function initializeBackToTop() {
        const backToTopBtn = document.querySelector('.back-to-top');

        if (backToTopBtn) {
            // Show/hide button based on scroll position
            window.addEventListener('scroll', function () {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });

            // Scroll to top when clicked
            backToTopBtn.addEventListener('click', function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    /**
     * Project Filtering
     */
    function initializeProjectFiltering(projectsData) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        if (filterButtons.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                const filter = this.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.classList.add('animate');
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('animate');
                    }
                });
            });
        });
    }

    /**
     * Animate elements on scroll
     */
    function animateOnScroll() {
        const elements = document.querySelectorAll('[data-animate]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1
        });

        elements.forEach(el => observer.observe(el));
    }

    /**
     * Count up animation for stats
     */
    function countStats() {
        const statNumbers = document.querySelectorAll('.stat-number');

        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
            }, 20);
        });
    }

    // Initialize the application
    initApp();
});
