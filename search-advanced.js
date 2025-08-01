/**
 * Système de recherche avancé pour la bibliothèque B3N
 */

class AdvancedSearch {
    constructor() {
        this.resources = [];
        this.filteredResources = [];
        this.filters = {
            type: [],
            category: [],
            tags: [],
            year: null,
            language: null,
            level: null
        };
        this.sortOption = 'relevance';
        this.searchTerm = '';
        this.initialized = false;
    }

    /**
     * Initialise le système de recherche avancé
     */
    init() {
        // Chargement des données (dans un environnement de production, cela viendrait d'une API)
        this.loadResources()
            .then(() => {
                this.setupEventListeners();
                this.initialized = true;
                console.log('Système de recherche avancé initialisé avec succès');
            })
            .catch(error => {
                console.error('Erreur lors de l\'initialisation du système de recherche:', error);
            });
    }

    /**
     * Charge les ressources depuis le fichier JSON (simule un appel API)
     */
    async loadResources() {
        try {
            // Dans un environnement réel, cela pourrait être un appel API
            // Pour la démonstration, nous utilisons des données statiques
            this.resources = [
                {
                    id: 1,
                    title: "L'Aventure ambiguë",
                    author: "Cheikh Hamidou Kane",
                    type: "livre",
                    category: "littérature",
                    tags: ["roman", "classique", "sénégal"],
                    year: 1961,
                    language: "français",
                    level: "tous",
                    description: "Un roman phare de la littérature africaine qui explore le choc des cultures.",
                    link: "https://drive.google.com/file/d/sample1",
                    thumbnail: "images/resources/aventure-ambigue.jpg"
                },
                {
                    id: 2,
                    title: "Introduction à la programmation Python",
                    author: "Dr. Fatou Ndiaye",
                    type: "cours",
                    category: "informatique",
                    tags: ["programmation", "python", "débutant"],
                    year: 2022,
                    language: "français",
                    level: "débutant",
                    description: "Cours complet pour apprendre les bases de la programmation avec Python.",
                    link: "https://drive.google.com/file/d/sample2",
                    thumbnail: "images/resources/python-intro.jpg"
                },
                {
                    id: 3,
                    title: "Techniques agricoles durables au Sahel",
                    author: "Institut Sénégalais de Recherche Agricole",
                    type: "guide",
                    category: "agriculture",
                    tags: ["agriculture", "durabilité", "sahel"],
                    year: 2023,
                    language: "français",
                    level: "intermédiaire",
                    description: "Guide pratique sur les techniques agricoles adaptées aux conditions sahéliennes.",
                    link: "https://drive.google.com/file/d/sample3",
                    thumbnail: "images/resources/agriculture-sahel.jpg"
                },
                {
                    id: 4,
                    title: "Business Model Canvas Expliqué",
                    author: "Incubateur StartX Dakar",
                    type: "vidéo",
                    category: "business",
                    tags: ["entrepreneuriat", "modèle d'affaires", "startup"],
                    year: 2023,
                    language: "français",
                    level: "tous",
                    description: "Tutoriel vidéo expliquant comment utiliser le Business Model Canvas pour structurer votre projet.",
                    link: "https://www.youtube.com/watch?v=sample4",
                    thumbnail: "images/resources/business-canvas.jpg"
                },
                {
                    id: 5,
                    title: "Comment réussir sa prise de parole en public",
                    author: "Dr. Issa Diop",
                    type: "présentation",
                    category: "communication",
                    tags: ["prise de parole", "confiance", "public speaking"],
                    year: 2022,
                    language: "français",
                    level: "intermédiaire",
                    description: "Présentation complète sur les techniques de prise de parole en public efficace.",
                    link: "https://drive.google.com/file/d/sample5",
                    thumbnail: "images/resources/public-speaking.jpg"
                },
                {
                    id: 6,
                    title: "Préparation au concours de la fonction publique",
                    author: "Ministère de la Fonction Publique",
                    type: "guide",
                    category: "concours",
                    tags: ["fonction publique", "préparation", "concours"],
                    year: 2023,
                    language: "français",
                    level: "avancé",
                    description: "Guide complet pour préparer les concours de la fonction publique sénégalaise.",
                    link: "https://drive.google.com/file/d/sample6",
                    thumbnail: "images/resources/concours-guide.jpg"
                },
                {
                    id: 7,
                    title: "Développement Web Frontend avec React",
                    author: "Tech Hub Dakar",
                    type: "cours",
                    category: "informatique",
                    tags: ["développement web", "react", "javascript"],
                    year: 2023,
                    language: "français",
                    level: "intermédiaire",
                    description: "Formation complète sur le développement d'interfaces modernes avec React.",
                    link: "https://drive.google.com/file/d/sample7",
                    thumbnail: "images/resources/react-course.jpg"
                },
                {
                    id: 8,
                    title: "Une si longue lettre",
                    author: "Mariama Bâ",
                    type: "livre",
                    category: "littérature",
                    tags: ["roman", "classique", "sénégal", "féminisme"],
                    year: 1979,
                    language: "français",
                    level: "tous",
                    description: "Roman épistolaire emblématique qui aborde la condition féminine au Sénégal.",
                    link: "https://drive.google.com/file/d/sample8",
                    thumbnail: "images/resources/si-longue-lettre.jpg"
                },
                {
                    id: 9,
                    title: "Intelligence Émotionnelle: Comprendre et Gérer ses Émotions",
                    author: "Dr. Aïcha Fall",
                    type: "article",
                    category: "développement personnel",
                    tags: ["psychologie", "émotions", "bien-être"],
                    year: 2023,
                    language: "français",
                    level: "tous",
                    description: "Article détaillé sur l'importance de l'intelligence émotionnelle dans la vie personnelle et professionnelle.",
                    link: "https://drive.google.com/file/d/sample9",
                    thumbnail: "images/resources/emotional-intelligence.jpg"
                },
                {
                    id: 10,
                    title: "Techniques avancées de culture maraîchère",
                    author: "Institut de Développement Rural",
                    type: "guide",
                    category: "agriculture",
                    tags: ["maraîchage", "techniques", "productivité"],
                    year: 2022,
                    language: "français",
                    level: "avancé",
                    description: "Guide pratique sur les techniques modernes de culture maraîchère adaptées au climat sénégalais.",
                    link: "https://drive.google.com/file/d/sample10",
                    thumbnail: "images/resources/maraichage.jpg"
                }
            ];
            
            // Initialise la liste filtrée avec toutes les ressources
            this.filteredResources = [...this.resources];
            
            // Génère les filtres à partir des données disponibles
            this.generateFilterOptions();
            
            // Affiche les résultats initiaux
            this.displayResults();
        } catch (error) {
            console.error("Erreur lors du chargement des ressources:", error);
            throw error;
        }
    }

    /**
     * Configure les écouteurs d'événements pour les filtres et la recherche
     */
    setupEventListeners() {
        // Écouteur pour le champ de recherche principal
        const searchInput = document.getElementById('advanced-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.searchTerm = searchInput.value.toLowerCase();
                this.applyFilters();
            }, 300));
        }

        // Écouteurs pour les filtres de type
        const typeFilters = document.querySelectorAll('.type-filter');
        typeFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.updateTypeFilters();
                this.applyFilters();
            });
        });

        // Écouteurs pour les filtres de catégorie
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.updateCategoryFilters();
                this.applyFilters();
            });
        });

        // Écouteur pour le filtre de langue
        const languageFilter = document.getElementById('language-filter');
        if (languageFilter) {
            languageFilter.addEventListener('change', () => {
                this.filters.language = languageFilter.value === 'all' ? null : languageFilter.value;
                this.applyFilters();
            });
        }

        // Écouteur pour le filtre de niveau
        const levelFilter = document.getElementById('level-filter');
        if (levelFilter) {
            levelFilter.addEventListener('change', () => {
                this.filters.level = levelFilter.value === 'all' ? null : levelFilter.value;
                this.applyFilters();
            });
        }

        // Écouteur pour le filtre d'année
        const yearFilter = document.getElementById('year-filter');
        if (yearFilter) {
            yearFilter.addEventListener('change', () => {
                this.filters.year = yearFilter.value === 'all' ? null : parseInt(yearFilter.value);
                this.applyFilters();
            });
        }

        // Écouteur pour l'option de tri
        const sortOption = document.getElementById('sort-option');
        if (sortOption) {
            sortOption.addEventListener('change', () => {
                this.sortOption = sortOption.value;
                this.sortResults();
                this.displayResults();
            });
        }

        // Écouteur pour réinitialiser les filtres
        const resetButton = document.getElementById('reset-filters');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }

    /**
     * Met à jour les filtres de type sélectionnés
     */
    updateTypeFilters() {
        const typeFilters = document.querySelectorAll('.type-filter:checked');
        this.filters.type = Array.from(typeFilters).map(filter => filter.value);
    }

    /**
     * Met à jour les filtres de catégorie sélectionnés
     */
    updateCategoryFilters() {
        const categoryFilters = document.querySelectorAll('.category-filter:checked');
        this.filters.category = Array.from(categoryFilters).map(filter => filter.value);
    }

    /**
     * Applique tous les filtres sélectionnés
     */
    applyFilters() {
        this.filteredResources = this.resources.filter(resource => {
            // Filtre par terme de recherche
            if (this.searchTerm && !this.matchSearchTerm(resource, this.searchTerm)) {
                return false;
            }

            // Filtre par type
            if (this.filters.type.length > 0 && !this.filters.type.includes(resource.type)) {
                return false;
            }

            // Filtre par catégorie
            if (this.filters.category.length > 0 && !this.filters.category.includes(resource.category)) {
                return false;
            }

            // Filtre par langue
            if (this.filters.language && resource.language !== this.filters.language) {
                return false;
            }

            // Filtre par niveau
            if (this.filters.level && resource.level !== this.filters.level && resource.level !== 'tous') {
                return false;
            }

            // Filtre par année
            if (this.filters.year && resource.year !== this.filters.year) {
                return false;
            }

            return true;
        });

        // Tri des résultats
        this.sortResults();

        // Affichage des résultats filtrés
        this.displayResults();
    }

    /**
     * Vérifie si une ressource correspond au terme de recherche
     */
    matchSearchTerm(resource, term) {
        if (!term) return true;
        
        term = term.toLowerCase();
        
        // Recherche dans le titre, l'auteur et la description
        if (resource.title.toLowerCase().includes(term) || 
            resource.author.toLowerCase().includes(term) || 
            resource.description.toLowerCase().includes(term)) {
            return true;
        }
        
        // Recherche dans les tags
        if (resource.tags.some(tag => tag.toLowerCase().includes(term))) {
            return true;
        }
        
        return false;
    }

    /**
     * Trie les résultats selon l'option sélectionnée
     */
    sortResults() {
        switch (this.sortOption) {
            case 'title_asc':
                this.filteredResources.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title_desc':
                this.filteredResources.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'year_newest':
                this.filteredResources.sort((a, b) => b.year - a.year);
                break;
            case 'year_oldest':
                this.filteredResources.sort((a, b) => a.year - b.year);
                break;
            case 'relevance':
            default:
                // Si nous avons un terme de recherche, trier par pertinence
                if (this.searchTerm) {
                    this.filteredResources.sort((a, b) => {
                        const scoreA = this.calculateRelevanceScore(a, this.searchTerm);
                        const scoreB = this.calculateRelevanceScore(b, this.searchTerm);
                        return scoreB - scoreA;
                    });
                }
                break;
        }
    }

    /**
     * Calcule un score de pertinence pour une ressource par rapport au terme de recherche
     */
    calculateRelevanceScore(resource, term) {
        if (!term) return 0;
        
        let score = 0;
        term = term.toLowerCase();
        
        // Le titre est le plus important
        if (resource.title.toLowerCase().includes(term)) {
            score += 10;
            // Bonus si le terme est au début du titre
            if (resource.title.toLowerCase().startsWith(term)) {
                score += 5;
            }
        }
        
        // L'auteur est également important
        if (resource.author.toLowerCase().includes(term)) {
            score += 7;
        }
        
        // Les tags sont pertinents
        resource.tags.forEach(tag => {
            if (tag.toLowerCase().includes(term)) {
                score += 3;
            }
        });
        
        // La description est moins prioritaire
        if (resource.description.toLowerCase().includes(term)) {
            score += 2;
        }
        
        return score;
    }

    /**
     * Génère les options de filtres basées sur les données disponibles
     */
    generateFilterOptions() {
        // Cette fonction serait utilisée pour générer dynamiquement les options de filtres
        // à partir des données disponibles, comme les types, catégories, années, etc.
        // Pour la démonstration, nous supposons que les filtres sont déjà définis dans le HTML.
    }

    /**
     * Affiche les résultats de recherche dans l'interface
     */
    displayResults() {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;
        
        // Vide le conteneur de résultats
        resultsContainer.innerHTML = '';
        
        // Affiche le nombre de résultats trouvés
        const resultCount = document.getElementById('result-count');
        if (resultCount) {
            resultCount.textContent = this.filteredResources.length;
        }
        
        // Si aucun résultat, affiche un message
        if (this.filteredResources.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Aucun résultat ne correspond à votre recherche</p>
                    <p>Essayez d'autres termes ou filtres</p>
                </div>
            `;
            return;
        }
        
        // Crée une carte pour chaque ressource filtrée
        this.filteredResources.forEach(resource => {
            const card = document.createElement('div');
            card.className = 'resource-card';
            card.dataset.id = resource.id;
            
            // Applique une animation d'apparition
            card.style.animation = 'fadeIn 0.5s ease-out forwards';
            
            card.innerHTML = `
                <div class="resource-thumbnail">
                    <img src="${resource.thumbnail || 'images/resource-placeholder.jpg'}" alt="${resource.title}" loading="lazy">
                    <span class="resource-type ${resource.type}">${resource.type}</span>
                </div>
                <div class="resource-info">
                    <h3>${resource.title}</h3>
                    <p class="resource-author">Par ${resource.author}</p>
                    <p class="resource-details">
                        <span class="resource-year">${resource.year}</span> • 
                        <span class="resource-category">${resource.category}</span> • 
                        <span class="resource-level">${resource.level}</span>
                    </p>
                    <p class="resource-description">${resource.description}</p>
                    <div class="resource-tags">
                        ${resource.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <a href="${resource.link}" class="resource-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i> Accéder à la ressource
                    </a>
                </div>
            `;
            
            resultsContainer.appendChild(card);
        });
    }

    /**
     * Réinitialise tous les filtres et la recherche
     */
    resetFilters() {
        // Réinitialise le terme de recherche
        const searchInput = document.getElementById('advanced-search-input');
        if (searchInput) {
            searchInput.value = '';
            this.searchTerm = '';
        }
        
        // Réinitialise les filtres de type
        document.querySelectorAll('.type-filter').forEach(filter => {
            filter.checked = false;
        });
        
        // Réinitialise les filtres de catégorie
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.checked = false;
        });
        
        // Réinitialise le filtre de langue
        const languageFilter = document.getElementById('language-filter');
        if (languageFilter) {
            languageFilter.value = 'all';
        }
        
        // Réinitialise le filtre de niveau
        const levelFilter = document.getElementById('level-filter');
        if (levelFilter) {
            levelFilter.value = 'all';
        }
        
        // Réinitialise le filtre d'année
        const yearFilter = document.getElementById('year-filter');
        if (yearFilter) {
            yearFilter.value = 'all';
        }
        
        // Réinitialise l'option de tri
        const sortOption = document.getElementById('sort-option');
        if (sortOption) {
            sortOption.value = 'relevance';
            this.sortOption = 'relevance';
        }
        
        // Réinitialise les filtres internes
        this.filters = {
            type: [],
            category: [],
            tags: [],
            year: null,
            language: null,
            level: null
        };
        
        // Réapplique les filtres (qui sont maintenant vides)
        this.filteredResources = [...this.resources];
        this.displayResults();
    }

    /**
     * Fonction utilitaire pour limiter la fréquence d'exécution d'une fonction
     */
    debounce(func, delay) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }
}

// Initialisation du système de recherche quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    const searchSystem = new AdvancedSearch();
    searchSystem.init();
    
    // On expose l'instance pour pouvoir y accéder depuis la console (pour débogage)
    window.advancedSearch = searchSystem;
}); 