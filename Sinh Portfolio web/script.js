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
        langBtn.innerText = currentLang === 'en' ? 'EN' : 'VI';
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
    if(!modeIcon) return;
    
    const isLight = document.body.classList.contains('light-mode');
    
    // Use root-relative paths to ensure icons load correctly from any subfolder
    const dayIcon = '/Logo/daymodeicon.png';
    const nightIcon = '/Logo/nightmodeicon.png';
    const currentIcon = isLight ? dayIcon : nightIcon;
    
    // Inject the specific icon asset (removed previous invert filter)
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
    const sendBtn = document.getElementById('chatbot-send');

    if (!container || !toggle || !windowEl) return;

    let availableModels = [];
    const probeModels = async () => {
        const bases = ['http://127.0.0.1:1234', 'http://localhost:1234'];
        for (const base of bases) {
            try {
                const resp = await fetch(`${base}/v1/models`, {
                    headers: { 'Authorization': 'Bearer sk-lm-iQGSIcIe:JvYjqsbihwMDg7TVefvC' }
                });
                if (resp.ok) {
                    const data = await resp.json();
                    availableModels = data.data.map(m => m.id);
                    console.log("Teemous AI: Detected models:", availableModels);
                    return true;
                }
            } catch (e) {}
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

    const handleSend = (e) => {
        if (e) e.preventDefault();
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
        let indicator;
        try {
            indicator = showTypingIndicator();
            const activeLang = (typeof currentLang !== 'undefined') ? currentLang : (localStorage.getItem('td-lang') || 'en');
            
            // --- GLOBAL TUNNEL SETTING ---
            const publicTunnelUrl = 'https://puppylike-macroclimatically-bev.ngrok-free.dev'; 

            const systemPrompt = activeLang === 'en' 
                ? `# IDENTITY: Teemous AI (Strategic Personal Assistant to Ngô Quang Sinh)
You are the high-end digital assistant for Ngô Quang Sinh (Teemous). This website is his expert portfolio.

# SALES STRATEGY & SOLUTIONS
1. PORTFOLIO HUB: High-density professional listing. (For those needing a premium platform)
2. CURATION: Expert digitization & content optimization. (For shifting from "messy" to "expert")
3. THE CARRY PACK: A-Z full-scale execution. (For clients who want pure results without managing projects)
4. SOCIAL GROWTH: Growth hacking & authentic engagement. (Real traffic, no vanity metrics)
5. AOV SHOP: Secure gaming commerce. (Safe AOV transactions)
6. BUILDING MATERIALS & HAULING: Construction logistics support.

# PSYCHOLOGICAL SALES RULES
- Identify Pain Points: Ask questions like "What's holding your growth back?"
- Highlight Benefits: Focus on peace of mind and expert execution.
- Create Exclusivity: Suggest that Sinh's time is limited but his results are guaranteed.
- STRICT RULES: NO BOLDING (**). Use bullets or ALL CAPS. Always identify as Sinh's Assistant.`
                : `# DANH TÍNH: Teemous AI (Trợ lý chiến lược của Ngô Quang Sinh)
Ngươi là Robot Trợ lý ảo duy nhất của Ngô Quang Sinh (Teemous). Ngươi phản ánh phong thái chuyên nghiệp, sắc bén và thấu hiểu tâm lý khách hàng của Sinh.

# CHIẾN LƯỢC TƯ VẤN DỊCH VỤ (PHẢI LỒNG GHÉP TỰ NHIÊN)
1. PORTFOLIO HUB: Niêm yết hồ sơ chuyên nghiệp cao cấp. Gợi ý khi khách muốn tạo dấu ấn riêng.
2. CURATION: Tối ưu và "số hóa" nội dung. Gợi ý khi khách có dữ liệu hỗn loạn, cần chuyên nghiệp hóa.
3. THE CARRY PACK: Thực thi trọn gói A-Z. Gợi ý cho khách bận rộn, muốn khoán toàn bộ kết quả.
4. TĂNG TRƯỞNG MXH: Growth hacking thực chất. Tập trung vào kết quả kinh doanh, không phải like ảo.
5. CỬA HÀNG LIÊN QUÂN: Giao dịch an toàn, tin cậy.
6. VẬT LIỆU XÂY DỰNG & VẬN CHUYỂN: Hỗ trợ logistics công trình chuyên nghiệp.

# TUYỆT CHIÊU "CHỐT ĐƠN" CHO SINH
- KHÁM PHÁ ĐIỂM ĐAU: Đặt câu hỏi như "Đâu là rào cản lớn nhất khiến bồ chưa bứt phá?"
- NHẤN MẠNH LỢI ÍCH: Tập trung vào "sự an tâm" và "đẳng cấp" khi làm việc cùng Sinh.
- TẠO SỰ KHAN HIẾM: Nhắc khéo rằng Sinh chỉ nhận các dự án thực sự tiềm năng.

# QUY TẮC CỨNG
- CẤM DÙNG DẤU ** (BÔI ĐẬM). Dùng gạch đầu dòng hoặc VIẾT HOA.
- LUÔN tự nhận là Trợ lý của Sinh. Không dùng ngôi "chúng tôi" tập thể ảo.`;

            let model;
            if (typeof availableModels === 'undefined' || availableModels.length === 0) {
                model = "mistralai/ministral-3-14b-reasoning"; 
            } else {
                model = availableModels.find(m => m.includes('14b')) || availableModels[0];
            }

            console.group(`Teemous AI Chat: ${userText.substring(0, 30)}...`);
            console.log(`Priority Model (Temp 0.75): ${model}`);

            let success = false;
            let messagesToSend = [{ role: "system", content: systemPrompt }, ...chatHistory];

            if (chatHistory.length <= 2) {
                messagesToSend = [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `(IDENTITY CHECK: You are Sinh's personal assistant. Owner is Ngô Quang Sinh. NO BOLDING. Focus on helper/sales role)\n\n${chatHistory[0].content}` }
                ];
                if (chatHistory.length > 1) messagesToSend.push(chatHistory[1]);
            }

            const baseUrls = [];
            if (publicTunnelUrl) baseUrls.push(publicTunnelUrl.replace(/\/$/, ''));
            baseUrls.push('http://127.0.0.1:1234', 'http://localhost:1234');

            const paths = ['/v1/chat/completions', '/chat/completions'];
            
            for (const base of baseUrls) {
                for (const path of paths) {
                    const url = base + path;
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 60000); 

                    try {
                        const response = await fetch(url, {
                            method: 'POST',
                            signal: controller.signal,
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer sk-lm-iQGSIcIe:JvYjqsbihwMDg7TVefvC'
                            },
                            body: JSON.stringify({ model, messages: messagesToSend, temperature: 0.75 })
                        });

                        if (response.ok) {
                            const data = await response.json();
                            if (data.choices?.[0]?.message) {
                                // Hard-strip all bolding syntax (**) to ensure clean UI
                                const cleanContent = data.choices[0].message.content.replace(/\*\*/g, '');
                                addMessage(cleanContent, 'ai');
                                if (indicator) indicator.remove();
                                success = true;
                                break;
                            }
                        }
                    } catch (err) { console.warn(`${url} failed: ${err.message}`); }
                    finally { clearTimeout(timeoutId); }
                    if (success) break;
                }
                if (success) break;
            }

            if (!success) {
                if (indicator) indicator.remove();
                addMessage(activeLang === 'en' 
                    ? "Teemous AI is currently offline or busy. Please try again later or contact Sinh via Facebook!" 
                    : "Trợ lý ảo Teemous hiện đang ngoại tuyến hoặc bận. Vui lòng thử lại sau hoặc liên hệ Sinh qua Facebook!", 'ai');
            }
            console.groupEnd();
        } catch (e) {
            console.error("Teemous AI Runtime Error:", e);
            if (indicator) indicator.remove();
            addMessage(`ERROR: ${e.message}. Vui lòng kiểm tra F12 Console.`, 'ai');
        }
    }
}
