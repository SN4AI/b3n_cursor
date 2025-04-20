// Attendez que le DOM soit entièrement chargé
document.addEventListener('DOMContentLoaded', () => {
    // Animation de chargement de page
    const pageTransition = document.querySelector('.page-transition');
    if (pageTransition) {
        setTimeout(() => {
            pageTransition.classList.add('loaded');
        }, 500);
    }
    
    // Éléments du menu
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');
    const header = document.querySelector('header');

    // Fonction pour gérer le menu burger
    function toggleMenu() {
    nav.classList.toggle('active');
    burger.classList.toggle('active');

        // Animation des liens
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
                // Performance: utilisation de la propriété CSS de transition
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    }

    // Écouteurs d'événements avec délégation pour économiser la mémoire
    burger.addEventListener('click', toggleMenu);

    // Fermeture du menu lors d'un clic à l'extérieur
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Smooth scroll optimisé avec délégation d'événements
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
        e.preventDefault();
            const targetElement = document.querySelector(anchor.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
            behavior: 'smooth'
        });
            }
        }
    });

    // Gestion du header lors du défilement
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Défilement vers le bas
            header.classList.add('scroll-down');
            header.classList.remove('scroll-up');
        } else {
            // Défilement vers le haut
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        
        // Gestion du bouton "Retour en haut"
        const backToTop = document.getElementById('back-to-top');
        if (scrollTop > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Bouton "Retour en haut"
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Optimisation: utilisation d'IntersectionObserver pour détecter les sections visibles pour la navigation
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    
    if (sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -80% 0px",
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
    navItems.forEach(item => {
        item.classList.remove('active');
                        if (item.getAttribute('href') === `#${currentId}`) {
            item.classList.add('active');
        }
                    });
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // Animation des sections au défilement
    const animateSections = document.querySelectorAll('.section-animate');
    if (animateSections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15
        });
        
        animateSections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    // Ajouter des liens de navigation directs pour les sections de ressources
    const resourceCategories = document.querySelectorAll('.ressource-categorie');
    resourceCategories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent.trim();
            // Simulation de navigation - à remplacer par de vraies URLs dans la version finale
            window.location.href = `bibliotheque.html?categorie=${encodeURIComponent(categoryName)}`;
        });
    });
    
    // Animations sur les cartes d'actualités
    const newsCards = document.querySelectorAll('.actualite-card');
    newsCards.forEach(card => {
        card.addEventListener('click', function() {
            // Ajouter un effet de clic avant la navigation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
                // Simulation de navigation - à remplacer par de vraies URLs
                const title = this.querySelector('h3').textContent.trim();
                window.location.href = `actualite.html?titre=${encodeURIComponent(title)}`;
            }, 200);
        });
    });
    
    // Préchargement des images en arrière-plan
    function preloadBackgroundImages() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                const images = document.querySelectorAll('img[loading="lazy"]');
                if ('IntersectionObserver' in window) {
                    const imgObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                img.src = img.src; // Force le chargement
                                imgObserver.unobserve(img);
                            }
                        });
                    });
                    
                    images.forEach(img => imgObserver.observe(img));
                }
            });
        }
    }
    
    // Appel de la fonction de préchargement
    preloadBackgroundImages();
    
    // Effet de zoom sur le portrait
    const portrait = document.querySelector('.portrait img');
    if (portrait) {
        portrait.addEventListener('mouseover', () => {
            portrait.style.transform = 'scale(1.03)';
        });
        
        portrait.addEventListener('mouseout', () => {
            portrait.style.transform = '';
        });
    }
    
    // Animation de la citation
    const citation = document.querySelector('.citation');
    if (citation) {
        window.addEventListener('scroll', () => {
            const citationPosition = citation.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (citationPosition < screenPosition) {
                citation.style.animation = 'pulse 2s ease-in-out infinite';
            } else {
                citation.style.animation = '';
            }
        });
    }
}); 