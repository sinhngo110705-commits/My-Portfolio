(() => {
  const root = document.documentElement;
  const hero = document.querySelector(".hero");
  const heroArt = hero?.querySelector(".hero-art");
  const orbitGrid = hero?.querySelector(".orbit-grid");
  const masthead = document.querySelector(".masthead");
  const showcase = document.querySelector("[data-motion-showcase]");
  const visual = showcase?.querySelector("[data-motion-visual]");
  const shots = Array.from(showcase?.querySelectorAll("[data-motion-shot]") ?? []);
  const steps = Array.from(showcase?.querySelectorAll("[data-motion-step]") ?? []);
  const hasShowcase = Boolean(visual && shots.length && shots.length === steps.length);
  const motion = matchMedia("(prefers-reduced-motion: no-preference)");
  const compact = matchMedia("(max-width: 760px)");
  let currentStep = -1;
  let frame = 0;
  let lastHeroPhase = -1;

  function activateStep(index) {
    if (index === currentStep) return;
    shots[currentStep]?.classList.remove("is-motion-active");
    steps[currentStep]?.classList.remove("is-motion-active");
    shots[index].classList.add("is-motion-active");
    steps[index].classList.add("is-motion-active");
    currentStep = index;
  }

  function readShowcase(viewport) {
    const bounds = showcase.getBoundingClientRect();
    if (bounds.top >= viewport) return { index: 0, progress: 0 };
    if (bounds.bottom <= 0) return { index: steps.length - 1, progress: 1 };

    const line = compact.matches && viewport > 480
      ? Math.min(viewport * .86, Math.max(viewport * .53, visual.getBoundingClientRect().bottom + viewport * .13))
      : viewport * .54;
    const positions = steps.map((step) => step.getBoundingClientRect().top);
    const range = positions.at(-1) - positions[0];
    let index = 0;
    positions.forEach((position, stepIndex) => {
      if (position <= line) index = stepIndex;
    });
    return { index, progress: range > 0 ? Math.min(1, Math.max(0, (line - positions[0]) / range)) : 0 };
  }

  function updateMotion() {
    frame = 0;
    if (!motion.matches) return;

    const viewport = innerHeight;
    const scrollRange = root.scrollHeight - viewport;
    const scrollProgress = scrollRange > 0 ? Math.min(1, Math.max(0, scrollY / scrollRange)) : 0;
    const heroBounds = hero?.getBoundingClientRect();
    const phase = heroBounds?.height
      ? Math.min(1, Math.max(0, ((masthead?.offsetHeight ?? 0) - heroBounds.top) / heroBounds.height))
      : 0;
    const scene = hasShowcase ? readShowcase(viewport) : null;

    masthead?.style.setProperty("--page-progress", scrollProgress.toFixed(4));
    if (hero && heroArt && phase !== lastHeroPhase) {
      hero.style.setProperty("--hero-glow-x", phase * -78 + "px");
      hero.style.setProperty("--hero-glow-y", phase * 46 + "px");
      heroArt.style.setProperty("--hero-orbit-y", phase * 38 + "px");
      heroArt.style.setProperty("--hero-orbit-tilt", phase * -23 + "deg");
      heroArt.style.setProperty("--hero-orbit-spin", phase * 19 + "deg");
      heroArt.style.setProperty("--hero-orbit-scale", 1 - phase * .12);
      lastHeroPhase = phase;
    }

    if (scene) {
      showcase.style.setProperty("--showcase-progress", scene.progress.toFixed(4));
      activateStep(scene.index);
    }
  }

  function queueMotion() {
    if (!frame && motion.matches) frame = requestAnimationFrame(updateMotion);
  }

  if (orbitGrid) {
    const trail = document.createElementNS("http://www.w3.org/2000/svg", "path");
    trail.classList.add("motion-trail");
    trail.setAttribute("pathLength", "100");
    trail.setAttribute("d", "M 61 268 C 98 128 239 53 394 87 C 493 112 486 222 414 300 C 335 385 183 405 91 345");
    orbitGrid.append(trail);
  }

  if (hasShowcase) {
    activateStep(0);
  }

  if ("IntersectionObserver" in window) {
    const reveal = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (motion.matches) entry.target.classList.add("motion-entered");
        reveal.unobserve(entry.target);
      }
    }, { threshold: .14 });

    document.querySelectorAll(".section-intro, .price, .member, .modules dl > div, .mentor").forEach((item) => reveal.observe(item));
  }

  function syncMotion() {
    root.classList.toggle("motion-ready", motion.matches);
    if (hasShowcase) showcase.classList.toggle("is-motion-showcase", motion.matches);
    queueMotion();
  }

  addEventListener("scroll", queueMotion, { passive: true });
  addEventListener("resize", queueMotion, { passive: true });
  addEventListener("pageshow", queueMotion);
  motion.addEventListener("change", syncMotion);
  syncMotion();
})();
