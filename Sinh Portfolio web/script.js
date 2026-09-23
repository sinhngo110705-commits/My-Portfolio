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

    // Critical UI initializations (Immediate)
    runSafe(initThemeToggle, 'ThemeToggle');
    runSafe(initLanguageToggle, 'LanguageToggle');
    runSafe(initMobileMenu, 'MobileMenu');
    runSafe(initScrollAnimations, 'ScrollAnimations');

    // Defer non-critical features to idle time so main thread stays 100% free for FCP/LCP
    const runIdle = (fn, name) => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => runSafe(fn, name), { timeout: 2000 });
        } else {
            setTimeout(() => runSafe(fn, name), 100);
        }
    };

    runIdle(initBackgroundAnimation, 'BackgroundAnimation');
    runIdle(initScrollProgress, 'ScrollProgress');
    runIdle(initCardSpotlights, 'CardSpotlights');
    runIdle(initLiveTelemetry, 'LiveTelemetry');
    runIdle(initHoverEffects, 'HoverEffects');
    runIdle(initServicesDirectory, 'ServicesDirectory');
    runIdle(initSmmTerminal, 'SmmTerminal');
    runIdle(initChatbot, 'Chatbot');
    runIdle(initAuthModal, 'AuthModal');
    runIdle(initDashboard, 'Dashboard');
    runIdle(initTopUpModal, 'TopUpModal');
    runIdle(initPortfolioFilters, 'PortfolioFilters');
    runIdle(initGalleryToggle, 'GalleryToggle');
    runIdle(ensureMobileWidgets, 'EnsureMobileWidgets');
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

            const isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
            if (isMobile) {
                heroTl.from(titleLines, { y: 15, duration: 0.45, stagger: 0.06, ease: 'power2.out' });
            } else {
                heroTl.fromTo(titleLines, 
                    { yPercent: 115 }, 
                    { 
                        yPercent: 0, 
                        duration: 1.1, 
                        stagger: 0.12, 
                        ease: 'power4.out',
                        onComplete: () => {
                            document.querySelectorAll('.mask-wrap').forEach(w => {
                                w.style.overflow = 'visible';
                            });
                        }
                    },
                    "-=0.5"
                );
            }
            if (manifesto) {
                heroTl.from(manifesto, { y: 12, duration: 0.5, ease: 'power2.out' }, "<0.1");
            }
            if (ctas.length > 0) {
                heroTl.fromTo(ctas, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, "<0.15");
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
    // High-Performance Guard: Skip continuous canvas simulation on dashboard & admin pages
    if (window.location.pathname.includes('/user')) return;

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
    if (isCoarse || width < 768) {
        // Touch/Mobile optimization: render static subtle snapshot and skip 60fps rAF loop to save 100% mobile CPU
        drawParticlesAndConnections(document.documentElement.classList.contains('light-mode') || document.body.classList.contains('light-mode'));
        return;
    }
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
        langBtn.setAttribute('aria-label', currentLang === 'vi' ? 'Ngôn ngữ VI - Chuyển sang English' : 'Language EN - Switch to Tiếng Việt');
    });

    // 1. Text elements
    const translatableElements = document.querySelectorAll('[data-en][data-vi]');
    translatableElements.forEach(el => {
        if (el.closest('#root')) return; // DO NOT FIGHT WITH REACT

        // SPECIAL CASE: Login Button (Skip if logged in, ensure ready)
        if (el.id === 'nav-login-btn') {
            el.classList.add('ready');
            if (el.classList.contains('logged-in')) {
                const userJson = localStorage.getItem('teemous_user');
                if (userJson) {
                    try {
                        const user = JSON.parse(userJson);
                        const prefix = currentLang === 'vi' ? 'Chào' : 'Hi';
                        el.innerHTML = prefix + ", " + user.username;
                    } catch(e) {}
                }
                return;
            }
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

    const SESSION_KEY = 'teemous_chat_session';
    const OPEN_KEY = 'teemous_chat_open';

    toggle.addEventListener('click', () => {
        windowEl.classList.toggle('active');
        try {
            sessionStorage.setItem(OPEN_KEY, windowEl.classList.contains('active') ? 'true' : 'false');
        } catch (e) {}
        if (windowEl.classList.contains('active')) {
            inputEl.focus();
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            windowEl.classList.remove('active');
            try {
                sessionStorage.setItem(OPEN_KEY, 'false');
            } catch (e) {}
        });
    }

    // Add reset/clear chat button to chatbot header
    const headerEl = windowEl.querySelector('.chatbot-header');
    if (headerEl && !headerEl.querySelector('.chatbot-clear-btn')) {
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'chatbot-clear-btn';
        clearBtn.innerHTML = '↺';
        clearBtn.title = 'Bắt đầu cuộc trò chuyện mới (Xóa lịch sử)';
        clearBtn.style.cssText = 'background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.15rem; margin-right:0.6rem; transition:color 0.2s, transform 0.2s; padding:0 4px; display:inline-flex; align-items:center;';
        clearBtn.addEventListener('mouseenter', () => { clearBtn.style.color = 'var(--neon-blue)'; clearBtn.style.transform = 'rotate(45deg)'; });
        clearBtn.addEventListener('mouseleave', () => { clearBtn.style.color = 'var(--text-muted)'; clearBtn.style.transform = 'rotate(0deg)'; });
        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            chatHistory.length = 0;
            try { sessionStorage.removeItem(SESSION_KEY); } catch(err) {}
            const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');
            const welcomeText = isEn ? "Hello! I'm Teemous AI. How can I help you today?" : "Xin chào! Tôi là trợ lý ảo Teemous. Tôi có thể giúp gì cho bạn hôm nay?";
            messagesEl.innerHTML = `<div class="message ai-message" data-en="Hello! I'm Teemous AI. How can I help you today?" data-vi="Xin chào! Tôi là trợ lý ảo Teemous. Tôi có thể giúp gì cho bạn hôm nay?">${welcomeText}</div>`;
        });
        if (closeBtn) {
            headerEl.insertBefore(clearBtn, closeBtn);
        } else {
            headerEl.appendChild(clearBtn);
        }
    }

    let isThinking = false;
    const chatHistory = [];

    function saveSession() {
        try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(chatHistory));
        } catch (e) {}
    }

    function restoreSession() {
        try {
            // Clean up any leading whitespace from initial HTML greeting
            messagesEl.querySelectorAll('.message').forEach(m => {
                m.innerHTML = m.innerHTML.trim();
            });

            const raw = sessionStorage.getItem(SESSION_KEY);
            if (raw) {
                const saved = JSON.parse(raw);
                if (Array.isArray(saved) && saved.length > 0) {
                    messagesEl.innerHTML = '';
                    saved.forEach(item => {
                        if (item && item.content) {
                            const sender = item.role === 'assistant' ? 'ai' : 'user';
                            const msg = document.createElement('div');
                            msg.className = `message ${sender}-message`;
                            if (sender === 'ai') {
                                msg.innerHTML = formatAiText(item.content);
                            } else {
                                msg.innerText = (item.content || '').trim();
                            }
                            messagesEl.appendChild(msg);
                            chatHistory.push(item);
                        }
                    });
                    messagesEl.scrollTop = messagesEl.scrollHeight;
                }
            }
            const wasOpen = sessionStorage.getItem(OPEN_KEY);
            if (wasOpen === 'true') {
                windowEl.classList.add('active');
            }
        } catch (e) {}
    }

    restoreSession();

    function formatAiText(text) {
        if (!text) return '';
        let trimmed = text.trim();
        let escaped = trimmed
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        escaped = escaped.replace(/^[\*\-]\s+(.+)$/gm, '• $1');
        escaped = escaped.replace(/\n/g, '<br>');
        return escaped;
    }

    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `message ${sender}-message`;
        if (sender === 'ai') {
            msg.innerHTML = formatAiText(text);
        } else {
            msg.innerText = (text || '').trim();
        }
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        chatHistory.push({ role: sender === 'ai' ? 'assistant' : 'user', content: (text || '').trim() });
        if (chatHistory.length > 20) chatHistory.shift();
        saveSession();
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
        const raw = userText || '';
        const clean = removeAccents(raw);

        // Math calculation check
        const mathMatch = raw.match(/^\s*(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)\s*\??\s*$/);
        if (mathMatch) {
            const a = parseFloat(mathMatch[1]);
            const op = mathMatch[2];
            const b = parseFloat(mathMatch[3]);
            let res = 0;
            if (op === '+') res = a + b;
            else if (op === '-') res = a - b;
            else if (op === '*') res = a * b;
            else if (op === '/' && b !== 0) res = a / b;
            return lang === 'vi'
                ? `Kết quả phép tính ${a} ${op} ${b} = ${res} nhé! Bạn cần mình giải đáp thêm thông tin gì nè?`
                : `The result of ${a} ${op} ${b} is ${res}! How else can I assist you today?`;
        }

        // Greetings
        if (/^(chao|xin chao|hi|hello|helo|alo|hey|good morning|good evening)\b/i.test(clean) || clean === 'chao' || clean === 'hi') {
            return lang === 'vi'
                ? "Xin chào bạn! Mình là Teemous AI. Rất vui được gặp bạn! Hôm nay mình có thể hỗ trợ bạn tư vấn nhận suất làm Portfolio 0đ, khám phá Portfolio Hub hay dịch vụ tăng trưởng MXH SMM?"
                : "Hello! I am Teemous AI. Delighted to meet you! How can I assist you today with portfolio creation, Portfolio Hub, or social media growth?";
        }

        // Who is AI
        if (/\b(ban la ai|who are you|tro ly|ten gi|gioi thieu ban than)\b/i.test(clean)) {
            return lang === 'vi'
                ? "Mình là Teemous AI, trợ lý số thông minh của Teemous Digital Lab do Ngô Quang Sinh sáng lập. Mình chuyên hỗ trợ tư vấn làm Portfolio cá nhân chuẩn quốc tế, tra cứu thông tin hồ sơ tài năng Portfolio Hub và cung cấp các dịch vụ tăng trưởng mạng xã hội uy tín!"
                : "I am Teemous AI, the digital assistant for Teemous Digital Lab founded by Ngo Quang Sinh. I assist with portfolio incubation, exploring top dossiers in Portfolio Hub, and verified social media growth services.";
        }

        // Personnel: Thuy Duong (#01) & Algorithms
        if (/\b(thuy duong|tran thi thuy duong|icpc|dijkstra|thuat toan|shecodes)\b/i.test(clean)) {
            return lang === "vi"
                ? "Trần Thị Thùy Dương (#01 - 96.0 điểm, Tier S+ Apex) là tài năng Khoa học Máy tính tại VKU (GPA 3.61/4.0), cựu chuyên Tin Quốc Học Huế (9.3/10), giải ICPC Quốc gia và Top 6 SheCodes. Chuyên sâu thuật toán, C++, Java, Full-Stack và Flutter Mobile!"
                : "Tran Thi Thuy Duong (#01 - 96.0 pts, Tier S+ Apex) is a top CS talent at VKU (3.61 GPA, National ICPC, SheCodes Top 6). Specialized in algorithms, Full-Stack Web and Flutter!";
        }

        // Personnel: Thai Trung (#02) & Backend
        if (/\b(thai trung|le thai trung|backend|postman|intellij)\b/i.test(clean)) {
            return lang === "vi"
                ? "Lê Thái Trung (#02 - 90.5 điểm, Tier S Professional) là kỹ sư Kỹ nghệ Phần mềm tại ĐH Duy Tân, chuyên sâu Backend APIs, IntelliJ IDEA, Postman và Linux/Git."
                : "Le Thai Trung (#02 - 90.5 pts, Tier S Professional) is a Software Engineering student at DTU specialized in Backend APIs, RESTful services, and Linux systems.";
        }

        // Personnel: Quang Sinh (#03) & Founder
        if (/\b(quang sinh|ngo quang sinh|founder|admin)\b/i.test(clean)) {
            return lang === "vi"
                ? "Ngô Quang Sinh (#03 - 88.0 điểm, Tier A+ Impressive) là Nhà sáng lập Teemous Digital Lab, sinh viên Digital Marketing tại ĐH Duy Tân. Chuyên kiến trúc Web, tự động hóa AI Workflows, Google AppsScript và phát triển hệ sinh thái số. Liên hệ Sinh qua FB: facebook.com/quang.sinh.5492 hoặc Zalo: 0797747297 nhé!"
                : "Ngo Quang Sinh (#03 - 88.0 pts, Tier A+ Impressive) is the Founder of Teemous Digital Lab. Specialized in Web architecture, AI workflows, and system development. Reach out on Facebook: facebook.com/quang.sinh.5492 or Zalo: 0797747297!";
        }

        // Personnel: Bao Han (#04) & HR
        if (/\b(bao han|bui luu bao han|nhan su|hr|notion)\b/i.test(clean)) {
            return lang === "vi"
                ? "Bùi Lưu Bảo Hân (#04 - 84.0 điểm, Tier A Standard) là sinh viên Kinh doanh Quốc tế tại ĐH Duy Tân, có thế mạnh về Quản trị Nhân sự (HR), vận hành cộng đồng thanh niên và quản trị dữ liệu với Notion & Google Sheets."
                : "Bui Luu Bao Han (#04 - 84.0 pts, Tier A Standard) studies International Business at DTU, specialized in HR operations and community coordination.";
        }

        // Personnel: Quang Tuan (#05) & Design
        if (/\b(quang tuan|vuong quang tuan|capcut|canva|fb ads)\b/i.test(clean)) {
            return lang === "vi"
                ? "Vương Quang Tuấn (#05 - 80.5 điểm, Tier A Standard) là nhân sự Sáng tạo Nội dung năng động, chuyên thiết kế đồ họa Canva, dựng video ngắn CapCut, quản trị Fanpage và chạy Facebook Ads."
                : "Vuong Quang Tuan (#05 - 80.5 pts, Tier A Standard) is a Content Creator specialized in Canva graphic design, CapCut video editing, and social media ads.";
        }

        // Pricing & 0đ Grant
        if (/\b(bang gia|chi phi|bao nhieu|bao gia|0d|mien phi|free|cost|price|goi khoi tao)\b/i.test(clean) || (/\bgia\b/i.test(clean) && !/\b(tham gia|danh gia|quoc gia|tac gia|chuyen gia|giai thuat|giai thich)\b/i.test(clean))) {
            return lang === "vi"
                ? "Hiện tại gói Khởi Tạo Portfolio Cơ Bản đang được TÀI TRỢ 100% SUẤT 0Đ (giá gốc 49k) cho người đăng ký sớm! Gói Nâng Cao (Bespoke VIP) hiện đang tạm khóa để remake phiên bản mới. Bạn hãy vào mục SERVICES & SHOP để nhận suất 0đ ngay nha!"
                : "The Basic Portfolio incubation package is currently 100% FREE (0 VND Pioneer Grant)! The Bespoke VIP tier is temporarily locked for remake. Visit the Services & Shop page to claim your 0 VND grant!";
        }

        // Portfolio Hub & Showcases
        if (/\b(portfolio hub|hub|mau ho so|mau portfolio|xep hang|showcase|danh ba)\b/i.test(clean)) {
            return lang === "vi"
                ? "Portfolio Hub xếp hạng hồ sơ công tâm dựa trên giá trị thực tế: S+ Apex (>=95.0 - Thùy Dương), S Professional (90.0-94.9 - Thái Trung), A+ Impressive (85.0-89.9 - Quang Sinh), A Standard (80.0-84.9 - Bảo Hân, Quang Tuấn). Bấm mục 'Portfolio Hub' trên menu để xem nhé!"
                : "Portfolio Hub benchmarks dossiers objectively: S+ Apex (Thuy Duong), S Pro (Thai Trung), A+ Impressive (Quang Sinh), A Standard (Bao Han, Quang Tuan). Check the Portfolio Hub tab on the menu!";
        }

        // SMM / Social Growth
        if (/\b(smm|mang xa hoi|buff|follow|like|tang like|tang follow|view tiktok|sub fb|vietqr)\b/i.test(clean)) {
            return lang === "vi"
                ? "Hệ thống SMM của Teemous Digital hỗ trợ tăng tương tác, like, follow, view cho Facebook, Instagram, Threads, TikTok. Tự động chuyển link sang UID, bảo mật 100% không cần mật khẩu và nạp tiền tự động qua VietQR!"
                : "Our SMM terminal provides high-speed engagement (likes, followers, views) across Meta & TikTok platforms. 100% account safety and instant auto-delivery!";
        }

        // AOV Shop
        if (/\b(lien quan|aov|shop acc|mua acc|nick|skin)\b/i.test(clean)) {
            return lang === "vi"
                ? "Cửa hàng Liên Quân hiện đang tạm ngưng hoạt động để bảo trì hệ thống máy chủ và nâng cấp quy trình giao dịch bảo mật. Bạn vui lòng quay lại sau nhé!"
                : "The Arena of Valor shop is currently undergoing system maintenance for server security upgrades.";
        }

        // Contact Admin
        if (/\b(lien he|contact|zalo|email|so dien thoai|sdt|inbox)\b/i.test(clean)) {
            return lang === "vi"
                ? "Bạn có thể liên hệ trực tiếp với Founder Quang Sinh qua Facebook: facebook.com/quang.sinh.5492, Zalo: 0797747297 hoặc email: teemous.contact@gmail.com nha!"
                : "You can reach out directly to founder Quang Sinh on Facebook: facebook.com/quang.sinh.5492 or Zalo: 0797747297!";
        }

        // Services Overview
        if (/\b(dich vu|services|lam duoc gi|ho tro gi|lam gi)\b/i.test(clean)) {
            return lang === "vi"
                ? "Teemous Digital cung cấp các dịch vụ: Khởi tạo Portfolio cá nhân (đang có suất tài trợ 0đ), Dịch vụ tăng trưởng Mạng Xã Hội SMM (Facebook, TikTok, Instagram) và Tự động hóa công cụ AI. Bạn cần mình tư vấn mục nào nhất?"
                : "Teemous Digital offers: Personal Portfolio Incubation (with 100% 0 VND Grant), SMM Social Growth Services (Meta, TikTok), and AI automation.";
        }

        // Intelligent Default
        return lang === "vi"
            ? "Chào bạn! Mình là Teemous AI, trợ lý số của Teemous Digital Lab (Founder: Ngô Quang Sinh). Mình có thể hỗ trợ bạn:\n• Đăng ký nhận suất tài trợ 100% Khởi tạo Portfolio cá nhân 0đ (giá gốc 49k)\n• Tra cứu hồ sơ tài năng thực chiến tại Portfolio Hub\n• Tư vấn dịch vụ tăng trưởng mạng xã hội SMM (Facebook, TikTok, Instagram)\n• Kết nối trực tiếp với Founder Quang Sinh (FB: facebook.com/quang.sinh.5492 hoặc Zalo: 0797747297).\nBạn cần mình tư vấn chi tiết phần nào nè?"
            : "Hello! I am Teemous AI, assistant to Teemous Digital Lab (Founder: Ngo Quang Sinh). I can help with:\n• Claiming the 100% Free 0 VND Portfolio incubation grant\n• Exploring benchmarked dossiers on Portfolio Hub\n• Meta and TikTok SMM growth services\n• Connecting with founder Quang Sinh (Zalo: 0797747297).";
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

            const systemPrompt = `Bạn là Teemous AI, trợ lý số thông minh độc quyền của Teemous Digital Lab (được sáng lập bởi Ngô Quang Sinh - sinh viên Digital Marketing tại ĐH Duy Tân).
Phong cách trả lời: Thân thiện, chu đáo, thông minh, chuyên nghiệp và có tính thẩm mỹ cao. Trình bày rõ ràng bằng Markdown (bullet points, **bold** từ khóa quan trọng).
Thông tin nền tảng về Teemous Digital Lab:
- Nhà sáng lập: Ngô Quang Sinh (#03 - Tier A+ Impressive, 88.0 điểm), chuyên gia Web Architecture, tự động hóa AI Workflows, Google AppsScript và hệ sinh thái số. Liên hệ Sinh: FB: facebook.com/quang.sinh.5492, Zalo: 0797747297, Email: teemous.contact@gmail.com.
- Portfolio Hub: Bảng xếp hạng hồ sơ năng lực thực chiến công tâm:
  + #01 Trần Thị Thùy Dương: Tier S+ Apex (96.0 điểm), VKU Khoa học Máy tính (GPA 3.61/4.0), cựu chuyên Tin Quốc Học Huế, giải Quốc Gia ICPC, Top 6 SheCodes. Chuyên sâu thuật toán, C++, Java, Full-Stack Web và Flutter Mobile.
  + #02 Lê Thái Trung: Tier S Professional (90.5 điểm), ĐH Duy Tân Kỹ nghệ Phần mềm, chuyên Backend APIs, IntelliJ IDEA, Postman, Linux/Git.
  + #04 Bùi Lưu Bảo Hân: Tier A Standard (84.0 điểm), ĐH Duy Tân Kinh doanh Quốc tế, HR & Vận hành dữ liệu Notion/Sheets.
  + #05 Vương Quang Tuấn: Tier A Standard (80.5 điểm), Content Creator, Canva, CapCut, Facebook Ads.
- Dịch vụ & Sản phẩm chính:
  1. Khởi tạo Portfolio cá nhân: Đang có chương trình TÀI TRỢ 100% SUẤT 0Đ (giá gốc 49k) gói Basic cho bạn trẻ đăng ký sớm! Gói VIP Bespoke đang tạm khóa để nâng cấp phiên bản mới.
  2. SMM Terminal (Dịch vụ Mạng Xã Hội): Tăng Like, Follow, View, Comment tương tác cho Facebook, Instagram, TikTok, Threads với giá cực tốt từ vài chục đồng, bảo mật 100% không cần mật khẩu, tự động lấy UID, nạp tiền tự động qua VietQR.
  3. Shop Liên Quân: Hiện đang tạm ngưng bảo trì hệ thống.
Hãy trả lời trực tiếp câu hỏi của người dùng bằng Tiếng Việt hoặc ngôn ngữ của người dùng.`;

            const messagesToSend = [
                { role: 'system', content: systemPrompt },
                ...chatHistory.slice(-8).map(m => ({ role: m.role, content: m.content }))
            ];

            // 1. Level 1: Direct client probe to 9Router / Local AI (no ngrok needed on local machine)
            try {
                const localKey = await getLocalAiKey();
                const localBases = [
                    'http://127.0.0.1:20128',
                    'http://localhost:20128',
                    'http://127.0.0.1:1234',
                    'http://localhost:1234',
                    'https://puppylike-macroclimatically-bev.ngrok-free.dev'
                ];
                const headers = {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    ...(localKey ? { 'Authorization': `Bearer ${localKey}` } : {})
                };

                let activeBase = null;
                for (const base of localBases) {
                    if (!base) continue;
                    const ctrl = new AbortController();
                    const tid = setTimeout(() => ctrl.abort(), 2000);
                    try {
                        const check = await fetch(`${base}/v1/models`, { method: 'GET', headers, signal: ctrl.signal });
                        clearTimeout(tid);
                        if (check.ok) { activeBase = base; break; }
                    } catch (e) { clearTimeout(tid); }
                }

                if (activeBase) {
                    const ctrl = new AbortController();
                    const tid = setTimeout(() => ctrl.abort(), 25000);
                    const resp = await fetch(`${activeBase}/v1/chat/completions`, {
                        method: 'POST',
                        signal: ctrl.signal,
                        headers,
                        body: JSON.stringify({
                            model: 'custom-agents-for-chatbot',
                            stream: false,
                            messages: messagesToSend,
                            temperature: 0.7,
                            max_tokens: 600
                        })
                    });
                    clearTimeout(tid);
                    if (resp.ok) {
                        const data = await resp.json();
                        content = data.choices?.[0]?.message?.content || data.choices?.[0]?.text;
                        if (content && content.trim()) {
                            content = content.trim();
                            success = true;
                        }
                    }
                }
            } catch (localErr) {
                // Ignore and proceed to Level 2
            }

            // 2. Level 2: Backend /api/chat (Server & Cloudflare Worker)
            if (!success || !content) {
                try {
                    const ctrl = new AbortController();
                    const tid = setTimeout(() => ctrl.abort(), 20000);

                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ messages: messagesToSend }),
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
                    // Proceed to Level 3
                }
            }

            // 3. Level 3: Fallback to client RAG on network failure or timeout
            if (!success || !content) {
                content = clientRagFallback(userText, activeLang);
            }

            if (indicator) indicator.remove();
            addMessage(content || '', 'ai');

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

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
            e.preventDefault();
            handleSend(e);
        }
    });
}


function initAuthModal() {
    const navLoginBtn = document.getElementById('nav-login-btn');
    if (navLoginBtn) {
        navLoginBtn.classList.add('ready');
        if (!navLoginBtn.innerHTML.trim()) {
            navLoginBtn.innerHTML = navLoginBtn.getAttribute('data-' + currentLang) || (currentLang === 'vi' ? 'Đăng Nhập | Đăng Ký' : 'Login | Sign Up');
        }
    }
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
    const tbody       = document.getElementById("admin-users-tbody");
    const searchInput = document.getElementById("admin-search-input");
    const refreshBtn  = document.getElementById("admin-refresh-btn");
    const editPanel   = document.getElementById("admin-edit-panel");
    const editTitle   = document.getElementById("admin-edit-title");
    const editBalance = document.getElementById("admin-edit-balance");
    const editRole    = document.getElementById("admin-edit-role");
    const saveBalBtn  = document.getElementById("admin-save-balance-btn");
    const saveRoleBtn = document.getElementById("admin-save-role-btn");
    const closeEditBtn= document.getElementById("admin-edit-close-btn");

    const ordersTbody = document.getElementById("admin-smm-orders-tbody") || document.getElementById("user-admin-smm-orders-tbody");
    const refreshOrdersBtn = document.getElementById("admin-refresh-orders-btn") || document.getElementById("user-admin-refresh-orders-btn");
    const pendingBadges = [document.getElementById("admin-pending-badge"), document.getElementById("user-admin-pending-badge")].filter(Boolean);

    let allUsers = [];
    let allOrders = [];
    let activeSmmFilter = "all";
    let selectedUserId = null;

    const getToken = () => localStorage.getItem("teemous_jwt");

    // ── Sub-tab Switcher (Users vs SMM Orders) ─────────────────────────────
    function setupSubTabs(btnUsersId, btnOrdersId, viewUsersId, viewOrdersId) {
        const btnUsers = document.getElementById(btnUsersId);
        const btnOrders = document.getElementById(btnOrdersId);
        const viewUsers = document.getElementById(viewUsersId);
        const viewOrders = document.getElementById(viewOrdersId);

        if (btnUsers && btnOrders) {
            btnUsers.onclick = () => {
                btnUsers.classList.add("active");
                btnOrders.classList.remove("active");
                if (viewUsers) viewUsers.style.display = "block";
                if (viewOrders) viewOrders.style.display = "none";
            };
            btnOrders.onclick = () => {
                btnOrders.classList.add("active");
                btnUsers.classList.remove("active");
                if (viewUsers) viewUsers.style.display = "none";
                if (viewOrders) viewOrders.style.display = "block";
                loadSmmOrders();
            };
        }
    }

    setupSubTabs("admin-subtab-btn-users", "admin-subtab-btn-orders", "admin-subview-users", "admin-subview-orders");
    setupSubTabs("user-admin-subtab-btn-users", "user-admin-subtab-btn-orders", "user-admin-subview-users", "user-admin-subview-orders");

    // ── Load Users ─────────────────────────────────────────────────────────
    async function loadUsers() {
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">⏳ Đang tải danh sách người dùng...</td></tr>';
        try {
            const res = await fetch("/api/admin/manage?action=users", {
                headers: { "Authorization": "Bearer " + getToken() }
            });
            if (res.status === 403) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:#ff5252;">🚫 Quyền truy cập bị từ chối. Không phải tài khoản admin.</td></tr>';
                return;
            }
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "API Error");
            allUsers = data.users || [];
            renderTable(allUsers);
        } catch (e) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:#ff5252;">❌ Lỗi: ' + e.message + '</td></tr>';
        }
    }

    // ── Render Users Table ─────────────────────────────────────────────────
    function renderTable(users) {
        if (!tbody) return;
        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">Không tìm thấy người dùng.</td></tr>';
            return;
        }
        tbody.innerHTML = users.map(u => {
            const roleClass = u.role === "admin" ? "elite" : "standard";
            const bal = (u.balance || 0).toLocaleString("vi-VN");
            return '<tr class="admin-user-row" data-userid="' + u.id + '">' +
                '<td><span class="admin-id-badge">#' + u.id + '</span></td>' +
                '<td><strong>' + u.username + '</strong></td>' +
                '<td class="admin-email-cell">' + u.email + '</td>' +
                '<td><span class="admin-balance-val">' + bal + ' đ</span></td>' +
                '<td><span class="rank-badge rank-' + roleClass + '">' + u.role + '</span></td>' +
                '<td>' +
                    '<button class="admin-edit-btn" onclick="adminOpenEdit(' + u.id + ', &apos;' + u.username + '&apos;, ' + (u.balance || 0) + ', &apos;' + u.role + '&apos;)">✏️ Sửa</button>' +
                '</td>' +
            '</tr>';
        }).join("");
    }

    // ── Load SMM Orders & Queue ────────────────────────────────────────────
    async function loadSmmOrders() {
        const tbodies = [document.getElementById("admin-smm-orders-tbody"), document.getElementById("user-admin-smm-orders-tbody")].filter(Boolean);
        if (tbodies.length === 0) return;

        tbodies.forEach(tb => {
            tb.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:2rem; color:var(--text-muted);">⏳ Đang tải danh sách hàng chờ & đơn hàng SMM...</td></tr>';
        });

        try {
            const res = await fetch("/api/admin/manage?action=smm_orders", {
                headers: { "Authorization": "Bearer " + getToken() }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "API Error");

            allOrders = data.orders || [];
            const pendingCount = data.pending_count !== undefined 
                ? data.pending_count 
                : allOrders.filter(o => o.status === "Pending" || !o.smm_order_id).length;

            pendingBadges.forEach(b => { b.textContent = pendingCount; });
            renderSmmOrdersTable(allOrders);
        } catch (e) {
            tbodies.forEach(tb => {
                tb.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:2rem; color:#ff5252;">❌ Lỗi: ' + e.message + '</td></tr>';
            });
        }
    }

    // ── Render SMM Orders Table ────────────────────────────────────────────
    function renderSmmOrdersTable(orders) {
        const tbodies = [document.getElementById("admin-smm-orders-tbody"), document.getElementById("user-admin-smm-orders-tbody")].filter(Boolean);
        if (tbodies.length === 0) return;

        let filtered = orders || [];
        if (activeSmmFilter !== "all") {
            filtered = filtered.filter(o => o.status === activeSmmFilter);
        }

        if (filtered.length === 0) {
            tbodies.forEach(tb => {
                tb.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:2rem; color:var(--text-muted);">Không có đơn hàng nào trong mục này.</td></tr>';
            });
            return;
        }

        const rowsHtml = filtered.map(o => {
            const statusClass = (o.status || "pending").toLowerCase();
            const partnerBadge = o.smm_order_id 
                ? '<strong style="color:var(--cyan-laser);">#' + o.smm_order_id + '</strong>'
                : '<span style="color:#f59e0b; font-weight:800; font-size:0.75rem;">⏳ Chờ đẩy đơn</span>';

            const isPending = o.status === "Pending" || !o.smm_order_id;
            const price = (o.price_at_purchase || 0).toLocaleString("vi-VN");
            const qty = (o.quantity || 0).toLocaleString("vi-VN");
            const shortLink = (o.link || "").length > 28 ? (o.link || "").slice(0, 26) + "..." : (o.link || "");

            return '<tr>' +
                '<td><strong>#' + o.id + '</strong></td>' +
                '<td>' +
                    '<div><strong>' + (o.username || "User #" + o.user_id) + '</strong></div>' +
                    '<div style="font-size:0.75rem; color:var(--text-muted);">' + (o.email || "") + '</div>' +
                '</td>' +
                '<td>' +
                    '<div><strong>' + (o.service_name || "Dịch vụ SMM") + '</strong></div>' +
                    '<div style="font-size:0.75rem; color:var(--text-muted);">ID gói: #' + (o.smm_service_id || "317835") + '</div>' +
                '</td>' +
                '<td><strong style="color:var(--text-main);">' + qty + '</strong></td>' +
                '<td>' +
                    '<a href="' + o.link + '" target="_blank" style="color:var(--cyan-laser); font-size:0.75rem; text-decoration:underline;" title="' + o.link + '">' +
                        shortLink +
                    '</a>' +
                '</td>' +
                '<td><strong>' + price + ' đ</strong></td>' +
                '<td>' + partnerBadge + '</td>' +
                '<td><span class="status-badge status-' + statusClass + '">' + (o.status || "Pending") + '</span></td>' +
                '<td>' +
                    '<div style="display:flex; gap:0.35rem; flex-wrap:wrap;">' +
                        (isPending ? '<button type="button" class="admin-btn-dispatch" data-dispatch-id="' + o.id + '">🚀 Đẩy đơn API</button>' : '') +
                        '<button type="button" class="admin-btn-sync" data-sync-id="' + o.id + '">🔄 Tiến độ</button>' +
                    '</div>' +
                '</td>' +
            '</tr>';
        }).join("");

        tbodies.forEach(tb => { tb.innerHTML = rowsHtml; });

        // Bind dispatch and sync buttons
        document.querySelectorAll("[data-dispatch-id]").forEach(btn => {
            btn.onclick = async () => {
                const oid = btn.getAttribute("data-dispatch-id");
                if (!confirm("Bấm xác nhận để đẩy đơn #" + oid + " lên máy chủ dichvumxh.vn ngay bây giờ?")) return;

                btn.disabled = true;
                btn.textContent = "⏳ Đang đẩy...";
                try {
                    const res = await fetch("/api/admin/manage", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + getToken() },
                        body: JSON.stringify({ action: "dispatch_smm_order", orderId: oid })
                    });
                    const result = await res.json();
                    if (result.success) {
                        alert(result.message || "Đã đẩy đơn thành công!");
                        loadSmmOrders();
                    } else {
                        alert("⚠️ Không thể đẩy đơn: " + (result.message || result.error) + "\n\n(Nếu do tài khoản đại lý chưa đủ tiền, bạn hãy nạp thêm tiền bên dichvumxh.vn rồi bấm lại nút này nhé!)");
                    }
                } catch(e) {
                    alert("Lỗi kết nối: " + e.message);
                } finally {
                    btn.disabled = false;
                    btn.textContent = "🚀 Đẩy đơn API";
                }
            };
        });

        document.querySelectorAll("[data-sync-id]").forEach(btn => {
            btn.onclick = async () => {
                const oid = btn.getAttribute("data-sync-id");
                btn.disabled = true;
                btn.textContent = "⏳...";
                try {
                    const res = await fetch("/api/admin/manage", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + getToken() },
                        body: JSON.stringify({ action: "sync_order_status", orderId: oid })
                    });
                    const result = await res.json();
                    if (result.success) {
                        alert(result.message || ("Trạng thái hiện tại: " + result.status));
                        loadSmmOrders();
                    } else {
                        alert("Thông báo: " + (result.message || "Không thể đồng bộ tiến độ"));
                    }
                } catch(e) {
                    alert("Lỗi kết nối: " + e.message);
                } finally {
                    btn.disabled = false;
                    btn.textContent = "🔄 Tiến độ";
                }
            };
        });
    }

    // Filter pills
    document.querySelectorAll("[data-smm-filter]").forEach(pill => {
        pill.addEventListener("click", () => {
            document.querySelectorAll("[data-smm-filter]").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            activeSmmFilter = pill.getAttribute("data-smm-filter");
            renderSmmOrdersTable(allOrders);
        });
    });

    if (refreshOrdersBtn) {
        refreshOrdersBtn.addEventListener("click", () => loadSmmOrders());
    }

    // ── Search Filter ──────────────────────────────────────────────────────
    if (searchInput) {
        let searchDebounceTimer = null;
        searchInput.addEventListener("input", () => {
            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                const q = searchInput.value.toLowerCase().trim();
                const filtered = allUsers.filter(u =>
                    (u.username && u.username.toLowerCase().includes(q)) ||
                    (u.email && u.email.toLowerCase().includes(q)) ||
                    String(u.id).includes(q)
                );
                renderTable(filtered);
            }, 120);
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => loadUsers());
    }

    if (closeEditBtn) {
        closeEditBtn.addEventListener("click", () => {
            editPanel.style.display = "none";
            selectedUserId = null;
        });
    }

    if (saveBalBtn) {
        saveBalBtn.addEventListener("click", async () => {
            if (!selectedUserId) return;
            const amount = parseInt(editBalance.value);
            if (isNaN(amount) || amount < 0) {
                alert("Số tiền không hợp lệ.");
                return;
            }
            saveBalBtn.disabled = true;
            saveBalBtn.innerText = "⏳ Đang lưu...";
            try {
                const res = await fetch("/api/admin/manage", {
                    method: "POST",
                    headers: { "Authorization": "Bearer " + getToken(), "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "update_balance", userId: selectedUserId, amount })
                });
                const data = await res.json();
                if (res.ok) {
                    const u = allUsers.find(x => x.id === selectedUserId);
                    if (u) u.balance = amount;
                    renderTable(allUsers);
                    editPanel.style.display = "none";
                    alert("✅ " + data.message);
                } else {
                    alert("❌ Lỗi: " + data.error);
                }
            } catch (e) {
                alert("❌ Lỗi mạng: " + e.message);
            } finally {
                saveBalBtn.disabled = false;
                saveBalBtn.innerText = "💾 Save Balance";
            }
        });
    }

    if (saveRoleBtn) {
        saveRoleBtn.addEventListener("click", async () => {
            if (!selectedUserId) return;
            const role = editRole.value;
            if (!["user", "admin"].includes(role)) return;

            const confirmed = confirm(
                role === "admin"
                    ? "⚠️ Trao quyền ADMIN cho tài khoản này? Người này sẽ có toàn quyền quản lý hệ thống."
                    : "Hạ quyền tài khoản này xuống 'user'?"
            );
            if (!confirmed) return;

            saveRoleBtn.disabled = true;
            saveRoleBtn.innerText = "⏳ Đang lưu...";
            try {
                const res = await fetch("/api/admin/manage", {
                    method: "POST",
                    headers: { "Authorization": "Bearer " + getToken(), "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "update_role", userId: selectedUserId, role })
                });
                const data = await res.json();
                if (res.ok) {
                    const u = allUsers.find(x => x.id === selectedUserId);
                    if (u) u.role = role;
                    renderTable(allUsers);
                    editPanel.style.display = "none";
                    alert("✅ " + data.message);
                } else {
                    alert("❌ Lỗi: " + data.error);
                }
            } catch (e) {
                alert("❌ Lỗi mạng: " + e.message);
            } finally {
                saveRoleBtn.disabled = false;
                saveRoleBtn.innerText = "💾 Save Role";
            }
        });
    }

    loadUsers();
    loadSmmOrders();

    window.adminOpenEdit = function(userId, username, balance, role) {
        selectedUserId = userId;
        editTitle.innerText = "Chỉnh sửa: " + username + " (ID #" + userId + ")";
        editBalance.value = balance || 0;
        editRole.value = role || "user";
        editPanel.style.display = "block";
        if (typeof gsap !== "undefined") {
            gsap.fromTo(editPanel, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
        }
    };
}


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

    const cards = document.querySelectorAll('.lookbook-card, .spectrum-col, .service-category-row');
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
// ==========================================
// SERVICES DIRECTORY (MODULAR HANDLER & HERO VFX)
// ==========================================
function initServicesDirectory() {
    const heroCanvas = document.getElementById('services-hero-canvas');
    if (!heroCanvas) return;

    const ctx = heroCanvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0, height = 0;
    function resize() {
        if (!heroCanvas) return;
        width = heroCanvas.width = window.innerWidth;
        height = heroCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let time = 0;
    let mouse = {
        x: width / 2,
        y: height / 2,
        targetX: width / 2,
        targetY: height / 2,
        isInside: false
    };

    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
        mouse.isInside = true;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        mouse.isInside = false;
        mouse.targetX = width / 2;
        mouse.targetY = height / 2;
    }, { passive: true });

    // Multi-Harmonic Wave Spectrum: Cyan Laser (#00F0FF), Royal Violet (#8B6CCF), Neon Pink (#FF2A85)
    const waveConfigs = [
        { speed: 0.011, freq: 0.0022, amp: 46, yRatio: 0.38, colorDark: 'rgba(0, 240, 255, 0.34)', colorLight: 'rgba(2, 132, 199, 0.26)', width: 2.2 },
        { speed: 0.015, freq: 0.0030, amp: 36, yRatio: 0.44, colorDark: 'rgba(139, 108, 207, 0.38)', colorLight: 'rgba(109, 40, 217, 0.26)', width: 1.8 },
        { speed: 0.009, freq: 0.0018, amp: 52, yRatio: 0.50, colorDark: 'rgba(255, 42, 133, 0.28)', colorLight: 'rgba(233, 30, 99, 0.20)', width: 1.8 },
        { speed: 0.018, freq: 0.0036, amp: 26, yRatio: 0.41, colorDark: 'rgba(0, 240, 255, 0.44)', colorLight: 'rgba(2, 132, 199, 0.32)', width: 1.2 },
        { speed: 0.012, freq: 0.0026, amp: 40, yRatio: 0.56, colorDark: 'rgba(139, 108, 207, 0.28)', colorLight: 'rgba(109, 40, 217, 0.20)', width: 1.6 }
    ];

    // Constellation Particle Mesh spanning full background
    const particles = [];
    const particleCount = 38;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * (width || window.innerWidth),
            y: Math.random() * (height || window.innerHeight),
            vx: (Math.random() - 0.5) * 0.32,
            vy: (Math.random() - 0.5) * 0.32,
            radius: Math.random() * 2 + 1,
            hue: Math.random() > 0.5 ? 'cyan' : 'violet'
        });
    }

    let isVisible = !document.hidden;
    let animId = null;

    function render() {
        time += 1;

        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        ctx.clearRect(0, 0, width, height);

        const isLight = document.documentElement.classList.contains('light-mode') || document.body.classList.contains('light-mode');
        const isMobile = width < 768;
        const ampScale = isMobile ? 0.65 : 1.0;

        // Draw Interactive Ambient Spotlight around cursor
        const spotRadius = Math.max(width, height) * 0.42;
        const spotGrad = ctx.createRadialGradient(
            mouse.x, mouse.y, 8,
            mouse.x, mouse.y, spotRadius
        );
        if (isLight) {
            spotGrad.addColorStop(0, 'rgba(2, 132, 199, 0.08)');
            spotGrad.addColorStop(0.5, 'rgba(109, 40, 217, 0.025)');
            spotGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
            spotGrad.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
            spotGrad.addColorStop(0.45, 'rgba(139, 108, 207, 0.05)');
            spotGrad.addColorStop(1, 'rgba(6, 6, 8, 0)');
        }
        ctx.fillStyle = spotGrad;
        ctx.fillRect(0, 0, width, height);

        // Smooth subtle parallax shift when scrolling down
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        const scrollShift = scrollY * 0.18;

        // Draw Fluid Wave Beams across the background
        waveConfigs.forEach((cfg, idx) => {
            const baseColor = isLight ? cfg.colorLight : cfg.colorDark;
            const baseY = (height * cfg.yRatio) - scrollShift;

            ctx.beginPath();
            const step = isMobile ? 24 : 18;
            for (let x = 0; x <= width + step; x += step) {
                const dx = x - mouse.x;
                const dy = baseY - mouse.y;
                const dist = Math.hypot(dx, dy);
                const mouseDeflection = Math.max(0, (1 - dist / 320)) * (30 * ampScale) * Math.sin(time * 0.05 + idx);

                const sin1 = Math.sin(x * cfg.freq + time * cfg.speed);
                const sin2 = Math.cos(x * (cfg.freq * 1.35) - time * (cfg.speed * 0.75));
                const y = baseY + (sin1 + sin2 * 0.5) * (cfg.amp * ampScale) + mouseDeflection;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.strokeStyle = baseColor;
            ctx.lineWidth = cfg.width;
            ctx.lineCap = 'round';
            ctx.stroke();
        });

        // Update & Render Floating Constellation Nodes
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            const nodeColor = isLight
                ? (p.hue === 'cyan' ? 'rgba(2, 132, 199, 0.55)' : 'rgba(109, 40, 217, 0.45)')
                : (p.hue === 'cyan' ? 'rgba(0, 240, 255, 0.7)' : 'rgba(139, 108, 207, 0.6)');

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = nodeColor;
            ctx.fill();

            // Connect nearby nodes
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const d = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (d < 110) {
                    const lineAlpha = (1 - d / 110) * (isLight ? 0.15 : 0.22);
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = isLight ? 
gba(15, 23, 42, ) : 
gba(0, 240, 255, );
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        });

        if (isVisible) {
            animId = requestAnimationFrame(render);
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isVisible = false;
            if (animId) cancelAnimationFrame(animId);
        } else {
            isVisible = true;
            resize();
            animId = requestAnimationFrame(render);
        }
    });

    animId = requestAnimationFrame(render);
}

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
        // --- FACEBOOK: LIKE BÀI VIẾT (ĐẦY ĐỦ 100% CÁC SERVER TRONG ẢNH) ---
        { service: '53977', name: 'SV6 : Like ẩn. tốc độ trung bình, không tụt', platform: 'facebook', category: 'like_post', rate: 30.4, min: 50, max: 200000, description: 'ID: 53977\n- Được phép dồn đơn\n- Hiện tại không tụt, không cam kết bảo hành\n- Lượt cảm xúc chỉ chạy cho bài gốc, không hỗ trợ bài chia sẻ.\nTối thiểu/Tối đa: 50/200k' },
        { service: '3566', name: 'SV1 : Like ẩn. tốc độ chậm, không tụt', platform: 'facebook', category: 'like_post', rate: 16.4, min: 50, max: 10000, description: 'ID: 3566\n- Không hiển thị người like.\n- Hiện tại không tụt, không cam kết bảo hành\n- Lượt cảm xúc chỉ chạy cho bài gốc, không hỗ trợ bài chia sẻ.' },
        { service: '4822', name: 'SV2 : Like Ngoại, tốc độ nhanh', platform: 'facebook', category: 'like_post', rate: 19.2, min: 100, max: 100000, description: 'ID: 4822\n- Gói không hỗ trợ huỷ đơn.\n- Tốc độ 10k - 50k / ngày' },
        { service: '4823', name: 'SV3 : Like việt. Tốc độ ổn', platform: 'facebook', category: 'like_post', rate: 28.9, min: 50, max: 10000, description: 'ID: 4823\n- Like tài nguyên Việt Nam\n- Tốc độ ổn định' },
        { service: '348536', name: 'SV8 : Like việt. Tốc độ nhanh', platform: 'facebook', category: 'like_post', rate: 34.6, min: 200, max: 1000, description: 'ID: 348536\n- Không hỗ trợ hủy gói.\n- Phù hợp gói like số lượng nhỏ, phần lớn là clone việt' },
        { service: '403532', name: 'SV15 : Like ẩn. tốc độ chậm, không tụt', platform: 'facebook', category: 'like_post', rate: 44.3, min: 50, max: 100000, description: 'ID: 403532\n- Được phép dồn đơn\n- Hiện tại không tụt, không cam kết bảo hành\n- Lượt cảm xúc chỉ chạy cho bài gốc, không hỗ trợ bài chia sẻ.' },

        // --- FACEBOOK: THEO DÕI TRANG CÁ NHÂN / SUB PROFILE (ĐẦY ĐỦ 100% CÁC SERVER TRONG ẢNH) ---
        { service: '317844', name: 'SV3 : Sub Việt Nam, tốc độ 7-10k /ngày, bảo hành 7 ngày', platform: 'facebook', category: 'follow_profile', rate: 48.5, min: 500, max: 150000, description: 'ID: 317844\n- Hỗ trợ sub cá nhân và sub fanpage\n- Tài nguyên phần lớn là beta hạn chế tụt\nTối thiểu/Tối đa: 500/150k' },
        { service: '317845', name: 'SV5 : Sub Việt Nam, tốc độ 5-10k/ngày, bảo hành 7 ngày', platform: 'facebook', category: 'follow_profile', rate: 23.4, min: 500, max: 2000, description: 'ID: 317845\n- Phần lớn là sub beta, giới hạn 150k/1 UID' },
        { service: '317846', name: 'SV7 : Sub Tây, tốc độ 30k/ngày, bảo hành 7 ngày', platform: 'facebook', category: 'follow_profile', rate: 34.7, min: 200, max: 1000000, description: 'ID: 317846\n- Hỗ trợ sub trang cá nhân và sub fanpage\n- Tài nguyên phần lớn là beta hạn chế tụt\n- 1 đơn chỉ hỗ trợ mua tối đa 3 lần' },
        { service: '317835', name: 'SV8 : Sub Tây, tốc độ 20k / 1 ngày, bảo hành 7 ngày', platform: 'facebook', category: 'follow_profile', rate: 18.8, min: 200, max: 1000000, description: 'ID: 317835\n- Hỗ trợ sub trang cá nhân và sub fanpage\n- Tài nguyên phần lớn là beta hạn chế tụt' },

        // --- FACEBOOK: THÀNH VIÊN NHÓM / GROUP MEMBERS ---
        { service: '7596', name: 'SV4 : Tăng thành viên nhóm giá rẻ', platform: 'facebook', category: 'group_member', rate: 23.6, min: 100, max: 10000, description: 'ID: 7596\n- Tăng member nhóm số lượng nhỏ\n- Tốc độ nhanh' },
        { service: '568566', name: 'SV7 : Tăng thành viên nhóm siêu tốc', platform: 'facebook', category: 'group_member', rate: 27.8, min: 200, max: 15000, description: 'ID: 568566\n- Không hỗ trợ group riêng tư.\n- Yêu cầu bật cho fanpage tham gia' },
        { service: '5106', name: 'SV2 : Tăng thành viên nhóm (Group Member)', platform: 'facebook', category: 'group_member', rate: 40.3, min: 500, max: 200000, description: 'ID: 5106\n- Tăng member cho nhóm công khai và nhóm kín\n- Thành viên tự nhiên, không bảo hành' },
        { service: '15283', name: 'SV3 : Tăng thành viên nhóm chất lượng cao', platform: 'facebook', category: 'group_member', rate: 49.6, min: 500, max: 30000, description: 'ID: 15283\n- Member chất lượng cao' },

        // --- FACEBOOK: CHIA SẺ & LIVESTREAM & VIEW ---
        { service: '75298', name: 'SV5 : Chia sẻ bài viết giá siêu rẻ', platform: 'facebook', category: 'share_post', rate: 27.8, min: 1000, max: 100000000, description: 'ID: 75298\n- Chia sẻ bài viết số lượng lớn' },
        { service: '47001', name: 'SV2 : Chia sẻ bài viết chất lượng cao', platform: 'facebook', category: 'share_post', rate: 320.2, min: 20, max: 10000, description: 'ID: 47001\n- Chia sẻ bài viết lên trang cá nhân' },
        { service: '4038', name: 'SV1 : Chia sẻ bài viết chất lượng cao', platform: 'facebook', category: 'share_post', rate: 400.2, min: 10, max: 50000, description: 'ID: 4038\n- Share bài viết lên tường cá nhân\n- Tăng độ phủ thương hiệu' },
        { service: '134713', name: 'SV4 : Mắt xem Livestream trực tiếp, số mắt tự do', platform: 'facebook', category: 'live_stream', rate: 2.6, min: 50, max: 100000, description: 'ID: 134713\n- Duy trì mắt xem live ổn định trong suốt buổi phát' },
        { service: '58022', name: 'SV3 : Lượt xem video / Reels', platform: 'facebook', category: 'view_video', rate: 3.8, min: 100000, max: 1000000, description: 'ID: 58022\n- Tăng lượt xem video Reels' },

        // --- TIKTOK & INSTAGRAM & THREADS ---
        { service: '3113', name: 'SV1 : Follow kênh cá nhân TikTok', platform: 'tiktok', category: 'follow_profile', rate: 71.9, min: 100, max: 1000, description: 'ID: 3113\n- Không dồn đơn và không mua nhiều server cùng lúc.' },
        { service: '227120', name: 'SV8 : Follow kênh cá nhân TikTok chất lượng', platform: 'tiktok', category: 'follow_profile', rate: 128.0, min: 200, max: 10000, description: 'ID: 227120\n- Tăng follow kênh cá nhân' },
        { service: '3104', name: 'SV1 : Follow chất lượng cao Instagram (BH 7 Ngày)', platform: 'instagram', category: 'follow_profile', rate: 382.8, min: 100, max: 10000, description: 'ID: 3104\n- Bảo hành 7 ngày\n- Follow chất lượng ổn định' },
        { service: '410018', name: 'SV9 : Follow Instagram giá tốt', platform: 'instagram', category: 'follow_profile', rate: 96.7, min: 500, max: 5000, description: 'ID: 410018\n- Có tỉ lệ tụt cao và không bảo hành.' },
        { service: '3103', name: 'SV1 : Like bài viết hình ảnh / Reels Instagram', platform: 'instagram', category: 'like_post', rate: 127.6, min: 100, max: 50000, description: 'ID: 3103\n- Lên like nhanh sau 5 - 15 phút' },
        { service: '257088', name: 'SV1 : Like bài viết Threads tự nhiên', platform: 'threads', category: 'all', rate: 348.0, min: 100, max: 20000, description: 'ID: 257088\n- Thả tim bài viết Threads tự nhiên' }
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
                const curatedMap = new Map();
                allServices.forEach(s => curatedMap.set(String(s.service), s));

                data.forEach(s => {
                    const sid = String(s.service);
                    const c = classify(s);
                    const unitVnd = parseFloat(s.rate_vnd_unit) || ((parseFloat(s.rate) * 26000 * 1.20) / 1000) || 1;
                    const finalRate = Math.round(unitVnd * 10) / 10;

                    if (curatedMap.has(sid)) {
                        const existing = curatedMap.get(sid);
                        existing.rate = finalRate;
                        if (parseInt(s.min)) existing.min = parseInt(s.min);
                        if (parseInt(s.max)) existing.max = parseInt(s.max);
                    } else {
                        let cleanName = (s.name || '')
                            .replace(/^Facebook\s*-\s*/i, '')
                            .replace(/^Instagram\s*-\s*/i, '')
                            .replace(/^TikTok\s*-\s*/i, '')
                            .replace(/^Threads\s*-\s*/i, '');
                        curatedMap.set(sid, {
                            service: sid,
                            name: cleanName,
                            platform: c.platform,
                            category: c.cat_id,
                            rate: finalRate,
                            min: parseInt(s.min) || 50,
                            max: parseInt(s.max) || 1000000,
                            description: s.description || ''
                        });
                    }
                });

                allServices = Array.from(curatedMap.values());
                renderCategories();
            }
        })
        .catch(() => {
            console.log('Using default curated SMM packages.');
            renderCategories();
        });

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

    // Synchronous initial render of default curated packages
    renderCategories();

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

        // Render Interactive Server Radio Cards (matching user screenshot)
        const serverListEl = document.getElementById('smm-server-list');
        if (serverListEl) {
            serverListEl.innerHTML = '';
            filtered.forEach(s => {
                const isSelected = (s.service === selectedServiceId);
                const item = document.createElement('div');
                item.className = `smm-server-item ${isSelected ? 'active' : ''}`;
                item.setAttribute('data-sid', s.service);

                const lines = (s.description || '').split('\n').filter(l => l.trim().length > 0);
                let descHtml = '';
                const maxDisplay = s.max >= 1000 ? (s.max >= 1000000 ? (s.max / 1000000) + 'M' : (s.max / 1000) + 'k') : s.max;
                let minMaxText = `Tối thiểu/Tối đa: ${s.min.toLocaleString('vi-VN')}/${maxDisplay}`;

                lines.forEach(l => {
                    const cleanL = l.replace(/^ID:\s*\d+/i, '').replace(/^[-\*•✓\s]+/, '').trim();
                    if (cleanL && !cleanL.toLowerCase().includes('tối thiểu')) {
                        descHtml += `<div style="display:flex; align-items:flex-start; gap:0.4rem; margin-bottom:2px;"><span style="color:#00b894; font-weight:bold;">✓</span> <span>${cleanL}</span></div>`;
                    }
                });

                item.innerHTML = `
                    <div class="smm-server-row">
                        <div style="display: flex; align-items: center; gap: 0.65rem; flex: 1;">
                            <input type="radio" name="smm_server_radio" class="smm-server-radio" value="${s.service}" ${isSelected ? 'checked' : ''}>
                            <span class="smm-server-name">${s.name}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <span class="smm-server-price">${s.rate.toLocaleString('vi-VN')} đ</span>
                            <span class="smm-server-badge ${s.status === 'maintenance' ? 'maintenance-badge' : 'active-badge'}">${s.status === 'maintenance' ? 'Bảo trì' : 'Hoạt động'}</span>
                        </div>
                    </div>
                    ${isSelected ? `
                        <div class="smm-server-details-card">
                            <div style="color: #ff3366; font-weight: 800; font-size: 0.85rem; margin-bottom: 4px;">ID: ${s.service}</div>
                            ${descHtml}
                            <div style="font-weight: 700; margin-top: 5px; color: var(--text-main);">${minMaxText}</div>
                        </div>
                    ` : ''}
                `;

                item.addEventListener('click', () => {
                    selectedServiceId = s.service;
                    serviceSelect.value = s.service;
                    populateDropdown();
                });

                serverListEl.appendChild(item);
            });
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

        // Min/Max strictly in QUANTITY units set by the shop
        if (minMaxLabel) {
            minMaxLabel.innerHTML = `Số lượng: <strong style="color: var(--cyan-laser);">${svc.min.toLocaleString('vi-VN')}</strong> &bull; <strong style="color: var(--cyan-laser);">${svc.max.toLocaleString('vi-VN')}</strong>`;
        }

        if (rateLabel) {
            rateLabel.textContent = '';
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

    // Smart Auto-Normalize & Check Link / UID
    let uidLookupTimer = null;
    async function autoNormalizeLink(silent = false) {
        if (!linkInput) return;
        let link = linkInput.value.trim();
        if (!link) {
            if (!silent) alert('Vui lòng dán link trang cá nhân hoặc bài viết!');
            if (uidResult) uidResult.innerHTML = '';
            return;
        }

        // 1. Raw numeric UID (e.g. 100052509938927) -> instant client convert
        if (/^\d{6,}$/.test(link)) {
            linkInput.value = `https://facebook.com/${link}`;
            if (uidResult) {
                uidResult.innerHTML = `<span style="color: #10b981;">&check; Đã nhận diện UID: <strong>${link}</strong></span>`;
            }
            return;
        }

        // 2. Facebook Profile with numeric id in URL -> instant client convert
        const numMatch = link.match(/^https?:\/\/(?:www\.)?facebook\.com\/(?:profile\.php\?id=)?(\d+)\/?$/i);
        if (numMatch && numMatch[1]) {
            linkInput.value = `https://facebook.com/${numMatch[1]}`;
            if (uidResult) {
                uidResult.innerHTML = `<span style="color: #10b981;">&check; Đã nhận diện UID: <strong>${numMatch[1]}</strong></span>`;
            }
            return;
        }

        // 3. Post / Video / Reel / Story -> Keep untouched for likes/views
        const isPost = /\/(posts|photos|videos|reel|watch)\/|story_fbid|permalink\.php/i.test(link);
        if (isPost) {
            if (uidResult) {
                uidResult.innerHTML = `<span style="color: #10b981;">&check; Link bài viết / video hợp lệ (tự động tối ưu)</span>`;
            }
            return;
        }

        // 4. Facebook username link (e.g. facebook.com/quang.sinh.5492) -> auto resolve via API
        if (link.includes('facebook.com') || link.includes('fb.com')) {
            if (uidBtn) {
                uidBtn.disabled = true;
                uidBtn.textContent = 'Checking...';
            }
            if (uidResult) {
                uidResult.innerHTML = `<span style="color: #00e5ff;">⏳ Đang tự động chuyển đổi sang UID...</span>`;
            }
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
                        uidResult.innerHTML = `<span style="color: #10b981;">&check; Đã tự động chuyển đổi UID: <strong>${data.id}</strong> (${data.name || 'Tài khoản'})</span>`;
                    }
                } else {
                    if (uidResult) {
                        uidResult.innerHTML = `<span style="color: #10b981;">&check; Link hợp lệ (hệ thống sẽ xử lý khi khớp lệnh).</span>`;
                    }
                }
            } catch (err) {
                if (uidResult) {
                    uidResult.innerHTML = `<span style="color: #10b981;">&check; Link hợp lệ.</span>`;
                }
            } finally {
                if (uidBtn) {
                    uidBtn.disabled = false;
                    uidBtn.textContent = 'Check';
                }
            }
            return;
        }

        // Other platforms (Instagram, TikTok, Threads)
        if (uidResult) {
            uidResult.innerHTML = `<span style="color: #10b981;">&check; Link hợp lệ</span>`;
        }
    }

    if (uidBtn) {
        uidBtn.addEventListener('click', () => autoNormalizeLink(false));
    }
    if (linkInput) {
        linkInput.addEventListener('paste', () => setTimeout(() => autoNormalizeLink(true), 60));
        linkInput.addEventListener('blur', () => autoNormalizeLink(true));
        linkInput.addEventListener('input', () => {
            clearTimeout(uidLookupTimer);
            uidLookupTimer = setTimeout(() => autoNormalizeLink(true), 400);
        });
    }

    // Direct Wallet Payment & Order Submission (With real DB deduction & Auto-Queue)
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

            // Check if user is logged in
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

            if (currentBalance < totalCost) {
                const missing = totalCost - currentBalance;
                alert(`Số dư ví của bạn không đủ!\n\n- Cần thanh toán: ${formatVND(totalCost)} VNĐ\n- Số dư hiện tại: ${formatVND(currentBalance)} VNĐ\n- Còn thiếu: ${formatVND(missing)} VNĐ\n\nVui lòng Nạp thêm tiền vào ví qua VietQR để tiếp tục tạo đơn.`);
                const topupOverlay = document.getElementById('topup-modal-overlay');
                if (topupOverlay) topupOverlay.classList.add('active');
                return;
            }

            const confirmMsg = `XÁC NHẬN THANH TOÁN TỪ SỐ DƯ VÍ?\n\n- Dịch vụ: ${svc.name}\n- Đơn giá: ${svc.rate} đ / 1\n- Số lượng: ${qty.toLocaleString('vi-VN')}\n- Link/UID: ${link}\n- Số tiền trừ ví: ${formatVND(totalCost)} VNĐ\n- Số dư sau khi trừ: ${formatVND(currentBalance - totalCost)} VNĐ`;

            if (!confirm(confirmMsg)) return;

            submitAutoBtn.disabled = true;
            submitAutoBtn.textContent = 'Đang xử lý trừ ví & đẩy đơn...';

            try {
                const res = await fetch('/api/smm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        action: 'add',
                        service: svc ? svc.service : '317835',
                        service_name: svc ? svc.name : 'Dịch vụ tăng tương tác SMM',
                        link: link,
                        quantity: qty,
                        rate: svc ? svc.rate : 1
                    })
                });
                const data = await res.json();

                if (data && data.success) {
                    const newBal = (data.new_balance !== undefined ? data.new_balance : currentBalance - totalCost);
                    user.balance = newBal;
                    localStorage.setItem('teemous_user', JSON.stringify(user));
                    updateWalletUI();

                    const orderId = data.internal_order_id || data.order;
                    if (trackInput) trackInput.value = orderId;

                    const smmOrders = JSON.parse(localStorage.getItem('teemous_smm_orders') || '[]');
                    smmOrders.unshift({
                        order_id: orderId,
                        smm_order_id: data.order,
                        service_id: svc.service,
                        service_name: svc.name,
                        quantity: qty,
                        link: link,
                        cost: totalCost,
                        date: new Date().toISOString(),
                        status: data.status || (data.queued ? 'Pending' : 'Running')
                    });
                    localStorage.setItem('teemous_smm_orders', JSON.stringify(smmOrders));

                    if (data.queued) {
                        alert(`🎉 ĐƠN HÀNG ĐÃ ĐƯỢC TIẾP NHẬN & ĐƯA VÀO HÀNG CHỜ!\n\n- Mã đơn hàng: #${orderId}\n- Dịch vụ: ${svc.name}\n- Số lượng: ${qty.toLocaleString('vi-VN')}\n- Đã trừ ví: ${formatVND(totalCost)} VNĐ\n- Số dư khả dụng: ${formatVND(user.balance)} VNĐ\n\nĐơn hàng của bạn đã được ghi nhận vào hệ thống và đang trong hàng chờ duyệt (Hệ thống/Admin sẽ duyệt và đẩy đơn tự động cho bạn ngay khi sẵn sàng)!\nBạn có thể nhập mã #${orderId} vào ô bên dưới để theo dõi tiến độ.`);
                    } else {
                        alert(`🎉 TẠO ĐƠN HÀNG THÀNH CÔNG!\n\n- Mã đơn hàng (Order ID): #${data.order}\n- Dịch vụ: ${svc.name}\n- Số lượng: ${qty.toLocaleString('vi-VN')}\n- Đã trừ ví: ${formatVND(totalCost)} VNĐ\n- Số dư khả dụng: ${formatVND(user.balance)} VNĐ\n\nHệ thống đã khớp lệnh và đang xử lý tăng tương tác cho bạn!\nBạn có thể nhập mã #${data.order} vào ô bên dưới để theo dõi tiến độ.`);
                    }

                    if (window.refreshBalance) window.refreshBalance();
                } else {
                    alert(`Thông báo từ hệ thống: ${data.error || 'Hệ thống đang bận. Vui lòng thử lại sau ít phút!'}`);
                }
            } catch (e) {
                alert(`Lỗi kết nối máy chủ: ${e.message}. Vui lòng thử lại sau!`);
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
                const info = await res.json();

                if (info && (info.status || info.order)) {
                    let badgeColor = 'var(--cyan-laser)';
                    let statusText = info.status || 'Running';
                    if (statusText === 'Completed' || statusText === 'Hoàn thành') {
                        badgeColor = '#10b981';
                        statusText = 'Hoàn thành (Completed)';
                    } else if (statusText === 'Pending' || statusText === 'Chờ xử lý') {
                        badgeColor = '#f59e0b';
                        statusText = 'Hàng chờ duyệt (Pending)';
                    } else if (statusText === 'Running' || statusText === 'In progress' || statusText === 'Processing') {
                        badgeColor = '#00f0ff';
                        statusText = 'Đang tăng tương tác (Running)';
                    }
                    if (trackResult) {
                        trackResult.innerHTML = `
                            <div style="padding: 0.85rem 1rem; background: rgba(0, 240, 255, 0.06); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 6px; font-size: 0.85rem; font-family: var(--font-tech);">
                                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                                    <div><strong>Đơn hàng #${oid}:</strong> <span style="color: ${badgeColor}; font-weight:800; text-transform: uppercase;">${statusText}</span></div>
                                    ${info.remains !== undefined ? `<div style="color: var(--text-muted); font-size: 0.8rem;">Khởi chạy: ${info.start_count || 0} &bull; Còn lại: ${info.remains}</div>` : ''}
                                </div>
                                ${info.message ? `<div style="color: var(--text-muted); font-size: 0.78rem; margin-top: 0.4rem;">${info.message}</div>` : ''}
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
