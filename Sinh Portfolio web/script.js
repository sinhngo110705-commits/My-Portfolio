document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    initBackgroundAnimation();
    initScrollAnimations();
    initLanguageToggle();
    initThemeToggle();
    initHoverEffects();
    initPortfolioFilters(); // Ensure Hub filtering initializes
    initMobileMenu();
});

function initScrollAnimations() {
    // Hero Entrance
    const avatar = document.querySelector('.avatar-container');
    if (avatar) {
        gsap.from(avatar, {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
    }

    const titles = document.querySelectorAll('.glitch, .tagline-sub, .tagline');
    if (titles.length > 0) {
        gsap.fromTo(titles, 
            { y: 30, opacity: 0 },
            { 
                duration: 1,
                y: 0,
                opacity: 1,
                stagger: 0.2,
                delay: 0.3,
                ease: 'power3.out'
            }
        );
    }

    const socialBtns = document.querySelectorAll('.social-btn');
    if (socialBtns.length > 0) {
        gsap.fromTo(socialBtns,
            { y: 20, opacity: 0 },
            {
                duration: 0.8,
                y: 0,
                opacity: 1,
                stagger: 0.15,
                delay: 0.9,
                ease: 'back.out(1.7)'
            }
        );
    }

    // About Section
    const aboutFrame = document.querySelector('#about .section-frame');
    if (aboutFrame) {
        gsap.from(aboutFrame, {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
            },
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
    }

    // Portfolio / Activities Grid
    const portfolioTriggerId = document.getElementById('portfolio') ? '#portfolio' : '#activities';
    const portfolioTrigger = document.querySelector(portfolioTriggerId);
    const projectCards = document.querySelectorAll('.project-card');

    if (portfolioTrigger && projectCards.length > 0) {
        gsap.fromTo(projectCards,
            { y: 50, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: portfolioTrigger,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                duration: 0.8,
                y: 0,
                opacity: 1,
                stagger: 0.15,
                ease: 'power3.out'
            }
        );
    }

    // Skills Animation
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.progress-bar, .skill-bar-fill');
    
    if (skillsSection && progressBars.length > 0) {
        ScrollTrigger.create({
            trigger: '#skills',
            start: 'top 80%',
            onEnter: () => {
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    if (width) bar.style.width = width;
                });
            }
        });

        gsap.from('.skill-category', {
            scrollTrigger: {
                trigger: '#skills',
                start: 'top 80%',
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out'
        });
    }

    // Evidence & Contact Entrance
    if (document.getElementById('evidence')) {
        gsap.from('#evidence .card', {
            scrollTrigger: {
                trigger: '#evidence',
                start: 'top 80%',
            },
            duration: 0.8,
            y: 40,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out'
        });
    }

    if (document.getElementById('contact')) {
        gsap.from('#contact-form', {
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 80%',
            },
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power3.out'
        });
    }

    // Safety fallback: Ensure everything is visible after 3 seconds if animations stall
    setTimeout(() => {
        const criticalElements = document.querySelectorAll('.social-btn, .project-card, .section-frame');
        criticalElements.forEach(el => {
            if (window.getComputedStyle(el).opacity === '0') {
                console.warn('GSAP safety fallback triggered for:', el);
                gsap.to(el, { opacity: 1, y: 0, duration: 0.5, clearProps: 'all' });
            }
        });
    }, 3000);
}

// High framerate mouse-tracking background animation (Data / Cyberpunk Grid shift)
function initBackgroundAnimation() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return; // Silent safety exit if no canvas exists
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width, height;
    let particles = [];
    
    // Mouse tracking
    let mouse = { x: null, y: null, targetX: null, targetY: null };
    
    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.x;
        mouse.targetY = e.y;
        if(mouse.x === null) {
            mouse.x = e.x;
            mouse.y = e.y;
        }
    });

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }
    
    window.addEventListener('resize', resize);
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 20) + 1;
            const colors = ['rgba(156, 39, 176, 0.4)', 'rgba(33, 150, 243, 0.4)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        
        update() {
            if(mouse.x != null) {
                // Parallax effect based on mouse distance to center
                let dx = mouse.x - width/2;
                let dy = mouse.y - height/2;
                
                // Shift particles smoothly
                let targetX = this.baseX - (dx * 0.05 * (30/this.density));
                let targetY = this.baseY - (dy * 0.05 * (30/this.density));
                
                this.x += (targetX - this.x) * 0.05;
                this.y += (targetY - this.y) * 0.05;
            }
        }
    }
    
    function initParticles() {
        particles = [];
        const numParticles = (width * height) / 8000; // Density
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }
    
    function drawGrid() {
        if (!mouse.x) return;
        
        const dx = (mouse.x - width/2) * 0.02;
        const dy = (mouse.y - height/2) * 0.02;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 1;
        
        const gridSize = 50;
        const offsetX = (dx % gridSize) - gridSize;
        const offsetY = (dy % gridSize) - gridSize;
        
        ctx.beginPath();
        for (let x = offsetX; x < width + gridSize; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for (let y = offsetY; y < height + gridSize; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Smooth mouse following
        if (mouse.targetX !== null) {
            mouse.x += (mouse.targetX - mouse.x) * 0.1;
            mouse.y += (mouse.targetY - mouse.y) * 0.1;
        }

        drawGrid();
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        // Draw connections for close particles
        connectParticles();
        
        requestAnimationFrame(animate);
    }
    
    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = dx * dx + dy * dy;
                
                if (distance < 12000) {
                    let opacity = 1 - (distance/12000);
                    ctx.strokeStyle = `rgba(156, 39, 176, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    resize();
    animate();
}

// Multi-language Toggle Logic
let currentLang = localStorage.getItem('td-lang') || 'en'; 
if (!localStorage.getItem('td-lang')) {
    localStorage.setItem('td-lang', currentLang);
}

function initLanguageToggle() {
    // Apply initial translation based on localStorage on load
    updateAllTranslations();
    
    const langBtn = document.getElementById('lang-toggle');
    if (!langBtn) return;
    
    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'vi' : 'en';
        localStorage.setItem('td-lang', currentLang);
        updateAllTranslations();
    });
}

function updateAllTranslations() {
    // 0. Update the Lang Toggle button text depending on current language
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.innerText = currentLang === 'en' ? 'Bạn là người Việt?' : 'Having difficulty with Vietnamese?';
    }

    // 1. Text elements
    const translatableElements = document.querySelectorAll('[data-en][data-vi]');
    translatableElements.forEach(el => {
        // Only update innerHTML if it's not an input/textarea
        if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
            el.innerHTML = el.getAttribute(`data-${currentLang}`);
        }
    });
    
    // 2. Placeholders mapping (default ones, fly-in placeholders handled by the text tags above)
    const placeholderElements = document.querySelectorAll('[data-en-placeholder][data-vi-placeholder]');
    placeholderElements.forEach(el => {
        el.setAttribute('placeholder', el.getAttribute(`data-${currentLang}-placeholder`));
    });

    // 3. Update the mode button text specifically depending on active theme
    updateThemeButtonText();
}

// Light / Dark Mode Toggle Logic
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    // --- localStorage persistence: apply saved theme on page load ---
    const savedTheme = localStorage.getItem('td-theme');
    if (savedTheme === 'dark') {
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode'); // default light
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('td-theme', isLight ? 'light' : 'dark');
        gsap.fromTo(themeBtn, { scale: 0.8 }, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
        updateThemeButtonText();
    });
    
    // Initial setup
    updateThemeButtonText();
}

function updateThemeButtonText() {
    const modeIcon = document.querySelector('.mode-icon');
    if(!modeIcon) return;
    
    const isLight = document.body.classList.contains('light-mode');
    if(isLight) {
        modeIcon.setAttribute('data-en', '☀️ Day');
        modeIcon.setAttribute('data-vi', '☀️ Ngày');
    } else {
        modeIcon.setAttribute('data-en', '🌙 Night');
        modeIcon.setAttribute('data-vi', '🌙 Đêm');
    }
    modeIcon.innerHTML = modeIcon.getAttribute(`data-${currentLang}`);
}

// Hover Effects for interactive elements
function initHoverEffects() {
    // Example: Social buttons
    gsap.utils.toArray('.social-btn, .nav-links a, .theme-toggle, .lang-toggle, .project-card, .card, .circular-avatar').forEach(el => {
        gsap.to(el, {
            scale: 1.05,
            duration: 0.2,
            paused: true,
            ease: 'power1.inOut',
            overwrite: true
        }).revertOnReverse = true;

        el.addEventListener('mouseenter', (e) => {
            gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2, ease: 'power1.inOut' });
        });
        el.addEventListener('mouseleave', (e) => {
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: 'power1.inOut' });
        });
    });
}

// Smart Contact Form Logic (Fly-in behavior)
function initSmartForms() {
    const smartInputs = document.querySelectorAll('.smart-input-group input, .smart-input-group textarea');
    
    smartInputs.forEach(input => {
        const group = input.closest('.smart-input-group');
        
        // Initial state check
        if(input.value.trim() !== '') {
            group.classList.add('typing');
        }

        input.addEventListener('focus', () => {
            if (input.value.trim() === '') {
                // Trigger fly-in sample
                group.classList.add('animating');
            }
        });

        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                // Reset it
                group.classList.remove('typing');
                group.classList.remove('animating');
            }
        });
        
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                group.classList.add('typing');
                group.classList.remove('animating');
            } else {
                group.classList.remove('typing');
                group.classList.add('animating');
            }
        });
    });
}

/**
 * Initialize Portfolio Hub Filtering Logic
 * Now uses tier-based category filter (hide/show whole tier sections)
 */
function initPortfolioFilters() {
    const filterTier = document.getElementById('filter-tier');
    const filterField = document.getElementById('filter-field');
    const tierSections = document.querySelectorAll('.tier-section[data-tier]');
    const avatars = document.querySelectorAll('.portfolio-card');

    // If not on Hub page, exit
    if (!filterTier && !filterField) return;
    if (tierSections.length === 0) return;

    function applyFilters() {
        const tierVal = filterTier ? filterTier.value : 'all';
        const fieldVal = filterField ? filterField.value : 'all';

        // First: show/hide whole tier sections based on tier selection
        tierSections.forEach(section => {
            const sectionTier = section.getAttribute('data-tier');
            const tierMatch = (tierVal === 'all') || (sectionTier === tierVal);

            if (tierMatch) {
                section.style.display = '';
                // Within visible tier: apply field filter
                const sectionAvatars = section.querySelectorAll('.portfolio-card');
                let anyVisible = false;
                sectionAvatars.forEach(avatar => {
                    const fieldMatch = (fieldVal === 'all') || (avatar.dataset.field === fieldVal);
                    if (fieldMatch) {
                        avatar.classList.remove('hidden-by-filter');
                        if (typeof gsap !== 'undefined') {
                            gsap.fromTo(avatar, {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1, duration: 0.3, clearProps: 'all'});
                        }
                        anyVisible = true;
                    } else {
                        avatar.classList.add('hidden-by-filter');
                    }
                });
                // Hide the entire section if no avatars match field filter
                if (!anyVisible) {
                    section.style.display = 'none';
                }
            } else {
                section.style.display = 'none';
            }
        });
    }

    if (filterTier) filterTier.addEventListener('change', applyFilters);
    if (filterField) filterField.addEventListener('change', applyFilters);
}
// Mobile Menu Logic
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const headerNav = document.querySelector('.header-nav');
    
    if (!menuToggle || !headerNav) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        headerNav.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            headerNav.classList.remove('active');
        });
    });
}
