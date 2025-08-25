/**
 * Data Manager - Handles loading and caching of JSON data
 */
class DataManager {
    constructor() {
        this.cache = new Map();
        // Determine base URL based on current location
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            // We're in a subdirectory, so go up one level
            this.baseUrl = '../data/';
        } else {
            // We're in the root directory
            this.baseUrl = './data/';
        }
        console.log('DataManager initialized with baseUrl:', this.baseUrl);
    }

    /**
     * Load JSON data with caching
     * @param {string} filename - JSON filename (without extension)
     * @returns {Promise<Object>} - Parsed JSON data
     */
    async loadData(filename) {
        if (this.cache.has(filename)) {
            console.log(`Loading ${filename} from cache`);
            return this.cache.get(filename);
        }

        const url = `${this.baseUrl}${filename}.json`;
        console.log(`Attempting to load data from: ${url}`);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}.json: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            this.cache.set(filename, data);
            console.log(`Successfully loaded ${filename}.json`);
            return data;
        } catch (error) {
            console.error(`Error loading ${filename}.json:`, error);
            console.log(`Falling back to default data for ${filename}`);
            // Return fallback data structure
            return this.getFallbackData(filename);
        }
    }

    /**
     * Get fallback data structure if JSON fails to load
     * @param {string} filename - JSON filename
     * @returns {Object} - Fallback data structure
     */
    getFallbackData(filename) {
        const fallbacks = {
            'personal': {
                personalInfo: {
                    name: 'Thiwanka Sandakalum',
                    title: 'Cloud-Oriented Software Engineer',
                    tagline: 'Building scalable backend systems and AI-powered solutions',
                    location: 'Colombo, Sri Lanka',
                    email: 'thiwanka2002sandakalum@gmail.com',
                    phone: '+94 76 904 3770',
                    profileImage: 'assets/images/profile.jpg',
                    social: {
                        github: 'https://github.com/thiwanka-sandakalum',
                        linkedin: 'https://linkedin.com/in/thiwanka-sandakalum',
                        email: 'mailto:thiwanka2002sandakalum@gmail.com'
                    },
                    stats: [
                        { number: '3+', label: 'Years Experience' },
                        { number: '10K+', label: 'Products Handled' },
                        { number: '20%', label: 'Performance Boost' }
                    ]
                },
                about: {
                    shortBio: 'Cloud-oriented Software Engineer with expertise in scalable systems.',
                    fullBio: ['Experienced in building scalable backend systems and AI solutions.'],
                    highlights: [],
                    hobbies: []
                }
            },
            'experience': {
                experience: [],
                education: []
            },
            'skills': {
                skillCategories: []
            },
            'projects': {
                featured: [1, 2],
                projects: [
                    {
                        id: 1,
                        title: 'FinVerse - AI Financial Marketplace',
                        shortDescription: 'AI-powered platform connecting consumers with financial institutions.',
                        image: 'assets/images/project1.jpg',
                        category: 'AI',
                        status: 'Live',
                        technologies: ['Next.js', 'Python', 'Azure', 'LangChain'],
                        links: {
                            demo: 'https://app.bankguru.com',
                            github: 'https://github.com/thiwanka-sandakalum/finverse'
                        }
                    },
                    {
                        id: 2,
                        title: 'VidSage - AI Video Analysis',
                        shortDescription: 'AI-powered YouTube video analysis platform.',
                        image: 'assets/images/project2.jpg',
                        category: 'AI',
                        status: 'Completed',
                        technologies: ['Python', 'LangChain', 'OpenAI'],
                        links: {
                            demo: '',
                            github: 'https://github.com/thiwanka-sandakalum/vidsage'
                        }
                    }
                ],
                filters: [
                    { id: 'all', name: 'All', count: 2 },
                    { id: 'ai', name: 'AI', count: 2 }
                ]
            },
            'blog': {
                posts: [],
                categories: [],
                featuredPosts: [],
                recentPosts: []
            }
        };

        console.log(`Returning fallback data for ${filename}`);
        return fallbacks[filename] || {};
    }

    /**
     * Clear cache (useful for development)
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Load personal data
     * @returns {Promise<Object>} - Personal information data
     */
    async loadPersonalData() {
        return await this.loadData('personal');
    }

    /**
     * Load projects data
     * @returns {Promise<Object>} - Projects data
     */
    async loadProjectsData() {
        return await this.loadData('projects');
    }

    /**
     * Load experience data
     * @returns {Promise<Object>} - Experience and education data
     */
    async loadExperienceData() {
        return await this.loadData('experience');
    }

    /**
     * Load skills data
     * @returns {Promise<Object>} - Skills data
     */
    async loadSkillsData() {
        return await this.loadData('skills');
    }

    /**
     * Load blog data
     * @returns {Promise<Object>} - Blog posts data
     */
    async loadBlogData() {
        return await this.loadData('blog');
    }

    /**
     * Preload all data files
     * @returns {Promise<Object>} - All loaded data
     */
    async preloadAll() {
        const files = ['personal', 'experience', 'skills', 'projects', 'blog'];
        const promises = files.map(file => this.loadData(file));

        try {
            const results = await Promise.all(promises);
            const data = {};
            files.forEach((file, index) => {
                data[file] = results[index];
            });
            return data;
        } catch (error) {
            console.error('Error preloading data:', error);
            return {};
        }
    }
}

// Create global instance
window.dataManager = new DataManager();