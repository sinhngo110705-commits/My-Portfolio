document.addEventListener('DOMContentLoaded', () => {
    const runSafe = (fn, name) => {
        try {
            if (typeof fn === 'function') fn();
        } catch (err) {
            console.warn(`[Teemous Lab] Warning in ${name}:`, err);
        }
    };

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        try { gsap.registerPlugin(ScrollTrigger); } catch(e) {}
    }

    runSafe(initBackgroundAnimation, 'BackgroundAnimation');
    runSafe(initLiveTelemetry, 'LiveTelemetry');
    runSafe(initCardSpotlights, 'CardSpotlights');
    runSafe(ensureMobileWidgets, 'EnsureMobileWidgets');
    runSafe(initLanguageToggle, 'LanguageToggle');
    runSafe(initThemeToggle, 'ThemeToggle');
    runSafe(initSmmTerminal, 'SmmTerminal');
    runSafe(initChatbot, 'Chatbot');
    runSafe(initAuthModal, 'AuthModal');
    runSafe(initDashboard, 'Dashboard');
    runSafe(initTopUpModal, 'TopUpModal');
    runSafe(initMobileMenu, 'MobileMenu');
    runSafe(initScrollProgress, 'ScrollProgress');
    runSafe(initScrollAnimations, 'ScrollAnimations');
    runSafe(initHoverEffects, 'HoverEffects');
    runSafe(initPortfolioFilters, 'PortfolioFilters');
    runSafe(initGalleryToggle, 'GalleryToggle');
});

function initScrollProgress() {
    const container = document.createElement('div');
    container.className = 'scroll-progress-container';
    const bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    container.appendChild(bar);
    document.body.appendChild(container);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
                bar.style.width = scrolled + "%";
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function initScrollAnimations() {
    if (typeof gsap === 'undefined') return;
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

    // ==========================================
    // MENG TO CINEMATIC MOTION SYSTEM (Awwwards / Studio-Grade)
    // ==========================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion && typeof gsap !== 'undefined') {
        gsap.defaults({ ease: 'power3.out', duration: 0.85 });

        // 1. Hero Entrance: Masked Line Reveal & Laser Sweep
        const titleLines = document.querySelectorAll('.title-line');
        const metaBar = document.querySelector('.editorial-meta-bar');
        const manifesto = document.querySelector('.editorial-manifesto-text');
        const ctas = document.querySelectorAll('.editorial-cta-row a, .commission-gate a');
        const hairlines = document.querySelectorAll('.hairline');

        if (titleLines.length > 0) {
            const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

            if (metaBar) {
                heroTl.fromTo(metaBar, { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
            }
            heroTl.fromTo(titleLines, 
                { yPercent: 115 }, 
                { yPercent: 0, duration: 1.2, stagger: 0.14, ease: 'power4.out' }, 
                "-=0.5"
            );
            if (manifesto) {
                heroTl.fromTo(manifesto, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, "-=0.7");
            }
            if (ctas.length > 0) {
                heroTl.fromTo(ctas, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, "-=0.6");
            }
            if (hairlines.length > 0) {
                heroTl.fromTo(hairlines[0], { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, "-=0.5");
            }

            // Hero Drift removed for 120fps buttery smooth scrolling
        }

        // 2. Meng To Magnetic Button Physics (Pointer Reactive Inertia)
        if (!window.matchMedia('(pointer: coarse)').matches) {
            ctas.forEach(btn => {
                const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
                const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
                let rect = null;

                btn.addEventListener('pointerenter', () => {
                    rect = btn.getBoundingClientRect();
                });

                btn.addEventListener('pointermove', (e) => {
                    if (!rect) rect = btn.getBoundingClientRect();
                    const strength = 0.28;
                    const x = (e.clientX - rect.left - rect.width / 2) * strength;
                    const y = (e.clientY - rect.top - rect.height / 2) * strength;
                    xTo(x);
                    yTo(y);
                }, { passive: true });

                btn.addEventListener('pointerleave', () => {
                    rect = null;
                    xTo(0);
                    yTo(0);
                });
            });
        }

        // 3. Lookbook Section: Meng To Architectural Staggered Reveal
        const lookbookSection = document.getElementById('lookbook');
        const lookbookCards = document.querySelectorAll('.lookbook-card');
        if (lookbookSection && lookbookCards.length > 0 && typeof ScrollTrigger !== 'undefined') {
            const lookbookTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#lookbook',
                    start: 'top 82%',
                    once: true
                }
            });

            lookbookTl.fromTo('#lookbook .editorial-section-header',
                { y: 18, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                }
            );

            lookbookTl.fromTo(lookbookCards,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.55,
                    stagger: 0.06,
                    ease: 'power2.out',
                    clearProps: 'transform,opacity,willChange'
                },
                "-=0.25"
            );
        }

        // 4. Systems Section: Staggered Architectural Spectrum Reveal
        const systemsSection = document.getElementById('systems');
        const spectrumCols = document.querySelectorAll('.spectrum-col');
        if (systemsSection && spectrumCols.length > 0 && typeof ScrollTrigger !== 'undefined') {
            const systemsTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#systems',
                    start: 'top 82%',
                    once: true
                }
            });

            systemsTl.fromTo('#systems .editorial-section-header',
                { y: 24, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    ease: 'power3.out'
                }
            );

            systemsTl.fromTo(spectrumCols,
                { y: 28, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity,willChange'
                },
                "-=0.35"
            );
        }

        // 5. Commission Section Reveal
        const commissionSection = document.getElementById('commission');
        if (commissionSection && typeof ScrollTrigger !== 'undefined') {
            gsap.fromTo(commissionSection,
                { y: 24, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: '#commission',
                        start: 'top 86%',
                        once: true
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity,willChange'
                }
            );
        }
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
            ease: 'power3.out',
            clearProps: 'transform,willChange'
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
                ease: 'power3.out',
                clearProps: 'transform,willChange'
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
            ease: 'power3.out',
            clearProps: 'transform,willChange'
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
                ease: 'power3.out',
                clearProps: 'transform,willChange'
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

// High-performance hardware-accelerated background animation (Data / Cyberpunk Grid shift)
function initBackgroundAnimation() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    let width = 0, height = 0;
    let particles = [];
    let mouse = { x: null, y: null, targetX: null, targetY: null };
    let isVisible = !document.hidden;
    let isScrolling = false;
    let scrollTimeout = null;
    let animId = null;
    let lastTime = 0;
    const targetFpsInterval = 1000 / 60;

    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isLowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || isCoarse;

    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
        if (mouse.x === null) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
    }, { passive: true });

    // Pause canvas completely during active user scroll to give 100% frame budget to smooth scrolling
    window.addEventListener('scroll', () => {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 80);
    }, { passive: true });

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    window.addEventListener('resize', resize, { passive: true });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.6 + 0.8;
            this.baseX = this.x;
            this.baseY = this.y;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.density = (Math.random() * 20) + 1;
            this.colorType = Math.random() > 0.5 ? 1 : 0;
        }

        update() {
            this.baseX += this.vx;
            this.baseY += this.vy;

            if (this.baseX < 0) this.baseX = width;
            if (this.baseX > width) this.baseX = 0;
            if (this.baseY < 0) this.baseY = height;
            if (this.baseY > height) this.baseY = 0;

            if (mouse.x != null) {
                const dx = mouse.x - width / 2;
                const dy = mouse.y - height / 2;
                const factor = (30 / this.density) * 0.04;
                const targetX = this.baseX - (dx * factor);
                const targetY = this.baseY - (dy * factor);

                this.x += (targetX - this.x) * 0.05;
                this.y += (targetY - this.y) * 0.05;
            } else {
                this.x = this.baseX;
                this.y = this.baseY;
            }
        }
    }

    function initParticles() {
        particles = [];
        const baseDensity = isLowPower ? 40000 : 26000;
        const maxParticles = isLowPower ? 14 : 26;
        const numParticles = Math.min(maxParticles, Math.max(10, Math.floor((width * height) / baseDensity)));
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function drawParticlesAndConnections(isLight) {
        const maxDistSq = 12000;
        ctx.beginPath();
        for (let a = 0; a < particles.length; a++) {
            const pa = particles[a];
            for (let b = a + 1; b < particles.length; b++) {
                const pb = particles[b];
                const dx = pa.x - pb.x;
                const dy = pa.y - pb.y;
                const distance = dx * dx + dy * dy;

                if (distance < maxDistSq) {
                    ctx.moveTo(pa.x, pa.y);
                    ctx.lineTo(pb.x, pb.y);
                }
            }
        }
        ctx.strokeStyle = isLight ? 'rgba(156, 39, 176, 0.14)' : 'rgba(156, 39, 176, 0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Batch purple particles
        ctx.fillStyle = 'rgba(156, 39, 176, 0.5)';
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (p.colorType === 0) {
                ctx.moveTo(p.x + p.size, p.y);
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }
        }
        ctx.fill();

        // Batch blue particles
        ctx.fillStyle = 'rgba(33, 150, 243, 0.5)';
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (p.colorType === 1) {
                ctx.moveTo(p.x + p.size, p.y);
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }
        }
        ctx.fill();
    }

    function animate(now) {
        if (!isVisible) return;

        animId = requestAnimationFrame(animate);

        // While scrolling, freeze canvas to eliminate all GPU competition
        if (isScrolling) return;

        const delta = now - lastTime;
        if (delta < targetFpsInterval - 2) return;
        lastTime = now - (delta % targetFpsInterval);

        ctx.clearRect(0, 0, width, height);

        if (mouse.targetX !== null) {
            mouse.x += (mouse.targetX - mouse.x) * 0.08;
            mouse.y += (mouse.targetY - mouse.y) * 0.08;
        }

        const isLight = document.documentElement.classList.contains('light-mode') || document.body.classList.contains('light-mode');

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }

        drawParticlesAndConnections(isLight);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isVisible = false;
            if (animId) cancelAnimationFrame(animId);
        } else {
            isVisible = true;
            lastTime = performance.now();
            animId = requestAnimationFrame(animate);
        }
    });

    resize();
    lastTime = performance.now();
    animId = requestAnimationFrame(animate);
}

// Multi-language Toggle Logic (Persistent state across entire ecosystem)
let currentLang = localStorage.getItem('td-lang') || 'vi';
if (!localStorage.getItem('td-lang')) {
    localStorage.setItem('td-lang', currentLang);
}

function ensureMobileWidgets() {
    const headerNav = document.querySelector('.header-nav');
    if (!headerNav) return;

    if (!headerNav.querySelector('.mobile-nav-widgets')) {
        const widgetsContainer = document.createElement('div');
        widgetsContainer.className = 'mobile-nav-widgets';
        widgetsContainer.innerHTML = `
            <div class="mobile-widget-row">
                <button type="button" class="mobile-widget-btn theme-toggle" title="Toggle Theme" aria-label="Toggle Theme">
                    <span class="mode-icon">🌙</span>
                    <span class="theme-label">Tối</span>
                </button>
                <button type="button" class="mobile-widget-btn lang-toggle" title="Toggle Language" aria-label="Toggle Language">
                    <span class="lang-flag">🇻🇳</span> <span class="lang-text">VI</span>
                </button>
            </div>
        `;
        headerNav.appendChild(widgetsContainer);
    }
}

function initLanguageToggle() {
    // Synchronize HTML element lang attribute immediately
    document.documentElement.lang = currentLang;
    document.documentElement.setAttribute('data-lang', currentLang);
    updateAllTranslations();

    const langBtns = document.querySelectorAll('.lang-toggle');
    langBtns.forEach(langBtn => {
        if (langBtn._hasLangListener) return;
        langBtn._hasLangListener = true;

        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentLang = currentLang === 'en' ? 'vi' : 'en';
            localStorage.setItem('td-lang', currentLang);
            document.documentElement.lang = currentLang;
            document.documentElement.setAttribute('data-lang', currentLang);
            updateAllTranslations();
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(langBtn, { scale: 0.85 }, { scale: 1, duration: 0.25, ease: 'back.out(1.7)' });
            }
            window.dispatchEvent(new CustomEvent('td-state-change', { detail: { type: 'lang', value: currentLang } }));
        });
    });
}

function updateAllTranslations() {
    document.documentElement.lang = currentLang;
    document.documentElement.setAttribute('data-lang', currentLang);

        // 0. Clean, minimal Lang button: Displays solely "VI" or "EN"
    const langBtns = document.querySelectorAll('.lang-toggle');
    langBtns.forEach(langBtn => {
        const code = currentLang === 'vi' ? 'VI' : 'EN';
        const isMobileBtn = langBtn.classList.contains('mobile-widget-btn');

        if (isMobileBtn) {
            langBtn.innerHTML = `<span class="lang-icon" style="font-size: 1rem; line-height: 1; display: inline-flex; align-items: center;">🌐</span> <span class="lang-text" style="font-weight: 800; font-size: 0.82rem; font-family: var(--font-heading, inherit);">${code}</span>`;
        } else {
            langBtn.innerHTML = `<span style="font-weight:900; font-family:var(--font-heading); font-size:0.95rem; letter-spacing:0.5px;">${code}</span>`;
        }
        langBtn.setAttribute('title', currentLang === 'vi' ? 'Đang hiển thị Tiếng Việt (Bấm để chuyển sang English)' : 'Currently English (Click to switch to Tiếng Việt)');
        langBtn.setAttribute('aria-label', currentLang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt');
    });

    // 1. Text elements
    const translatableElements = document.querySelectorAll('[data-en][data-vi]');
    translatableElements.forEach(el => {
        if (el.closest('#root')) return; // DO NOT FIGHT WITH REACT

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
        if (el.closest('#root')) return; // DO NOT FIGHT WITH REACT
        el.setAttribute('placeholder', el.getAttribute(`data-${currentLang}-placeholder`));
    });

    // 3. Update the mode button text specifically depending on active theme
    updateThemeButtonText();
}

// Light / Dark Mode Toggle Logic
function initThemeToggle() {
    // --- localStorage persistence: apply saved theme on page load ---
    const savedTheme = localStorage.getItem('td-theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.remove('light-mode');
    } else {
        document.documentElement.classList.add('light-mode'); // default light
    }

    const themeBtns = document.querySelectorAll('.theme-toggle');
    themeBtns.forEach(themeBtn => {
        if (themeBtn._hasThemeListener) return;
        themeBtn._hasThemeListener = true;

        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.documentElement.classList.toggle('light-mode');
            const isLight = document.documentElement.classList.contains('light-mode');
            localStorage.setItem('td-theme', isLight ? 'light' : 'dark');

            if (typeof gsap !== 'undefined') {
                gsap.fromTo(themeBtn, { scale: 0.8 }, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
            }
            updateThemeButtonText();
            window.dispatchEvent(new CustomEvent('td-state-change', { detail: { type: 'theme', value: isLight ? 'light' : 'dark' } }));
        });
    });

    // Initial setup
    updateThemeButtonText();
}

function updateThemeButtonText() {
    const isLight = document.documentElement.classList.contains('light-mode');

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
    const fallbackEmoji = isLight ? '☀️' : '🌙';

    const modeIcons = document.querySelectorAll('.mode-icon');
    modeIcons.forEach(modeIcon => {
        const isMobile = modeIcon.closest('.mobile-widget-btn');
        const iconSize = isMobile ? '18px' : '24px';
        modeIcon.innerHTML = `<img src="${currentIcon}" alt="Theme Icon" class="theme-icon-img" style="width: ${iconSize}; height: ${iconSize}; vertical-align: middle;" onerror="this.outerHTML='${fallbackEmoji}';">`;
    });

    const activeLang = (typeof currentLang !== 'undefined') ? currentLang : (localStorage.getItem('td-lang') || 'vi');
    const themeLabels = document.querySelectorAll('.theme-label');
    themeLabels.forEach(label => {
        if (isLight) {
            label.textContent = activeLang === 'vi' ? 'Sáng' : 'Light';
        } else {
            label.textContent = activeLang === 'vi' ? 'Tối' : 'Dark';
        }
    });

    const themeBtns = document.querySelectorAll('.theme-toggle');
    themeBtns.forEach(btn => {
        btn.setAttribute('title', isLight ? (activeLang === 'vi' ? 'Chế độ Sáng (Bấm để chuyển Tối)' : 'Light Mode (Click for Dark)') : (activeLang === 'vi' ? 'Chế độ Tối (Bấm để chuyển Sáng)' : 'Dark Mode (Click for Light)'));
        btn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    });
}

// Hover Effects for interactive buttons & links (leaving card/section hover purely to CSS transitions)
function initHoverEffects() {
    if (typeof gsap === 'undefined') return;

    gsap.utils.toArray('.social-btn, .nav-links a, .theme-toggle, .lang-toggle, .circular-avatar').forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            gsap.to(e.currentTarget, { scale: 1.05, duration: 0.25, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', (e) => {
            gsap.to(e.currentTarget, { scale: 1, duration: 0.25, ease: 'power2.out', clearProps: 'transform' });
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
    const avatars = document.querySelectorAll('.portfolio-card, .hub-profile-card');

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
                const sectionAvatars = section.querySelectorAll('.portfolio-card, .hub-profile-card');
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

    ensureMobileWidgets();
    initLanguageToggle();
    initThemeToggle();

    // Remove any leftover backdrop overlay from DOM
    const oldBackdrop = document.querySelector('.mobile-menu-backdrop');
    if (oldBackdrop) oldBackdrop.remove();

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        headerNav.classList.remove('active');
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        const isOpen = headerNav.classList.toggle('active');
        menuToggle.classList.toggle('active', isOpen);
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close when clicking anywhere outside the floating dropdown menu
    document.addEventListener('click', (e) => {
        if (headerNav.classList.contains('active')) {
            if (!headerNav.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // Close menu when clicking a link or button inside
    const navLinks = document.querySelectorAll('.nav-links a, .nav-links button');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
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
    const sendBtn = document.getElementById('chatbot-send') || document.getElementById('send-btn');

    if (!container || !toggle || !windowEl || !messagesEl || !inputEl) return;

    toggle.addEventListener('click', () => {
        windowEl.classList.toggle('active');
        if (windowEl.classList.contains('active')) {
            inputEl.focus();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            windowEl.classList.remove('active');
        });
    }

    let isThinking = false;
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

    function removeAccents(str) {
        return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
    }

    function clientRagFallback(userText, lang) {
        const clean = removeAccents(userText);
        if (clean.includes("thuy duong") || clean.includes("duong")) {
            return lang === "vi"
                ? "Trần Thị Thùy Dương (#01 - 96.0 điểm, Tier S+ Apex) là tài năng Khoa học Máy tính tại VKU (GPA 3.61/4.0), cựu chuyên Tin Quốc Học Huế (9.3/10), giải ICPC Quốc gia và Top 6 SheCodes. Chuyên sâu thuật toán, C++, Java, Full-Stack và Flutter Mobile!"
                : "Tran Thi Thuy Duong (#01 - 96.0 pts, Tier S+ Apex) is a top CS talent at VKU (3.61 GPA, National ICPC, SheCodes Top 6). Specialized in algorithms, Full-Stack Web and Flutter!";
        }
        if (clean.includes("thai trung") || clean.includes("trung")) {
            return lang === "vi"
                ? "Lê Thái Trung (#02 - 90.5 điểm, Tier S Professional) là kỹ sư Kỹ nghệ Phần mềm tại ĐH Duy Tân, chuyên sâu Backend APIs, IntelliJ IDEA, Postman và Linux/Git."
                : "Le Thai Trung (#02 - 90.5 pts, Tier S Professional) is a Software Engineering student at DTU specialized in Backend APIs, RESTful services, and Linux systems.";
        }
        if (clean.includes("quang sinh") || clean.includes("sinh") || clean.includes("founder") || clean.includes("admin")) {
            return lang === "vi"
                ? "Ngô Quang Sinh (#03 - 88.0 điểm, Tier A+ Impressive) là Nhà sáng lập Teemous Digital Lab, sinh viên Digital Marketing tại ĐH Duy Tân. Chuyên kiến trúc Web, tự động hóa AI Workflows, Google AppsScript và phát triển hệ sinh thái số. Liên hệ Sinh qua FB: facebook.com/quang.sinh.5492 hoặc Zalo: 0797747297 nhé!"
                : "Ngo Quang Sinh (#03 - 88.0 pts, Tier A+ Impressive) is the Founder of Teemous Digital Lab. Specialized in Web architecture, AI workflows, and system development. Reach out on Facebook: facebook.com/quang.sinh.5492 or Zalo: 0797747297!";
        }
        if (clean.includes("bao han") || clean.includes("han")) {
            return lang === "vi"
                ? "Bùi Lưu Bảo Hân (#04 - 84.0 điểm, Tier A Standard) là sinh viên Kinh doanh Quốc tế tại ĐH Duy Tân, có thế mạnh về Quản trị Nhân sự (HR), vận hành cộng đồng thanh niên và quản trị dữ liệu với Notion & Google Sheets."
                : "Bui Luu Bao Han (#04 - 84.0 pts, Tier A Standard) studies International Business at DTU, specialized in HR operations and community coordination.";
        }
        if (clean.includes("quang tuan") || clean.includes("tuan")) {
            return lang === "vi"
                ? "Vương Quang Tuấn (#05 - 80.5 điểm, Tier A Standard) là nhân sự Sáng tạo Nội dung năng động, chuyên thiết kế đồ họa Canva, dựng video ngắn CapCut, quản trị Fanpage và chạy Facebook Ads."
                : "Vuong Quang Tuan (#05 - 80.5 pts, Tier A Standard) is a Content Creator specialized in Canva graphic design, CapCut video editing, and social media ads.";
        }
        if (clean.includes("gia") || clean.includes("cost") || clean.includes("price") || clean.includes("bang gia") || clean.includes("chi phi") || clean.includes("bao nhieu") || clean.includes("0d") || clean.includes("free")) {
            return lang === "vi"
                ? "Hiện tại gói Khởi Tạo Portfolio Cơ Bản đang được TÀI TRỢ 100% SUẤT 0Đ (giá gốc 49k) cho người đăng ký sớm! Gói Nâng Cao (Bespoke VIP) hiện đang tạm khóa để remake phiên bản mới. Bạn hãy vào mục SERVICES & SHOP để nhận suất 0đ ngay nha!"
                : "The Basic Portfolio incubation package is currently 100% FREE (0 VND Pioneer Grant)! The Bespoke VIP tier is temporarily locked for remake. Visit the Services & Shop page to claim your 0 VND grant!";
        }
        if (clean.includes("mau") || clean.includes("showcase") || clean.includes("hub") || clean.includes("ho so") || clean.includes("xep hang") || clean.includes("tier") || clean.includes("bac")) {
            return lang === "vi"
                ? "Portfolio Hub xếp hạng hồ sơ công tâm dựa trên giá trị thực tế: S+ Apex (>=95.0 - Thùy Dương), S Professional (90.0-94.9 - Thái Trung), A+ Impressive (85.0-89.9 - Quang Sinh), A Standard (80.0-84.9 - Bảo Hân, Quang Tuấn). Bấm mục 'Portfolio Hub' trên menu để xem nhé!"
                : "Portfolio Hub benchmarks dossiers objectively: S+ Apex (Thuy Duong), S Pro (Thai Trung), A+ Impressive (Quang Sinh), A Standard (Bao Han, Quang Tuan). Check the Portfolio Hub tab on the menu!";
        }
        if (clean.includes("mxh") || clean.includes("smm") || clean.includes("mang xa hoi") || clean.includes("social") || clean.includes("follow") || clean.includes("buff") || clean.includes("like") || clean.includes("tiktok") || clean.includes("facebook") || clean.includes("instagram")) {
            return lang === "vi"
                ? "Hệ thống SMM của Teemous Digital hỗ trợ tăng tương tác, like, follow, view cho Facebook, Instagram, Threads, TikTok. Tự động chuyển link sang UID, bảo mật 100% không cần mật khẩu và nạp tiền tự động qua VietQR!"
                : "Our SMM terminal provides high-speed engagement (likes, followers, views) across Meta & TikTok platforms. 100% account safety and instant auto-delivery!";
        }
        if (clean.includes("aov") || clean.includes("lien quan") || clean.includes("acc") || clean.includes("shop") || clean.includes("nick")) {
            return lang === "vi"
                ? "Cửa hàng Liên Quân hiện đang tạm ngưng hoạt động để bảo trì hệ thống máy chủ và nâng cấp quy trình giao dịch bảo mật. Bạn vui lòng quay lại sau nhé!"
                : "The Arena of Valor shop is currently undergoing system maintenance for server security upgrades.";
        }
        if (clean.includes("lien he") || clean.includes("contact") || clean.includes("fb") || clean.includes("zalo") || clean.includes("email")) {
            return lang === "vi"
                ? "Bạn có thể liên hệ trực tiếp với Founder Quang Sinh qua Facebook: facebook.com/quang.sinh.5492, Zalo: 0797747297 hoặc email: teemous.contact@gmail.com nha!"
                : "You can reach out directly to founder Quang Sinh on Facebook: facebook.com/quang.sinh.5492 or Zalo: 0797747297!";
        }
        return lang === "vi"
            ? "Chào bạn! Mình là Teemous AI, trợ lý số của Teemous Digital Lab. Mình có thể hỗ trợ bạn nhận suất khởi tạo Portfolio 0đ, giải đáp thông tin Portfolio Hub, dịch vụ buff tương tác MXH hay kết nối trực tiếp với Founder Quang Sinh. Bạn cần mình hỗ trợ gì nè?"
            : "Hello! I am Teemous AI, virtual assistant to Teemous Digital Lab. I can help with claiming your 0 VND portfolio grant, exploring Portfolio Hub, social growth services, or connecting directly with founder Quang Sinh. How can I help you today?";
    }

    async function getAIResponse(userText) {
        if (isThinking) return;
        let indicator;
        const activeLang = (typeof currentLang !== 'undefined') ? currentLang : (localStorage.getItem('td-lang') || 'vi');
        try {
            isThinking = true;
            inputEl.disabled = true;
            if (sendBtn) {
                sendBtn.style.opacity = '0.5';
                sendBtn.style.pointerEvents = 'none';
            }

            indicator = showTypingIndicator();

            let content = '';
            let success = false;

            // Direct fetch to /api/chat
            try {
                const ctrl = new AbortController();
                const tid = setTimeout(() => ctrl.abort(), 3000);

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [
                            ...chatHistory.slice(-4).map(m => ({ role: m.role, content: m.content })),
                            { role: 'user', content: userText }
                        ]
                    }),
                    signal: ctrl.signal
                });
                clearTimeout(tid);

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.content) {
                        content = data.content;
                        success = true;
                    }
                }
            } catch (netErr) {
                // Ignore network error and proceed instantly to client RAG
            }

            if (!success || !content) {
                content = clientRagFallback(userText, activeLang);
            }

            if (indicator) indicator.remove();
            addMessage((content || "").replace(/\*\*/g, ''), 'ai');

        } catch (e) {
            console.error("Chatbot exception handled:", e);
            if (indicator) indicator.remove();
            addMessage(clientRagFallback(userText, activeLang), 'ai');
        } finally {
            isThinking = false;
            inputEl.disabled = false;
            if (sendBtn) {
                sendBtn.style.opacity = '1';
                sendBtn.style.pointerEvents = 'auto';
            }
            inputEl.focus();
        }
    }

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

    if (sendBtn) {
        sendBtn.addEventListener('click', handleSend);
    }

    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend(e);
        }
    });

    windowEl.querySelectorAll('.quick-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            if (prompt && inputEl) {
                inputEl.value = prompt;
                handleSend();
            }
        });
    });
}


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
    // Navigate to dedicated user page if on another page, or fallback to modal
    if (!document.getElementById("dashboard-modal-overlay")) {
        window.location.href = "/user";
        return;
    }
    window.openDashboard = openDashboard;
    const overlay = document.getElementById("dashboard-modal-overlay");
    const token = localStorage.getItem("teemous_jwt");
    if (!overlay || !token) {
        window.location.href = "/user";
        return;
    }

    // Show modal with stale data first for speed
    const user = JSON.parse(localStorage.getItem('teemous_user') || '{}');
    if (user.username) {
        document.getElementById('dashboard-username-input').value = user.username;
        document.getElementById('dashboard-email').innerText = user.email || '';
        document.getElementById('dashboard-balance').innerText = `${user.balance || 0} VND`;
        
        const rankSpan = document.getElementById('dashboard-rank') || document.getElementById('dashboard-role');
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
            
            // Reveal Admin tab ONLY if role = 'admin' (double-checked from server)
            const adminTab = document.getElementById('admin-dash-tab');
            if (adminTab) {
                if (data.user.role === 'admin') {
                    adminTab.style.display = '';
                } else {
                    adminTab.style.display = 'none';
                }
            }

            // Refresh UI fields
            document.getElementById('dashboard-username-input').value = data.user.username;
            document.getElementById('dashboard-balance').innerText = `${data.user.balance.toLocaleString()} VND`;
            
            const rankSpan = document.getElementById('dashboard-rank') || document.getElementById('dashboard-role');
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
    const profileOpenBtn = document.getElementById('up-open-topup-btn');
    const overlay = document.getElementById('topup-modal-overlay');
    const closeBtn = document.getElementById('close-topup-modal');
    const genBtn = document.getElementById('gen-qr-btn');
    const amtBtns = document.querySelectorAll('.amt-btn');
    const customAmtInput = document.getElementById('custom-amount');
    const qrArea = document.getElementById('qr-display-area');
    const qrImg = document.getElementById('vietqr-img');
    const qrAmtText = document.getElementById('qr-amt-text');
    const qrNoteText = document.getElementById('qr-note-text');

    if (!overlay) return;

    let selectedAmount = 200000;

    const handleOpen = () => {
        overlay.classList.add('active');
        overlay.style.display = 'flex'; // Ensure flex for centering
        if (typeof gsap !== 'undefined') {
            gsap.fromTo("#topup-modal", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
        }
    };

    if (openBtn) openBtn.addEventListener('click', handleOpen);
    if (profileOpenBtn) profileOpenBtn.addEventListener('click', handleOpen);

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
            <button class="mp-btn neon-border" onclick="window.location.href='/user'">Dashboard</button>
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

// === AOV SHOP PURCHASE LOGIC ===
window.buyAovAccount = async function(accountId, price, details) {
    const userJson = localStorage.getItem('teemous_user');
    const lang = localStorage.getItem('td-lang') || 'en';

    if (!userJson) {
        const msg = lang === 'vi' ? 'Vui lòng đăng nhập để thực hiện giao dịch!' : 'Please login to perform this transaction!';
        alert(msg);
        // Trigger login modal
        const loginBtn = document.getElementById('nav-login-btn');
        if (loginBtn) loginBtn.click();
        return;
    }

    const user = JSON.parse(userJson);
    const balance = user.balance || 0;

    if (balance < price) {
        const msg = lang === 'vi' ? 'Tài khoản không đủ tiền. Vui lòng nạp thêm!' : 'Insufficient funds. Please top up!';
        alert(msg);
        
        // Open Dashboard directly to Funding tab if possible
        if (window.openDashboard) {
            window.openDashboard().then(() => {
                const fundingTab = document.querySelector('.dash-tab[data-tab="transactions"]');
                if (fundingTab) fundingTab.click();
            });
        }
        return;
    }

    // Confirm purchase
    const confirmMsg = lang === 'vi' 
        ? `Xác nhận mua tài khoản ${accountId} với giá ${price.toLocaleString()} VND?` 
        : `Confirm purchase of ${accountId} for ${price.toLocaleString()} VND?`;
    
    if (!confirm(confirmMsg)) return;

    // Simulate API call and Balance Deduction
    try {
        // Deduct balance
        user.balance = balance - price;
        
        // Add to Mock Orders
        const newOrder = {
            product_name: accountId,
            price_at_purchase: price,
            status: 'completed',
            details: details,
            date: new Date().toISOString()
        };
        
        // Save to local storage
        localStorage.setItem('teemous_user', JSON.stringify(user));

        // Show Success with Account Details
        const successTitle = lang === 'vi' ? 'GIAO DỊCH THÀNH CÔNG!' : 'PURCHASE SUCCESSFUL!';
        const successBody = lang === 'vi' 
            ? `Chúc mừng! Bạn đã sở hữu tài khoản ${accountId}.\n\nThông tin đăng nhập:\n👉 ${details}\n\n(Lưu ý: Bạn có thể xem lại thông tin này trong phần Đơn hàng ở Profile).` 
            : `Congratulations! You now own ${accountId}.\n\nLogin Credentials:\n👉 ${details}\n\n(Note: You can review this in the Orders section of your Profile).`;
        
        alert(`${successTitle}\n\n${successBody}`);

        // Update UI
        const balDisplay = document.getElementById('dashboard-balance');
        if (balDisplay) balDisplay.innerText = `${user.balance.toLocaleString()} VND`;

        // Refresh mini profile if exists
        if (window.initMiniProfile) window.initMiniProfile();

    } catch (e) {
        alert(lang === 'vi' ? 'Lỗi giao dịch: ' + e.message : 'Transaction Error: ' + e.message);
    }
};

// Instant Navigation Prefetcher (Prefetches pages on link hover for instant, flicker-free navigation)
(function initInstantPrefetch() {
    const prefetched = new Set();
    document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a[href]');
        if (!link || link.target === '_blank') return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('javascript:') || href.startsWith('mailto:')) return;
        const fullUrl = new URL(href, window.location.href).href;
        if (prefetched.has(fullUrl)) return;
        prefetched.add(fullUrl);
        const linkEl = document.createElement('link');
        linkEl.rel = 'prefetch';
        linkEl.href = fullUrl;
        document.head.appendChild(linkEl);
    }, { passive: true });
})();
// Safety Fallback for initDashboard
if (typeof window.openDashboard === 'undefined') {
    window.openDashboard = async () => {
        // Fallback or Trigger existing one
        const overlay = document.getElementById('dashboard-modal-overlay');
        if (overlay) overlay.classList.add('active');
    };
}

/**
 * ================================================================
 * ADMIN PANEL LOGIC
 * Security: Widget only shows if role='admin' (server-verified).
 * Every API call re-checks role in DB — localStorage spoofing won't work.
 * ================================================================
 */
function initAdminPanel() {
    const tbody       = document.getElementById('admin-users-tbody');
    const searchInput = document.getElementById('admin-search-input');
    const refreshBtn  = document.getElementById('admin-refresh-btn');
    const editPanel   = document.getElementById('admin-edit-panel');
    const editTitle   = document.getElementById('admin-edit-title');
    const editBalance = document.getElementById('admin-edit-balance');
    const editRole    = document.getElementById('admin-edit-role');
    const saveBalBtn  = document.getElementById('admin-save-balance-btn');
    const saveRoleBtn = document.getElementById('admin-save-role-btn');
    const closeEditBtn= document.getElementById('admin-edit-close-btn');

    if (!tbody) return;

    let allUsers = [];
    let selectedUserId = null;

    // Helper: get token
    const getToken = () => localStorage.getItem('teemous_jwt');

    // ── Load users from Admin API ───────────────────────────────────────────
    async function loadUsers() {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">⏳ Loading...</td></tr>`;
        try {
            const res = await fetch('/api/admin/manage?action=users', {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (res.status === 403) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:#ff5252;">🚫 Access Denied. Not an admin.</td></tr>`;
                return;
            }
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'API Error');
            allUsers = data.users || [];
            renderTable(allUsers);
        } catch (e) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:#ff5252;">❌ Error: ${e.message}</td></tr>`;
        }
    }

    // ── Render Table ───────────────────────────────────────────────────────
    function renderTable(users) {
        if (!users || users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">No users found.</td></tr>`;
            return;
        }
        tbody.innerHTML = users.map(u => `
            <tr class="admin-user-row" data-userid="${u.id}">
                <td><span class="admin-id-badge">#${u.id}</span></td>
                <td><strong>${u.username}</strong></td>
                <td class="admin-email-cell">${u.email}</td>
                <td><span class="admin-balance-val">${(u.balance || 0).toLocaleString()}</span></td>
                <td><span class="rank-badge rank-${u.role === 'admin' ? 'elite' : 'standard'}">${u.role}</span></td>
                <td>
                    <button class="admin-edit-btn neon-border" onclick="adminOpenEdit(${u.id}, '${u.username}', ${u.balance}, '${u.role}')">✏️ Edit</button>
                </td>
            </tr>
        `).join('');
    }

    // ── Search filter ──────────────────────────────────────────────────────
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const q = searchInput.value.toLowerCase();
            const filtered = allUsers.filter(u =>
                u.username.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
            );
            renderTable(filtered);
        });
    }

    // ── Refresh button ─────────────────────────────────────────────────────
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => loadUsers());
    }

    // ── Close edit panel ───────────────────────────────────────────────────
    if (closeEditBtn) {
        closeEditBtn.addEventListener('click', () => {
            editPanel.style.display = 'none';
            selectedUserId = null;
        });
    }

    // ── Save Balance ───────────────────────────────────────────────────────
    if (saveBalBtn) {
        saveBalBtn.addEventListener('click', async () => {
            if (!selectedUserId) return;
            const amount = parseInt(editBalance.value);
            if (isNaN(amount) || amount < 0) {
                alert('Invalid amount. Must be a non-negative number.');
                return;
            }
            saveBalBtn.disabled = true;
            saveBalBtn.innerText = '⏳ Saving...';
            try {
                const res = await fetch('/api/admin/manage', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action: 'update_balance', userId: selectedUserId, amount })
                });
                const data = await res.json();
                if (res.ok) {
                    // Update local allUsers cache
                    const u = allUsers.find(x => x.id === selectedUserId);
                    if (u) u.balance = amount;
                    renderTable(allUsers);
                    editPanel.style.display = 'none';
                    alert(`✅ ${data.message}`);
                } else {
                    alert(`❌ Error: ${data.error}`);
                }
            } catch (e) {
                alert(`❌ Network error: ${e.message}`);
            } finally {
                saveBalBtn.disabled = false;
                saveBalBtn.innerText = '💾 Save Balance';
            }
        });
    }

    // ── Save Role ──────────────────────────────────────────────────────────
    if (saveRoleBtn) {
        saveRoleBtn.addEventListener('click', async () => {
            if (!selectedUserId) return;
            const role = editRole.value;
            if (!['user', 'admin'].includes(role)) return;

            const confirmed = confirm(
                role === 'admin'
                    ? `⚠️ Grant ADMIN privileges to this user? This gives full database access.`
                    : `Downgrade this user to 'user' role?`
            );
            if (!confirmed) return;

            saveRoleBtn.disabled = true;
            saveRoleBtn.innerText = '⏳ Saving...';
            try {
                const res = await fetch('/api/admin/manage', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action: 'update_role', userId: selectedUserId, role })
                });
                const data = await res.json();
                if (res.ok) {
                    const u = allUsers.find(x => x.id === selectedUserId);
                    if (u) u.role = role;
                    renderTable(allUsers);
                    editPanel.style.display = 'none';
                    alert(`✅ ${data.message}`);
                } else {
                    alert(`❌ Error: ${data.error}`);
                }
            } catch (e) {
                alert(`❌ Network error: ${e.message}`);
            } finally {
                saveRoleBtn.disabled = false;
                saveRoleBtn.innerText = '💾 Save Role';
            }
        });
    }

    // Load immediately when panel first initialized
    loadUsers();

    // Expose openEdit globally so inline onclick calls work
    window.adminOpenEdit = function(userId, username, balance, role) {
        selectedUserId = userId;
        editTitle.innerText = `Editing: ${username} (ID #${userId})`;
        editBalance.value = balance || 0;
        editRole.value = role || 'user';
        editPanel.style.display = 'block';
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(editPanel, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
        }
    };
}

// Wire admin tab click to initialize admin panel (lazy load)
document.addEventListener('DOMContentLoaded', () => {
    const adminTab = document.getElementById('admin-dash-tab');
    if (adminTab) {
        let adminPanelInitialized = false;
        adminTab.addEventListener('click', () => {
            if (!adminPanelInitialized) {
                adminPanelInitialized = true;
                initAdminPanel();
            }
        });
    }
});


// ==========================================
// MENG TO TELEMETRY & CARD SPOTLIGHT SYSTEM
// ==========================================
function initLiveTelemetry() {
    const clockEl = document.getElementById('live-danang-clock');
    if (!clockEl) return;

    function updateClock() {
        const now = new Date();
        const options = { timeZone: 'Asia/Ho_Chi_Minh', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        clockEl.textContent = `${now.toLocaleTimeString('en-GB', options)} ICT`;
    }
    updateClock();
    setInterval(updateClock, 1000);
}

function initCardSpotlights() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.lookbook-card, .spectrum-col');
    cards.forEach(card => {
        let ticking = false;
        let rect = null;

        card.addEventListener('pointerenter', () => {
            rect = card.getBoundingClientRect();
        }, { passive: true });

        card.addEventListener('pointermove', (e) => {
            if (!rect) rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (!ticking) {
                requestAnimationFrame(() => {
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        card.addEventListener('pointerleave', () => {
            rect = null;
        }, { passive: true });
    });
}


// ==========================================
// INTERACTIVE META BUFF TERMINAL (DICHVUMXH.VN)
// ==========================================
function initSmmTerminal() {
    const terminal = document.getElementById('smm-terminal');
    if (!terminal) return;

    const platformTabs = document.querySelectorAll('.smm-tab-btn');
    const categoryGrid = document.getElementById('smm-category-grid');
    const serviceSelect = document.getElementById('smm-service-select');
    const noteContainer = document.getElementById('smm-note-container');
    const serviceDesc = document.getElementById('smm-service-desc');
    const linkInput = document.getElementById('smm-link-input');
    const uidBtn = document.getElementById('smm-uid-btn');
    const uidResult = document.getElementById('smm-uid-result');
    const qtyInput = document.getElementById('smm-qty-input');
    const qtyWarning = document.getElementById('smm-qty-warning');
    const qtyChips = document.querySelectorAll('.smm-chip');
    const minMaxLabel = document.getElementById('smm-minmax-label');
    const rateLabel = document.getElementById('smm-rate-label');
    const rate1kBadge = document.getElementById('smm-rate-1k-badge');
    const rateUnitBadge = document.getElementById('smm-rate-unit-badge');
    const totalPriceEl = document.getElementById('smm-total-price');
    const userBalanceEl = document.getElementById('smm-user-balance');
    const topUpBtn = document.getElementById('smm-topup-btn');
    const submitAutoBtn = document.getElementById('smm-submit-auto');
    const trackInput = document.getElementById('smm-track-input');
    const trackBtn = document.getElementById('smm-track-btn');
    const trackResult = document.getElementById('smm-track-result');
    const matrixPills = document.querySelectorAll('.matrix-pill');

    function formatVND(num) {
        return new Intl.NumberFormat('vi-VN').format(Math.round(num));
    }

    // Update wallet balance display
    function updateWalletUI() {
        const userJson = localStorage.getItem('teemous_user');
        if (userJson && userBalanceEl) {
            try {
                const user = JSON.parse(userJson);
                userBalanceEl.textContent = `${formatVND(user.balance || 0)} VNĐ`;
            } catch(e) {
                userBalanceEl.textContent = '0 VNĐ';
            }
        } else if (userBalanceEl) {
            userBalanceEl.textContent = 'Chưa đăng nhập';
        }
    }
    updateWalletUI();

    // Top up button click
    if (topUpBtn) {
        topUpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const token = localStorage.getItem('teemous_jwt');
            if (!token) {
                const overlay = document.getElementById('auth-modal-overlay');
                if (overlay) overlay.classList.add('active');
                return;
            }
            const topupOverlay = document.getElementById('topup-modal-overlay');
            if (topupOverlay) {
                topupOverlay.classList.add('active');
            } else if (window.openDashboard) {
                window.openDashboard();
            }
        });
    }

    // Detailed service classification (Splitting sub profile vs group members vs likes)
    function classify(s) {
        const name = (s.name || '').toLowerCase();
        const cat = (s.category || '').toLowerCase();

        let platform = 'other';
        if (name.includes('facebook') || cat.includes('facebook')) platform = 'facebook';
        else if (name.includes('instagram') || cat.includes('instagram')) platform = 'instagram';
        else if (name.includes('tiktok') || cat.includes('tiktok')) platform = 'tiktok';
        else if (name.includes('threads') || cat.includes('threads')) platform = 'threads';
        else if (name.includes('youtube') || cat.includes('youtube')) platform = 'youtube';
        else if (name.includes('twitter') || cat.includes('twitter')) platform = 'twitter';
        else if (name.includes('shopee') || cat.includes('shopee')) platform = 'shopee';

        let cat_id = 'other';
        if (platform === 'facebook') {
            if (name.includes('thành viên') || name.includes('nhóm') || name.includes('group')) {
                cat_id = 'group_member';
            } else if (name.includes('theo dõi') || name.includes('follow') || name.includes('sub ')) {
                cat_id = 'follow_profile';
            } else if (name.includes('mắt') || name.includes('livestream')) {
                cat_id = 'live_stream';
            } else if (name.includes('chia sẻ') || name.includes('share')) {
                cat_id = 'share_post';
            } else if (name.includes('xem video') || name.includes('lượt xem') || name.includes('view') || name.includes('reel') || name.includes('story')) {
                cat_id = 'view_video';
            } else {
                cat_id = 'like_post';
            }
        } else if (platform === 'instagram') {
            if (name.includes('theo dõi') || name.includes('follow')) cat_id = 'follow_profile';
            else if (name.includes('like') || name.includes('thích bài') || name.includes('tim')) cat_id = 'like_post';
            else cat_id = 'view_video';
        } else if (platform === 'tiktok') {
            if (name.includes('theo dõi') || name.includes('follow')) cat_id = 'follow_profile';
            else if (name.includes('like') || name.includes('tim')) cat_id = 'like_post';
            else if (name.includes('chia sẻ') || name.includes('share')) cat_id = 'share_post';
            else cat_id = 'view_video';
        } else {
            cat_id = 'all';
        }

        return { platform, cat_id };
    }

    // Default curated packages with 100% exact original prices and original notes
    let allServices = [
        { service: '317835', name: 'Facebook - SV8: Sub Tây, tốc độ 20k/ngày, BH 7 ngày', platform: 'facebook', category: 'follow_profile', rate: 18.8, min: 200, max: 1000000, description: '- Hỗ trợ sub trang cá nhân và sub fanpage\n- Tài nguyên phần lớn là sub Tây hạn chế tụt\n- Bảo hành 7 ngày' },
        { service: '317844', name: 'Facebook - SV3: Sub Việt Nam, hạn chế tụt', platform: 'facebook', category: 'follow_profile', rate: 48.5, min: 500, max: 150000, description: '- Hỗ trợ sub cá nhân và sub fanpage\n- Tài nguyên phần lớn là beta hạn chế tụt' },
        { service: '317845', name: 'Facebook - SV5: Sub Việt ổn định', platform: 'facebook', category: 'follow_profile', rate: 23.4, min: 500, max: 2000, description: '- Phần lớn là sub beta, giới hạn 150k/1 UID' },
        { service: '5106', name: 'Facebook - SV2: Tăng thành viên nhóm (Group Member)', platform: 'facebook', category: 'group_member', rate: 40.3, min: 500, max: 200000, description: '- Tăng member cho nhóm công khai và nhóm kín\n- Thành viên tự nhiên, không bảo hành' },
        { service: '7596', name: 'Facebook - SV4: Tăng thành viên nhóm giá rẻ', platform: 'facebook', category: 'group_member', rate: 23.6, min: 100, max: 10000, description: '- Tăng member nhóm số lượng nhỏ\n- Tốc độ nhanh' },
        { service: '3566', name: 'Facebook - SV1: Like bài viết tốc độ nhanh', platform: 'facebook', category: 'like_post', rate: 16.4, min: 50, max: 10000, description: '- Không hiển thị người like.\n- Hiện tại không tụt, không cam kết bảo hành\n- Lượt cảm xúc chỉ chạy cho bài gốc, không hỗ trợ bài chia sẻ.' },
        { service: '4822', name: 'Facebook - SV2: Like bài viết tốc độ cao', platform: 'facebook', category: 'like_post', rate: 19.2, min: 100, max: 100000, description: '- Tốc độ 10k - 50k / ngày\n- Không bảo hành' },
        { service: '134713', name: 'Facebook - SV4: Mắt xem Livestream trực tiếp', platform: 'facebook', category: 'live_stream', rate: 3.1, min: 50, max: 100000, description: '- Duy trì mắt xem live ổn định trong suốt buổi phát' },
        { service: '4038', name: 'Facebook - SV1: Chia sẻ bài viết (Share)', platform: 'facebook', category: 'share_post', rate: 480.2, min: 10, max: 50000, description: '- Share bài viết lên tường cá nhân\n- Tăng độ phủ thương hiệu' },
        { service: '410018', name: 'Instagram - SV9: Follow giá tốt', platform: 'instagram', category: 'follow_profile', rate: 96.7, min: 500, max: 5000, description: '- Có tỉ lệ tụt cao và không bảo hành.' },
        { service: '3104', name: 'Instagram - SV1: Follow chất lượng cao', platform: 'instagram', category: 'follow_profile', rate: 382.8, min: 100, max: 10000, description: '- Bảo hành 7 ngày\n- Follow chất lượng ổn định' },
        { service: '3103', name: 'Instagram - SV1: Like bài viết hình ảnh / Reels', platform: 'instagram', category: 'like_post', rate: 153.1, min: 100, max: 50000, description: '- Lên like nhanh sau 5 - 15 phút' },
        { service: '3113', name: 'TikTok - SV1: Follow kênh cá nhân', platform: 'tiktok', category: 'follow_profile', rate: 71.9, min: 100, max: 1000, description: '- Không dồn đơn và không mua nhiều server cùng lúc.' },
        { service: '62382', name: 'TikTok - SV4: Thả tim / Like video', platform: 'tiktok', category: 'like_post', rate: 27.8, min: 100, max: 500, description: '- Tăng tim nhanh, tốc độ ổn định' },
        { service: '3114', name: 'TikTok - SV1: Lượt xem (View) video', platform: 'tiktok', category: 'view_video', rate: 4.1, min: 1000, max: 1000000, description: '- Lên view siêu tốc sau 5 phút' },
        { service: '257088', name: 'Threads - SV1: Like bài viết Threads', platform: 'threads', category: 'all', rate: 348.0, min: 100, max: 20000, description: '- Thả tim bài viết Threads tự nhiên' }
    ];

    let currentPlatform = 'facebook';
    let currentCategory = 'follow_profile';
    let selectedServiceId = '317844';

    // Granular platform category map (Separate Sub Profile vs Group Member vs Like)
    const platformCategoryMap = {
        facebook: [
            { id: 'follow_profile', name: 'Follow Trang Cá Nhân', icon: '👤' },
            { id: 'group_member', name: 'Thành Viên Nhóm (Group)', icon: '👥' },
            { id: 'like_post', name: 'Like Bài Viết', icon: '👍' },
            { id: 'share_post', name: 'Chia Sẻ Bài Viết', icon: '🔄' },
            { id: 'live_stream', name: 'Mắt Livestream', icon: '👁️' },
            { id: 'view_video', name: 'Lượt Xem Video / Reels', icon: '▶️' }
        ],
        instagram: [
            { id: 'follow_profile', name: 'Follow Instagram', icon: '👤' },
            { id: 'like_post', name: 'Like Bài Viết / Reels', icon: '❤️' },
            { id: 'view_video', name: 'Lượt Xem Video / Story', icon: '▶️' }
        ],
        tiktok: [
            { id: 'follow_profile', name: 'Follow Kênh TikTok', icon: '👤' },
            { id: 'like_post', name: 'Thả Tim / Like Video', icon: '❤️' },
            { id: 'view_video', name: 'Lượt Xem Video', icon: '▶️' },
            { id: 'share_post', name: 'Chia Sẻ Video', icon: '🔄' }
        ],
        threads: [
            { id: 'all', name: 'Like Bài Viết Threads', icon: '❤️' }
        ],
        other: [
            { id: 'all', name: 'Tất Cả Dịch Vụ Khác', icon: '⚡' }
        ]
    };

    // Load full live services from proxy API with exact shop min/max and descriptions
    fetch('/api/smm/services')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                allServices = data.map(s => {
                    const c = classify(s);
                    const unitVnd = parseFloat(s.rate_vnd_unit) || ((parseFloat(s.rate) * 26000 * 1.20) / 1000) || 1;
                    const finalRate = Math.round(unitVnd * 10) / 10;
                    return {
                        service: String(s.service),
                        name: s.name,
                        platform: c.platform,
                        category: c.cat_id,
                        rate: finalRate,
                        min: parseInt(s.min) || 50,
                        max: parseInt(s.max) || 1000000,
                        description: s.description || '- Gói dịch vụ tự động xử lý qua hệ thống.'
                    };
                });
                renderCategories();
            }
        })
        .catch(() => console.log('Using default curated SMM packages.'));

    function renderCategories() {
        if (!categoryGrid) return;
        const cats = platformCategoryMap[currentPlatform] || platformCategoryMap.facebook;
        categoryGrid.innerHTML = '';

        if (!cats.some(c => c.id === currentCategory)) {
            currentCategory = cats[0].id;
        }

        cats.forEach(c => {
            const pill = document.createElement('div');
            pill.className = `smm-cat-pill ${c.id === currentCategory ? 'active' : ''}`;
            pill.setAttribute('data-cid', c.id);
            pill.innerHTML = `<span class="smm-cat-icon">${c.icon}</span><span>${c.name}</span>`;
            
            pill.addEventListener('click', () => {
                terminal.querySelectorAll('.smm-cat-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentCategory = c.id;
                populateDropdown();
            });

            categoryGrid.appendChild(pill);
        });

        populateDropdown();
    }

    function populateDropdown() {
        if (!serviceSelect) return;
        
        let filtered = allServices.filter(s => {
            const platMatch = (currentPlatform === 'other') || (s.platform === currentPlatform);
            const catMatch = (currentCategory === 'all') || (s.category === currentCategory);
            return platMatch && catMatch;
        });

        if (filtered.length === 0) {
            filtered = allServices.filter(s => s.platform === currentPlatform);
        }

        serviceSelect.innerHTML = '';
        filtered.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.service;
            opt.textContent = `${s.name} [${s.rate.toLocaleString('vi-VN')} đ/1 • ${formatVND(s.rate * 1000)} đ/1k]`;
            serviceSelect.appendChild(opt);
        });

        const exists = filtered.some(s => s.service === selectedServiceId);
        if (exists) {
            serviceSelect.value = selectedServiceId;
        } else if (filtered.length > 0) {
            selectedServiceId = filtered[0].service;
            serviceSelect.value = selectedServiceId;
        }

        updateCalculation();
    }

    function getSelectedService() {
        const sid = serviceSelect ? serviceSelect.value : selectedServiceId;
        return allServices.find(s => s.service === sid) || allServices[0];
    }

    function updateCalculation() {
        const svc = getSelectedService();
        if (!svc) return;

        selectedServiceId = svc.service;

        // Display exact shop description in note container
        if (noteContainer && serviceDesc) {
            if (svc.description && svc.description.trim()) {
                noteContainer.style.display = 'block';
                serviceDesc.textContent = svc.description;
            } else {
                noteContainer.style.display = 'none';
            }
        }

        // Sync matrix pills highlight
        matrixPills.forEach(pill => {
            if (pill.getAttribute('data-sid') === selectedServiceId) {
                pill.classList.add('selected');
            } else {
                pill.classList.remove('selected');
            }
        });

        // Min/Max strictly in QUANTITY units set by the shop
        if (minMaxLabel) {
            minMaxLabel.innerHTML = `Số lượng: <strong style="color: var(--cyan-laser);">${svc.min.toLocaleString('vi-VN')}</strong> &bull; <strong style="color: var(--cyan-laser);">${svc.max.toLocaleString('vi-VN')}</strong>`;
        }

        // Unit labels strictly /1
        if (rateLabel) {
            rateLabel.textContent = `Đơn giá: ${svc.rate.toLocaleString('vi-VN')} VNĐ / 1 (${formatVND(svc.rate * 1000)} VNĐ / 1.000)`;
        }
        if (rateUnitBadge) {
            rateUnitBadge.textContent = `${svc.rate.toLocaleString('vi-VN')} ₫ / 1`;
        }
        if (rate1kBadge) {
            rate1kBadge.textContent = `${formatVND(svc.rate * 1000)} ₫ / 1.000`;
        }

        let qty = parseInt(qtyInput ? qtyInput.value : 0) || 0;
        
        if (qtyWarning) {
            if (qty > 0 && qty < svc.min) {
                qtyWarning.style.display = 'block';
                qtyWarning.textContent = `⚠ Số lượng tối thiểu cho gói này là ${svc.min.toLocaleString('vi-VN')}.`;
            } else if (qty > svc.max) {
                qtyWarning.style.display = 'block';
                qtyWarning.textContent = `⚠ Số lượng tối đa cho gói này là ${svc.max.toLocaleString('vi-VN')}.`;
            } else {
                qtyWarning.style.display = 'none';
            }
        }

        const totalCost = Math.round(qty * svc.rate);
        if (totalPriceEl) {
            totalPriceEl.textContent = `${formatVND(totalCost)} VNĐ`;
        }
    }

    // Platform Tab clicks
    platformTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            platformTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentPlatform = tab.getAttribute('data-platform') || 'facebook';
            renderCategories();
        });
    });

    // Quick Matrix Pills Click
    matrixPills.forEach(pill => {
        pill.addEventListener('click', () => {
            matrixPills.forEach(p => p.classList.remove('selected'));
            pill.classList.add('selected');
            
            const sid = pill.getAttribute('data-sid');
            const plat = pill.getAttribute('data-plat');
            const cat = pill.getAttribute('data-cat') || 'follow_profile';
            
            const tab = document.querySelector(`.smm-tab-btn[data-platform="${plat}"]`);
            if (tab) {
                platformTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentPlatform = plat;
                currentCategory = cat;
            }
            
            selectedServiceId = sid;
            renderCategories();
            if (serviceSelect) {
                serviceSelect.value = sid;
                updateCalculation();
            }
        });
    });

    if (serviceSelect) {
        serviceSelect.addEventListener('change', () => {
            selectedServiceId = serviceSelect.value;
            updateCalculation();
        });
    }
    if (qtyInput) {
        qtyInput.addEventListener('input', updateCalculation);
    }

    // Quick Qty Chips
    qtyChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const val = parseInt(chip.getAttribute('data-qty'));
            if (val && qtyInput) {
                qtyInput.value = val;
                updateCalculation();
            }
        });
    });

    // Auto UID lookup
    if (uidBtn && linkInput) {
        uidBtn.addEventListener('click', async () => {
            const link = linkInput.value.trim();
            if (!link) {
                alert('Vui lòng dán đường link trang cá nhân hoặc bài viết cần lấy UID!');
                return;
            }

            uidBtn.disabled = true;
            uidBtn.textContent = 'Đang quét UID...';
            if (uidResult) uidResult.textContent = '';

            try {
                                const res = await fetch('/api/smm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'get_numeric_uid', link: link })
                });
                const data = await res.json();
                if (data && data.id) {
                    linkInput.value = data.link || `https://facebook.com/${data.id}`;
                    if (uidResult) {
                        uidResult.innerHTML = `<span style="color: #10b981;">&check; Quét UID thành công: <strong>${data.id}</strong> (${data.name || 'Tài khoản'}) &bull; Đã tự động chuẩn hóa link đơn!</span>`;
                    }
                } else {
                    if (uidResult) {
                        uidResult.innerHTML = `<span style="color: #f59e0b;">&excl; Giữ nguyên link gốc (Hệ thống vẫn nhận diện link trực tiếp).</span>`;
                    }
                }
            } catch (e) {
                if (uidResult) {
                    uidResult.innerHTML = `<span style="color: #f59e0b;">&excl; Hệ thống tự động xử lý link gốc khi chạy đơn.</span>`;
                }
            } finally {
                uidBtn.disabled = false;
                uidBtn.textContent = '⚡ Quét UID';
            }
        });
    }

    // Direct Wallet Payment & Order Submission
    if (submitAutoBtn) {
        submitAutoBtn.addEventListener('click', async () => {
            const svc = getSelectedService();
            let link = linkInput ? linkInput.value.trim() : '';
            if (/^\d+$/.test(link)) {
                link = `https://facebook.com/${link}`;
                if (linkInput) linkInput.value = link;
            }
            const qty = parseInt(qtyInput ? qtyInput.value : 0) || 0;

            if (!link) {
                alert('Vui lòng dán link hoặc UID cần tăng tương tác!');
                if (linkInput) linkInput.focus();
                return;
            }

            // 1. Enforce shop quantity min / max
            if (svc) {
                if (qty < svc.min) {
                    alert(`Số lượng bạn chọn (${qty.toLocaleString('vi-VN')}) nhỏ hơn mức tối thiểu!\n\nShop quy định số lượng tối thiểu cho gói này là ${svc.min.toLocaleString('vi-VN')}.`);
                    if (qtyInput) qtyInput.focus();
                    return;
                }
                if (qty > svc.max) {
                    alert(`Số lượng bạn chọn (${qty.toLocaleString('vi-VN')}) vượt quá mức tối đa!\n\nShop quy định số lượng tối đa cho gói này là ${svc.max.toLocaleString('vi-VN')}.`);
                    if (qtyInput) qtyInput.focus();
                    return;
                }
            }

            const totalCost = Math.round(qty * (svc ? svc.rate : 0));

            // 2. Check if user is logged in
            const token = localStorage.getItem('teemous_jwt');
            const userJson = localStorage.getItem('teemous_user');

            if (!token || !userJson) {
                alert('Vui lòng Đăng nhập tài khoản Teemous để tạo đơn và thanh toán trực tiếp từ số dư ví!');
                const authOverlay = document.getElementById('auth-modal-overlay');
                if (authOverlay) authOverlay.classList.add('active');
                return;
            }

            let user;
            try {
                user = JSON.parse(userJson);
            } catch(e) {
                alert('Lỗi dữ liệu người dùng. Vui lòng đăng nhập lại!');
                return;
            }

            const currentBalance = parseFloat(user.balance || 0);

            // 3. Check wallet balance
            if (currentBalance < totalCost) {
                const missing = totalCost - currentBalance;
                alert(`Số dư ví của bạn không đủ!\n\n- Cần thanh toán: ${formatVND(totalCost)} VNĐ\n- Số dư hiện tại: ${formatVND(currentBalance)} VNĐ\n- Còn thiếu: ${formatVND(missing)} VNĐ\n\nVui lòng Nạp thêm tiền vào ví qua VietQR để tiếp tục tạo đơn.`);
                const topupOverlay = document.getElementById('topup-modal-overlay');
                if (topupOverlay) topupOverlay.classList.add('active');
                return;
            }

            // 4. Confirm transaction with user
            const confirmMsg = `XÁC NHẬN THANH TOÁN TỪ SỐ DƯ VÍ?\n\n- Dịch vụ: ${svc.name}\n- Đơn giá: ${svc.rate} đ / 1\n- Số lượng: ${qty.toLocaleString('vi-VN')}\n- Link/UID: ${link}\n- Số tiền trừ ví: ${formatVND(totalCost)} VNĐ\n- Số dư sau khi trừ: ${formatVND(currentBalance - totalCost)} VNĐ`;

            if (!confirm(confirmMsg)) return;

            submitAutoBtn.disabled = true;
            submitAutoBtn.textContent = 'Đang xử lý trừ ví & đẩy đơn...';

            try {
                // Call API SMM
                const res = await fetch('/api/smm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'add',
                        service: svc ? svc.service : '317835',
                        link: link,
                        quantity: qty
                    })
                });
                const data = await res.json();

                // Check API result
                if (data && data.order) {
                    // Deduct wallet balance
                    user.balance = currentBalance - totalCost;
                    localStorage.setItem('teemous_user', JSON.stringify(user));

                    // Save order to history
                    const smmOrders = JSON.parse(localStorage.getItem('teemous_smm_orders') || '[]');
                    smmOrders.unshift({
                        order_id: data.order,
                        service_id: svc.service,
                        service_name: svc.name,
                        quantity: qty,
                        link: link,
                        cost: totalCost,
                        date: new Date().toISOString(),
                        status: 'Running'
                    });
                    localStorage.setItem('teemous_smm_orders', JSON.stringify(smmOrders));

                    // Update UI
                    updateWalletUI();

                    alert(`🎉 TẠO ĐƠN HÀNG THÀNH CÔNG!\n\n- Mã đơn hàng (Order ID): #${data.order}\n- Đã trừ ví: ${formatVND(totalCost)} VNĐ\n- Số dư khả dụng: ${formatVND(user.balance)} VNĐ\n\nHệ thống đã khớp lệnh và đang xử lý tăng tương tác cho bạn!\nBạn có thể nhập mã #${data.order} vào ô bên dưới để theo dõi tiến độ.`);
                    if (trackInput) trackInput.value = data.order;
                } else {
                    // In case upstream API returns error or needs admin balance
                    alert(`Thông báo từ máy chủ: ${data.error || 'Hệ thống đang bận. Số dư của bạn chưa bị trừ, vui lòng thử lại sau ít phút!'}`);
                }
            } catch (e) {
                alert(`Lỗi kết nối máy chủ: ${e.message}. Số dư ví của bạn chưa bị trừ!`);
            } finally {
                submitAutoBtn.disabled = false;
                submitAutoBtn.textContent = '⚡ XÁC NHẬN & TẠO ĐƠN NGAY (TRỪ VÍ) →';
            }
        });
    }

    // Track Order Progress
    if (trackBtn && trackInput) {
        trackBtn.addEventListener('click', async () => {
            const oid = trackInput.value.trim().replace('#', '');
            if (!oid) {
                alert('Vui lòng nhập Mã đơn hàng (Order ID) để tra cứu!');
                return;
            }

            trackBtn.disabled = true;
            trackBtn.textContent = 'Đang kiểm tra...';
            if (trackResult) trackResult.textContent = '';

            try {
                const res = await fetch('/api/smm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'status', order: oid })
                });
                const data = await res.json();
                const info = data[oid] || data;
                if (info && info.status) {
                    if (trackResult) {
                        trackResult.innerHTML = `
                            <div style="padding: 0.75rem; background: rgba(0, 240, 255, 0.08); border-radius: 4px; font-size: 0.85rem; font-family: var(--font-tech);">
                                <div><strong>Đơn hàng #${oid}:</strong> <span style="color: var(--cyan-laser); text-transform: uppercase;">${info.status}</span></div>
                                <div style="color: var(--text-muted); margin-top: 0.25rem;">Số lượng ban đầu: ${info.start_count || 0} &bull; Còn lại: ${info.remains || 0}</div>
                            </div>
                        `;
                    }
                } else {
                    if (trackResult) {
                        trackResult.innerHTML = `<span style="color: #ff8a80; font-size: 0.8rem;">Không tìm thấy thông tin đơn hàng #${oid}. Vui lòng kiểm tra lại mã đơn!</span>`;
                    }
                }
            } catch (e) {
                if (trackResult) {
                    trackResult.innerHTML = `<span style="color: #ff8a80; font-size: 0.8rem;">Lỗi kết nối tra cứu: ${e.message}</span>`;
                }
            } finally {
                trackBtn.disabled = false;
                trackBtn.textContent = 'Tra Cứu';
            }
        });
    }

    renderCategories();
}
