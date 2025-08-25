/**
 * About Page Content Utilities
 * Helper functions for managing about page content
 */

class AboutContentUtils {
    static async loadAboutData() {
        try {
            const response = await fetch('../data/about.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading about data:', error);
            return null;
        }
    }

    static async saveAboutData(data) {
        // Note: This would typically require a backend API
        // For now, we'll log the data for manual updating
        console.log('Updated About Data:', JSON.stringify(data, null, 2));

        // In a real application, you would send this to your backend:
        // const response = await fetch('/api/about', {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });

        return data;
    }

    static addExperience(experienceData) {
        const newExperience = {
            id: Date.now(),
            position: experienceData.position || '',
            company: experienceData.company || '',
            location: experienceData.location || '',
            duration: experienceData.duration || '',
            description: experienceData.description || '',
            achievements: experienceData.achievements || [],
            technologies: experienceData.technologies || []
        };

        return newExperience;
    }

    static addEducation(educationData) {
        const newEducation = {
            id: Date.now(),
            degree: educationData.degree || '',
            institution: educationData.institution || '',
            location: educationData.location || '',
            duration: educationData.duration || '',
            description: educationData.description || '',
            subjects: educationData.subjects || []
        };

        return newEducation;
    }

    static addPassion(passionData) {
        const newPassion = {
            id: Date.now(),
            icon: passionData.icon || '🎯',
            title: passionData.title || '',
            description: passionData.description || ''
        };

        return newPassion;
    }

    static addActivity(activityData) {
        const newActivity = {
            id: Date.now(),
            image: activityData.image || '',
            alt: activityData.alt || '',
            title: activityData.title || '',
            description: activityData.description || ''
        };

        return newActivity;
    }

    static addTechnology(categoryId, technologyData) {
        const newTechnology = {
            name: technologyData.name || '',
            logo: technologyData.logo || '',
            proficiency: technologyData.proficiency || 'Intermediate'
        };

        return newTechnology;
    }

    static addTechnologyCategory(categoryData) {
        const newCategory = {
            id: Date.now(),
            name: categoryData.name || '',
            technologies: categoryData.technologies || []
        };

        return newCategory;
    }

    static validateExperience(experience) {
        const required = ['position', 'company', 'duration', 'description'];
        return required.every(field => experience[field] && experience[field].trim() !== '');
    }

    static validateEducation(education) {
        const required = ['degree', 'institution', 'duration', 'description'];
        return required.every(field => education[field] && education[field].trim() !== '');
    }

    static validatePassion(passion) {
        const required = ['title', 'description'];
        return required.every(field => passion[field] && passion[field].trim() !== '');
    }

    static validateActivity(activity) {
        const required = ['image', 'title', 'description'];
        return required.every(field => activity[field] && activity[field].trim() !== '');
    }

    static validateTechnology(technology) {
        const required = ['name', 'logo', 'proficiency'];
        return required.every(field => technology[field] && technology[field].trim() !== '');
    }

    static validateTechnologyCategory(category) {
        const required = ['name'];
        return required.every(field => category[field] && category[field].trim() !== '') &&
            Array.isArray(category.technologies);
    }

    static formatDuration(startDate, endDate = 'Present') {
        if (!startDate) return '';

        const start = new Date(startDate);
        const end = endDate === 'Present' ? new Date() : new Date(endDate);

        const months = (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());

        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let duration = '';
        if (years > 0) {
            duration += `${years} year${years > 1 ? 's' : ''}`;
        }
        if (remainingMonths > 0) {
            if (duration) duration += ' ';
            duration += `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
        }

        return duration || '1 month';
    }

    static generateActivityImagePath(filename) {
        return `../assets/images/activities/${filename}`;
    }

    static optimizeImageAlt(title, description) {
        return `${title} - ${description}`;
    }

    static sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    static truncateText(text, maxLength = 150) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    static createBreadcrumbs(currentPage = 'About') {
        return [
            { text: 'Home', url: '../index.html' },
            { text: currentPage, url: '#', active: true }
        ];
    }

    static generateSeoKeywords(aboutData) {
        const keywords = [
            aboutData.pageInfo.keywords || [],
            aboutData.professionalJourney.workExperience.experiences.flatMap(exp =>
                exp.technologies || []
            ),
            aboutData.passionsActivities.passions.map(passion => passion.title)
        ].flat();

        return [...new Set(keywords)]; // Remove duplicates
    }

    static exportToMarkdown(aboutData) {
        let markdown = `# ${aboutData.hero.title}\n\n`;

        // About section
        markdown += `## ${aboutData.aboutSection.heading}\n\n`;
        aboutData.aboutSection.paragraphs.forEach(p => {
            markdown += `${p}\n\n`;
        });

        // Professional Journey
        markdown += `## ${aboutData.professionalJourney.title}\n\n`;

        // Work Experience
        markdown += `### ${aboutData.professionalJourney.workExperience.title}\n\n`;
        aboutData.professionalJourney.workExperience.experiences.forEach(exp => {
            markdown += `#### ${exp.position} at ${exp.company}\n`;
            markdown += `*${exp.duration}*\n\n`;
            markdown += `${exp.description}\n\n`;
            markdown += `**Achievements:**\n`;
            exp.achievements.forEach(achievement => {
                markdown += `- ${achievement}\n`;
            });
            markdown += '\n';
        });

        // Education
        markdown += `### ${aboutData.professionalJourney.education.title}\n\n`;
        aboutData.professionalJourney.education.qualifications.forEach(qual => {
            markdown += `#### ${qual.degree}\n`;
            markdown += `*${qual.institution} (${qual.duration})*\n\n`;
            markdown += `${qual.description}\n\n`;
        });

        // Passions
        markdown += `## ${aboutData.passionsActivities.title}\n\n`;
        aboutData.passionsActivities.passions.forEach(passion => {
            markdown += `### ${passion.icon} ${passion.title}\n`;
            markdown += `${passion.description}\n\n`;
        });

        return markdown;
    }

    static getProficiencyColor(proficiency) {
        const colors = {
            'expert': '#28a745',
            'advanced': '#4a6cf7',
            'intermediate': '#ffc107',
            'beginner': '#dc3545'
        };
        return colors[proficiency.toLowerCase()] || colors['intermediate'];
    }

    static generateTechLogoUrl(techName) {
        // Common technology logo patterns
        const techMap = {
            'javascript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
            'typescript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
            'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
            'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
            'nodejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
            'docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
            'mongodb': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
            'postgresql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
            'azure': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
            'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'
        };

        const key = techName.toLowerCase().replace(/[^a-z0-9]/g, '');
        return techMap[key] || `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;
    }

    static sortTechnologiesByProficiency(technologies) {
        const proficiencyOrder = { 'expert': 4, 'advanced': 3, 'intermediate': 2, 'beginner': 1 };
        return technologies.sort((a, b) => {
            const aOrder = proficiencyOrder[a.proficiency.toLowerCase()] || 0;
            const bOrder = proficiencyOrder[b.proficiency.toLowerCase()] || 0;
            return bOrder - aOrder;
        });
    }

    static getTechnologyStats(technologies) {
        const stats = {
            total: 0,
            byProficiency: {
                expert: 0,
                advanced: 0,
                intermediate: 0,
                beginner: 0
            },
            byCategory: {}
        };

        technologies.categories.forEach(category => {
            stats.byCategory[category.name] = category.technologies.length;
            stats.total += category.technologies.length;

            category.technologies.forEach(tech => {
                const proficiency = tech.proficiency.toLowerCase();
                if (stats.byProficiency[proficiency] !== undefined) {
                    stats.byProficiency[proficiency]++;
                }
            });
        });

        return stats;
    }
}

// Export utilities
if (typeof window !== 'undefined') {
    window.AboutContentUtils = AboutContentUtils;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutContentUtils;
}
