/**
 * About Page Content Manager
 * Manages dynamic content rendering for the about page
 */

class AboutPageManager {
    constructor() {
        this.aboutData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadAboutData();
            this.renderContent();
        } catch (error) {
            console.error('Error initializing About Page Manager:', error);
        }
    }

    async loadAboutData() {
        try {
            const response = await fetch('../data/about.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.aboutData = await response.json();
            console.log('About data loaded successfully:', this.aboutData);
        } catch (error) {
            console.error('Error loading about data:', error);
            // Fallback - try to continue with partial functionality
            return;
        }
    }

    renderContent() {
        if (!this.aboutData) return;

        this.updatePageMeta();
        this.renderHeroSection();
        this.renderAboutSection();
        this.renderProfessionalJourney();
        this.renderTechnologies();
        this.renderPassionsActivities();
        this.renderFooter();
    }

    updatePageMeta() {
        const { pageInfo } = this.aboutData;
        document.title = pageInfo.title;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', pageInfo.description);
        }
    }

    renderHeroSection() {
        const { hero } = this.aboutData;

        // Update section title
        const sectionTitle = document.querySelector('.about .section-title h1');
        const sectionSubtitle = document.querySelector('.about .section-title p');

        if (sectionTitle) sectionTitle.textContent = hero.title;
        if (sectionSubtitle) sectionSubtitle.textContent = hero.subtitle;

        // Update profile image
        const profileImage = document.querySelector('.about-image img');
        if (profileImage) {
            profileImage.src = hero.profileImage;
            profileImage.alt = hero.profileAlt;
        }
    }

    renderAboutSection() {
        const { aboutSection } = this.aboutData;

        // Update heading
        const heading = document.querySelector('.about-text h2');
        if (heading) heading.textContent = aboutSection.heading;

        // Update paragraphs
        const aboutText = document.querySelector('.about-text');
        if (aboutText) {
            // Remove existing paragraphs
            const existingParagraphs = aboutText.querySelectorAll('p');
            existingParagraphs.forEach(p => p.remove());

            // Add new paragraphs
            aboutSection.paragraphs.forEach(paragraphText => {
                const p = document.createElement('p');
                p.textContent = paragraphText;
                aboutText.insertBefore(p, aboutText.querySelector('.about-buttons'));
            });
        }

        // Update resume button
        const resumeBtn = document.querySelector('.about-buttons .btn');
        if (resumeBtn) {
            resumeBtn.href = aboutSection.resumeLink;
            resumeBtn.textContent = aboutSection.resumeText;
        }
    }

    renderProfessionalJourney() {
        const { professionalJourney } = this.aboutData;

        // Update section title
        const sectionTitle = document.querySelector('.professional-journey .section-title h2');
        const sectionSubtitle = document.querySelector('.professional-journey .section-title p');

        if (sectionTitle) sectionTitle.textContent = professionalJourney.title;
        if (sectionSubtitle) sectionSubtitle.textContent = professionalJourney.subtitle;

        // Render work experience
        this.renderWorkExperience(professionalJourney.workExperience);

        // Render education
        this.renderEducation(professionalJourney.education);
    }

    renderWorkExperience(workExperience) {
        const experienceContainer = document.querySelector('.experience-cards');
        if (!experienceContainer) return;

        experienceContainer.innerHTML = '';

        workExperience.experiences.forEach(exp => {
            const experienceCard = document.createElement('div');
            experienceCard.className = 'experience-card';

            experienceCard.innerHTML = `
                <div class="experience-header">
                    <h4>${exp.position}</h4>
                    <span class="company">${exp.company}</span>
                    <span class="duration">${exp.duration}</span>
                </div>
                <p>${exp.description}</p>
                <div class="achievements">
                    ${exp.achievements.map(achievement =>
                `<span class="achievement-tag">${achievement}</span>`
            ).join('')}
                </div>
            `;

            experienceContainer.appendChild(experienceCard);
        });
    }

    renderEducation(education) {
        const educationContainer = document.querySelector('.education-cards');
        if (!educationContainer) return;

        educationContainer.innerHTML = '';

        education.qualifications.forEach(qual => {
            const educationCard = document.createElement('div');
            educationCard.className = 'education-card';

            educationCard.innerHTML = `
                <div class="education-header">
                    <h4>${qual.degree}</h4>
                    <span class="institution">${qual.institution}</span>
                    <span class="duration">${qual.duration}</span>
                </div>
                <p>${qual.description}</p>
                <div class="subjects">
                    ${qual.subjects.map(subject =>
                `<span class="subject-tag">${subject}</span>`
            ).join('')}
                </div>
            `;

            educationContainer.appendChild(educationCard);
        });
    }

    renderTechnologies() {
        const { technologies } = this.aboutData;
        if (!technologies) return;

        // Update section title
        const sectionTitle = document.querySelector('.technologies .section-title h2');
        const sectionSubtitle = document.querySelector('.technologies .section-title p');

        if (sectionTitle) sectionTitle.textContent = technologies.title;
        if (sectionSubtitle) sectionSubtitle.textContent = technologies.subtitle;

        // Render technology categories
        const technologiesContent = document.querySelector('.technologies-content');
        if (!technologiesContent) return;

        technologiesContent.innerHTML = '';

        technologies.categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'tech-category';

            categoryDiv.innerHTML = `
                <h3 class="tech-category-title">${category.name}</h3>
                <div class="tech-grid">
                    ${category.technologies.map(tech => `
                        <div class="tech-item">
                            <img src="${tech.logo}" alt="${tech.name}" loading="lazy">
                            <span class="tech-name">${tech.name}</span>
                            <span class="tech-proficiency ${tech.proficiency.toLowerCase()}">${tech.proficiency}</span>
                        </div>
                    `).join('')}
                </div>
            `;

            technologiesContent.appendChild(categoryDiv);
        });
    }

    renderPassionsActivities() {
        const { passionsActivities } = this.aboutData;

        // Update section title
        const sectionTitle = document.querySelector('.passions-activities .section-title h2');
        const sectionSubtitle = document.querySelector('.passions-activities .section-title p');

        if (sectionTitle) sectionTitle.textContent = passionsActivities.title;
        if (sectionSubtitle) sectionSubtitle.textContent = passionsActivities.subtitle;

        // Render passions grid
        this.renderPassionsGrid(passionsActivities.passions);

        // Render activities gallery
        this.renderActivitiesGallery(passionsActivities.gallery);
    }

    renderPassionsGrid(passions) {
        const passionsGrid = document.querySelector('.passions-grid');
        if (!passionsGrid) return;

        passionsGrid.innerHTML = '';

        passions.forEach(passion => {
            const passionCard = document.createElement('div');
            passionCard.className = 'passion-card';

            passionCard.innerHTML = `
                <div class="passion-icon">${passion.icon}</div>
                <h3>${passion.title}</h3>
                <p>${passion.description}</p>
            `;

            passionsGrid.appendChild(passionCard);
        });
    }

    renderActivitiesGallery(gallery) {
        const galleryTitle = document.querySelector('.gallery-title');
        const galleryGrid = document.querySelector('.gallery-grid');

        if (galleryTitle) galleryTitle.textContent = gallery.title;
        if (!galleryGrid) return;

        galleryGrid.innerHTML = '';

        gallery.activities.forEach(activity => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            galleryItem.innerHTML = `
                <img src="${activity.image}" alt="${activity.alt}" loading="lazy">
                <div class="gallery-overlay">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
            `;

            galleryGrid.appendChild(galleryItem);
        });
    }

    renderFooter() {
        const { footer } = this.aboutData;

        // Update footer logo
        const footerLogo = document.querySelector('.footer-logo a');
        const footerSubtitle = document.querySelector('.footer-logo p');

        if (footerLogo) {
            footerLogo.innerHTML = `${footer.logo.text.split(' ')[0]}<span>${footer.logo.text.split(' ')[1]}</span>`;
        }
        if (footerSubtitle) footerSubtitle.textContent = footer.logo.subtitle;

        // Update navigation links
        const footerNav = document.querySelector('.footer-links ul');
        if (footerNav) {
            footerNav.innerHTML = footer.navigation.map(nav =>
                `<li><a href="${nav.url}">${nav.text}</a></li>`
            ).join('');
        }

        // Update social links
        const footerSocial = document.querySelector('.footer-social');
        if (footerSocial) {
            const socialLinks = footerSocial.querySelectorAll('a');
            footer.social.forEach((social, index) => {
                if (socialLinks[index]) {
                    socialLinks[index].href = social.url;
                    socialLinks[index].setAttribute('aria-label', social.ariaLabel);
                }
            });
        }

        // Update copyright
        const copyright = document.querySelector('.copyright p');
        if (copyright) copyright.textContent = footer.copyright;
    }

    // Method to update specific content
    updateContent(section, data) {
        if (!this.aboutData) return;

        // Update the data
        this.aboutData[section] = { ...this.aboutData[section], ...data };

        // Re-render the specific section
        switch (section) {
            case 'hero':
                this.renderHeroSection();
                break;
            case 'aboutSection':
                this.renderAboutSection();
                break;
            case 'professionalJourney':
                this.renderProfessionalJourney();
                break;
            case 'technologies':
                this.renderTechnologies();
                break;
            case 'passionsActivities':
                this.renderPassionsActivities();
                break;
            case 'footer':
                this.renderFooter();
                break;
        }
    }

    // Method to get current data
    getData() {
        return this.aboutData;
    }
}

// Initialize the About Page Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aboutPageManager = new AboutPageManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutPageManager;
}
