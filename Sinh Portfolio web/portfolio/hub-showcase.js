/**
 * TEEMOUS DIGITAL // PORTFOLIO HUB ENGINE
 * Interactive Harmonic Fluid Mesh, Gyroscopic 3D Cards, Live Telemetry & Multilingual Architecture
 */

(function () {
    'use strict';

    const DOSSIERS = [
        {
            id: 'tranthithuyduong',
            nameEn: 'Tran Thi Thuy Duong',
            nameVi: 'Trần Thị Thùy Dương',
            tier: 'elite',
            tierLabel: 'S+ ELITE (APEX)',
            rankNumber: '#01',
            powerScore: 96.0,
            field: 'it',
            majorId: 'computer-science',
            majorVi: 'Khoa học Máy tính / CNTT',
            majorEn: 'Computer Science / IT',
            roleEn: 'Software Engineering & Algorithms • VKU CS Scholar',
            roleVi: 'Kỹ sư Phần mềm & Thuật toán • Sinh viên Chuyên Tin VKU',
            schoolEn: 'VKU — Vietnam-Korea University (2005)',
            schoolVi: 'ĐH CNTT & Truyền thông Việt - Hàn (2005)',
            year: 2005,
            gpa: '3.61 / 4.0',
            accoladesEn: 'ICPC National Contest • SheCodes Top 6 National • Quoc Hoc Hue CS Gifted (9.3/10)',
            accoladesVi: 'Huy chương ICPC Quốc gia • Top 6 SheCodes Toàn quốc • Cựu Chuyên Tin Quốc Học Huế (9.3/10)',
            bioEn: 'Computer Science student at VKU with a 3.61/4.0 GPA. Strong background in data structures, algorithms, and full-stack software development (Flutter, Node.js, C++, Java, SQL). Former CS specialized student at Quoc Hoc Hue High School.',
            bioVi: 'Sinh viên ngành Khoa học Máy tính tại VKU với GPA 3.61/4.0. Nền tảng thuật toán vững chắc, lập trình ứng dụng đa nền tảng (Flutter, Node.js, C++, Java, SQL). Cựu học sinh Chuyên Tin THPT Chuyên Quốc Học Huế với điểm chuyên 9.3/10.',
            avatar: '../Avatar/tttduong.jpg',
            url: 'tranthithuyduong/index.html',
            isOwner: false,
            verified: true,
            skills: ['Algorithms & ICPC', 'C++ / Java', 'Full-Stack Web', 'Flutter Mobile', 'Data Structures'],
            skillBars: [
                { name: 'Algorithms & Data Structures', val: 96 },
                { name: 'Full-Stack Web Development', val: 94 },
                { name: 'Mobile App Development (Flutter)', val: 92 },
                { name: 'Problem Solving & Logic', val: 96 }
            ],
            certs: [
                '../cer/Thùy Dương 2005/certi-1.png',
                '../cer/Thùy Dương 2005/certi-2.png',
                '../cer/Thùy Dương 2005/bbe-1.png'
            ]
        },
        {
            id: 'lethaitrung',
            nameEn: 'Le Thai Trung',
            nameVi: 'Lê Thái Trung',
            tier: 'professional',
            tierLabel: 'S PROFESSIONAL (BACKEND)',
            rankNumber: '#02',
            powerScore: 90.5,
            field: 'it',
            majorId: 'software-engineering',
            majorVi: 'Kỹ nghệ Phần mềm',
            majorEn: 'Software Engineering',
            roleEn: 'Backend Developer & Software Engineering',
            roleVi: 'Lập trình viên Backend & Kỹ nghệ Phần mềm',
            schoolEn: 'Duy Tan University (2003)',
            schoolVi: 'Đại học Duy Tân (2003)',
            year: 2003,
            gpa: 'Senior Stack',
            accoladesEn: 'Software Engineering Specialist • Backend APIs & Cloud Deployment',
            accoladesVi: 'Chuyên viên Kỹ nghệ Phần mềm • Xây dựng Backend APIs & Cloud',
            bioEn: 'Software Engineering student at Duy Tan University focused on backend server logic, RESTful APIs, clean architecture, and reliable system deployment using IntelliJ, Postman, Linux, and Git.',
            bioVi: 'Sinh viên Kỹ nghệ Phần mềm tại Đại học Duy Tân, tập trung phát triển logic backend, thiết kế RESTful APIs, cấu trúc mã nguồn chuẩn mực và triển khai hệ thống ổn định với IntelliJ, Postman, Linux và Git.',
            avatar: '../Avatar/lethaitrung2003.jpg',
            url: 'lethaitrung/index.html',
            isOwner: false,
            verified: false,
            skills: ['Backend Dev', 'REST APIs', 'IntelliJ IDEA', 'Postman', 'Git / Linux'],
            skillBars: [
                { name: 'Backend API Architecture', val: 91 },
                { name: 'Code Execution & Debugging', val: 90 },
                { name: 'Database & Server Logic', val: 90 },
                { name: 'Agile Delivery', val: 89 }
            ],
            certs: []
        },
        {
            id: 'ngoquangsinh',
            nameEn: 'Ngo Quang Sinh',
            nameVi: 'Ngô Quang Sinh',
            tier: 'impressive',
            tierLabel: 'A+ IMPRESSIVE (FOUNDER)',
            rankNumber: '#03',
            powerScore: 88.0,
            field: 'it',
            majorId: 'digital-marketing',
            majorVi: 'Digital Marketing & TMĐT',
            majorEn: 'Digital Marketing & E-Commerce',
            roleEn: 'Founder Teemous Digital • Web Solutions & AI Automation',
            roleVi: 'Nhà sáng lập Teemous Digital • Giải pháp Web & AI Automation',
            schoolEn: 'Duy Tan University (2005)',
            schoolVi: 'Đại học Duy Tân (2005)',
            year: 2005,
            gpa: 'Founder Track',
            accoladesEn: 'Founder Teemous Digital • Web Platform Dev • SMM API Automation',
            accoladesVi: 'Founder Teemous Digital • Phát triển Hệ thống Web • Tích hợp API SMM',
            bioEn: 'Founder of Teemous Digital creative ecosystem. Combines web architecture, Google AppsScript automation, AI workflows, and digital brand development. Built working portfolio hub and automated social terminal.',
            bioVi: 'Nhà sáng lập hệ sinh thái Teemous Digital. Kết hợp kiến trúc web, tự động hóa Google AppsScript, trợ lý AI và phát triển thương hiệu số. Trực tiếp xây dựng nền tảng Portfolio Hub và hệ thống dịch vụ số tự động.',
            avatar: '../Avatar/IMG_5907_compressed.jpg',
            url: 'ngoquangsinh/index.html',
            isOwner: true,
            verified: true,
            skills: ['Web Architecture', 'AI Automation', 'AppsScript', 'Community Leader', 'Product Ops'],
            skillBars: [
                { name: 'Web & Infrastructure Architecture', val: 89 },
                { name: 'AI Agent & Process Automation', val: 88 },
                { name: 'Product Management & Systems', val: 88 },
                { name: 'Community Leadership & Growth', val: 87 }
            ],
            certs: [
                '../cer/Quang Sinh 2005/KPI XANH BBE.jpg',
                '../cer/Quang Sinh 2005/Cer-training-comm.jpg'
            ]
        },
        {
            id: 'builuubaohan',
            nameEn: 'Bui Luu Bao Han',
            nameVi: 'Bùi Lưu Bảo Hân',
            tier: 'standard',
            tierLabel: 'A STANDARD (COMMUNITY)',
            rankNumber: '#04',
            powerScore: 84.0,
            field: 'business',
            majorId: 'international-business',
            majorVi: 'Kinh doanh Quốc tế',
            majorEn: 'International Business',
            roleEn: 'HR Operations & Community Coordinator',
            roleVi: 'Điều phối Nhân sự & Vận hành Cộng đồng',
            schoolEn: 'Duy Tan University (2007)',
            schoolVi: 'Đại học Duy Tân (2007)',
            year: 2007,
            gpa: 'Honor Student',
            accoladesEn: 'HR & Media Lead Dak Lak Green Project • Youth Event Coordinator',
            accoladesVi: 'Trưởng ban HR & TT Dự án Xanh Đắk Lắk • Điều phối Sự kiện Trẻ',
            bioEn: 'Proactive International Business student with practical experience in human resources, youth community projects, organizational workflows with Notion & Google Sheets, and cross-cultural communication.',
            bioVi: 'Sinh viên ngành Kinh doanh Quốc tế năng nổ với kinh nghiệm thực tế trong công tác nhân sự, điều phối dự án cộng đồng thanh niên, quản trị dữ liệu công việc với Notion & Google Sheets và giao tiếp đối ngoại.',
            avatar: '../Avatar/baohan2007.jpg',
            url: 'builuubaohan/index.html',
            isOwner: false,
            verified: false,
            skills: ['HR Operations', 'Community Lead', 'Notion Arch', 'Google Sheets', 'Event Planning'],
            skillBars: [
                { name: 'Community Operations', val: 85 },
                { name: 'Talent & HR Coordination', val: 84 },
                { name: 'Productivity & Notion', val: 83 },
                { name: 'Interpersonal Communication', val: 87 }
            ],
            certs: [
                '../cer/Bảo Hân 2007/1.jpg',
                '../cer/Bảo Hân 2007/2.jpg'
            ]
        },
        {
            id: 'vuongquangtuan',
            nameEn: 'Vuong Quang Tuan',
            nameVi: 'Vương Quang Tuấn',
            tier: 'standard',
            tierLabel: 'A STANDARD (CREATIVE)',
            rankNumber: '#05',
            powerScore: 81.0,
            field: 'digital-marketing',
            majorId: 'digital-marketing',
            majorVi: 'Digital Marketing',
            majorEn: 'Digital Marketing',
            roleEn: 'Content Creator • Canva Graphic Design & CapCut Video Editor',
            roleVi: 'Sáng tạo Nội dung • Thiết kế Canva & Dựng Video CapCut',
            schoolEn: 'Duy Tan University (2005)',
            schoolVi: 'Đại học Duy Tân (2005)',
            year: 2005,
            gpa: 'Active Creative',
            accoladesEn: 'Canva Creative Design • CapCut Video Production • Social Content Creation',
            accoladesVi: 'Thiết kế Đồ họa Canva • Sản xuất Video CapCut • Sáng tạo Nội dung Kênh',
            bioEn: 'Creative media builder skilled in visual design with Canva, short-form video editing with CapCut, social channel management, and practical advertising campaign execution.',
            bioVi: 'Nhân sự sáng tạo nội dung năng động, thành thạo thiết kế hình ảnh với Canva, dựng video ngắn chuyên nghiệp với CapCut, quản trị fanpage mạng xã hội và hỗ trợ triển khai chiến dịch quảng cáo cơ bản.',
            avatar: '../Avatar/quangtuan2005.jpg',
            url: 'vuongquangtuan/index.html',
            isOwner: false,
            verified: false,
            skills: ['Canva Design', 'CapCut Editor', 'Content Creator', 'Fanpage Ops', 'Facebook Ads'],
            skillBars: [
                { name: 'Canva Graphic Design', val: 84 },
                { name: 'CapCut Video Editing', val: 85 },
                { name: 'Content Creation & Social Media', val: 82 },
                { name: 'Fanpage & Ad Operations', val: 80 }
            ],
            certs: []
        }
    ];

    /* ==========================================================================
       2. INTERACTIVE HARMONIC FLUID MESH (Teemous Brand Waves)
       ========================================================================== */
    function initHeroFluidCanvas() {
        const canvas = document.getElementById('hub-fluid-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

                let width = 0, height = 0;
        function resize() {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        let time = 0;
        let mouse = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            targetX: window.innerWidth / 2,
            targetY: window.innerHeight / 2
        };

        // Track cursor globally across the entire viewport so the glow seamlessly follows everywhere
        window.addEventListener('mousemove', (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
        }, { passive: true });

        // Harmonic fluid wave bands (Teemous Brand Palette: Cyan Laser #00F0FF, Violet #8B6CCF, Pink #FF2A85)
        const waveConfigs = [
            { speed: 0.009, freq: 0.0028, amp: 48, yRatio: 0.48, colorDark: 'rgba(0, 240, 255, 0.22)', colorLight: 'rgba(2, 132, 199, 0.18)', width: 2.5 },
            { speed: 0.013, freq: 0.0035, amp: 38, yRatio: 0.52, colorDark: 'rgba(139, 108, 207, 0.28)', colorLight: 'rgba(109, 40, 217, 0.2)', width: 2.0 },
            { speed: 0.008, freq: 0.0022, amp: 55, yRatio: 0.55, colorDark: 'rgba(255, 42, 133, 0.20)', colorLight: 'rgba(233, 30, 99, 0.16)', width: 2.0 },
            { speed: 0.016, freq: 0.0042, amp: 26, yRatio: 0.50, colorDark: 'rgba(0, 240, 255, 0.35)', colorLight: 'rgba(2, 132, 199, 0.25)', width: 1.5 }
        ];

        let isVisible = !document.hidden;
        let animId = null;

        function render() {
            time += 1;

            mouse.x += (mouse.targetX - mouse.x) * 0.05;
            mouse.y += (mouse.targetY - mouse.y) * 0.05;

            ctx.clearRect(0, 0, width, height);

            const isLight = document.documentElement.classList.contains('light-mode') || document.body.classList.contains('light-mode');

            waveConfigs.forEach((cfg, idx) => {
                const baseColor = isLight ? cfg.colorLight : cfg.colorDark;
                const baseY = height * cfg.yRatio;

                ctx.beginPath();
                ctx.moveTo(0, baseY);

                const step = 20;
                for (let x = 0; x <= width + step; x += step) {
                    const dx = x - mouse.x;
                    const dy = baseY - mouse.y;
                    const dist = Math.hypot(dx, dy);
                    const mouseDeflection = Math.max(0, (1 - dist / 320)) * 28 * Math.sin(time * 0.05 + idx);

                    const sin1 = Math.sin(x * cfg.freq + time * cfg.speed);
                    const sin2 = Math.cos(x * (cfg.freq * 1.5) - time * (cfg.speed * 0.8));
                    const y = baseY + (sin1 + sin2 * 0.5) * cfg.amp + mouseDeflection;

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

            // Ambient breathing glow behind center
            const glowGrad = ctx.createRadialGradient(
                mouse.x, mouse.y, 10,
                mouse.x, mouse.y, Math.min(width, height) * 0.45
            );
            if (isLight) {
                glowGrad.addColorStop(0, 'rgba(2, 132, 199, 0.06)');
                glowGrad.addColorStop(0.5, 'rgba(109, 40, 217, 0.03)');
                glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            } else {
                glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.10)');
                glowGrad.addColorStop(0.5, 'rgba(139, 108, 207, 0.05)');
                glowGrad.addColorStop(1, 'rgba(6, 6, 8, 0)');
            }

            ctx.fillStyle = glowGrad;
            ctx.fillRect(0, 0, width, height);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isVisible = false;
                if (animId) cancelAnimationFrame(animId);
            } else {
                isVisible = true;
                animId = requestAnimationFrame(renderLoop);
            }
        });

        function renderLoop() {
            if (!isVisible) return;
            render();
            animId = requestAnimationFrame(renderLoop);
        }

        renderLoop();
    }

    /* ==========================================================================
       4. 3D GYROSCOPIC CARD TILT & SPECULAR ENGINE (100% Scroll-Immune)
       ========================================================================== */
    function attach3DCardTilt(card) {
        if (!card) return;
        const trigger = card.closest('.hub-card-wrap') || card;

        let isHovered = false;
        let isOverButtons = false;
        let targetRotX = 0;
        let targetRotY = 0;
        let currentRotX = 0;
        let currentRotY = 0;
        let animFrameId = null;

        function tiltLoop() {
            if (!isHovered || isOverButtons) {
                targetRotX = 0;
                targetRotY = 0;
            }

            // Smooth spring damping towards target rotation
            currentRotX += (targetRotX - currentRotX) * 0.14;
            currentRotY += (targetRotY - currentRotY) * 0.14;

            card.style.setProperty('--tilt-x', currentRotX.toFixed(2) + 'deg');
            card.style.setProperty('--tilt-y', currentRotY.toFixed(2) + 'deg');

            if (isHovered || Math.abs(currentRotX) > 0.05 || Math.abs(currentRotY) > 0.05) {
                animFrameId = requestAnimationFrame(tiltLoop);
            } else {
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
                animFrameId = null;
            }
        }

        trigger.addEventListener('pointerenter', function () {
            isHovered = true;
            
            if (!animFrameId) {
                animFrameId = requestAnimationFrame(tiltLoop);
            }
        });

        trigger.addEventListener('pointermove', function (e) {
            const rect = trigger.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Clamped normalized coordinates [-1, 1]
            const normX = Math.max(-1, Math.min(1, (mouseX / rect.width) * 2 - 1));
            const normY = Math.max(-1, Math.min(1, (mouseY / rect.height) * 2 - 1));

            // When hovering near the bottom actions row, flatten card flat so clicking is 100% rock-solid
            isOverButtons = (mouseY / rect.height) > 0.76 || !!e.target.closest('.hub-card-actions');

            if (isOverButtons) {
                targetRotX = 0;
                targetRotY = 0;
            } else {
                const maxTilt = 8;
                targetRotX = -normY * maxTilt;
                targetRotY = normX * maxTilt;
            }

            const holoX = Math.max(0, Math.min(100, Math.round((mouseX / rect.width) * 100)));
            const holoY = Math.max(0, Math.min(100, Math.round((mouseY / rect.height) * 100)));
            card.style.setProperty('--holo-x', holoX + '%');
            card.style.setProperty('--holo-y', holoY + '%');
        }, { passive: true });

        trigger.addEventListener('pointerleave', function () {
            isHovered = false;
            isOverButtons = false;
        });
    }

    /* ==========================================================================
       5. HTML GENERATION & TEMPLATES
       ========================================================================== */
    function createHoloCardHTML(dossier) {
        const isVi = document.documentElement.lang === 'vi' || localStorage.getItem('td-lang') === 'vi';
        const name = isVi ? dossier.nameVi : dossier.nameEn;
        const role = isVi ? dossier.roleVi : dossier.roleEn;
        const school = isVi ? dossier.schoolVi : dossier.schoolEn;
        const inspectText = isVi ? 'XEM HỒ SƠ' : 'INSPECT DOSSIER';
        const powerText = isVi ? 'CHỈ SỐ NĂNG LỰC' : 'INDEX POWER';

        let skillsHtml = '';
        for (let i = 0; i < Math.min(3, dossier.skills.length); i++) {
            skillsHtml += '<span class="hub-skill-chip">' + dossier.skills[i] + '</span>';
        }

        const crown = dossier.isOwner ? '<div class="hub-owner-crown" title="Key Founder">🔑</div>' : '';

        return '<div class="hub-card-wrap" data-id="' + dossier.id + '" data-tier="' + dossier.tier + '" data-field="' + dossier.field + '">' +
            '<div class="hub-holo-card" data-tier="' + dossier.tier + '">' +
                '<div class="hub-card-avatar-wrap">' +
                    '<div class="hub-avatar-ring"></div>' +
                    '<div class="hub-card-img-wrap">' +
                        '<img src="' + dossier.avatar + '" alt="' + name + '" class="hub-card-img" loading="lazy">' +
                    '</div>' +
                    crown +
                '</div>' +
                '<div class="hub-card-identity">' +
                    '<div class="hub-card-name-row">' +
                        '<h4 class="hub-card-name">' + name + '</h4>' +
                        (dossier.verified ? '<img src="../Logo/tickxanh.png" alt="Verified" class="hub-verified-tick" title="Verified Dossier">' : '') +
                    '</div>' +
                    '<p class="hub-card-role">' + role + '</p>' +
                    '<p class="hub-card-school">' + school + '</p>' +
                '</div>' +
                '<div class="hub-card-power-meter">' +
                    '<div class="hub-power-score-label">' +
                        '<span data-en="INDEX POWER" data-vi="CHỈ SỐ NĂNG LỰC">' + powerText + '</span>' +
                        '<span class="hub-power-score-val">' + dossier.powerScore + '</span>' +
                    '</div>' +
                    '<div class="hub-meter-track">' +
                        '<div class="hub-meter-bar" style="width: ' + dossier.powerScore + '%;"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="hub-card-skill-chips">' + skillsHtml + '</div>' +
                '<div class="hub-card-actions">' +
                    '<button class="hub-btn-inspect" data-inspect="' + dossier.id + '" onclick="event.stopPropagation(); window.hubShowcaseInstance && window.hubShowcaseInstance.openDossierModal(&apos;' + dossier.id + '&apos;);">' +
                        '<span data-en="INSPECT DOSSIER" data-vi="XEM HỒ SƠ">' + inspectText + '</span>' +
                        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
                    '</button>' +
                    '<a href="' + dossier.url + '" class="hub-btn-direct" onclick="event.stopPropagation();" title="Open Full Portfolio" aria-label="Open Full Portfolio">' +
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>' +
                    '</a>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    function createAvailableSlotHTML(tierName) {
        const isVi = document.documentElement.lang === 'vi' || localStorage.getItem('td-lang') === 'vi';
        const slotTitle = isVi ? 'VỊ TRÍ TRỐNG' : 'SLOT AVAILABLE';
        const slotRole = isVi ? 'Chiêu mộ Tài năng Đỉnh cao' : 'Recruiting Top Talents';
        const slotBtn = isVi ? 'ỨNG TUYỂN' : 'APPLY DOSSIER';

        return '<div class="hub-card-wrap hub-slot-available-wrap">' +
            '<div class="hub-holo-card hub-slot-available" onclick="window.open(&apos;https://www.facebook.com/quang.sinh.5492&apos;, &apos;_blank&apos;)">' +
                '<div class="hub-wireframe-avatar">' +
                    '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>' +
                '</div>' +
                '<h4 class="hub-card-name" style="font-size: 0.95rem; color: var(--brand-cyan);" data-en="SLOT AVAILABLE" data-vi="VỊ TRÍ TRỐNG">' + slotTitle + '</h4>' +
                '<p class="hub-card-role" style="font-size: 0.65rem;" data-en="Recruiting Top Talents" data-vi="Chiêu mộ Tài năng">' + slotRole + '</p>' +
                '<div class="hub-card-actions" style="margin-top: 1.25rem;">' +
                    '<button class="hub-btn-inspect" style="border-color: var(--brand-cyan);">' +
                        '<span data-en="APPLY DOSSIER" data-vi="ỨNG TUYỂN">' + slotBtn + '</span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    function flipAnimate(container, renderCallback) {
        const cards = Array.from(container.querySelectorAll('.hub-card-wrap'));
        const firstPositions = new Map();

        cards.forEach(card => {
            firstPositions.set(card, card.getBoundingClientRect());
        });

        renderCallback();

        const newCards = Array.from(container.querySelectorAll('.hub-card-wrap'));

        requestAnimationFrame(() => {
            newCards.forEach(card => {
                const first = firstPositions.get(card);
                if (first) {
                    const last = card.getBoundingClientRect();
                    const deltaX = first.left - last.left;
                    const deltaY = first.top - last.top;

                    if (deltaX !== 0 || deltaY !== 0) {
                        card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        card.style.transition = 'none';

                        requestAnimationFrame(() => {
                            card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
                            card.style.transform = '';
                        });
                    }
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                        card.style.opacity = '1';
                        card.style.transform = '';
                    });
                }
            });
        });
    }

    /* ==========================================================================
       5. MAIN SHOWCASE MANAGER CLASS
       ========================================================================== */
    class HubShowcaseManager {
        constructor() {
            this.activeTier = 'all';
            this.activeField = 'all';
            this.activeMajor = 'all';
            this.activeSkill = 'all';
            this.searchQuery = '';
            this.sortBy = 'power';
            this.viewMode = 'tier-hierarchy';

            this.mount();
        }

        mount() {
            window.hubShowcaseInstance = this;
            this.renderShowcaseStructure();
            this.bindEvents();
            initHeroFluidCanvas();
            this.applyFilters();
        }

        renderShowcaseStructure() {
            const container = document.getElementById('hub-showcase-mount');
            if (!container) return;

            const isVi = document.documentElement.lang === 'vi' || localStorage.getItem('td-lang') === 'vi';

            container.innerHTML = 
            '<canvas id="hub-fluid-canvas"></canvas>' +
            '<!-- EDITORIAL BRAND HERO CHAMBER -->' +
            '<div class="hub-hero-wrapper">' +
                '<div class="hub-hero-main">' +
                    '<div class="hero-brand-pill">' +
                        '<span class="meta-dot"></span>' +
                        '<span data-en="TEEMOUS DIGITAL // VERIFIED GEN Z ECOSYSTEM" data-vi="HỆ SINH THÁI TÀI NĂNG GEN Z // TEEMOUS DIGITAL">' + (isVi ? 'HỆ SINH THÁI TÀI NĂNG GEN Z // TEEMOUS DIGITAL' : 'TEEMOUS DIGITAL // VERIFIED GEN Z ECOSYSTEM') + '</span>' +
                    '</div>' +
                    '<h1 class="editorial-hero-title">' +
                        '<span class="mask-wrap"><span class="title-line">PORTFOLIO</span></span> ' +
                        '<span class="mask-wrap"><span class="title-line editorial-hero-sub">HUB</span></span>' +
                    '</h1>' +
                    '<p class="hub-hero-lead" data-en="Discover elite Gen Z creators, software engineers, and digital growth leaders." data-vi="Khám phá các tài năng Gen Z, kỹ sư phần mềm và thủ lĩnh truyền thông trong hệ sinh thái Teemous.">' +
                        (isVi ? 'Khám phá các tài năng Gen Z, kỹ sư phần mềm và thủ lĩnh truyền thông trong hệ sinh thái Teemous.' : 'Discover elite Gen Z creators, software engineers, and digital growth leaders.') +
                    '</p>' +
                '</div>' +
                '<div class="hub-telemetry-ribbon">' +
                    '<div class="hub-stat-box">' +
                        '<div class="hub-stat-val">02</div>' +
                        '<div class="hub-stat-label" data-en="VERIFIED DOSSIERS" data-vi="HỒ SƠ XÁC MINH">' + (isVi ? 'HỒ SƠ XÁC MINH' : 'VERIFIED DOSSIERS') + '</div>' +
                    '</div>' +
                    '<div class="hub-stat-box">' +
                        '<div class="hub-stat-val">S</div>' +
                        '<div class="hub-stat-label" data-en="APEX PEAK RANK" data-vi="THỨ HẠNG ĐỈNH CAO">' + (isVi ? 'THỨ HẠNG ĐỈNH CAO' : 'APEX PEAK RANK') + '</div>' +
                    '</div>' +
                    '<div class="hub-stat-box">' +
                        '<div class="hub-stat-val">93.5</div>' +
                        '<div class="hub-stat-label" data-en="MAX POWER INDEX" data-vi="CHỈ SỐ NĂNG LỰC TỐI ĐA">' + (isVi ? 'CHỈ SỐ NĂNG LỰC TỐI ĐA' : 'MAX POWER INDEX') + '</div>' +
                    '</div>' +
                    '<div class="hub-stat-box">' +
                        '<div class="hub-stat-val">100%</div>' +
                        '<div class="hub-stat-label" data-en="AUTHENTICITY RATE" data-vi="TỶ LỆ XÁC THỰC">' + (isVi ? 'TỶ LỆ XÁC THỰC' : 'AUTHENTICITY RATE') + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="hub-hud-container container mx-auto px-4">' +
                '<div class="hub-hud-deck">' +
                    '<!-- TIER BENCHMARK & RUBRICS NOTE BOX -->' +
                    '<div class="hub-criteria-note-box">' +
                        '<div class="hub-criteria-header">' +
                            '<div class="hub-criteria-title-wrap">' +
                                '<span class="hub-criteria-icon">⚖️</span>' +
                                '<span class="hub-criteria-title" data-en="OFFICIAL EVALUATION CRITERIA &amp; TIER FRAMEWORK" data-vi="QUY CHẾ XÉT BẬC &amp; ĐIỂM NĂNG LỰC TOÀN DIỆN">' + (isVi ? 'QUY CHẾ XÉT BẬC &amp; ĐIỂM NĂNG LỰC TOÀN DIỆN' : 'OFFICIAL EVALUATION CRITERIA &amp; TIER FRAMEWORK') + '</span>' +
                            '</div>' +
                            '<button type="button" id="hub-criteria-toggle-btn" class="hub-criteria-toggle">' +
                                '<span id="hub-criteria-toggle-text" data-en="View Criteria Details ▼" data-vi="Xem chi tiết quy chế ▼">' + (isVi ? 'Xem chi tiết quy chế ▼' : 'View Criteria Details ▼') + '</span>' +
                            '</button>' +
                        '</div>' +
                        '<p class="hub-criteria-summary" data-en="Power score is evaluated objectively based on authentic community value, working products, and demonstrated execution capacity across all fields (not restricted to any single narrow major)." data-vi="Điểm năng lực được đánh giá công tâm dựa trên giá trị thực tế tạo ra cho cộng đồng, sản phẩm thực chiến và năng lực thực thi trên bình diện chung (không gò bó cứng nhắc theo từng chuyên ngành riêng biệt).">' +
                            (isVi ? 'Điểm năng lực được đánh giá công tâm dựa trên giá trị thực tế tạo ra cho cộng đồng, sản phẩm thực chiến và năng lực thực thi trên bình diện chung (không gò bó cứng nhắc theo từng chuyên ngành riêng biệt).' : 'Power score is evaluated objectively based on authentic community value, working products, and demonstrated execution capacity across all fields (not restricted to any single narrow major).') +
                        '</p>' +
                        '<div id="hub-criteria-details" class="hub-criteria-details" style="display: none;">' +
                            '<div class="hub-tier-threshold-grid">' +
                                '<div class="threshold-card s-plus">' +
                                    '<div class="threshold-header">' +
                                        '<span class="threshold-tier-tag s-plus">S+ APEX</span>' +
                                        '<span class="threshold-score">&ge; 95.0</span>' +
                                    '</div>' +
                                    '<p class="threshold-desc" data-en="Ecosystem architects with breakthrough community impact and large-scale autonomous deliverables." data-vi="Thủ lĩnh kiến tạo hệ sinh thái, dẫn dắt dự án lớn và tạo tác động cộng đồng đột phá.">Thủ lĩnh kiến tạo hệ sinh thái, dẫn dắt dự án lớn và tạo tác động cộng đồng đột phá.</p>' +
                                '</div>' +
                                '<div class="hub-tier-rule-card tier-rule-s threshold-card s">' +
                                    '<div class="threshold-header">' +
                                        '<span class="threshold-tier-tag s">S PROFESSIONAL</span>' +
                                        '<span class="threshold-score">90.0 – 94.9</span>' +
                                    '</div>' +
                                    '<p class="threshold-desc" data-en="Exceptional domain specialists with verified high-impact products and independent execution capacity." data-vi="Chuyên môn thực chiến xuất sắc, hoàn thiện sản phẩm độc lập chất lượng cao, thành tích thực tế rõ ràng.">Chuyên môn thực chiến xuất sắc, hoàn thiện sản phẩm độc lập chất lượng cao, thành tích thực tế rõ ràng.</p>' +
                                '</div>' +
                                '<div class="hub-tier-rule-card tier-rule-a-plus threshold-card a-plus">' +
                                    '<div class="threshold-header">' +
                                        '<span class="threshold-tier-tag a-plus">A+ IMPRESSIVE</span>' +
                                        '<span class="threshold-score">85.0 – 89.9</span>' +
                                    '</div>' +
                                    '<p class="threshold-desc" data-en="Solid core technical foundation, actively deploying practical deliverables with strong growth potential." data-vi="Nền tảng kỹ năng vững vàng, chủ động triển khai sản phẩm thực tế và có tiềm năng bứt phá mạnh mẽ.">Nền tảng kỹ năng vững vàng, chủ động triển khai sản phẩm thực tế và có tiềm năng bứt phá mạnh mẽ.</p>' +
                                '</div>' +
                                '<div class="hub-tier-rule-card tier-rule-a threshold-card a">' +
                                    '<div class="threshold-header">' +
                                        '<span class="threshold-tier-tag a">A STANDARD</span>' +
                                        '<span class="threshold-score">80.0 – 84.9</span>' +
                                    '</div>' +
                                    '<p class="threshold-desc" data-en="Proficient with essential specialized toolkits, agile execution mindset, and proactive learner attitude." data-vi="Thành thạo công cụ chuyên môn thiết yếu, tác phong thực thi nhanh nhẹn và tinh thần cầu tiến.">Thành thạo công cụ chuyên môn thiết yếu, tác phong thực thi nhanh nhẹn và tinh thần cầu tiến.</p>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="hub-hud-top-row">' +
                        '<div class="hub-search-box">' +
                            '<svg class="hub-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
                            '<input type="text" id="hub-search-input" class="hub-search-input" placeholder="' + (isVi ? 'Tìm theo tên, vai trò, trường, kỹ năng...' : 'Search by name, role, school, skills...') + '"' +
                                   ' data-en-placeholder="Search by name, role, school, skills..." data-vi-placeholder="Tìm theo tên, vai trò, trường, kỹ năng...">' +
                            '<button id="hub-search-clear" class="hub-search-clear" title="Clear">✕</button>' +
                        '</div>' +
                        '<div class="hub-view-switch">' +
                            '<button class="hub-view-btn active" data-view="tier-hierarchy">' +
                                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>' +
                                '<span data-en="Tier Hierarchy" data-vi="Bậc Xếp Hạng">' + (isVi ? 'Bậc Xếp Hạng' : 'Tier Hierarchy') + '</span>' +
                            '</button>' +
                            '<button class="hub-view-btn" data-view="holo-grid">' +
                                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' +
                                '<span data-en="3D Holo Grid" data-vi="Lưới 3D Holo">' + (isVi ? 'Lưới 3D Holo' : '3D Holo Grid') + '</span>' +
                            '</button>' +
                            '<button class="hub-view-btn" data-view="benchmark-matrix">' +
                                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' +
                                '<span data-en="Benchmark Matrix" data-vi="Ma Trận So Sánh">' + (isVi ? 'Ma Trận So Sánh' : 'Benchmark Matrix') + '</span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="hub-tier-selector-bar">' +
                        '<button class="hub-tier-chip active" data-tier="all">' +
                            '<span class="hub-tier-badge-letter" style="background: rgba(255,255,255,0.2);">ALL</span>' +
                            '<span data-en="ALL TIERS" data-vi="TẤT CẢ BẬC">' + (isVi ? 'TẤT CẢ BẬC' : 'ALL TIERS') + '</span>' +
                            '<span class="hub-chip-count">(5)</span>' +
                        '</button>' +
                        '<button class="hub-tier-chip" data-tier="elite">' +
                            '<span class="hub-tier-badge-letter" style="color: #B026FF;">S+</span>' +
                            '<span data-en="ELITE (APEX)" data-vi="TINH HOA (ĐỈNH CAO)">' + (isVi ? 'TINH HOA (ĐỈNH CAO)' : 'ELITE (APEX)') + '</span>' +
                            '<span class="hub-chip-count">(0)</span>' +
                        '</button>' +
                        '<button class="hub-tier-chip" data-tier="professional">' +
                            '<span class="hub-tier-badge-letter" style="color: #FFB800;">S</span>' +
                            '<span data-en="PROFESSIONAL" data-vi="CHUYÊN NGHIỆP">' + (isVi ? 'CHUYÊN NGHIỆP' : 'PROFESSIONAL') + '</span>' +
                            '<span class="hub-chip-count">(1)</span>' +
                        '</button>' +
                        '<button class="hub-tier-chip" data-tier="impressive">' +
                            '<span class="hub-tier-badge-letter" style="color: #00FF88;">A+</span>' +
                            '<span data-en="IMPRESSIVE" data-vi="ẤN TƯỢNG">' + (isVi ? 'ẤN TƯỢNG' : 'IMPRESSIVE') + '</span>' +
                            '<span class="hub-chip-count">(2)</span>' +
                        '</button>' +
                        '<button class="hub-tier-chip" data-tier="standard">' +
                            '<span class="hub-tier-badge-letter" style="color: #00F0FF;">A</span>' +
                            '<span data-en="STANDARD" data-vi="TIÊU CHUẨN">' + (isVi ? 'TIÊU CHUẨN' : 'STANDARD') + '</span>' +
                            '<span class="hub-chip-count">(2)</span>' +
                        '</button>' +
                    '</div>' +
                    '<div class="hub-secondary-filter-row">' +
                        '<div class="hub-sector-pills">' +
                            '<button class="hub-sector-btn active" data-field="all" data-en="All Fields" data-vi="Tất cả Lĩnh vực">' + (isVi ? 'Tất cả Lĩnh vực' : 'All Fields') + '</button>' +
                            '<button class="hub-sector-btn" data-field="it" data-en="Tech &amp; Systems" data-vi="Công nghệ &amp; Hệ thống">' + (isVi ? 'Công nghệ &amp; Hệ thống' : 'Tech &amp; Systems') + '</button>' +
                            '<button class="hub-sector-btn" data-field="digital-marketing" data-en="Growth &amp; Media" data-vi="Truyền thông &amp; Tăng trưởng">' + (isVi ? 'Truyền thông &amp; Tăng trưởng' : 'Growth &amp; Media') + '</button>' +
                            '<button class="hub-sector-btn" data-field="business" data-en="Business &amp; Ops" data-vi="Kinh doanh &amp; Quản trị">' + (isVi ? 'Kinh doanh &amp; Quản trị' : 'Business &amp; Ops') + '</button>' +
                        '</div>' +
                        '<div class="hub-sort-dropdown-wrap">' +
                            '<span class="hub-sort-label" data-en="SORT BY:" data-vi="SẮP XẾP:">' + (isVi ? 'SẮP XẾP:' : 'SORT BY:') + '</span>' +
                            '<select id="hub-sort-select" class="hub-sort-select">' +
                                '<option value="power">' + (isVi ? 'Chỉ số Năng lực (Cao đến Thấp)' : 'Power Index (High to Low)') + '</option>' +
                                '<option value="rank">' + (isVi ? 'Bậc Thứ Hạng' : 'Rank Tier') + '</option>' +
                                '<option value="name">' + (isVi ? 'Tên (A-Z)' : 'Name (A-Z)') + '</option>' +
                                '<option value="year">' + (isVi ? 'Khóa / Năm' : 'Graduation / Batch') + '</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>' +
                    '<!-- ACADEMIC MAJOR FILTER ROW -->' +
                    '<div class="hub-major-filter-row">' +
                        '<div class="hub-major-filter-label">' +
                            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>' +
                            '<span data-en="ACADEMIC MAJOR:" data-vi="NGÀNH THEO HỌC:">' + (isVi ? 'NGÀNH THEO HỌC:' : 'ACADEMIC MAJOR:') + '</span>' +
                        '</div>' +
                        '<div class="hub-major-pills">' +
                            '<button class="hub-major-btn active" data-major="all" data-en="All Majors" data-vi="Tất cả Ngành">' + (isVi ? 'Tất cả Ngành' : 'All Majors') + '</button>' +
                            '<button class="hub-major-btn" data-major="computer-science" data-en="Computer Science" data-vi="Khoa học Máy tính / CNTT">' + (isVi ? 'Khoa học Máy tính / CNTT' : 'Computer Science') + '</button>' +
                            '<button class="hub-major-btn" data-major="software-engineering" data-en="Software Engineering" data-vi="Kỹ nghệ Phần mềm">' + (isVi ? 'Kỹ nghệ Phần mềm' : 'Software Engineering') + '</button>' +
                            '<button class="hub-major-btn" data-major="digital-marketing" data-en="Digital Marketing" data-vi="Digital Marketing">Digital Marketing</button>' +
                            '<button class="hub-major-btn" data-major="international-business" data-en="International Business" data-vi="Kinh doanh Quốc tế">' + (isVi ? 'Kinh doanh Quốc tế' : 'International Business') + '</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="hub-skills-filter-row">' +
                        '<div class="hub-skills-filter-label">' +
                            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
                            '<span data-en="ANIMATION &amp; TECH MATRIX:" data-vi="KỸ NĂNG CHUYỂN ĐỘNG &amp; CÔNG NGHỆ:">' + (isVi ? 'KỸ NĂNG CHUYỂN ĐỘNG &amp; CÔNG NGHỆ:' : 'ANIMATION &amp; TECH MATRIX:') + '</span>' +
                        '</div>' +
                        '<div class="hub-skill-filter-pills">' +
                            '<button class="hub-skill-filter-btn active" data-skill="all" data-en="All Specialties" data-vi="Tất cả Kỹ năng">' + (isVi ? 'Tất cả Kỹ năng' : 'All Specialties') + '</button>' +
                            '<button class="hub-skill-filter-btn" data-skill="algorithms" data-en="🏆 Thuật toán &amp; ICPC" data-vi="🏆 Thuật toán &amp; ICPC">🏆 Thuật toán &amp; ICPC</button>' +
                            '<button class="hub-skill-filter-btn" data-skill="web-dev" data-en="🌐 Full-Stack &amp; Web" data-vi="🌐 Full-Stack &amp; Web">🌐 Full-Stack &amp; Web</button>' +
                            '<button class="hub-skill-filter-btn" data-skill="backend-apis" data-en="💻 Backend &amp; APIs" data-vi="💻 Backend &amp; APIs">💻 Backend &amp; APIs</button>' +
                            '<button class="hub-skill-filter-btn" data-skill="ai-automation" data-en="🤖 AI &amp; AppsScript" data-vi="🤖 AI &amp; AppsScript">🤖 AI &amp; AppsScript</button>' +
                            '<button class="hub-skill-filter-btn" data-skill="canva-design" data-en="🎨 Thiết kế Canva" data-vi="🎨 Thiết kế Canva">🎨 Thiết kế Canva</button>' +
                            '<button class="hub-skill-filter-btn" data-skill="capcut-editor" data-en="🎬 Dựng Video CapCut" data-vi="🎬 Dựng Video CapCut">🎬 Dựng Video CapCut</button>' +
                            '<button class="hub-skill-filter-btn" data-skill="hr-community" data-en="👥 Nhân sự &amp; Cộng đồng" data-vi="👥 Nhân sự &amp; Cộng đồng">👥 Nhân sự &amp; Cộng đồng</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div id="hub-results-container" class="hub-results-area"></div>' +
            '</div>' +
            '<div id="hub-dossier-modal" class="hub-modal-overlay">' +
                '<div class="hub-modal-dossier">' +
                    '<button id="hub-modal-close-btn" class="hub-modal-close" aria-label="Close">✕</button>' +
                    '<div id="hub-modal-content" class="contents"></div>' +
                '</div>' +
            '</div>';
        }

        bindEvents() {
            const searchInput = document.getElementById('hub-search-input');
            const clearBtn = document.getElementById('hub-search-clear');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.searchQuery = e.target.value.trim().toLowerCase();
                    if (clearBtn) {
                        clearBtn.classList.toggle('visible', this.searchQuery.length > 0);
                    }
                    this.applyFilters();
                });
            }
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    if (searchInput) {
                        searchInput.value = '';
                        this.searchQuery = '';
                        clearBtn.classList.remove('visible');
                        this.applyFilters();
                    }
                });
            }

            const tierChips = document.querySelectorAll('.hub-tier-chip');
            tierChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    tierChips.forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    this.activeTier = chip.getAttribute('data-tier');
                    this.applyFilters();
                });
            });

            const sectorBtns = document.querySelectorAll('.hub-sector-btn');
            sectorBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    sectorBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.activeField = btn.getAttribute('data-field');
                    this.applyFilters();
                });
            });

            // Criteria Toggle
            const criteriaBtn = document.getElementById('hub-criteria-toggle-btn');
            const criteriaDetails = document.getElementById('hub-criteria-details');
            const criteriaText = document.getElementById('hub-criteria-toggle-text');
            if (criteriaBtn && criteriaDetails) {
                let isCriteriaOpen = false;
                criteriaBtn.addEventListener('click', () => {
                    isCriteriaOpen = !isCriteriaOpen;
                    criteriaDetails.style.display = isCriteriaOpen ? 'block' : 'none';
                    if (criteriaText) {
                        const isVi = document.documentElement.lang === 'vi' || localStorage.getItem('td-lang') === 'vi';
                        criteriaText.textContent = isCriteriaOpen 
                            ? (isVi ? 'Thu gọn quy chế ▲' : 'Collapse Criteria ▲')
                            : (isVi ? 'Xem chi tiết quy chế ▼' : 'View Criteria Details ▼');
                    }
                });
            }

            // Major Filter Buttons
            const majorBtns = document.querySelectorAll('.hub-major-btn');
            majorBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    majorBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.activeMajor = btn.getAttribute('data-major');
                    this.applyFilters();
                });
            });

            const skillBtns = document.querySelectorAll('.hub-skill-filter-btn');
            skillBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    skillBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.activeSkill = btn.getAttribute('data-skill');
                    this.applyFilters();
                });
            });

            // Listen to global td-state-change to re-render properly on language change
            window.addEventListener('td-state-change', (e) => {
                if (e.detail && e.detail.type === 'lang') {
                    this.renderShowcaseStructure();
                    this.bindEvents();
                    this.applyFilters();
                }
            });

            const viewBtns = document.querySelectorAll('.hub-view-btn');
            viewBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    viewBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.viewMode = btn.getAttribute('data-view');
                    this.applyFilters();
                });
            });

            const sortSelect = document.getElementById('hub-sort-select');
            if (sortSelect) {
                sortSelect.addEventListener('change', (e) => {
                    this.sortBy = e.target.value;
                    this.applyFilters();
                });
            }

            document.addEventListener('click', (e) => {
                if (e.target.closest('.hub-btn-direct')) return;

                if (e.target.closest('#hub-modal-close-btn')) {
                    this.closeDossierModal();
                    return;
                }

                const overlay = document.getElementById('hub-dossier-modal');
                if (e.target === overlay) {
                    this.closeDossierModal();
                    return;
                }

                const inspectTarget = e.target.closest('[data-inspect]');
                if (inspectTarget) {
                    const id = inspectTarget.getAttribute('data-inspect');
                    if (id) {
                        this.openDossierModal(id);
                    }
                    return;
                }
            });

                        document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeDossierModal();
                }
            });
        }

        getFilteredDossiers() {
            let list = [...DOSSIERS];

            if (this.activeTier !== 'all') {
                list = list.filter(d => d.tier === this.activeTier);
            }

            if (this.activeField !== 'all') {
                list = list.filter(d => d.field === this.activeField);
            }

            if (this.activeMajor && this.activeMajor !== 'all') {
                list = list.filter(d => d.majorId === this.activeMajor);
            }

            if (this.activeSkill && this.activeSkill !== 'all') {
                list = list.filter(d => d.skills.some(s => {
                    const lower = s.toLowerCase();
                    if (this.activeSkill === '3d-motion') return lower.includes('3d') || lower.includes('webgl') || lower.includes('motion');
                    if (this.activeSkill === 'kinetic-ui') return lower.includes('kinetic') || lower.includes('ui') || lower.includes('asset motion');
                    if (this.activeSkill === 'algorithms') return lower.includes('algorithm') || lower.includes('icpc');
                    if (this.activeSkill === 'ai-automation') return lower.includes('ai') || lower.includes('automation') || lower.includes('system');
                    if (this.activeSkill === 'growth-ops') return lower.includes('growth') || lower.includes('paid') || lower.includes('campaign') || lower.includes('business') || lower.includes('viral');
                    return false;
                }));
            }

            if (this.searchQuery) {
                const q = this.searchQuery;
                list = list.filter(d => {
                    const matchName = d.nameEn.toLowerCase().includes(q) || d.nameVi.toLowerCase().includes(q);
                    const matchRole = d.roleEn.toLowerCase().includes(q) || d.roleVi.toLowerCase().includes(q);
                    const matchSchool = d.schoolEn.toLowerCase().includes(q) || d.schoolVi.toLowerCase().includes(q);
                    const matchSkills = d.skills.some(s => s.toLowerCase().includes(q));
                    return matchName || matchRole || matchSchool || matchSkills;
                });
            }

            if (this.sortBy === 'power') {
                list.sort((a, b) => b.powerScore - a.powerScore);
            } else if (this.sortBy === 'name') {
                list.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
            } else if (this.sortBy === 'year') {
                list.sort((a, b) => a.year - b.year);
            } else if (this.sortBy === 'rank') {
                const tierWeights = { elite: 4, professional: 3, impressive: 2, standard: 1 };
                list.sort((a, b) => (tierWeights[b.tier] || 0) - (tierWeights[a.tier] || 0));
            }

            return list;
        }

        applyFilters() {
            const container = document.getElementById('hub-results-container');
            if (!container) return;

            const filtered = this.getFilteredDossiers();

            flipAnimate(container, () => {
                if (filtered.length === 0) {
                    container.innerHTML = 
                    '<div class="hub-no-match-box">' +
                        '<svg class="mx-auto mb-4 text-neutral-500" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>' +
                        '<h3 class="text-lg font-black uppercase text-neutral-300 mb-2" data-en="No Matching Dossiers Found" data-vi="Không Tìm Thấy Hồ Sơ Phù Hợp">No Matching Dossiers Found</h3>' +
                        '<p class="text-xs text-neutral-500" data-en="Try adjusting your tier, sector, or search keyword." data-vi="Vui lòng thử điều chỉnh bộ lọc cấp độ, ngành hoặc từ khóa tìm kiếm.">Try adjusting your tier, sector, or search keyword.</p>' +
                    '</div>';
                    return;
                }

                if (this.viewMode === 'tier-hierarchy') {
                    this.renderTierHierarchyView(container, filtered);
                } else if (this.viewMode === 'holo-grid') {
                    this.renderHoloGridView(container, filtered);
                } else if (this.viewMode === 'benchmark-matrix') {
                    this.renderBenchmarkMatrixView(container, filtered);
                }

                container.querySelectorAll('.hub-holo-card').forEach(card => {
                    attach3DCardTilt(card);
                });
                if (typeof window.updateAllTranslations === 'function') { window.updateAllTranslations(); }
            });
        }

        renderTierHierarchyView(container, dossiers) {
            const isVi = document.documentElement.lang === 'vi' || localStorage.getItem('td-lang') === 'vi';
            const tiers = [
                {
                    key: 'elite',
                    letter: 'S+',
                    nameEn: 'ELITE (APEX OVERCLOCK)',
                    nameVi: 'TINH HOA (ĐỈNH CAO NĂNG LỰC)',
                    descEn: 'Exceptional mastery, national honors & top academic benchmark',
                    descVi: 'Năng lực vượt trội, giải thưởng quốc gia & chuẩn mực học thuật cao nhất',
                    powerThreshold: '95.0+',
                    barColor: 'linear-gradient(90deg, #B026FF, #00F0FF)'
                },
                {
                    key: 'professional',
                    letter: 'S',
                    nameEn: 'PROFESSIONAL (ARCHITECT)',
                    nameVi: 'CHUYÊN NGHIỆP (THỦ LĨNH THỰC THI)',
                    descEn: 'Proven engineering leadership, backend architecture & execution',
                    descVi: 'Năng lực chuyên môn vững chắc, kiến trúc backend & thực thi sản phẩm',
                    powerThreshold: '90.0 – 94.9',
                    barColor: 'linear-gradient(90deg, #FFB800, #FF5722)'
                },
                {
                    key: 'impressive',
                    letter: 'A+',
                    nameEn: 'IMPRESSIVE (VANGUARD)',
                    nameVi: 'ẤN TƯỢNG (TIÊN PHONG ĐỔI MỚI)',
                    descEn: 'Dynamic digital solutions, automation systems & growth leadership',
                    descVi: 'Giải pháp số năng động, hệ thống tự động hóa & dẫn dắt tăng trưởng',
                    powerThreshold: '85.0 – 89.9',
                    barColor: 'linear-gradient(90deg, #00FF88, #00B0FF)'
                },
                {
                    key: 'standard',
                    letter: 'A',
                    nameEn: 'STANDARD (TACTICAL)',
                    nameVi: 'TIÊU CHUẨN (TÁC CHIẾN LINH HOẠT)',
                    descEn: 'Agile creative execution, visual design, HR & media operations',
                    descVi: 'Thực thi sáng tạo linh hoạt, thiết kế hình ảnh, nhân sự & truyền thông',
                    powerThreshold: '80.0 – 84.9',
                    barColor: 'linear-gradient(90deg, #64748B, #00E5FF)'
                }
            ];

            let html = '<div class="hub-tier-brackets-container">';

            tiers.forEach(t => {
                const inTier = dossiers.filter(d => d.tier === t.key);
                if (inTier.length === 0 && this.activeTier !== 'all') return;

                html += '<div class="hub-tier-bracket" data-tier="' + t.key + '">' +
                    '<div class="hub-bracket-header">' +
                        '<div class="hub-bracket-left">' +
                            '<div class="hub-rank-shield ' + t.key + '">' + t.letter + '</div>' +
                            '<div class="hub-bracket-info">' +
                                '<h3><span data-en="' + t.nameEn + '" data-vi="' + t.nameVi + '">' + (isVi ? t.nameVi : t.nameEn) + '</span></h3>' +
                                '<p data-en="' + t.descEn + '" data-vi="' + t.descVi + '">' + (isVi ? t.descVi : t.descEn) + '</p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="hub-power-gauge-wrap">' +
                            '<span class="text-[11px] font-mono font-bold text-neutral-400">PWR ' + t.powerThreshold + '</span>' +
                            '<div class="hub-power-gauge-bar">' +
                                '<div class="hub-power-gauge-fill" style="width: 100%; background: ' + t.barColor + ';"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="hub-bracket-grid">' +
                        inTier.map(d => createHoloCardHTML(d)).join('') +
                        (((this.activeTier === 'all' || this.activeTier === t.key)) ? createAvailableSlotHTML(t.nameEn) : '') +
                    '</div>' +
                '</div>';
            });

            html += '</div>';
            container.innerHTML = html;
        }

        renderHoloGridView(container, dossiers) {
            let html = '<div class="hub-holo-grid-layout">';
            html += dossiers.map(d => createHoloCardHTML(d)).join('');
            html += createAvailableSlotHTML('Recruitment Open');
            html += '</div>';
            container.innerHTML = html;
        }

        renderBenchmarkMatrixView(container, dossiers) {
            let html = '<div class="hub-benchmark-table-wrap">' +
                '<table class="hub-benchmark-table">' +
                    '<thead>' +
                        '<tr>' +
                            '<th data-en="RANK" data-vi="HẠNG">RANK</th>' +
                            '<th data-en="CREATOR &amp; DOMAIN" data-vi="TÀI NĂNG &amp; LĨNH VỰC">CREATOR &amp; DOMAIN</th>' +
                            '<th data-en="TIER LEVEL" data-vi="CẤP ĐỘ">TIER LEVEL</th>' +
                            '<th data-en="POWER INDEX" data-vi="CHỈ SỐ NĂNG LỰC">POWER INDEX</th>' +
                            '<th data-en="KEY HIGHLIGHTS" data-vi="THẾ MẠNH CHỦ CHỐT">KEY HIGHLIGHTS</th>' +
                            '<th data-en="ACCOLADES" data-vi="THÀNH TÍCH">ACCOLADES</th>' +
                            '<th data-en="ACTIONS" data-vi="THAO TÁC">ACTIONS</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>';

            dossiers.forEach(d => {
                const isVi = document.documentElement.lang === 'vi' || localStorage.getItem('td-lang') === 'vi';
                const name = isVi ? d.nameVi : d.nameEn;
                const role = isVi ? d.roleVi : d.roleEn;
                const accolades = isVi ? d.accoladesVi : d.accoladesEn;

                let skillChips = '';
                for (let i = 0; i < Math.min(2, d.skills.length); i++) {
                    skillChips += '<span class="hub-skill-chip">' + d.skills[i] + '</span>';
                }

                html += '<tr>' +
                    '<td class="font-mono font-black text-sm" style="color: var(--brand-cyan);">' + d.rankNumber + '</td>' +
                    '<td>' +
                        '<div class="hub-table-talent-cell">' +
                            '<img src="' + d.avatar + '" alt="' + name + '" class="hub-table-avatar" data-tier="' + d.tier + '">' +
                            '<div>' +
                                '<div class="font-black text-sm text-[var(--hub-text-main)] flex items-center gap-1.5">' +
                                    name +
                                    (d.verified ? '<img src="../Logo/tickxanh.png" alt="Verified" style="width: 14px; height: 14px;">' : '') +
                                '</div>' +
                                '<div class="text-[11px] text-neutral-400">' + role + '</div>' +
                            '</div>' +
                        '</div>' +
                    '</td>' +
                    '<td>' +
                        '<span class="font-mono font-extrabold text-xs uppercase px-2.5 py-1 rounded-md" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);">' +
                            d.tierLabel +
                        '</span>' +
                    '</td>' +
                    '<td>' +
                        '<div class="flex items-center gap-2">' +
                            '<span class="font-mono font-black text-sm" style="color: var(--brand-cyan);">' + d.powerScore + '</span>' +
                            '<div class="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">' +
                                '<div class="h-full bg-gradient-to-r from-pink-500 to-cyan-400" style="width: ' + d.powerScore + '%;"></div>' +
                            '</div>' +
                        '</div>' +
                    '</td>' +
                    '<td><div class="flex flex-wrap gap-1">' + skillChips + '</div></td>' +
                    '<td class="text-xs text-neutral-400 max-w-xs">' + accolades + '</td>' +
                    '<td>' +
                        '<button class="hub-btn-inspect" style="padding: 0.4rem 0.8rem; font-size: 0.68rem;" data-inspect="' + d.id + '" onclick="event.stopPropagation(); window.hubShowcaseInstance && window.hubShowcaseInstance.openDossierModal(&apos;' + d.id + '&apos;);">' +
                            '<span data-en="INSPECT" data-vi="CHI TIẾT">INSPECT</span>' +
                        '</button>' +
                    '</td>' +
                '</tr>';
            });

            html += '</tbody></table></div>';
            container.innerHTML = html;
        }

        openDossierModal(id) {
            const dossier = DOSSIERS.find(d => d.id === id);
            if (!dossier) return;

            const modal = document.getElementById('hub-dossier-modal');
            const content = document.getElementById('hub-modal-content');
            if (!modal || !content) return;

            const isVi = document.documentElement.lang === 'vi' || localStorage.getItem('td-lang') === 'vi';
            const name = isVi ? dossier.nameVi : dossier.nameEn;
            const role = isVi ? dossier.roleVi : dossier.roleEn;
            const school = isVi ? dossier.schoolVi : dossier.schoolEn;
            const bio = isVi ? dossier.bioVi : dossier.bioEn;
            const accolades = isVi ? dossier.accoladesVi : dossier.accoladesEn;

            let skillBarsHtml = '';
            dossier.skillBars.forEach(sb => {
                skillBarsHtml += '<div class="hub-dossier-bar-item">' +
                    '<div class="hub-bar-head">' +
                        '<span>' + sb.name + '</span>' +
                        '<span class="hub-bar-val">' + sb.val + '%</span>' +
                    '</div>' +
                    '<div class="hub-bar-rail">' +
                        '<div class="hub-bar-fill" style="width: ' + sb.val + '%;"></div>' +
                    '</div>' +
                '</div>';
            });

            let certsHtml = '';
            if (dossier.certs && dossier.certs.length > 0) {
                certsHtml = '<div>' +
                    '<div class="hub-dossier-section-title">' +
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
                        '<span data-en="VERIFIED CERTIFICATES" data-vi="CHỨNG NHẬN ĐÃ XÁC MINH">VERIFIED CERTIFICATES</span>' +
                    '</div>' +
                    '<div class="hub-cert-gallery">' +
                        dossier.certs.map(c => `<img src="${c}" alt="Certificate" class="hub-cert-thumb" onclick="window.open('${c}', '_blank')">`).join('') +
                    '</div>' +
                '</div>';
            }

            content.innerHTML = '<div class="hub-dossier-left">' +
                '<div class="hub-dossier-avatar-wrap">' +
                    '<img src="' + dossier.avatar + '" alt="' + name + '" class="hub-dossier-avatar" data-tier="' + dossier.tier + '">' +
                    (dossier.isOwner ? '<div class="hub-owner-crown" style="width: 32px; height: 32px; font-size: 0.9rem;" title="Key Founder">🔑</div>' : '') +
                '</div>' +
                '<h3 class="font-black text-xl text-[var(--hub-text-main)] mb-1 flex items-center justify-center gap-1.5">' +
                    name +
                    (dossier.verified ? '<img src="../Logo/tickxanh.png" alt="Verified" style="width: 18px; height: 18px;">' : '') +
                '</h3>' +
                '<p class="text-xs font-bold uppercase tracking-wider text-[var(--brand-cyan)] mb-1">' + dossier.tierLabel + '</p>' +
                '<p class="text-xs text-neutral-400 mb-4">' + school + '</p>' +
                '<div class="hub-modal-telemetry-box font-mono">' +
                    '<div class="telemetry-row">' +
                        '<span class="telemetry-label" data-en="RANK INDEX" data-vi="CHỈ SỐ THỨ HẠNG">RANK INDEX</span>' +
                        '<span class="telemetry-val-cyan">' + dossier.rankNumber + '</span>' +
                    '</div>' +
                    '<div class="telemetry-row">' +
                        '<span class="telemetry-label" data-en="POWER RATING" data-vi="ĐIỂM NĂNG LỰC">POWER RATING</span>' +
                        '<span class="telemetry-val-pink">' + dossier.powerScore + ' / 100</span>' +
                    '</div>' +
                    '<div class="telemetry-row">' +
                        '<span class="telemetry-label" data-en="STATUS" data-vi="TRẠNG THÁI">STATUS</span>' +
                        (dossier.verified
                            ? '<span class="telemetry-val-emerald" data-en="AUTHENTICATED" data-vi="ĐÃ XÁC MINH">AUTHENTICATED</span>'
                            : '<span class="telemetry-val-neutral" data-en="ACTIVE TALENT" data-vi="HỒ SƠ GIA NHẬP">ACTIVE TALENT</span>') +
                    '</div>' +
                '</div>' +
                '<a href="' + dossier.url + '" class="hub-dossier-btn-launch w-full">' +
                    '<span data-en="LAUNCH FULL PORTFOLIO" data-vi="TRUY CẬP HỒ SƠ ĐẦY ĐỦ">LAUNCH FULL PORTFOLIO</span>' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
                '</a>' +
            '</div>' +
            '<div class="hub-dossier-right">' +
                '<div>' +
                    '<div class="hub-dossier-section-title">' +
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>' +
                        '<span data-en="EXECUTIVE SUMMARY" data-vi="TỔNG QUAN HỒ SƠ">EXECUTIVE SUMMARY</span>' +
                    '</div>' +
                    '<p class="hub-dossier-bio">' + bio + '</p>' +
                '</div>' +
                '<div>' +
                    '<div class="hub-dossier-section-title">' +
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' +
                        '<span data-en="HONORS &amp; ACCOLADES" data-vi="DANH HIỆU &amp; THÀNH TỰU">HONORS &amp; ACCOLADES</span>' +
                    '</div>' +
                    '<p class="hub-modal-accolades-box">' + accolades + '</p>' +
                '</div>' +
                '<div>' +
                    '<div class="hub-dossier-section-title">' +
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>' +
                        '<span data-en="SKILL &amp; ANIMATION TELEMETRY" data-vi="ĐẶC TẢ KỸ NĂNG &amp; CHUYỂN ĐỘNG">SKILL &amp; ANIMATION TELEMETRY</span>' +
                    '</div>' +
                    '<div class="hub-dossier-skill-bars">' + skillBarsHtml + '</div>' +
                '</div>' +
                certsHtml +
            '</div>';

            modal.classList.add('active');
            document.body.classList.add('hub-modal-open');
            document.body.style.overflow = 'hidden';
        }

        closeDossierModal() {
            const modal = document.getElementById('hub-dossier-modal');
            if (modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.classList.remove('hub-modal-open');
                document.body.style.overflow = '';
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new HubShowcaseManager());
    } else {
        new HubShowcaseManager();
    }
})();
