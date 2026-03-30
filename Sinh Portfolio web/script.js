document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    initBackgroundAnimation();
    initScrollAnimations();
    initLanguageToggle();
    initThemeToggle();
    initHoverEffects();
    initPortfolioFilters();
    initMobileMenu();
    initGalleryToggle();
    initScrollProgress();
    initChatbot();
    initAuthModal();
    initDashboard();
    initTopUpModal();
});

function initScrollProgress() {
    const container = document.createElement('div');
    container.className = 'scroll-progress-container';
    const bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    container.appendChild(bar);
    document.body.appendChild(container);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + "%";
    });
}

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

    // Community & Academic Records Entrance
    const academicSection = document.getElementById('community-academic');
    if (academicSection) {
        const cards = academicSection.querySelectorAll('.gallery-card:not(.hidden-item)');

        if (cards.length > 0) {
            gsap.from(cards, {
                scrollTrigger: {
                    trigger: academicSection,
                    start: 'top 95%',
                    once: true
                },
                y: 40,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        gsap.fromTo(contactForm,
            { opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '#contact',
                    start: 'top 98%',
                    once: true
                },
                duration: 1,
                opacity: 1,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.set(contactForm, { clearProps: 'all', opacity: 1, visibility: 'visible' });
                }
            }
        );
    }

    // Safety fallback: Ensure everything is visible after 3 seconds if animations stall
    setTimeout(() => {
        const criticalElements = document.querySelectorAll('.social-btn, .project-card, .section-frame, .contact-card');
        criticalElements.forEach(el => {
            if (window.getComputedStyle(el).opacity === '0') {
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
        if (mouse.x === null) {
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
            if (mouse.x != null) {
                // Parallax effect based on mouse distance to center
                let dx = mouse.x - width / 2;
                let dy = mouse.y - height / 2;

                // Shift particles smoothly
                let targetX = this.baseX - (dx * 0.05 * (30 / this.density));
                let targetY = this.baseY - (dy * 0.05 * (30 / this.density));

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

    function drawGrid(isLight) {
        if (!mouse.x) return;

        const dx = (mouse.x - width / 2) * 0.02;
        const dy = (mouse.y - height / 2) * 0.02;

        ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.02)';
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

        const isLight = document.body.classList.contains('light-mode');
        
        drawGrid(isLight);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        // Draw connections for close particles in both modes
        connectParticles(isLight);

        requestAnimationFrame(animate);
    }

    function connectParticles(isLight) {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = dx * dx + dy * dy;

                if (distance < 12000) {
                    let opacity = 1 - (distance / 12000);
                    // Use neon-purple color (156, 39, 176) with balanced intensity for both modes
                    const lineOpacity = isLight ? opacity * 0.15 : opacity * 0.2;
                    ctx.strokeStyle = `rgba(156, 39, 176, ${lineOpacity})`;
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
        langBtn.innerText = currentLang === 'en' ? 'EN' : 'VI';
    }

    // 1. Text elements
    const translatableElements = document.querySelectorAll('[data-en][data-vi]');
    translatableElements.forEach(el => {
        // SPECIAL CASE: Login Button (Skip if logged in)
        if (el.id === 'nav-login-btn' && el.classList.contains('logged-in')) {
            const userJson = localStorage.getItem('teemous_user');
            if (userJson) {
                try {
                    const user = JSON.parse(userJson);
                    const prefix = currentLang === 'vi' ? 'Chào' : 'Hi';
                    el.innerHTML = `${prefix}, ${user.username}`;
                } catch(e) {}
            }
            return;
        }

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

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(themeBtn, { scale: 0.8 }, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
        }
        updateThemeButtonText();
    });

    // Initial setup
    updateThemeButtonText();
}

function updateThemeButtonText() {
    const modeIcon = document.querySelector('.mode-icon');
    if (!modeIcon) return;

    const isLight = document.body.classList.contains('light-mode');

    // FOOLPROOF ASSET PATH: Use the script's own src location to find the root
    let rootPath = '';
    const scriptTag = document.querySelector('script[src*="script.js"]');
    if (scriptTag) {
        const src = scriptTag.getAttribute('src');
        rootPath = src.split('script.js')[0];
    }

    const dayIcon = `${rootPath}Logo/daymodeicon.png`;
    const nightIcon = `${rootPath}Logo/nightmodeicon.png`;
    const currentIcon = isLight ? dayIcon : nightIcon;

    modeIcon.innerHTML = `<img src="${currentIcon}" alt="Theme Icon" class="theme-icon-img" style="width: 24px; height: 24px; vertical-align: middle;">`;
}

// Hover Effects for interactive elements
function initHoverEffects() {
    if (typeof gsap === 'undefined') return;

    // Example: Social buttons
    gsap.utils.toArray('.social-btn, .nav-links a, .theme-toggle, .lang-toggle, .project-card, .card, .circular-avatar').forEach(el => {
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
        if (input.value.trim() !== '') {
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
                            gsap.fromTo(avatar, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, clearProps: 'all' });
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

// Expandable Gallery Toggle Logic
function initGalleryToggle() {
    const galleryGrids = document.querySelectorAll('.interactive-gallery');

    galleryGrids.forEach(grid => {
        const items = grid.querySelectorAll('.gallery-card, .project-card, .gallery-item');
        if (items.length <= 6) return; // No need for toggle if 6 or fewer

        // Wrap the grid in a wrapper if not already done
        if (!grid.parentElement.classList.contains('gallery-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('gallery-wrapper');
            grid.parentNode.insertBefore(wrapper, grid);
            wrapper.appendChild(grid);
        }

        const wrapper = grid.parentElement;

        // Initial state: Hide items beyond 6
        items.forEach((item, index) => {
            if (index >= 6) {
                item.classList.add('hidden-item');
                item.style.display = 'none';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
            }
        });

        // Create the toggle button
        const btn = document.createElement('button');
        btn.classList.add('gallery-toggle-btn');
        btn.setAttribute('data-en', 'Show All');
        btn.setAttribute('data-vi', 'Xem Tất Cả');
        btn.innerHTML = `<span class="btn-text" data-en="Show All" data-vi="Xem Tất Cả">${currentLang === 'en' ? 'Show All' : 'Xem Tất Cả'}</span> <span class="icon">▼</span>`;
        wrapper.appendChild(btn);

        let isExpanded = false;

        btn.addEventListener('click', () => {
            isExpanded = !isExpanded;

            if (isExpanded) {
                // Expand
                btn.classList.add('expanded');
                const textSpan = btn.querySelector('.btn-text');
                textSpan.innerHTML = currentLang === 'en' ? 'Show Less' : 'Thu Gọn';

                // Show hidden items
                const hiddenItems = grid.querySelectorAll('.hidden-item');
                hiddenItems.forEach((item, index) => {
                    item.style.setProperty('display', 'block', 'important');
                    item.style.setProperty('opacity', '0', 'important');

                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: 'power2.out',
                        onStart: () => {
                            item.style.setProperty('visibility', 'visible', 'important');
                        },
                        onComplete: () => {
                            item.classList.remove('hidden-item');
                            item.style.removeProperty('display');
                            item.style.removeProperty('opacity');
                            item.style.removeProperty('visibility');
                            // Ensure layout reflows correctly
                            ScrollTrigger.refresh();
                        }
                    });
                });
                // Also ensure the parent is clear
                grid.parentElement.style.maxHeight = 'none';
                grid.parentElement.style.overflow = 'visible';
            } else {
                // Collapse
                btn.classList.remove('expanded');
                const textSpan = btn.querySelector('.btn-text');
                textSpan.innerHTML = currentLang === 'en' ? 'Show All' : 'Xem Tất Cả';

                const hItems = Array.from(items).slice(6);
                hItems.forEach((item, index) => {
                    gsap.to(item, {
                        opacity: 0,
                        y: 20,
                        duration: 0.4,
                        ease: 'power2.in',
                        onComplete: () => {
                            item.classList.add('hidden-item');
                            item.style.setProperty('display', 'none', 'important');
                        }
                    });
                });
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Add click-to-view (Lightbox Lite)
function initLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-img');
    galleryImages.forEach(img => {
        img.style.transition = 'filter 0.3s ease';
        img.addEventListener('mouseenter', () => img.style.filter = 'brightness(1.1)');
        img.addEventListener('mouseleave', () => img.style.filter = 'brightness(1)');

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.inset = '0';
            overlay.style.background = 'rgba(0,0,0,0.9)';
            overlay.style.zIndex = '9999';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.cursor = 'zoom-out';
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';

            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.style.maxWidth = '90%';
            fullImg.style.maxHeight = '90%';
            fullImg.style.borderRadius = '8px';
            fullImg.style.boxShadow = '0 0 30px rgba(0,163,255,0.5)';
            fullImg.style.transform = 'scale(0.8)';
            fullImg.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

            overlay.appendChild(fullImg);
            document.body.appendChild(overlay);

            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                fullImg.style.transform = 'scale(1)';
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    fullImg.style.transform = 'scale(0.8)';
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 300);
                }
            });

            const closeBtn = document.createElement('div');
            closeBtn.innerHTML = '✕';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '1.25rem';
            closeBtn.style.right = '1.25rem';
            closeBtn.style.color = 'white';
            closeBtn.style.fontSize = '1.875rem';
            closeBtn.style.cursor = 'pointer';
            overlay.appendChild(closeBtn);
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fullImg.style.transform = 'scale(0.8)';
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            });
        });
    });
}

// Final Global Initialization
window.addEventListener('load', () => {
    initLightbox();
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});

/**
 * Local AI Chatbot Logic
 * Connects to local AI API (LM Studio/Ollama) or uses Mock Mode
 */
function initChatbot() {
    const container = document.getElementById('chatbot-container');
    const toggle = document.getElementById('chatbot-toggle');
    const windowEl = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const messagesEl = document.getElementById('chatbot-messages');
    const inputEl = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('send-btn') || document.getElementById('chatbot-send');
    // Provider select removed from UI

    if (!container || !toggle || !windowEl) return;

    let availableModels = [];
    const probeModels = async () => {
        const bases = ['http://127.0.0.1:1234', 'http://localhost:1234'];
        const paths = ['/api/v1/models', '/v1/models'];
        for (const base of bases) {
            for (const path of paths) {
                try {
                    const resp = await fetch(`${base}${path}`, {
                        headers: { 'Accept': 'application/json' }
                    });
                    if (resp.ok) {
                        const data = await resp.json();
                        availableModels = (data.data || data).map(m => m.id || m.name);
                        console.log(`Teemous AI: Detected models via ${path}:`, availableModels);
                        return true;
                    }
                } catch (e) { }
            }
        }
        return false;
    };
    probeModels();

    toggle.addEventListener('click', () => {
        windowEl.classList.toggle('active');
        if (windowEl.classList.contains('active')) {
            inputEl.focus();
            if (availableModels.length === 0) probeModels();
        }
    });

    closeBtn.addEventListener('click', () => {
        windowEl.classList.remove('active');
    });

    let isThinking = false;

    const handleSend = (e) => {
        if (e) e.preventDefault();
        if (isThinking) return;

        const text = inputEl.value.trim();
        if (text) {
            addMessage(text, 'user');
            inputEl.value = '';
            getAIResponse(text);
        }
    };

    sendBtn.addEventListener('click', handleSend);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend(e);
        }
    });

    const chatHistory = [];

    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `message ${sender}-message`;
        msg.innerText = text;
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        chatHistory.push({ role: sender === 'ai' ? 'assistant' : 'user', content: text });
        if (chatHistory.length > 10) chatHistory.shift();
        return msg;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator ai-message';
        indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        messagesEl.appendChild(indicator);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return indicator;
    }

    async function getAIResponse(userText) {
        if (isThinking) return;
        const provider = 'local'; // Restored to Local AI (LM Studio/ngrok) as requested
        let indicator;
        try {
            isThinking = true;
            inputEl.disabled = true;
            sendBtn.style.opacity = '0.5';
            sendBtn.style.pointerEvents = 'none';

            indicator = showTypingIndicator();
            const activeLang = (typeof currentLang !== 'undefined') ? currentLang : (localStorage.getItem('td-lang') || 'en');

            const systemPrompt = `
# IDENTITY: Teemous AI (Youthful/Friendly Assistant to Sinh)
- WEB: Hệ sinh thái Dịch vụ & Portfolio Hub của Quang Sinh (không chỉ là Shop).
- VỀ SINH: Người sáng lập Teemous Digital, U30, nhiệt huyết.
- XƯNG HÔ: Gọi "Sinh"/"Quang Sinh"/"cậu ấy". Xưng "mình", gọi khách là "bạn". Tránh "Ông/Ngài/Chuyên gia".
- LANGUAGE: Tự động dùng ngôn ngữ theo khách (Tiếng Việt hoặc Tiếng Anh). 
- PHONG CÁCH: Ngắn gọn (1-2 câu), thân thiện như bạn bè. 
- XƯNG HÔ: Nếu tiếng Việt, xưng "mình", gọi khách là "bạn". Nếu tiếng Anh, dùng "I/Me" và "You".

# KNOWLEDGE BASE (DỊCH VỤ & GIÁ):
1. KHỞI TẠO PORTFOLIO:
- Basic: 199k -> 49k (-75%). Bố cục chuẩn, sub-domain teemousdigital.id.vn.
- Advanced: 300k - 1M+. Custom UI, tên miền riêng (.com/.vn).
2. DỊCH VỤ BỔ SUNG:
- Curation: +29k-249k (Tinh chỉnh/Số hóa nội dung chuyên nghiệp).
- The Carry Pack: +12$ (Tư vấn & thực thi trọn gói A-Z).
- Add to Top: +1$/tháng (Ghim nổi bật trên Hub).
3. ARENA OF VALOR ACCS:
- #AOV-001: 999k (ATM). Murad Chí Tôn, Full SS hữu hạn. Rank Chiến Tướng.
- #AOV-002: 678k (ATM). Yena Wave, Ryo SS. Rank Cao Thủ. (Có link FB bảo kê).

# RULES: NO BOLDING (**), ALL CAPS for emphasis, nesting: (*) -> (-) -> (+). Trả lời ngắn!
`;

            const recentHistory = chatHistory.slice(-10);
            const messagesToSend = [{ role: "system", content: systemPrompt }, ...recentHistory.map(m => ({
                role: m.role,
                content: m.content
            }))];

            let content = "";
            let success = false;
            let lastApiError = "";

            if (provider === 'local') {
                const publicTunnelBase = 'https://puppylike-macroclimatically-bev.ngrok-free.dev';
                const baseUrls = [publicTunnelBase, 'http://127.0.0.1:1234', 'http://localhost:1234'];
                const ngrokHeaders = { 'ngrok-skip-browser-warning': 'true', 'Content-Type': 'application/json' };

                let model;
                if (typeof availableModels === 'undefined' || availableModels.length === 0) {
                    model = "qwen/qwen3-vl-8b";
                } else {
                    const chatModels = availableModels.filter(m => !m.toLowerCase().includes('embed'));
                    const pool = chatModels.length > 0 ? chatModels : availableModels;
                    model = pool.find(m => m.toLowerCase().includes('qwen3-vl')) ||
                            pool.find(m => m.toLowerCase().includes('qwen')) ||
                            pool.find(m => m.toLowerCase().includes('12b')) ||
                            pool.find(m => m.toLowerCase().includes('gemma-3')) ||
                            pool.find(m => m.toLowerCase().includes('gemma')) ||
                            pool[0];
                }

                console.group(`Teemous AI Chat: ${userText.substring(0, 30)}...`);
                console.log(`Provider: ${provider} | Model: ${model}`);

                let activeBase = null;
                for (const base of baseUrls) {
                    if (!base) continue;
                    const ctrl = new AbortController();
                    const tid = setTimeout(() => ctrl.abort(), 8000);
                    try {
                        console.log(`🔍 Checking endpoint: ${base}/v1/models`);
                        const check = await fetch(base + '/v1/models', { method: 'GET', headers: ngrokHeaders, signal: ctrl.signal });
                        clearTimeout(tid);
                        if (check.ok) { activeBase = base; console.log(`📡 Selected: ${base}`); break; }
                    } catch (e) { clearTimeout(tid); console.log(`❌ Unreachable: ${base}`); }
                }

                if (activeBase) {
                    const ctrl = new AbortController();
                    const tid = setTimeout(() => ctrl.abort(), 300000);
                    try {
                        console.log(`🚀 Sending request...`);
                        console.time('Generation Time');
                        const resp = await fetch(activeBase + '/v1/chat/completions', {
                            method: 'POST', signal: ctrl.signal, headers: ngrokHeaders,
                            body: JSON.stringify({ model, messages: messagesToSend, temperature: 0.6, max_tokens: 250 })
                        });
                        clearTimeout(tid);
                        console.timeEnd('Generation Time');
                        if (resp.ok) {
                            const data = await resp.json();
                            content = data.choices?.[0]?.message?.content || data.choices?.[0]?.text;
                            if (content) success = true;
                        } else {
                            lastApiError = `Local AI Error (${resp.status})`;
                            console.error(lastApiError, await resp.text());
                        }
                    } catch (e) {
                        console.timeEnd('Generation Time');
                        lastApiError = `Local AI Exception: ${e.message}`;
                        console.error(lastApiError);
                    }
                } else {
                    lastApiError = "Cannot connect to Local AI (ngrok/LM Studio offline)";
                }
                console.groupEnd();

            } else {
                // Cloud Provider (Gemini/etc.) via Cloudflare Functions
                console.group(`Teemous AI Chat (Cloud): ${userText.substring(0, 30)}...`);
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ provider, messages: messagesToSend })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        content = data.content;
                        if (content) success = true;
                    } else {
                        const errorData = await response.json().catch(() => ({}));
                        lastApiError = errorData.error || `Server Error (${response.status})`;
                        console.error("Cloud API Error:", lastApiError);
                    }
                } catch (e) {
                    lastApiError = `Connection Error: ${e.message}`;
                    console.error(lastApiError);
                }
                console.groupEnd();
            }

            if (indicator) indicator.remove();
            if (success && content) {
                addMessage(content.replace(/\*\*/g, ''), 'ai');
            } else {
                const displayName = "Teemous AI";
                addMessage(activeLang === 'en'
                    ? `${displayName} Error: ${lastApiError || "Unknown Error"}.`
                    : `Lỗi ${displayName}: ${lastApiError || "Lỗi không xác định"}.`, 'ai');
            }
        } catch (e) {
            console.error("🚨 CRITICAL AI ERROR:", e);
            if (indicator) indicator.remove();
            addMessage(`CRITICAL ERROR: ${e.message}`, 'ai');
        } finally {
            isThinking = false;
            inputEl.disabled = false;
            sendBtn.style.opacity = '1';
            sendBtn.style.pointerEvents = 'auto';
            inputEl.focus();
        }
    }
}

/**
 * Authentication Modal Logic
 */
function initAuthModal() {
    const navLoginBtn = document.getElementById('nav-login-btn');
    const authOverlay = document.getElementById('auth-modal-overlay');
    const closeBtn = document.getElementById('close-auth-modal');
    
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    
    if (!navLoginBtn || !authOverlay) return;

    // Check if user is already logged in
    const token = localStorage.getItem('teemous_jwt');
    const userJson = localStorage.getItem('teemous_user');
    
    if (token && userJson) {
        try {
            const user = JSON.parse(userJson);
            const prefix = currentLang === 'vi' ? 'Chào' : 'Hi';
            navLoginBtn.innerHTML = `${prefix}, ${user.username}`;
            navLoginBtn.classList.add('logged-in');
            navLoginBtn.classList.add('ready'); // Prevent flash
            
            navLoginBtn.onclick = (e) => {
                e.preventDefault();
                openDashboard();
            };
            
            // Render Mini Profile
            setTimeout(initMiniProfile, 100);
            return;
        } catch(e) {}
    }

    // If reached here, ensure button shows "Login | Sign Up" in correct lang
    navLoginBtn.innerHTML = navLoginBtn.getAttribute(`data-${currentLang}`);
    navLoginBtn.classList.add('ready'); // Prevent flash

    function openModal() {
        authOverlay.classList.add('active');
        if (typeof gsap !== 'undefined') {
            const modalContainer = document.getElementById('auth-modal');
            gsap.fromTo(modalContainer, 
                { y: 30, scale: 0.95, opacity: 0 },
                { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }
            );
        }
    }

    function closeModal() {
        if (typeof gsap !== 'undefined') {
            const modalContainer = document.getElementById('auth-modal');
            gsap.to(modalContainer, {
                y: 20,
                scale: 0.95,
                opacity: 0,
                duration: 0.3,
                onComplete: () => authOverlay.classList.remove('active')
            });
        } else {
            authOverlay.classList.remove('active');
        }
    }

    navLoginBtn.addEventListener('click', (e) => {
        if (!navLoginBtn.classList.contains('logged-in')) {
            e.preventDefault();
            openModal();
        }
    });

    closeBtn.addEventListener('click', closeModal);

    authOverlay.addEventListener('click', (e) => {
        if (e.target === authOverlay) closeModal();
    });

    // Tab Logic
    tabLogin.addEventListener('click', (e) => {
        e.preventDefault();
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        loginSection.style.display = 'block';
        signupSection.style.display = 'none';
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(loginSection, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
        }
    });

    tabSignup.addEventListener('click', (e) => {
        e.preventDefault();
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        signupSection.style.display = 'block';
        loginSection.style.display = 'none';
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(signupSection, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
        }
    });

    function authShowAlert(message, type = 'error') {
        const alertBox = document.getElementById('auth-alert');
        if(!alertBox) return;
        alertBox.innerHTML = message;
        alertBox.className = `auth-alert ${type}`;
        alertBox.style.display = 'block';
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(alertBox, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 });
        }
    }

    // Handle Login Click
    const submitBtnLogin = document.getElementById('auth-submit-login');
    if (submitBtnLogin) {
        submitBtnLogin.addEventListener('click', async () => {
            const isLogin = tabLogin.classList.contains('active');
            if(!isLogin) return; 

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';

            if (!email || !password) {
                authShowAlert(lang === 'vi' ? 'Vui lòng điền đủ thông tin!' : 'Please fill all fields.');
                return;
            }

            const origText = submitBtnLogin.innerText;
            submitBtnLogin.innerText = 'Routing...';
            submitBtnLogin.disabled = true;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('teemous_jwt', data.token);
                    localStorage.setItem('teemous_user', JSON.stringify(data.user));
                    authShowAlert(lang === 'vi' ? 'Đăng nhập thành công!' : 'Login successful!', 'success');
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    authShowAlert(data.error || 'Authentication failed');
                }
            } catch (err) {
                authShowAlert('Network error. Please try again.');
            } finally {
                submitBtnLogin.innerText = origText;
                submitBtnLogin.disabled = false;
            }
        });
    }

    // Allow Enter key to submit login
    loginSection.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (submitBtnLogin) submitBtnLogin.click();
        }
    });

    // Also handle Enter for signup for completeness
    signupSection.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (submitBtnSignup) submitBtnSignup.click();
        }
    });

    // Handle Signup Click
    const submitBtnSignup = document.getElementById('auth-submit-signup');
    if (submitBtnSignup) {
        submitBtnSignup.addEventListener('click', async () => {
            const username = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';

            if (!username || !email || !password || !confirm) {
                authShowAlert(lang === 'vi' ? 'Vui lòng điền đủ thông tin!' : 'Please fill all fields.');
                return;
            }

            if (password !== confirm) {
                authShowAlert(lang === 'vi' ? 'Mật khẩu nhập lại không khớp!' : 'Passwords do not match!');
                return;
            }

            const origText = submitBtnSignup.innerText;
            submitBtnSignup.innerText = 'Initializing...';
            submitBtnSignup.disabled = true;

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await res.json();
                if (res.ok) {
                    authShowAlert(lang === 'vi' ? 'Khởi tạo thành công!' : 'Initialization successful!', 'success');
                    setTimeout(() => tabLogin.click(), 1000);
                } else {
                    authShowAlert(data.error || 'Registration failed');
                }
            } catch (err) {
                authShowAlert('Network error. Please try again.');
            } finally {
                submitBtnSignup.innerText = origText;
                submitBtnSignup.disabled = false;
            }
        });
    }
}

/**
 * Dashboard Logic
 */
/**
 * Dashboard Logic
 */
function initDashboard() {
    const dashboardOverlay = document.getElementById('dashboard-modal-overlay');
    const closeBtn = document.getElementById('close-dashboard-modal');
    const logoutBtn = document.getElementById('logout-btn');
    const avatarInput = document.getElementById('avatar-input');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    
    if (!dashboardOverlay || !closeBtn) return;

    closeBtn.addEventListener('click', closeDashboard);
    dashboardOverlay.addEventListener('click', (e) => {
        if (e.target === dashboardOverlay) closeDashboard();
    });

    // Logout handling
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('teemous_jwt');
            localStorage.removeItem('teemous_user');
            window.location.reload();
        });
    }

    // Tab Switching Logic
    const tabs = document.querySelectorAll('.dash-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // Toggle Tab Buttons
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Toggle Sections
            const sections = document.querySelectorAll('.dash-section');
            sections.forEach(s => s.classList.remove('active'));
            const activeSection = document.getElementById(`tab-${target}`);
            if (activeSection) activeSection.classList.add('active');
        });
    });

    // Avatar Upload handling
    if (avatarInput) {
        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const container = document.querySelector('.avatar-edit-container');
            container.classList.add('uploading');

            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('teemous_jwt');

            try {
                const res = await fetch('/api/user/upload-avatar', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });

                const data = await res.json();
                if (res.ok) {
                    const user = JSON.parse(localStorage.getItem('teemous_user'));
                    user.avatar_url = data.avatar_url;
                    localStorage.setItem('teemous_user', JSON.stringify(user));
                    document.getElementById('dashboard-avatar').src = data.avatar_url;
                    alert(currentLang === 'vi' ? 'Cập nhật ảnh thành công!' : 'Avatar updated!');
                } else {
                    alert(data.error || 'Upload failed');
                }
            } catch (err) {
                alert('Network error during upload');
            } finally {
                container.classList.remove('uploading');
            }
        });
    }

    // Profile (Username) Update handling
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', async () => {
            const username = document.getElementById('dashboard-username-input').value;
            if (!username || username.length < 3) {
                alert(currentLang === 'vi' ? 'Tên phải có ít nhất 3 ký tự!' : 'Username too short!');
                return;
            }

            const token = localStorage.getItem('teemous_jwt');
            saveProfileBtn.disabled = true;
            saveProfileBtn.innerText = '⌛';

            try {
                const res = await fetch('/api/user/update-profile', {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                });

                if (res.ok) {
                    const user = JSON.parse(localStorage.getItem('teemous_user'));
                    user.username = username;
                    localStorage.setItem('teemous_user', JSON.stringify(user));
                    
                    const navBtn = document.getElementById('nav-login-btn');
                    if (navBtn) navBtn.innerHTML = `Hi, ${username}`;
                    
                    alert(currentLang === 'vi' ? 'Đã lưu thay đổi!' : 'Profile saved!');
                } else {
                    const data = await res.json();
                    alert(data.error || 'Update failed');
                }
            } catch (err) {
                alert('Network error');
            } finally {
                saveProfileBtn.disabled = false;
                saveProfileBtn.innerText = '💾';
            }
        });
    }
}

async function openDashboard() {
    const overlay = document.getElementById('dashboard-modal-overlay');
    const token = localStorage.getItem('teemous_jwt');
    if (!overlay || !token) return;

    // Show modal with stale data first for speed
    const user = JSON.parse(localStorage.getItem('teemous_user') || '{}');
    if (user.username) {
        document.getElementById('dashboard-username-input').value = user.username;
        document.getElementById('dashboard-email').innerText = user.email || '';
        document.getElementById('dashboard-balance').innerText = `${user.balance || 0} VND`;
        
        const rankSpan = document.getElementById('dashboard-rank');
        if (rankSpan) {
            const rank = getUserRank(user);
            rankSpan.innerText = rank;
            rankSpan.className = `stat-value rank-badge rank-${rank.toLowerCase()}`;
        }
        
        document.getElementById('dashboard-avatar').src = user.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.username}`;
    }

    overlay.classList.add('active');
    
    if (typeof gsap !== 'undefined') {
        const modal = document.getElementById('dashboard-modal');
        gsap.fromTo(modal, 
            { y: 30, scale: 0.95, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }
        );
    }

    // Now fetch FRESH data from server
    try {
        const res = await fetch('/api/user/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.ok) {
            // Update Local Storage
            localStorage.setItem('teemous_user', JSON.stringify(data.user));
            
            // Refresh UI fields
            document.getElementById('dashboard-username-input').value = data.user.username;
            document.getElementById('dashboard-balance').innerText = `${data.user.balance.toLocaleString()} VND`;
            
            const rankSpan = document.getElementById('dashboard-rank');
            if (rankSpan) {
                const rank = getUserRank(data.user);
                rankSpan.innerText = rank;
                rankSpan.className = `stat-value rank-badge rank-${rank.toLowerCase()}`;
            }

            // Sync avatar
            document.getElementById('dashboard-avatar').src = data.user.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${data.user.username}`;
            
            // Re-render Mini Profile to sync data
            initMiniProfile();

            // Render Tables
            renderOrders(data.orders);
            renderTransactions(data.transactions);
        }
    } catch (e) {
        console.error("Failed to refresh dashboard data", e);
    }
}

function renderOrders(orders) {
    const tbody = document.getElementById('orders-list-body');
    if (!tbody) return;
    
    if (!orders || orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 2rem; color: var(--text-muted);">${currentLang === 'vi' ? 'Chưa có đơn hàng nào.' : 'No orders found.'}</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.product_name}</strong></td>
            <td>${order.price_at_purchase.toLocaleString()}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
        </tr>
    `).join('');
}

function renderTransactions(txs) {
    const tbody = document.getElementById('transactions-list-body');
    if (!tbody) return;

    if (!txs || txs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 2rem; color: var(--text-muted);">${currentLang === 'vi' ? 'Chưa có giao dịch nào.' : 'No transactions found.'}</td></tr>`;
        return;
    }

    tbody.innerHTML = txs.map(tx => `
        <tr>
            <td style="color: ${tx.type === 'topup' ? '#81c784' : '#ff8a80'}">${tx.type === 'topup' ? '+' : '-'}${tx.amount.toLocaleString()}</td>
            <td>${tx.type}</td>
            <td><span class="status-badge status-${tx.status}">${tx.status}</span></td>
        </tr>
    `).join('');
}

function closeDashboard() {
    const overlay = document.getElementById('dashboard-modal-overlay');
    if (!overlay) return;

    if (typeof gsap !== 'undefined') {
        const modal = document.getElementById('dashboard-modal');
        gsap.to(modal, {
            y: 20,
            scale: 0.95,
            opacity: 0,
            duration: 0.3,
            onComplete: () => overlay.classList.remove('active')
        });
    } else {
        overlay.classList.remove('active');
    }
}



/**
 * Top Up Modal Logic
 */
function initTopUpModal() {
    const openBtn = document.getElementById('open-topup-btn');
    const overlay = document.getElementById('topup-modal-overlay');
    const closeBtn = document.getElementById('close-topup-modal');
    const genBtn = document.getElementById('gen-qr-btn');
    const amtBtns = document.querySelectorAll('.amt-btn');
    const customAmtInput = document.getElementById('custom-amount');
    const qrArea = document.getElementById('qr-display-area');
    const qrImg = document.getElementById('vietqr-img');
    const qrAmtText = document.getElementById('qr-amt-text');
    const qrNoteText = document.getElementById('qr-note-text');

    if (!openBtn || !overlay) return;

    let selectedAmount = 200000;

    openBtn.addEventListener('click', () => {
        overlay.classList.add('active');
        if (typeof gsap !== 'undefined') {
            gsap.fromTo("#topup-modal", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
        }
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        qrArea.style.display = 'none';
    });

    amtBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amtBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedAmount = parseInt(btn.dataset.value);
            if(customAmtInput) customAmtInput.value = '';
        });
    });

    if (customAmtInput) {
        customAmtInput.addEventListener('input', () => {
            amtBtns.forEach(b => b.classList.remove('active'));
            selectedAmount = parseInt(customAmtInput.value) || 0;
        });
    }

    genBtn.addEventListener('click', () => {
        const userJson = localStorage.getItem('teemous_user');
        if (!userJson) return alert('Please login again');
        const user = JSON.parse(userJson);

        if (selectedAmount < 10000) return alert(currentLang === 'vi' ? 'Số tiền tối thiểu là 10.000đ' : 'Minimum amount is 10,000 VND');

        // MB Bank Config (from your screenshot)
        const bankID = "MB";
        const accountNo = "0110705301174";
        const accountName = "NGO QUANG SINH";
        const memo = `NAP ${user.id}`;
        
        // Use VietQR API to generate Image URL
        const qrUrl = `https://img.vietqr.io/image/${bankID}-${accountNo}-compact2.png?amount=${selectedAmount}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(accountName)}`;
        
        qrImg.src = qrUrl;
        qrAmtText.innerText = `${selectedAmount.toLocaleString()} VND`;
        qrNoteText.innerText = memo;
        
        qrArea.style.display = 'block';
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(qrArea, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 });
        }

        // Auto-refresh dashboard balance every 5 seconds while modal is open
        const pollInterval = setInterval(() => {
            if (!overlay.classList.contains('active')) return clearInterval(pollInterval);
            refreshBalance();
        }, 5000);
    });
}

async function refreshBalance() {
    const token = localStorage.getItem('teemous_jwt');
    if (!token) return;
    try {
        const res = await fetch('/api/user/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            const oldBalance = document.getElementById('dashboard-balance').innerText;
            const newBalance = `${data.user.balance.toLocaleString()} VND`;
            
            if (oldBalance !== newBalance) {
                document.getElementById('dashboard-balance').innerText = newBalance;
                // Update local storage
                localStorage.setItem('teemous_user', JSON.stringify(data.user));
                // Optional: show a small toast or sound
                console.log("Balance updated!");
            }
        }
    } catch (e) {}
}

// === ROLE TO RANK LOGIC ===
function getUserRank(user) {
    if (user.role === 'admin') return 'Elite';
    const bal = user.balance || 0;
    if (bal >= 500000) return 'Professional';
    if (bal >= 100000) return 'Impressive';
    return 'Standard';
}

function initMiniProfile() {
    const userJson = localStorage.getItem('teemous_user');
    if (!userJson) return;
    try {
        const user = JSON.parse(userJson);
        const rank = getUserRank(user);
        const avatarUrl = user.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.username}`;
        
        let miniProfile = document.getElementById('teemous-mini-profile');
        if (!miniProfile) {
            miniProfile = document.createElement('div');
            miniProfile.id = 'teemous-mini-profile';
            miniProfile.className = 'mini-profile-popup glass-card';
            document.body.appendChild(miniProfile);
        }
        
        miniProfile.innerHTML = `
            <div class="mp-header">
                <img src="${avatarUrl}" alt="Avatar" class="mp-avatar">
                <div class="mp-info">
                    <h4 class="mp-username">${user.username}</h4>
                    <span class="mp-rank rank-badge rank-${rank.toLowerCase()}">${rank}</span>
                </div>
            </div>
            <div class="mp-balance-box">
                <span class="mp-lbl">Balance:</span>
                <span class="mp-val">${(user.balance || 0).toLocaleString()} VND</span>
            </div>
            <button class="mp-btn neon-border" onclick="openDashboard()">Dashboard</button>
        `;

        const navBtn = document.getElementById('nav-login-btn');
        let hideTimeout;
        if (navBtn) {
            navBtn.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
                const rect = navBtn.getBoundingClientRect();
                miniProfile.style.top = (rect.bottom + window.scrollY + 10) + 'px';
                miniProfile.style.left = Math.max(10, rect.right + window.scrollX - 250) + 'px'; 
                miniProfile.classList.add('show');
            });
            navBtn.addEventListener('mouseleave', (e) => {
                hideTimeout = setTimeout(() => {
                    miniProfile.classList.remove('show');
                }, 300);
            });
            miniProfile.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
            });
            miniProfile.addEventListener('mouseleave', (e) => {
                hideTimeout = setTimeout(() => {
                    miniProfile.classList.remove('show');
                }, 300);
            });
        }
    } catch(e) {}
}
