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

// Gestion de l'installation de l'application (PWA)
let deferredPrompt;
const addBtn = document.createElement('button');
addBtn.classList.add('install-app');
addBtn.style.display = 'none';
addBtn.textContent = 'Installer l\'application';

// Vérifier si tous les éléments du DOM sont chargés
document.addEventListener('DOMContentLoaded', function() {
    // Ajout du bouton d'installation dans le footer
    const footer = document.querySelector('.footer-content');
    if (footer) {
        const installContainer = document.createElement('div');
        installContainer.classList.add('install-container');
        installContainer.style.textAlign = 'center';
        installContainer.style.margin = '1rem 0';
        installContainer.appendChild(addBtn);
        footer.appendChild(installContainer);
    }
    
    // Animation des liens de navigation active
    activateCurrentPageLink();
    
    // Gestion du menu burger
    setupBurgerMenu();
    
    // S'assurer que le logo est cliquable
    makeLogoClickable();
    
    // Enregistrement du service worker pour PWA
    registerServiceWorker();
});

// Installation de l'application
window.addEventListener('beforeinstallprompt', (e) => {
    // Empêcher Chrome de montrer automatiquement la bannière d'installation
    e.preventDefault();
    // Stocker l'événement pour pouvoir le déclencher plus tard
    deferredPrompt = e;
    // Afficher le bouton d'installation
    addBtn.style.display = 'block';
    
    // Ajouter une bannière d'installation en haut de la page pour les utilisateurs mobiles
    showInstallBanner();
});

// Gestionnaire de clic pour le bouton d'installation
addBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    // Montrer la bannière d'installation
    deferredPrompt.prompt();
    
    // Attendre que l'utilisateur réponde à la bannière
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Nous n'avons plus besoin de l'événement différé
    deferredPrompt = null;
    
    // Cacher le bouton d'installation
    addBtn.style.display = 'none';
    
    // Cacher la bannière d'installation si elle est visible
    const installBanner = document.querySelector('.install-banner');
    if (installBanner) {
        installBanner.style.display = 'none';
    }
});

// Afficher une bannière d'installation en haut du site
function showInstallBanner() {
    // Vérifier si la bannière existe déjà
    if (document.querySelector('.install-banner')) return;
    
    const banner = document.createElement('div');
    banner.classList.add('install-banner');
    banner.innerHTML = `
        <div class="install-banner-content">
            <p>Installez B3N pour un accès rapide</p>
            <button class="install-now-btn">Installer</button>
            <button class="close-banner-btn">&times;</button>
        </div>
    `;
    
    // Style de la bannière
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.right = '0';
    banner.style.background = 'var(--primary-color)';
    banner.style.color = 'white';
    banner.style.padding = '10px';
    banner.style.zIndex = '1001';
    banner.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    banner.style.display = 'block';
    
    // Style du contenu de la bannière
    const content = banner.querySelector('.install-banner-content');
    content.style.display = 'flex';
    content.style.alignItems = 'center';
    content.style.justifyContent = 'space-between';
    content.style.maxWidth = '1200px';
    content.style.margin = '0 auto';
    content.style.padding = '0 1rem';
    
    // Style des boutons
    const installBtn = banner.querySelector('.install-now-btn');
    installBtn.style.background = 'var(--secondary-color)';
    installBtn.style.color = 'white';
    installBtn.style.border = 'none';
    installBtn.style.padding = '8px 15px';
    installBtn.style.borderRadius = '5px';
    installBtn.style.cursor = 'pointer';
    installBtn.style.fontWeight = 'bold';
    
    const closeBtn = banner.querySelector('.close-banner-btn');
    closeBtn.style.background = 'transparent';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.padding = '0 10px';
    
    // Ajouter au DOM
    document.body.insertBefore(banner, document.body.firstChild);
    
    // Ajuster l'espacement du header pour éviter le chevauchement
    const header = document.querySelector('header');
    if (header) {
        header.style.marginTop = banner.offsetHeight + 'px';
    }
    
    // Gestionnaire d'événements pour les boutons
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        banner.style.display = 'none';
        // Réinitialiser la marge du header
        if (header) {
            header.style.marginTop = '0';
        }
    });
    
    closeBtn.addEventListener('click', () => {
        banner.style.display = 'none';
        // Réinitialiser la marge du header
        if (header) {
            header.style.marginTop = '0';
        }
    });
}

// Enregistrement du service worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('Service Worker enregistré avec succès:', registration.scope);
                })
                .catch(function(error) {
                    console.log('Échec de l\'enregistrement du Service Worker:', error);
                });
        });
    }
}

// Fonction pour activer le lien de navigation correspondant à la page actuelle
function activateCurrentPageLink() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPage === linkPath || 
            (currentPage.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('active');
        }
    });
    
    // S'assurer que le logo est cliquable et renvoie vers la page d'accueil
    const logoImg = document.querySelector('.logo-img');
    const logoTitle = document.querySelector('.logo h1');
    
    if (logoImg && !logoImg.parentElement.tagName === 'A') {
        logoImg.style.cursor = 'pointer';
        logoImg.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    if (logoTitle && !logoTitle.parentElement.tagName === 'A') {
        logoTitle.style.cursor = 'pointer';
        logoTitle.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

// Configuration du menu burger pour la navigation mobile
function setupBurgerMenu() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const body = document.body;
    
    if (burger && nav) {
        // Fonction pour basculer le menu
        function toggleMenu() {
            nav.classList.toggle('active');
            burger.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Animation des liens
            const navLinks = document.querySelectorAll('.nav-links li');
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        }
        
        // Gestionnaire d'événements pour le bouton burger
        burger.addEventListener('click', toggleMenu);
        
        // Fermer le menu lorsqu'un lien est cliqué
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Fermer le menu uniquement si c'est sur mobile (si le menu burger est visible)
                if (getComputedStyle(burger).display !== 'none' && nav.classList.contains('active')) {
                    // Petit délai pour permettre à l'utilisateur de voir le clic avant que le menu ne se ferme
                    setTimeout(() => {
                        toggleMenu();
                    }, 100);
                    
                    // Si c'est un lien interne (ancre), empêcher le comportement par défaut
                    // car nous gérerons le défilement après la fermeture du menu
                    if (link.getAttribute('href').startsWith('#')) {
                        e.preventDefault();
                        const targetId = link.getAttribute('href');
                        
                        setTimeout(() => {
                            const targetElement = document.querySelector(targetId);
                            if (targetElement) {
                                targetElement.scrollIntoView({
                                    behavior: 'smooth'
                                });
                            }
                        }, 300); // Délai pour attendre que le menu se ferme
                    }
                }
            });
        });
        
        // Fermer le menu lorsqu'on clique en dehors
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                !burger.contains(e.target)) {
                toggleMenu();
            }
        });
        
        // Fermer le menu lorsqu'on fait défiler la page
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop + 10 && nav.classList.contains('active')) {
                toggleMenu();
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }
}

// Fonction pour s'assurer que le logo est cliquable sur toutes les pages
function makeLogoClickable() {
    const logoContainer = document.querySelector('.logo');
    
    if (logoContainer) {
        // Ajouter un style de curseur pour indiquer que c'est cliquable
        logoContainer.style.cursor = 'pointer';
        
        // Ajouter un gestionnaire d'événements au conteneur du logo
        logoContainer.addEventListener('click', (e) => {
            // Vérifier si l'élément cliqué est déjà à l'intérieur d'un lien
            if (!e.target.closest('a')) {
                window.location.href = 'index.html';
            }
        });
        
        // S'assurer que l'image du logo est cliquable si elle n'est pas déjà dans un lien
        const logoImg = logoContainer.querySelector('.logo-img');
        if (logoImg && !logoImg.closest('a')) {
            logoImg.style.cursor = 'pointer';
            logoImg.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        // S'assurer que le titre du logo est cliquable s'il n'est pas déjà dans un lien
        const logoTitle = logoContainer.querySelector('h1');
        if (logoTitle && !logoTitle.closest('a')) {
            logoTitle.style.cursor = 'pointer';
            logoTitle.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    }
} 