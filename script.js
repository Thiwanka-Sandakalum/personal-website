document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate links
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // --- Scroll Reveal Animation ---
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-up, .hidden-left, .hidden-right');
    hiddenElements.forEach((el) => observer.observe(el));

    // Animate proficiency cards on scroll
    const profCards = document.querySelectorAll('.proficiency-card');
    profCards.forEach((card, idx) => {
        observer.observe(card);
    });

    // --- Parallax Effect for Hero Image (Subtle) ---
    const heroImg = document.querySelector('.img-wrapper');
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            if (heroImg) {
                heroImg.style.transform = `translateX(${x}px) translateY(${y}px)`;
            }
        }
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

// --- Firebase Analytics ---
// Add after all other DOMContentLoaded logic
const firebaseConfig = {
    apiKey: "AIzaSyDHPYY5PERS8ZWKn8JtbanbJciTdhPwugY",
    authDomain: "thiwanka-sandakalum.firebaseapp.com",
    projectId: "thiwanka-sandakalum",
    storageBucket: "thiwanka-sandakalum.appspot.com", // fixed .com
    messagingSenderId: "143377971431",
    appId: "1:143377971431:web:824bd0c6bdb0f59d160a42",
    measurementId: "G-RXPK9YGWJV"
};

if (window.firebase && firebase.initializeApp) {
    firebase.initializeApp(firebaseConfig);
    if (firebase.analytics) {
        firebase.analytics();
    }
}