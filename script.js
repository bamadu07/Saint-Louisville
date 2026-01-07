// Header Slider avec fluidité améliorée
document.addEventListener('DOMContentLoaded', function() {
    // Header Slider
    const headerSliderTrack = document.getElementById('headerSliderTrack');
    const headerSlides = document.querySelectorAll('.header-slider .slider-slide');
    const headerDotsContainer = document.getElementById('headerSliderDots');
    
    let headerCurrentSlide = 0;
    const headerTotalSlides = headerSlides.length;
    
    // Créer les points pour le header slider
    for (let i = 0; i < headerTotalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.dataset.index = i;
        headerDotsContainer.appendChild(dot);
    }
    
    const headerDots = document.querySelectorAll('.slider-dot');
    
    function updateHeaderSlider() {
        headerSliderTrack.style.transform = `translateX(-${headerCurrentSlide * 100}%)`;
        
        // Mettre à jour les points actifs
        headerDots.forEach(dot => dot.classList.remove('active'));
        headerDots[headerCurrentSlide].classList.add('active');
    }
    
    // Navigation avec points pour le header
    headerDots.forEach(dot => {
        dot.addEventListener('click', () => {
            headerCurrentSlide = parseInt(dot.dataset.index);
            updateHeaderSlider();
        });
    });
    
    // Défilement automatique pour le header slider
    let headerAutoplay = setInterval(() => {
        headerCurrentSlide = (headerCurrentSlide + 1) % headerTotalSlides;
        updateHeaderSlider();
    }, 5000);
    
    // Pause au survol
    headerSliderTrack.addEventListener('mouseenter', () => clearInterval(headerAutoplay));
    headerSliderTrack.addEventListener('mouseleave', () => {
        headerAutoplay = setInterval(() => {
            headerCurrentSlide = (headerCurrentSlide + 1) % headerTotalSlides;
            updateHeaderSlider();
        }, 5000);
    });
    
    // NOUVEAU : Carrousel des Adjoints Ultra-Fluide et Automatique - MODIFIÉ POUR 1 SECONDE
    const adjointsTrack = document.getElementById('adjointsTrack');
    const adjointsCards = document.querySelectorAll('.adjoint-carousel-card');
    const adjointsDotsContainer = document.getElementById('adjointsDots');
    
    let adjointsCurrentSlide = 0;
    let adjointsCardsPerView = 1;
    let isAnimating = false;
    let adjointsAutoplay;
    
    // Déterminer le nombre de cartes visibles selon la largeur de l'écran
    function updateAdjointsCardsPerView() {
        if (window.innerWidth >= 1024) {
            adjointsCardsPerView = 3;
        } else if (window.innerWidth >= 768) {
            adjointsCardsPerView = 2;
        } else {
            adjointsCardsPerView = 1;
        }
    }
    
    // Initialiser le carrousel des adjoints
    function initAdjointsCarousel() {
        updateAdjointsCardsPerView();
        
        // Créer les points de navigation
        adjointsDotsContainer.innerHTML = '';
        const totalDots = Math.ceil(adjointsCards.length / adjointsCardsPerView);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('adjoints-dot');
            if (i === 0) dot.classList.add('active');
            dot.dataset.index = i;
            
            dot.addEventListener('click', () => {
                if (!isAnimating) {
                    adjointsCurrentSlide = i;
                    updateAdjointsCarousel();
                    resetAutoplay();
                }
            });
            
            adjointsDotsContainer.appendChild(dot);
        }
        
        updateAdjointsCarousel();
        startAutoplay();
    }
    
    function updateAdjointsCarousel() {
        if (isAnimating) return;
        
        isAnimating = true;
        const cardWidth = 100 / adjointsCardsPerView;
        const translateX = adjointsCurrentSlide * cardWidth;
        
        // Animation fluide
        adjointsTrack.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        adjointsTrack.style.transform = `translateX(-${translateX}%)`;
        
        // Mettre à jour l'état des cartes
        adjointsCards.forEach((card, index) => {
            card.classList.remove('active');
        });
        
        // Activer les cartes visibles
        const startIndex = adjointsCurrentSlide * adjointsCardsPerView;
        const endIndex = startIndex + adjointsCardsPerView;
        
        for (let i = startIndex; i < Math.min(endIndex, adjointsCards.length); i++) {
            adjointsCards[i]?.classList.add('active');
        }
        
        // Mettre à jour les points actifs
        const dots = document.querySelectorAll('.adjoints-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[adjointsCurrentSlide]) {
            dots[adjointsCurrentSlide].classList.add('active');
        }
        
        // Réinitialiser l'animation
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    // Fonction pour passer à la slide suivante
    function nextAdjointsSlide() {
        if (!isAnimating) {
            const maxSlide = Math.ceil(adjointsCards.length / adjointsCardsPerView) - 1;
            adjointsCurrentSlide = adjointsCurrentSlide < maxSlide ? adjointsCurrentSlide + 1 : 0;
            updateAdjointsCarousel();
        }
    }
    
    // MODIFIÉ : Défilement automatique toutes les 1 secondes
    function startAutoplay() {
        adjointsAutoplay = setInterval(() => {
            nextAdjointsSlide();
        }, 1000); // Change toutes les 1 seconde
    }
    
    function resetAutoplay() {
        clearInterval(adjointsAutoplay);
        startAutoplay();
    }
    
    // Gérer le redimensionnement de la fenêtre
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateAdjointsCardsPerView();
            updateAdjointsCarousel();
        }, 250);
    });
    
    // Pause au survol
    adjointsTrack.addEventListener('mouseenter', () => clearInterval(adjointsAutoplay));
    adjointsTrack.addEventListener('mouseleave', () => startAutoplay());
    
    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !isAnimating) {
            const maxSlide = Math.ceil(adjointsCards.length / adjointsCardsPerView) - 1;
            adjointsCurrentSlide = adjointsCurrentSlide > 0 ? adjointsCurrentSlide - 1 : maxSlide;
            updateAdjointsCarousel();
            resetAutoplay();
        } else if (e.key === 'ArrowRight' && !isAnimating) {
            nextAdjointsSlide();
            resetAutoplay();
        }
    });
    
    // Initialiser le carrousel des adjoints
    initAdjointsCarousel();
    
    // Animation au défilement
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll('.service-card, .maire-card, .blog-card, .stat-item, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
    
    // Animation pour les cartes du carrousel
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, observerOptions);
    
    adjointsCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.95)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        carouselObserver.observe(card);
    });
});

// Mobile menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
    this.innerHTML = mobileMenu.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : 
        '<i class="fas fa-bars"></i>';
});

// Fermer le menu au clic sur un lien
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.innerHTML = mobileMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    });

    // Fermer le menu mobile
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Filtrage des articles
    const filterTabs = document.querySelectorAll('.filter-tab');
    const blogCards = document.querySelectorAll('.blog-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Animation du clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Mettre à jour l'onglet actif
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const selectedCategory = this.getAttribute('data-category');
            
            // Filtrer avec animation
            blogCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`;
                    }, 50);
                } else {
                    card.style.animation = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Recherche d'articles
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm) {
            searchButton.innerHTML = '<div class="loading"></div>';
        }
        
        setTimeout(() => {
            blogCards.forEach((card, index) => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const excerpt = card.querySelector('p').textContent.toLowerCase();
                const category = card.querySelector('.blog-category').textContent.toLowerCase();
                
                if (searchTerm === '' || 
                    title.includes(searchTerm) || 
                    excerpt.includes(searchTerm) ||
                    category.includes(searchTerm)) {
                    
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`;
                    }, 50);
                } else {
                    card.style.animation = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            searchButton.innerHTML = '<i class="fas fa-search"></i>';
            
            // Afficher un message si aucun résultat
            const visibleCards = Array.from(blogCards).filter(card => 
                card.style.display !== 'none'
            );
            
            if (visibleCards.length === 0 && searchTerm !== '') {
                const noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
                        <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                        <h3 style="color: var(--primary-color); margin-bottom: 10px;">Aucun résultat trouvé</h3>
                        <p style="color: #666;">Essayez d'autres mots-clés ou explorez nos catégories.</p>
                    </div>
                `;
                
                if (!document.querySelector('.no-results')) {
                    document.getElementById('blogGrid').appendChild(noResults);
                }
            } else {
                const existingNoResults = document.querySelector('.no-results');
                if (existingNoResults) {
                    existingNoResults.remove();
                }
            }
        }, 500);
    }
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Newsletter avec feedback
    const newsletterForm = document.getElementById('newsletterForm');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const submitBtn = this.querySelector('button');
        const email = emailInput.value.trim();
        
        if (validateEmail(email)) {
            const originalText = submitBtn.innerHTML;
            
            // Animation de chargement
            submitBtn.innerHTML = '<div class="loading"></div>';
            submitBtn.disabled = true;
            
            // Simulation d'envoi
            setTimeout(() => {
                // Succès
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div style="background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71; border-radius: var(--border-radius); padding: 20px; margin-top: 20px; text-align: center; animation: fadeInUp 0.5s;">
                        <i class="fas fa-check-circle" style="color: #2ecc71; font-size: 2rem; margin-bottom: 10px;"></i>
                        <h4 style="color: white; margin-bottom: 10px;">Inscription réussie !</h4>
                        <p style="color: rgba(255,255,255,0.9);">Merci ! Vous recevrez bientôt nos actualités.</p>
                    </div>
                `;
                
                newsletterForm.parentNode.insertBefore(successMessage, newsletterForm.nextSibling);
                
                // Reset du formulaire
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                emailInput.value = '';
                
                // Supprimer le message après 5 secondes
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 1500);
        } else {
            // Animation d'erreur
            emailInput.style.borderColor = '#e74c3c';
            emailInput.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.2)';
            
            setTimeout(() => {
                emailInput.style.borderColor = '';
                emailInput.style.boxShadow = '';
            }, 2000);
        }
    });
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Animation au défilement
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll('.featured-main, .featured-side, .blog-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Smooth scroll pour les boutons Voir Plus
    document.querySelectorAll('.see-more-btn, .featured-side-link, .read-more').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Pagination interactive
    const pageLinks = document.querySelectorAll('.page-link:not(.prev):not(.next)');
    const prevBtn = document.querySelector('.page-link.prev');
    const nextBtn = document.querySelector('.page-link.next');
    let currentPage = 1;
    
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('active')) return;
            
            // Animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Mettre à jour la page active
            pageLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            currentPage = parseInt(this.textContent);
            
            // Mettre à jour les boutons précédent/suivant
            updatePaginationButtons();
            
            // Simuler le chargement de la page
            simulatePageLoad(currentPage);
        });
    });
    
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            updateActivePage();
            simulatePageLoad(currentPage);
        }
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < 5) {
            currentPage++;
            updateActivePage();
            simulatePageLoad(currentPage);
        }
    });
    
    function updateActivePage() {
        pageLinks.forEach(link => {
            link.classList.remove('active');
            if (parseInt(link.textContent) === currentPage) {
                link.classList.add('active');
            }
        });
        updatePaginationButtons();
    }
    
    function updatePaginationButtons() {
        prevBtn.classList.toggle('disabled', currentPage === 1);
        nextBtn.classList.toggle('disabled', currentPage === 5);
    }
    
    function simulatePageLoad(page) {
        const blogGrid = document.getElementById('blogGrid');
        blogGrid.style.opacity = '0.5';
        blogGrid.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            blogGrid.style.opacity = '1';
            blogGrid.style.transform = 'translateY(0)';
            blogGrid.style.transition = 'all 0.5s ease';
            
            // Réanimer les cartes
            blogCards.forEach((card, index) => {
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`;
                }, 50);
            });
        }, 300);
    }

    // Effet de survol amélioré pour les cartes
    blogCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 1;
            const rotateX = ((centerY - y) / centerY) * 1;
            
            card.style.transform = `
                translateY(-10px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });

    // Gestion du scroll pour le header
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            document.querySelector('header').style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            document.querySelector('header').style.backdropFilter = 'blur(20px)';
        } else {
            document.querySelector('header').style.boxShadow = '0 2px 15px rgba(0,0,0,0.08)';
            document.querySelector('header').style.backdropFilter = 'blur(10px)';
        }
        
        lastScroll = currentScroll;
    });

    // Animation des boutons Voir Plus au survol
    document.querySelectorAll('.see-more-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.innerHTML = mobileMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    });

    // Fermer le menu mobile
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Filtrage des articles
    const filterTabs = document.querySelectorAll('.filter-tab');
    const blogCards = document.querySelectorAll('.blog-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Animation du clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Mettre à jour l'onglet actif
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const selectedCategory = this.getAttribute('data-category');
            
            // Filtrer avec animation
            blogCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`;
                    }, 50);
                } else {
                    card.style.animation = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Recherche d'articles
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm) {
            searchButton.innerHTML = '<div class="loading"></div>';
        }
        
        setTimeout(() => {
            blogCards.forEach((card, index) => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const excerpt = card.querySelector('p').textContent.toLowerCase();
                const category = card.querySelector('.blog-category').textContent.toLowerCase();
                
                if (searchTerm === '' || 
                    title.includes(searchTerm) || 
                    excerpt.includes(searchTerm) ||
                    category.includes(searchTerm)) {
                    
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`;
                    }, 50);
                } else {
                    card.style.animation = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            searchButton.innerHTML = '<i class="fas fa-search"></i>';
            
            // Afficher un message si aucun résultat
            const visibleCards = Array.from(blogCards).filter(card => 
                card.style.display !== 'none'
            );
            
            if (visibleCards.length === 0 && searchTerm !== '') {
                const noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
                        <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                        <h3 style="color: var(--primary-color); margin-bottom: 10px;">Aucun résultat trouvé</h3>
                        <p style="color: #666;">Essayez d'autres mots-clés ou explorez nos catégories.</p>
                    </div>
                `;
                
                if (!document.querySelector('.no-results')) {
                    document.getElementById('blogGrid').appendChild(noResults);
                }
            } else {
                const existingNoResults = document.querySelector('.no-results');
                if (existingNoResults) {
                    existingNoResults.remove();
                }
            }
        }, 500);
    }
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Newsletter avec feedback
    const newsletterForm = document.getElementById('newsletterForm');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const submitBtn = this.querySelector('button');
        const email = emailInput.value.trim();
        
        if (validateEmail(email)) {
            const originalText = submitBtn.innerHTML;
            
            // Animation de chargement
            submitBtn.innerHTML = '<div class="loading"></div>';
            submitBtn.disabled = true;
            
            // Simulation d'envoi
            setTimeout(() => {
                // Succès
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div style="background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71; border-radius: var(--border-radius); padding: 20px; margin-top: 20px; text-align: center; animation: fadeInUp 0.5s;">
                        <i class="fas fa-check-circle" style="color: #2ecc71; font-size: 2rem; margin-bottom: 10px;"></i>
                        <h4 style="color: white; margin-bottom: 10px;">Inscription réussie !</h4>
                        <p style="color: rgba(255,255,255,0.9);">Merci ! Vous recevrez bientôt nos actualités.</p>
                    </div>
                `;
                
                newsletterForm.parentNode.insertBefore(successMessage, newsletterForm.nextSibling);
                
                // Reset du formulaire
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                emailInput.value = '';
                
                // Supprimer le message après 5 secondes
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 1500);
        } else {
            // Animation d'erreur
            emailInput.style.borderColor = '#e74c3c';
            emailInput.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.2)';
            
            setTimeout(() => {
                emailInput.style.borderColor = '';
                emailInput.style.boxShadow = '';
            }, 2000);
        }
    });
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Animation au défilement
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll('.featured-main, .featured-side, .blog-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Smooth scroll pour les boutons Voir Plus
    document.querySelectorAll('.see-more-btn, .featured-side-link, .read-more').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Pagination interactive
    const pageLinks = document.querySelectorAll('.page-link:not(.prev):not(.next)');
    const prevBtn = document.querySelector('.page-link.prev');
    const nextBtn = document.querySelector('.page-link.next');
    let currentPage = 1;
    
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('active')) return;
            
            // Animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Mettre à jour la page active
            pageLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            currentPage = parseInt(this.textContent);
            
            // Mettre à jour les boutons précédent/suivant
            updatePaginationButtons();
            
            // Simuler le chargement de la page
            simulatePageLoad(currentPage);
        });
    });
    
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            updateActivePage();
            simulatePageLoad(currentPage);
        }
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < 5) {
            currentPage++;
            updateActivePage();
            simulatePageLoad(currentPage);
        }
    });
    
    function updateActivePage() {
        pageLinks.forEach(link => {
            link.classList.remove('active');
            if (parseInt(link.textContent) === currentPage) {
                link.classList.add('active');
            }
        });
        updatePaginationButtons();
    }
    
    function updatePaginationButtons() {
        prevBtn.classList.toggle('disabled', currentPage === 1);
        nextBtn.classList.toggle('disabled', currentPage === 5);
    }
    
    function simulatePageLoad(page) {
        const blogGrid = document.getElementById('blogGrid');
        blogGrid.style.opacity = '0.5';
        blogGrid.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            blogGrid.style.opacity = '1';
            blogGrid.style.transform = 'translateY(0)';
            blogGrid.style.transition = 'all 0.5s ease';
            
            // Réanimer les cartes
            blogCards.forEach((card, index) => {
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`;
                }, 50);
            });
        }, 300);
    }

    // Effet de survol amélioré pour les cartes
    blogCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 1;
            const rotateX = ((centerY - y) / centerY) * 1;
            
            card.style.transform = `
                translateY(-10px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });

    // Gestion du scroll pour le header
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            document.querySelector('header').style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            document.querySelector('header').style.backdropFilter = 'blur(20px)';
        } else {
            document.querySelector('header').style.boxShadow = '0 2px 15px rgba(0,0,0,0.08)';
            document.querySelector('header').style.backdropFilter = 'blur(10px)';
        }
        
        lastScroll = currentScroll;
    });

    // Animation des boutons Voir Plus au survol
    document.querySelectorAll('.see-more-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // ========== HEADER SLIDER ==========
    const headerSliderTrack = document.getElementById('headerSliderTrack');
    const headerSlides = document.querySelectorAll('.header-slider .slider-slide');
    const headerDotsContainer = document.getElementById('headerSliderDots');
    
    let headerCurrentSlide = 0;
    const headerTotalSlides = headerSlides.length;
    
    // Créer les points de navigation
    for (let i = 0; i < headerTotalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.dataset.index = i;
        dot.addEventListener('click', () => {
            headerCurrentSlide = parseInt(dot.dataset.index);
            updateHeaderSlider();
        });
        headerDotsContainer.appendChild(dot);
    }
    
    const headerDots = document.querySelectorAll('.slider-dot');
    
    function updateHeaderSlider() {
        headerSliderTrack.style.transform = `translateX(-${headerCurrentSlide * 100}%)`;
        headerDots.forEach(dot => dot.classList.remove('active'));
        headerDots[headerCurrentSlide].classList.add('active');
    }
    
    // Auto-play du slider
    let headerAutoplay = setInterval(() => {
        headerCurrentSlide = (headerCurrentSlide + 1) % headerTotalSlides;
        updateHeaderSlider();
    }, 5000);
    
    // Pause au survol
    headerSliderTrack.addEventListener('mouseenter', () => clearInterval(headerAutoplay));
    headerSliderTrack.addEventListener('mouseleave', () => {
        headerAutoplay = setInterval(() => {
            headerCurrentSlide = (headerCurrentSlide + 1) % headerTotalSlides;
            updateHeaderSlider();
        }, 5000);
    });

    // ========== MOBILE MENU ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.innerHTML = mobileMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    });

    // Fermer le menu au clic sur un lien
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // ========== GALLERY DATA ==========
    // Données des images de la galerie (simulées depuis les données HTML)
    const galleryImages = [
        {
            id: 1,
            src: 'images/pont2.jpg',
            alt: 'Pont Faidherbe illuminé la nuit sur le fleuve Sénégal',
            category: 'monuments',
            title: 'Pont Faidherbe - Symbole Éternel',
            description: 'Construit en 1897, ce pont métallique de 507 mètres est l\'emblème de Saint-Louis. Composé de 7 travées dont une tournante, il relie l\'île au continent. Chef-d\'œuvre d\'ingénierie souvent attribué à Gustave Eiffel.',
            year: '1897',
            location: 'Entre l\'île et le continent'
        },
        {
            id: 2,
            src: 'images/maison.jpeg',
            alt: 'Façades coloniales colorées du centre historique',
            category: 'architecture',
            title: 'Architecture Coloniale Préservée',
            description: 'Maisons bourgeoises du XIXe siècle avec balcons en fer forgé importés de France, persiennes et garde-corps ouvragés témoignent de la prospérité commerciale de Saint-Louis.',
            year: '1850-1900',
            location: 'Avenue Blaise Diagne'
        },
        {
            id: 3,
            src: 'images/pave.jpeg',
            alt: 'Ruelle pavée typique du vieux Saint-Louis',
            category: 'vie',
            title: 'Ruelles Pavées Historiques',
            description: 'Les ruelles étroites et pavées du centre historique conservent l\'authenticité du tissu urbain du XIXe siècle. Le pavage traditionnel en calade permettait le drainage des eaux de pluie.',
            year: 'XIXe siècle',
            location: 'Quartier Sud de l\'île'
        },
        {
            id: 4,
            src: 'images/eglise2.jpeg',
            alt: 'Cathédrale Saint-Louis au crépuscule',
            category: 'monuments',
            title: 'Cathédrale Saint-Louis',
            description: 'Édifiée en 1828, première cathédrale d\'Afrique de l\'Ouest. Style néo-classique avec des influences mauresques. Le clocher domine le paysage urbain à 35 mètres de hauteur.',
            year: '1828',
            location: 'Place Pierre Loti'
        },
        {
            id: 5,
            src: 'images/fer.jpeg',
            alt: 'Maisons coloniales avec balcons en fer forgé',
            category: 'architecture',
            title: 'Balcons en Fer Forgé',
            description: 'Signature architecturale de Saint-Louis. Fabriqués en France et assemblés sur place, ils ornent les façades des maisons bourgeoises du XIXe siècle.',
            year: '1850-1900',
            location: 'Centre historique'
        },
        {
            id: 6,
            src: 'images/marche.jpeg',
            alt: 'Marché traditionnel animé de Saint-Louis',
            category: 'vie',
            title: 'Marché Tilène',
            description: 'Fondé au XIXe siècle, le marché Tilène est le cœur commercial de Saint-Louis. Sous ses halles métalliques, on trouve épices, tissus wax et artisanat local dans une ambiance unique.',
            year: '1870',
            location: 'Centre de l\'île'
        },
        {
            id: 7,
            src: 'images/plage.jpeg',
            alt: 'Plage de Saint-Louis avec pêcheurs',
            category: 'nature',
            title: 'Plage de la Langue de Barbarie',
            description: 'Bande de sable entre l\'océan Atlantique et le fleuve Sénégal. Site de nidification pour de nombreux oiseaux migrateurs et lieu de pêche traditionnelle.',
            year: 'Naturel',
            location: 'Langue de Barbarie'
        },
        {
            id: 8,
            src: 'images/pirogue.jpeg',
            alt: 'Pirogues colorées des pêcheurs',
            category: 'culture',
            title: 'Pirogues Traditionnelles',
            description: 'Les pirogues multicolores des pêcheurs Guet Ndar sont indissociables du paysage saint-louisien. Tradition séculaire de pêche perpétuée chaque jour.',
            year: 'Tradition séculaire',
            location: 'Quartier Guet Ndar'
        },
        {
            id: 9,
            src: 'images/jardin.jpeg',
            alt: 'Jardin public avec palmiers',
            category: 'nature',
            title: 'Jardin Public Historique',
            description: 'Créé en 1865 sous le gouverneur Faidherbe, un des plus anciens jardins publics d\'Afrique de l\'Ouest. Abrite des essences rares et des palmiers centenaires.',
            year: '1865',
            location: 'Près de la Gouvernance'
        },
        {
            id: 10,
            src: 'images/maisarchi.jpeg',
            alt: 'Cour intérieure typique de Saint-Louis',
            category: 'architecture',
            title: 'Cours Intérieures',
            description: 'Les cours intérieures des maisons coloniales, souvent agrémentées de puits et de végétation luxuriante, constituent des havres de paix au cœur de la ville historique.',
            year: 'XIXe siècle',
            location: 'Maisons coloniales'
        },
        {
            id: 11,
            src: 'images/pirogue.jpeg',
            alt: 'Pêcheurs au travail sur la plage',
            category: 'culture',
            title: 'Pêche Traditionnelle',
            description: 'La pêche artisanale reste une activité économique importante à Saint-Louis, perpétuant des techniques ancestrales transmises de génération en génération.',
            year: 'Tradition',
            location: 'Plage de Guet Ndar'
        },
        {
            id: 12,
            src: 'images/jazz.jpg',
            alt: 'Festival de musique de Saint-Louis',
            category: 'culture',
            title: 'Festival International',
            description: 'Saint-Louis accueille chaque année un festival international de jazz et de musique africaine qui anime les rues et places historiques de la ville.',
            year: 'Annuel',
            location: 'Centre historique'
        },
        {
            id: 13,
            src: 'images/monument.jpeg',
            alt: 'Vue aérienne de l\'île de Saint-Louis',
            category: 'monuments',
            title: 'Vue Aérienne de l\'Île',
            description: 'L\'île de Saint-Louis, entourée par les eaux du fleuve Sénégal, révèle toute sa beauté et son organisation urbaine unique lorsqu\'on la contemple depuis le ciel.',
            year: 'Vue panoramique',
            location: 'Île de Saint-Louis'
        },
        {
            id: 14,
            src: 'images/arts.jpeg',
            alt: 'Artisanat local de Saint-Louis',
            category: 'culture',
            title: 'Artisanat Traditionnel',
            description: 'L\'artisanat saint-louisien, avec ses tissus wax, ses bijoux et ses objets en cuir, perpétue des savoir-faire ancestraux et contribue à l\'identité culturelle de la ville.',
            year: 'Tradition',
            location: 'Ateliers locaux'
        },
        {
            id: 15,
            src: 'images/soleil.jpeg',
            alt: 'Coucher de soleil sur le fleuve Sénégal',
            category: 'nature',
            title: 'Coucher de Soleil sur le Fleuve',
            description: 'Les couchers de soleil sur le fleuve Sénégal offrent un spectacle naturel exceptionnel, avec des reflets dorés sur les eaux et les silhouettes des pirogues.',
            year: 'Naturel',
            location: 'Fleuve Sénégal'
        }
    ];

    // ========== GALLERY FUNCTIONS ==========
    const galerieGrid = document.getElementById('galerieGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const voirPlusBtn = document.getElementById('voirPlusBtn');
    
    let currentFilter = 'all';
    let visibleImages = 6;
    
    // Initialiser la galerie
    function initGallery() {
        renderGallery();
        setupEventListeners();
    }
    
    // Rendre la galerie
    function renderGallery() {
        const filteredImages = getFilteredImages();
        const imagesToShow = filteredImages.slice(0, visibleImages);
        
        // Masquer toutes les images d'abord
        document.querySelectorAll('.galerie-item').forEach(item => {
            item.style.display = 'none';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
        });
        
        // Afficher les images visibles
        imagesToShow.forEach(img => {
            const galleryItem = document.querySelector(`.galerie-item[data-id="${img.id}"]`);
            if (galleryItem) {
                galleryItem.style.display = 'block';
                setTimeout(() => {
                    galleryItem.style.opacity = '1';
                    galleryItem.style.transform = 'scale(1)';
                }, 10);
            }
        });
        
        // Mettre à jour le bouton "Voir plus"
        updateVoirPlusButton(filteredImages.length);
    }
    
    // Obtenir les images filtrées
    function getFilteredImages() {
        if (currentFilter === 'all') return galleryImages;
        return galleryImages.filter(img => img.category === currentFilter);
    }
    
    // Obtenir le nom de la catégorie
    function getCategoryName(category) {
        const names = {
            'all': 'Tout',
            'architecture': 'Architecture',
            'monuments': 'Monuments',
            'culture': 'Culture',
            'nature': 'Nature',
            'vie': 'Vie Urbaine'
        };
        return names[category] || category;
    }
    
    // Mettre à jour le bouton "Voir plus"
    function updateVoirPlusButton(totalFiltered) {
        if (visibleImages >= totalFiltered) {
            voirPlusBtn.style.display = 'none';
        } else {
            voirPlusBtn.style.display = 'inline-flex';
        }
    }
    
    // ========== EVENT LISTENERS ==========
    function setupEventListeners() {
        // Filtres de galerie
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.classList.contains('active')) return;
                
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                visibleImages = 6;
                renderGallery();
            });
        });
        
        // Bouton "Voir plus"
        voirPlusBtn.addEventListener('click', function() {
            visibleImages += 6;
            renderGallery();
        });
        
        // Gestion du lightbox pour les images
        document.querySelectorAll('.galerie-item').forEach(item => {
            item.addEventListener('click', function() {
                const imgId = parseInt(this.dataset.id);
                const image = galleryImages.find(img => img.id === imgId);
                if (image) {
                    openLightbox(image);
                }
            });
        });
        
        // Scroll to top
        const scrollTopBtn = document.getElementById('scrollTop');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Smooth scroll pour les ancres
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ========== LIGHTBOX ==========
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentImageIndex = 0;
    let currentLightboxImages = [];
    
    function openLightbox(image) {
        currentLightboxImages = getFilteredImages();
        currentImageIndex = currentLightboxImages.findIndex(img => img.id === image.id);
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function updateLightbox() {
        const img = currentLightboxImages[currentImageIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        lightboxCaption.innerHTML = `
            <h3>${img.title}</h3>
            <p>${img.description}</p>
            <div class="lightbox-meta">
                <span class="lightbox-category">${getCategoryName(img.category)}</span>
                ${img.year ? `<span class="lightbox-date"><i class="far fa-calendar-alt"></i> ${img.year}</span>` : ''}
                ${img.location ? `<span class="lightbox-date"><i class="fas fa-map-marker-alt"></i> ${img.location}</span>` : ''}
            </div>
        `;
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function navigateLightbox(direction) {
        currentImageIndex += direction;
        if (currentImageIndex < 0) currentImageIndex = currentLightboxImages.length - 1;
        if (currentImageIndex >= currentLightboxImages.length) currentImageIndex = 0;
        updateLightbox();
    }
    
    // Événements lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
    
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // ========== INITIALIZATION ==========
    initGallery();
    
    // Timeline animation on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Animation des cartes de missions
    const missionCards = document.querySelectorAll('.mission-card');
    const missionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    missionCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        missionObserver.observe(card);
    });
});
// Données de démonstration pour les demandes
const demandes = [
    {
        id: "SL-2023-05874",
        type: "Acte de naissance",
        dateDepot: "2023-10-15",
        demandeur: "Amadou Diop",
        email: "amadou.diop@example.com",
        telephone: "+221 77 123 45 67",
        adresse: "Rue Blaise Diagne, Saint-Louis",
        motif: "Passeport",
        statut: "traitement",
        commentaire: "Demande standard",
        service: "État Civil",
        agent: "Marie Ndiaye",
        historique: [
            {
                date: "2023-10-15 09:30",
                statut: "enregistre",
                agent: "Système",
                commentaire: "Demande reçue en ligne"
            },
            {
                date: "2023-10-16 14:20",
                statut: "verification",
                agent: "Marie Ndiaye",
                commentaire: "Vérification des informations"
            },
            {
                date: "2023-10-20 11:15",
                statut: "traitement",
                agent: "Marie Ndiaye",
                commentaire: "Document en cours de préparation"
            }
        ]
    },
    {
        id: "SL-2023-05875",
        type: "Acte de mariage",
        dateDepot: "2023-10-16",
        demandeur: "Fatou Sow",
        email: "fatou.sow@example.com",
        telephone: "+221 76 987 65 43",
        adresse: "Avenue Jean Mermoz, Saint-Louis",
        motif: "Succession",
        statut: "valide",
        commentaire: "Document prêt à être retiré",
        service: "État Civil",
        agent: "Ibrahima Fall",
        historique: [
            {
                date: "2023-10-16 10:45",
                statut: "enregistre",
                agent: "Système",
                commentaire: "Demande reçue en ligne"
            },
            {
                date: "2023-10-17 15:30",
                statut: "verification",
                agent: "Ibrahima Fall",
                commentaire: "Vérification terminée"
            },
            {
                date: "2023-10-18 09:15",
                statut: "valide",
                agent: "Ibrahima Fall",
                commentaire: "Document validé et prêt"
            }
        ]
    },
    {
        id: "SL-2023-05876",
        type: "Acte de décès",
        dateDepot: "2023-10-14",
        demandeur: "Jean Diallo",
        email: "jean.diallo@example.com",
        telephone: "+221 70 456 78 90",
        adresse: "Quai Roume, Saint-Louis",
        motif: "Succession",
        statut: "verification",
        commentaire: "En attente de pièces complémentaires",
        service: "État Civil",
        agent: "Aminata Kane",
        historique: [
            {
                date: "2023-10-14 16:20",
                statut: "enregistre",
                agent: "Système",
                commentaire: "Demande reçue en ligne"
            },
            {
                date: "2023-10-19 10:00",
                statut: "verification",
                agent: "Aminata Kane",
                commentaire: "Demande de pièces complémentaires"
            }
        ]
    },
    {
        id: "SL-2023-05877",
        type: "Copie intégrale",
        dateDepot: "2023-10-18",
        demandeur: "Moussa Ndiaye",
        email: "moussa.ndiaye@example.com",
        telephone: "+221 78 234 56 78",
        adresse: "Rue du Général de Gaulle, Saint-Louis",
        motif: "Procédure administrative",
        statut: "enregistre",
        commentaire: "Nouvelle demande",
        service: "État Civil",
        agent: "Système",
        historique: [
            {
                date: "2023-10-18 14:30",
                statut: "enregistre",
                agent: "Système",
                commentaire: "Demande reçue en ligne"
            }
        ]
    },
    {
        id: "SL-2023-05878",
        type: "Acte de naissance",
        dateDepot: "2023-10-12",
        demandeur: "Aïssatou Fall",
        email: "aissatou.fall@example.com",
        telephone: "+221 77 345 67 89",
        adresse: "Boulevard de la République, Saint-Louis",
        motif: "Carte d'identité",
        statut: "rejete",
        commentaire: "Informations incomplètes",
        service: "État Civil",
        agent: "Marie Ndiaye",
        historique: [
            {
                date: "2023-10-12 11:20",
                statut: "enregistre",
                agent: "Système",
                commentaire: "Demande reçue en ligne"
            },
            {
                date: "2023-10-13 16:45",
                statut: "verification",
                agent: "Marie Ndiaye",
                commentaire: "Informations manquantes identifiées"
            },
            {
                date: "2023-10-17 10:15",
                statut: "rejete",
                agent: "Marie Ndiaye",
                commentaire: "Demande rejetée - informations incomplètes"
            }
        ]
    }
];

// Traduction des statuts
const statutsLabels = {
    "enregistre": "Enregistré",
    "verification": "En vérification",
    "traitement": "En traitement",
    "valide": "Validé",
    "rejete": "Rejeté",
    "archive": "Archivé"
};

// Traduction des types
const typesLabels = {
    "naissance": "Acte de naissance",
    "mariage": "Acte de mariage",
    "deces": "Acte de décès",
    "copie": "Copie intégrale"
};

// Variables globales
let currentDemande = null;

// Fonction pour formater une date
function formatDate(dateString, includeTime = false) {
    const date = new Date(dateString);
    if (includeTime) {
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    return date.toLocaleDateString('fr-FR');
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Afficher le message d'info au chargement
    document.getElementById('infoMessage').style.display = 'block';
    
    // Initialiser les écouteurs d'événements
    initEventListeners();
    
    // Gestion du menu mobile
    initMobileMenu();
});

// Initialiser les écouteurs d'événements
function initEventListeners() {
    // Recherche de demande
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch();
    });

    // Réinitialisation de la recherche
    document.getElementById('resetSearch').addEventListener('click', function() {
        resetSearch();
    });

    // Bouton pour changer le statut
    document.getElementById('changerStatutBtn').addEventListener('click', function() {
        showStatusChangeForm();
    });

    // Sélection d'un statut
    document.querySelectorAll('.statut-option').forEach(option => {
        option.addEventListener('click', function() {
            selectStatusOption(this);
        });
    });

    // Annuler le changement de statut
    document.getElementById('cancelStatutBtn').addEventListener('click', function() {
        cancelStatusChange();
    });

    // Enregistrer le changement de statut
    document.getElementById('saveStatutBtn').addEventListener('click', function() {
        saveStatusChange();
    });

    // Voir l'historique
    document.getElementById('voirHistoriqueBtn').addEventListener('click', function() {
        showHistory();
    });

    // Fermer l'historique
    document.getElementById('closeHistoriqueBtn').addEventListener('click', function() {
        closeHistory();
    });

    // Générer un document
    document.getElementById('genererDocumentBtn').addEventListener('click', function() {
        generateDocument();
    });
}

// Gestion du menu mobile
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.innerHTML = mobileMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    });

    // Gestion du sous-menu mobile
    document.querySelectorAll('.mobile-dropdown > a').forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            parent.classList.toggle('active');
            
            document.querySelectorAll('.mobile-dropdown').forEach(other => {
                if (other !== parent) other.classList.remove('active');
            });
        });
    });
}

// Effectuer une recherche
function performSearch() {
    const dossier = document.getElementById('searchDossier').value.trim();
    const nom = document.getElementById('searchNom').value.trim().toLowerCase();
    const type = document.getElementById('searchType').value;
    const statut = document.getElementById('searchStatut').value;
    
    let results = demandes;
    
    // Appliquer les filtres
    if (dossier) {
        results = results.filter(d => d.id.toLowerCase().includes(dossier.toLowerCase()));
    }
    
    if (nom) {
        results = results.filter(d => d.demandeur.toLowerCase().includes(nom));
    }
    
    if (type) {
        results = results.filter(d => d.type.toLowerCase().includes(type));
    }
    
    if (statut) {
        results = results.filter(d => d.statut === statut);
    }
    
    displayResults(results);
}

// Réinitialiser la recherche
function resetSearch() {
    document.getElementById('searchForm').reset();
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('demandeDetails').classList.remove('active');
    currentDemande = null;
}

// Afficher les résultats de recherche
function displayResults(results) {
    const resultsContainer = document.getElementById('resultsTable');
    const searchResultsSection = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    <h4 style="margin: 0;">Aucune demande trouvée</h4>
                    <p style="margin-top: 0.5rem;">Essayez avec d'autres critères de recherche.</p>
                </td>
            </tr>
        `;
        searchResultsSection.style.display = 'block';
        return;
    }
    
    let html = '';
    
    results.forEach(demande => {
        const statusClass = `status-${demande.statut}`;
        const statusLabel = statutsLabels[demande.statut] || demande.statut;
        
        html += `<tr>`;
        html += `<td><strong>${demande.id}</strong></td>`;
        html += `<td>${demande.type}</td>`;
        html += `<td>${demande.demandeur}</td>`;
        html += `<td>${formatDate(demande.dateDepot)}</td>`;
        html += `<td><span class="status-badge ${statusClass}">${statusLabel}</span></td>`;
        html += `<td>
                    <button class="btn btn-sm btn-primary" onclick="selectDemande('${demande.id}')">
                        <i class="fas fa-eye"></i> Voir
                    </button>
                 </td>`;
        html += `</tr>`;
    });
    
    resultsContainer.innerHTML = html;
    searchResultsSection.style.display = 'block';
    
    // Faire défiler vers les résultats
    searchResultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Sélectionner une demande
window.selectDemande = function(demandeId) {
    currentDemande = demandes.find(d => d.id === demandeId);
    
    if (currentDemande) {
        displayDemandeDetails(currentDemande);
        document.getElementById('searchResults').style.display = 'none';
        document.getElementById('demandeDetails').classList.add('active');
        document.getElementById('changementStatutForm').classList.remove('active');
        document.getElementById('historiqueSection').classList.remove('active');
        
        // Faire défiler vers les détails
        document.getElementById('demandeDetails').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Afficher les détails d'une demande
function displayDemandeDetails(demande) {
    const statusClass = `status-${demande.statut}`;
    const statusLabel = statutsLabels[demande.statut] || demande.statut;
    
    document.getElementById('currentStatus').className = `status-badge ${statusClass}`;
    document.getElementById('currentStatus').textContent = statusLabel;
    
    let detailsHtml = `
        <div class="detail-item">
            <h4>Numéro de dossier</h4>
            <p>${demande.id}</p>
        </div>
        <div class="detail-item">
            <h4>Type de demande</h4>
            <p>${demande.type}</p>
        </div>
        <div class="detail-item">
            <h4>Demandeur</h4>
            <p>${demande.demandeur}</p>
        </div>
        <div class="detail-item">
            <h4>Date de dépôt</h4>
            <p>${formatDate(demande.dateDepot)}</p>
        </div>
        <div class="detail-item">
            <h4>Email</h4>
            <p>${demande.email}</p>
        </div>
        <div class="detail-item">
            <h4>Téléphone</h4>
            <p>${demande.telephone}</p>
        </div>
        <div class="detail-item">
            <h4>Adresse</h4>
            <p>${demande.adresse}</p>
        </div>
        <div class="detail-item">
            <h4>Motif</h4>
            <p>${demande.motif}</p>
        </div>
        <div class="detail-item">
            <h4>Service traitant</h4>
            <p>${demande.service}</p>
        </div>
        <div class="detail-item">
            <h4>Agent responsable</h4>
            <p>${demande.agent}</p>
        </div>
        <div class="detail-item">
            <h4>Commentaire</h4>
            <p>${demande.commentaire || "Aucun commentaire"}</p>
        </div>
    `;
    
    document.getElementById('detailsContent').innerHTML = detailsHtml;
}

// Afficher le formulaire de changement de statut
function showStatusChangeForm() {
    if (!currentDemande) {
        showErrorMessage("Veuillez d'abord sélectionner une demande.");
        return;
    }
    
    document.getElementById('demandeDetails').classList.remove('active');
    document.getElementById('changementStatutForm').classList.add('active');
    document.getElementById('demandeNumero').textContent = currentDemande.id;
    
    // Réinitialiser la sélection des statuts
    document.querySelectorAll('.statut-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Faire défiler vers le formulaire
    document.getElementById('changementStatutForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Sélectionner une option de statut
function selectStatusOption(optionElement) {
    document.querySelectorAll('.statut-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    optionElement.classList.add('selected');
}

// Annuler le changement de statut
function cancelStatusChange() {
    document.getElementById('changementStatutForm').classList.remove('active');
    document.getElementById('demandeDetails').classList.add('active');
}

// Enregistrer le changement de statut
function saveStatusChange() {
    const selectedOption = document.querySelector('.statut-option.selected');
    if (!selectedOption) {
        showErrorMessage("Veuillez sélectionner un nouveau statut.");
        return;
    }
    
    const nouveauStatut = selectedOption.dataset.value;
    const commentaire = document.getElementById('statutComment').value.trim();
    const notifier = document.getElementById('notifierClient').checked;
    
    if (nouveauStatut === currentDemande.statut) {
        showErrorMessage("Le nouveau statut est identique au statut actuel.");
        return;
    }
    
    // Ajouter à l'historique
    const historiqueEntry = {
        date: new Date().toISOString(),
        statut: nouveauStatut,
        agent: "Administrateur",
        commentaire: commentaire || "Changement de statut"
    };
    
    currentDemande.historique.push(historiqueEntry);
    currentDemande.statut = nouveauStatut;
    
    // Mettre à jour l'affichage
    displayDemandeDetails(currentDemande);
    
    // Afficher le message de succès
    let successMessage = `Le statut de la demande ${currentDemande.id} a été changé en <strong>${statutsLabels[nouveauStatut]}</strong>.`;
    if (notifier) {
        successMessage += " Le demandeur a été notifié par email.";
    }
    showSuccessMessage(successMessage);
    
    // Retourner aux détails
    document.getElementById('changementStatutForm').classList.remove('active');
    document.getElementById('demandeDetails').classList.add('active');
    document.getElementById('statutComment').value = '';
}

// Afficher l'historique
function showHistory() {
    if (!currentDemande) {
        showErrorMessage("Veuillez d'abord sélectionner une demande.");
        return;
    }
    
    document.getElementById('demandeDetails').classList.remove('active');
    document.getElementById('historiqueSection').classList.add('active');
    document.getElementById('historiqueNumero').textContent = currentDemande.id;
    
    displayHistorique(currentDemande.historique);
    
    // Faire défiler vers l'historique
    document.getElementById('historiqueSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Afficher l'historique des modifications
function displayHistorique(historique) {
    const timeline = document.getElementById('historiqueTimeline');
    let html = '';
    
    // Trier l'historique par date (du plus récent au plus ancien)
    const sortedHistorique = [...historique].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedHistorique.forEach((entry, index) => {
        const isImportant = index === 0; // Le dernier changement est important
        const statusLabel = statutsLabels[entry.statut] || entry.statut;
        const iconClass = getIconForStatus(entry.statut);
        
        html += `
            <div class="timeline-item ${isImportant ? 'important' : ''}">
                <div class="timeline-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="timeline-content">
                    <h5>${statusLabel}</h5>
                    <p>${entry.commentaire}</p>
                    <div class="timeline-date">
                        ${formatDate(entry.date, true)} - Par ${entry.agent}
                    </div>
                </div>
            </div>
        `;
    });
    
    timeline.innerHTML = html || `
        <div style="text-align: center; padding: 2rem; color: #666;">
            <i class="fas fa-history" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
            <h4 style="margin: 0;">Aucun historique disponible</h4>
        </div>
    `;
}

// Fermer l'historique
function closeHistory() {
    document.getElementById('historiqueSection').classList.remove('active');
    document.getElementById('demandeDetails').classList.add('active');
}

// Générer un document
function generateDocument() {
    if (!currentDemande) {
        showErrorMessage("Veuillez d'abord sélectionner une demande.");
        return;
    }
    
    showSuccessMessage(`Le document pour la demande ${currentDemande.id} a été généré avec succès.`);
    
    // Dans une vraie application, on téléchargerait le PDF
    // Simuler un téléchargement
    setTimeout(() => {
        const docTypes = {
            "Acte de naissance": "acte_naissance",
            "Acte de mariage": "acte_mariage",
            "Acte de décès": "acte_deces",
            "Copie intégrale": "copie_integrale"
        };
        
        const docType = docTypes[currentDemande.type] || "document";
        alert(`Document ${currentDemande.id}.pdf généré avec succès !\n\nType: ${docType}_${currentDemande.id}.pdf`);
    }, 500);
}

// Obtenir l'icône pour un statut
function getIconForStatus(statut) {
    switch(statut) {
        case 'enregistre': return 'fas fa-inbox text-primary';
        case 'verification': return 'fas fa-search text-warning';
        case 'traitement': return 'fas fa-cogs text-info';
        case 'valide': return 'fas fa-check-circle text-success';
        case 'rejete': return 'fas fa-times-circle text-danger';
        case 'archive': return 'fas fa-archive text-secondary';
        default: return 'fas fa-info-circle';
    }
}

// Afficher un message de succès
function showSuccessMessage(message) {
    const alert = document.getElementById('successMessage');
    alert.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    alert.style.display = 'block';
    
    // Masquer après 5 secondes
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
    
    // Faire défiler vers le message
    alert.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Afficher un message d'erreur
function showErrorMessage(message) {
    const alert = document.getElementById('errorMessage');
    alert.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    alert.style.display = 'block';
    
    // Masquer après 5 secondes
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
    
    // Faire défiler vers le message
    alert.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
// Header Slider
document.addEventListener('DOMContentLoaded', function() {
    // Header Slider
    const headerSliderTrack = document.getElementById('headerSliderTrack');
    const headerSlides = document.querySelectorAll('.header-slider .slider-slide');
    const headerDotsContainer = document.getElementById('headerSliderDots');
    
    let headerCurrentSlide = 0;
    const headerTotalSlides = headerSlides.length;
    
    // Créer les points pour le header slider
    for (let i = 0; i < headerTotalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.dataset.index = i;
        headerDotsContainer.appendChild(dot);
    }
    
    const headerDots = document.querySelectorAll('.slider-dot');
    
    function updateHeaderSlider() {
        headerSliderTrack.style.transform = `translateX(-${headerCurrentSlide * 100}%)`;
        
        // Mettre à jour les points actifs
        headerDots.forEach(dot => dot.classList.remove('active'));
        headerDots[headerCurrentSlide].classList.add('active');
    }
    
    // Navigation avec points pour le header
    headerDots.forEach(dot => {
        dot.addEventListener('click', () => {
            headerCurrentSlide = parseInt(dot.dataset.index);
            updateHeaderSlider();
        });
    });
    
    // Défilement automatique pour le header slider
    let headerAutoplay = setInterval(() => {
        headerCurrentSlide = (headerCurrentSlide + 1) % headerTotalSlides;
        updateHeaderSlider();
    }, 4000);
    
    // Pause au survol
    headerSliderTrack.addEventListener('mouseenter', () => clearInterval(headerAutoplay));
    headerSliderTrack.addEventListener('mouseleave', () => {
        headerAutoplay = setInterval(() => {
            headerCurrentSlide = (headerCurrentSlide + 1) % headerTotalSlides;
            updateHeaderSlider();
        }, 4000);
    });
    
    // Menu mobile
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.innerHTML = mobileMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    });

    // Fermer le menu au clic sur un lien
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});
// Document ready
document.addEventListener('DOMContentLoaded', function() {
    // Header Slider
    const headerSliderTrack = document.getElementById('headerSliderTrack');
    const headerSlides = document.querySelectorAll('.header-slider .slider-slide');
    const headerDotsContainer = document.getElementById('headerSliderDots');
    
    let headerCurrentSlide = 0;
    const headerTotalSlides = headerSlides.length;
    
    // Créer les points pour le header slider
    if (headerDotsContainer && headerTotalSlides > 0) {
        for (let i = 0; i < headerTotalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.dataset.index = i;
            headerDotsContainer.appendChild(dot);
        }
        
        const headerDots = document.querySelectorAll('.slider-dot');
        
        function updateHeaderSlider() {
            headerSliderTrack.style.transform = `translateX(-${headerCurrentSlide * 100}%)`;
            
            // Mettre à jour les points actifs
            headerDots.forEach(dot => dot.classList.remove('active'));
            headerDots[headerCurrentSlide].classList.add('active');
        }
        
        // Navigation avec points pour le header
        headerDots.forEach(dot => {
            dot.addEventListener('click', () => {
                headerCurrentSlide = parseInt(dot.dataset.index);
                updateHeaderSlider();
            });
        });
        
        // Défilement automatique pour le header slider
        let headerAutoplay = setInterval(() => {
            headerCurrentSlide = (headerCurrentSlide + 1) % headerTotalSlides;
            updateHeaderSlider();
        }, 4000);
        
        // Pause au survol
        headerSliderTrack.addEventListener('mouseenter', () => clearInterval(headerAutoplay));
        headerSliderTrack.addEventListener('mouseleave', () => {
            headerAutoplay = setInterval(() => {
                headerCurrentSlide = (headerCurrentSlide + 1) % headerTotalSlides;
                updateHeaderSlider();
            }, 4000);
        });
    }
    
    // Menu mobile
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.innerHTML = mobileMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });

        // Fermer le menu au clic sur un lien
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Bouton retour en haut
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== GESTION DU FORMULAIRE AMÉLIORÉ =====
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    
    // Fonction pour masquer tous les messages
    function hideAllMessages() {
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('warningMessage').style.display = 'none';
        document.getElementById('infoMessage').style.display = 'none';
    }
    
    // Fonction pour afficher un message
    function showMessage(type, message) {
        const messageElement = document.getElementById(type + 'Message');
        messageElement.innerHTML = message;
        messageElement.style.display = 'block';
        
        // Faire défiler vers le message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Masquer après 10 secondes (sauf pour info)
        if (type !== 'info') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 10000);
        }
    }
    
    // Fonction pour valider un champ
    function validateField(fieldId, validator, errorId, errorMessage) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        const formGroup = field.closest('.form-group');
        
        if (!value) {
            document.getElementById(errorId).textContent = 'Ce champ est obligatoire';
            document.getElementById(errorId).style.display = 'block';
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
        
        if (!validator(value)) {
            document.getElementById(errorId).textContent = errorMessage;
            document.getElementById(errorId).style.display = 'block';
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
        
        document.getElementById(errorId).style.display = 'none';
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        return true;
    }
    
    // Validation de l'email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validation du téléphone (Sénégal)
    function validatePhone(phone) {
        if (!phone) return true; // Téléphone optionnel
        const phoneRegex = /^(\+221|00221)?[0-9]{9}$/;
        const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanedPhone);
    }
    
    // Formatage du téléphone
    function formatPhoneNumber(value) {
        let numbers = value.replace(/\D/g, '');
        
        if (numbers.length === 0) return '';
        
        if (numbers.length <= 2) {
            return numbers;
        } else if (numbers.length <= 5) {
            return numbers.substring(0, 2) + ' ' + numbers.substring(2);
        } else if (numbers.length <= 7) {
            return numbers.substring(0, 2) + ' ' + numbers.substring(2, 5) + ' ' + numbers.substring(5);
        } else {
            return numbers.substring(0, 2) + ' ' + numbers.substring(2, 5) + ' ' + numbers.substring(5, 7) + ' ' + numbers.substring(7, 9);
        }
    }
    
    if (contactForm && submitBtn) {
        // Validation en temps réel
        const nomInput = document.getElementById('nom');
        const prenomInput = document.getElementById('prenom');
        const emailInput = document.getElementById('email');
        const telephoneInput = document.getElementById('telephone');
        const serviceSelect = document.getElementById('service');
        const sujetInput = document.getElementById('sujet');
        const messageInput = document.getElementById('message');
        
        // Validation du nom
        nomInput.addEventListener('blur', () => {
            validateField('nom', 
                (value) => value.length >= 2, 
                'nom-error', 
                'Le nom doit contenir au moins 2 caractères'
            );
        });
        
        // Validation du prénom
        prenomInput.addEventListener('blur', () => {
            validateField('prenom', 
                (value) => value.length >= 2, 
                'prenom-error', 
                'Le prénom doit contenir au moins 2 caractères'
            );
        });
        
        // Validation de l'email
        emailInput.addEventListener('blur', () => {
            validateField('email', 
                validateEmail, 
                'email-error', 
                'Veuillez entrer une adresse email valide'
            );
        });
        
        // Validation et formatage du téléphone
        telephoneInput.addEventListener('input', function() {
            this.value = formatPhoneNumber(this.value);
        });
        
        telephoneInput.addEventListener('blur', () => {
            validateField('telephone', 
                validatePhone, 
                'telephone-error', 
                'Veuillez entrer un numéro de téléphone valide (ex: 77 123 45 67)'
            );
        });
        
        // Validation du service
        serviceSelect.addEventListener('change', () => {
            const value = serviceSelect.value;
            const formGroup = serviceSelect.closest('.form-group');
            
            if (!value) {
                document.getElementById('service-error').textContent = 'Ce champ est obligatoire';
                document.getElementById('service-error').style.display = 'block';
                formGroup.classList.add('error');
                formGroup.classList.remove('success');
            } else {
                document.getElementById('service-error').style.display = 'none';
                formGroup.classList.remove('error');
                formGroup.classList.add('success');
            }
        });
        
        // Validation du sujet
        sujetInput.addEventListener('blur', () => {
            validateField('sujet', 
                (value) => value.length >= 5, 
                'sujet-error', 
                'Le sujet doit contenir au moins 5 caractères'
            );
        });
        
        // Validation du message
        messageInput.addEventListener('blur', () => {
            validateField('message', 
                (value) => value.length >= 10, 
                'message-error', 
                'Le message doit contenir au moins 10 caractères'
            );
        });
        
        // Gestion de la soumission du formulaire
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Masquer tous les messages précédents
            hideAllMessages();
            
            // Vérification honeypot
            const honeypot = document.getElementById('website').value;
            if (honeypot) {
                // C'est probablement un bot, simuler un succès
                showMessage('success', 'Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.');
                contactForm.reset();
                return;
            }
            
            // Validation avant soumission
            const isNomValid = validateField('nom', 
                (value) => value.length >= 2, 
                'nom-error', 
                'Le nom doit contenir au moins 2 caractères'
            );
            
            const isPrenomValid = validateField('prenom', 
                (value) => value.length >= 2, 
                'prenom-error', 
                'Le prénom doit contenir au moins 2 caractères'
            );
            
            const isEmailValid = validateField('email', 
                validateEmail, 
                'email-error', 
                'Veuillez entrer une adresse email valide'
            );
            
            const isPhoneValid = validateField('telephone', 
                validatePhone, 
                'telephone-error', 
                'Veuillez entrer un numéro de téléphone valide'
            );
            
            const isServiceValid = serviceSelect.value ? true : false;
            if (!isServiceValid) {
                document.getElementById('service-error').textContent = 'Ce champ est obligatoire';
                document.getElementById('service-error').style.display = 'block';
                serviceSelect.closest('.form-group').classList.add('error');
            }
            
            const isSujetValid = validateField('sujet', 
                (value) => value.length >= 5, 
                'sujet-error', 
                'Le sujet doit contenir au moins 5 caractères'
            );
            
            const isMessageValid = validateField('message', 
                (value) => value.length >= 10, 
                'message-error', 
                'Le message doit contenir au moins 10 caractères'
            );
            
            // Si tout est valide
            if (isNomValid && isPrenomValid && isEmailValid && isPhoneValid && isServiceValid && isSujetValid && isMessageValid) {
                // Désactiver le bouton pendant l'envoi
                const originalText = btnText.textContent;
                submitBtn.disabled = true;
                btnText.textContent = 'Envoi en cours...';
                btnLoader.style.display = 'inline-block';
                
                // Créer un FormData avec les données du formulaire
                const formData = new FormData(contactForm);
                
                // Envoyer les données via AJAX
                fetch('send_email.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur réseau: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        // Afficher le message de succès
                        showMessage('success', data.message || 'Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.');
                        
                        // Réinitialiser le formulaire
                        contactForm.reset();
                        
                        // Réinitialiser les états de validation
                        document.querySelectorAll('.form-group').forEach(group => {
                            group.classList.remove('success', 'error');
                        });
                        
                        // Afficher un message d'information supplémentaire
                        setTimeout(() => {
                            showMessage('info', 
                                'Vous pouvez également nous contacter directement par téléphone au +221 33 961 10 10 pour une réponse plus rapide.'
                            );
                        }, 2000);
                    } else {
                        // Afficher le message d'erreur
                        showMessage('error', data.message || "Une erreur s'est produite. Veuillez réessayer.");
                    }
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    
                    // Solution de secours : utiliser mailto
                    showMessage('warning', 
                        "Envoi en cours... Si rien ne se passe, cliquez sur le lien ci-dessous :<br>" +
                        '<a href="mailto:o.ndiaye@bcmgroupe.com?subject=Message Mairie Saint-Louis&body=' + 
                        encodeURIComponent('Nom: ' + nomInput.value + '\n' +
                                        'Prénom: ' + prenomInput.value + '\n' +
                                        'Email: ' + emailInput.value + '\n' +
                                        'Téléphone: ' + (telephoneInput.value || 'Non spécifié') + '\n' +
                                        'Service: ' + serviceSelect.value + '\n' +
                                        'Sujet: ' + sujetInput.value + '\n' +
                                        'Message: ' + messageInput.value) + 
                        '" style="color: #856404; text-decoration: underline; margin-top: 10px; display: inline-block;">Ouvrir votre client email</a>'
                    );
                    
                    // Réinitialiser le formulaire
                    contactForm.reset();
                })
                .finally(() => {
                    // Rétablir le bouton
                    submitBtn.disabled = false;
                    btnText.textContent = originalText;
                    btnLoader.style.display = 'none';
                });
            } else {
                // Faire défiler vers la première erreur
                const firstError = document.querySelector('.error-message[style="display: block;"]');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Instructions pour configurer le serveur
    console.log(`
=== INSTRUCTIONS POUR CONFIGURER L'ENVOI D'EMAILS ===

1. Créez un fichier 'send_email.php' dans le même dossier que cette page
2. Copiez le code PHP suivant dans ce fichier :

<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Vérification honeypot
    if (!empty($_POST['website'])) {
        echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès !']);
        exit;
    }
    
    // Nettoyage des données
    $nom = htmlspecialchars(strip_tags(trim($_POST['nom'])));
    $prenom = htmlspecialchars(strip_tags(trim($_POST['prenom'])));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $telephone = htmlspecialchars(strip_tags(trim($_POST['telephone'] ?? 'Non spécifié')));
    $adresse = htmlspecialchars(strip_tags(trim($_POST['adresse'] ?? 'Non spécifiée')));
    $service = htmlspecialchars(strip_tags(trim($_POST['service'])));
    $sujet = htmlspecialchars(strip_tags(trim($_POST['sujet'])));
    $message = htmlspecialchars(strip_tags(trim($_POST['message'])));
    $newsletter = isset($_POST['newsletter']) ? 'Oui' : 'Non';
    
    // Validation
    $errors = [];
    if (empty($nom)) $errors[] = "Le nom est obligatoire";
    if (empty($prenom)) $errors[] = "Le prénom est obligatoire";
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "L'email est invalide";
    if (empty($service)) $errors[] = "Le service est obligatoire";
    if (empty($sujet)) $errors[] = "Le sujet est obligatoire";
    if (empty($message)) $errors[] = "Le message est obligatoire";
    
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode("<br>", $errors)]);
        exit;
    }
    
    // Destinataire principal
    $destinataire = "o.ndiaye@bcmgroupe.com";
    $sujet_email = "[Mairie Saint-Louis] $sujet - Service: $service";
    
    // Construction du message HTML
    $corps_html = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0a3d62; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .section { margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid #eee; }
            .section:last-child { border-bottom: none; }
            .section-title { color: #0a3d62; font-weight: 600; margin-bottom: 15px; font-size: 1.2rem; }
            .info-item { margin-bottom: 10px; }
            .label { font-weight: 600; color: #333; }
            .value { color: #555; }
            .message-box { background-color: white; padding: 15px; border-left: 4px solid #f6b93b; margin: 15px 0; border-radius: 4px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Nouveau message - Mairie de Saint-Louis</h1>
            </div>
            <div class='content'>
                <div class='section'>
                    <h2 class='section-title'>Informations du citoyen</h2>
                    <div class='info-item'><span class='label'>Nom :</span> <span class='value'>$nom $prenom</span></div>
                    <div class='info-item'><span class='label'>Email :</span> <span class='value'><a href='mailto:$email'>$email</a></span></div>
                    <div class='info-item'><span class='label'>Téléphone :</span> <span class='value'><a href='tel:$telephone'>$telephone</a></span></div>
                    <div class='info-item'><span class='label'>Adresse :</span> <span class='value'>$adresse</span></div>
                </div>
                
                <div class='section'>
                    <h2 class='section-title'>Détails de la demande</h2>
                    <div class='info-item'><span class='label'>Service concerné :</span> <span class='value'>$service</span></div>
                    <div class='info-item'><span class='label'>Sujet :</span> <span class='value'>$sujet</span></div>
                    <div class='info-item'><span class='label'>Inscription newsletter :</span> <span class='value'>$newsletter</span></div>
                </div>
                
                <div class='section'>
                    <h2 class='section-title'>Message</h2>
                    <div class='message-box'>
                        " . nl2br($message) . "
                    </div>
                </div>
            </div>
            <div class='footer'>
                <p>Message envoyé depuis le formulaire de contact du site Mairie de Saint-Louis</p>
                <p>Date : " . date('d/m/Y H:i') . " | IP : " . $_SERVER['REMOTE_ADDR'] . "</p>
                <p>⚠️ Réponse requise dans les 48h</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Version texte
    $corps_text = "
    NOUVEAU MESSAGE DU SITE MAIRIE DE SAINT-LOUIS
    
    INFORMATIONS DU CITOYEN
    -----------------------
    Nom: $nom $prenom
    Email: $email
    Téléphone: $telephone
    Adresse: $adresse
    
    DÉTAILS DE LA DEMANDE
    ---------------------
    Service concerné: $service
    Sujet: $sujet
    Newsletter: $newsletter
    
    MESSAGE
    -------
    $message
    
    ---
    Date: " . date('d/m/Y H:i') . "
    IP: " . $_SERVER['REMOTE_ADDR'] . "
    Page: Formulaire de contact
    ";
    
    // En-têtes pour email multipart
    $boundary = uniqid('np');
    $headers = "From: $nom $prenom <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Corps du message multipart
    $message_body = "--$boundary\r\n";
    $message_body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $message_body .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";
    $message_body .= quoted_printable_encode($corps_text) . "\r\n";
    
    $message_body .= "--$boundary\r\n";
    $message_body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $message_body .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";
    $message_body .= quoted_printable_encode($corps_html) . "\r\n";
    
    $message_body .= "--$boundary--";
    
    // Envoi de l'email principal
    $email_sent = mail($destinataire, $sujet_email, $message_body, $headers);
    
    if ($email_sent) {
        // Accusé de réception
        $accuse_sujet = "Accusé de réception - Mairie de Saint-Louis";
        $accuse_corps = "
        Bonjour $prenom $nom,
        
        Nous accusons réception de votre message concernant : $sujet
        
        Votre demande a été transmise au service $service qui la traitera dans les meilleurs délais.
        
        Nous vous répondrons à l'adresse email : $email
        
        Récapitulatif de votre message :
        --------------------------------
        Service: $service
        Sujet: $sujet
        
        Message:
        $message
        
        Nous vous remercions pour votre confiance et nous vous contacterons très prochainement.
        
        Cordialement,
        L'équipe de la Mairie de Saint-Louis
        
        📞 Téléphone : +221 33 961 10 10
        📧 Email : o.ndiaye@bcmgroupe.com
        📍 Adresse : Place Faidherbe, Île de Saint-Louis
        
        ---
        Ceci est un message automatique, merci de ne pas y répondre.
        Date : " . date('d/m/Y H:i') . "
        ";
        
        $accuse_headers = "From: Mairie de Saint-Louis <noreply@mairie-saintlouis.sn>\r\n";
        $accuse_headers .= "Content-Type: text/plain; charset=utf-8\r\n";
        
        // Envoyer l'accusé de réception
        mail($email, $accuse_sujet, $accuse_corps, $accuse_headers);
        
        // Sauvegarde dans un fichier log
        $log_entry = date('Y-m-d H:i:s') . " | Nom: $nom $prenom | Email: $email | Service: $service | Sujet: $sujet\n";
        @file_put_contents('messages_log.txt', $log_entry, FILE_APPEND);
        
        echo json_encode(['success' => true, 'message' => 'Votre message a bien été envoyé ! Un accusé de réception vous a été envoyé par email.']);
    } else {
        echo json_encode(['success' => false, 'message' => "Erreur d'envoi. Veuillez réessayer ou nous contacter directement."]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
}
?>

3. Assurez-vous que votre serveur supporte PHP
4. Testez le formulaire avec de vraies données
5. Vérifiez que l'email arrive à o.ndiaye@bcmgroupe.com

=== CONFIGURATION ALTERNATIVE ===
Si mail() ne fonctionne pas, modifiez la ligne dans send_email.php :
$destinataire = "o.ndiaye@bcmgroupe.com"; // Votre email
    `);
});
// Ajoutez ce script dans votre fichier HTML ou JavaScript existant

document.addEventListener('DOMContentLoaded', function() {
    // Éléments du menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    // Vérifier si on est sur mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && mobileMenuBtn && mobileMenu) {
        // Afficher le bouton menu sur mobile
        mobileMenuBtn.style.display = 'flex';
        
        // Gérer le clic sur le bouton menu
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            mobileMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Animation de l'icône
            const icon = this.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Réinitialiser l'icône
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Fermer le menu en cliquant sur un lien
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Réinitialiser l'icône
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            });
        });
        
        // Empêcher la fermeture quand on clique dans le menu
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        const isNowMobile = window.innerWidth <= 768;
        
        if (mobileMenuBtn && mobileMenu) {
            if (isNowMobile) {
                // Afficher le bouton menu
                mobileMenuBtn.style.display = 'flex';
            } else {
                // Masquer le bouton menu et fermer le menu mobile
                mobileMenuBtn.style.display = 'none';
                mobileMenu.classList.remove('active');
                body.classList.remove('menu-open');
            }
        }
    });
});




// Fonction pour basculer l'affichage de la description
function toggleDescription(itemId) {
    const item = document.querySelector(`.galerie-item[data-id="${itemId}"]`);
    const content = item.querySelector('.description-content');
    const button = item.querySelector('.read-more-btn');
    const btnText = item.querySelector('.btn-text');
    const btnIcon = item.querySelector('.btn-icon');
    
    // Basculer la classe expanded
    content.classList.toggle('expanded');
    button.classList.toggle('active');
    
    // Changer le texte du bouton
    if (content.classList.contains('expanded')) {
        btnText.textContent = 'Réduire le texte';
    } else {
        btnText.textContent = 'Lire tout le texte';
    }
}

// Fermer les descriptions étendues quand on clique ailleurs
document.addEventListener('click', function(event) {
    if (!event.target.closest('.galerie-item')) {
        const expandedContents = document.querySelectorAll('.description-content.expanded');
        expandedContents.forEach(content => {
            content.classList.remove('expanded');
            const button = content.closest('.galerie-item').querySelector('.read-more-btn');
            const btnText = button.querySelector('.btn-text');
            button.classList.remove('active');
            btnText.textContent = 'Lire tout le texte';
        });
    }
});



