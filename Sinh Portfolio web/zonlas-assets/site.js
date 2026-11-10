const spaces = document.querySelector("[data-spaces]");
const tabList = spaces.querySelector(".space-tabs");
const tabs = Array.from(tabList.querySelectorAll("a"));
const panels = tabs.map((tab) => document.querySelector(tab.hash));
const floor = spaces.querySelector(".venue-floor");
const route = spaces.querySelector(".venue-route path");
const venueControls = spaces.querySelector(".venue-controls");
const positionLabel = spaces.querySelector(".venue-position");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const coordinates = tabs.map((tab) => ({
  x: parseFloat(tab.style.getPropertyValue("--x")) * 8,
  y: parseFloat(tab.style.getPropertyValue("--y")) * 4.8,
}));
const hub = { x: 400, y: 255 };
let selectedIndex = -1;
let routeAnimation;
reducedMotion.addEventListener("change", () => routeAnimation?.cancel());

function drawVenueRoute(index) {
  const origin = coordinates[selectedIndex] ?? hub;
  const destination = coordinates[index];
  const midX = (origin.x + destination.x) / 2;
  route.setAttribute("d", `M ${origin.x} ${origin.y} Q ${origin.x} ${hub.y} ${midX} ${hub.y} T ${destination.x} ${destination.y}`);
  routeAnimation?.cancel();
  if (!reducedMotion.matches && route.animate) {
    routeAnimation = route.animate(
      [{ strokeDasharray: "0 100" }, { strokeDasharray: "100 0" }],
      { duration: 650, easing: "cubic-bezier(.22, 1, .36, 1)" },
    );
  }
}

function selectSpace(index, moveFocus = false) {
  if (index !== selectedIndex) {
    drawVenueRoute(index);
    floor.style.setProperty("--focus-x", tabs[index].style.getPropertyValue("--x"));
    floor.style.setProperty("--focus-y", tabs[index].style.getPropertyValue("--y"));
    positionLabel.textContent = `${index + 1} / ${tabs.length} · ${tabs[index].querySelector(".venue-pin-name").textContent}`;
    selectedIndex = index;
  }
  tabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panels[tabIndex].hidden = !selected;
  });
  if (moveFocus) tabs[index].focus();
}

tabList.setAttribute("role", "tablist");
tabs.forEach((tab, index) => {
  const panel = panels[index];
  tab.id = `space-tab-${index + 1}`;
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", panel.id);
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", tab.id);
  panel.tabIndex = 0;

  tab.addEventListener("click", (event) => {
    event.preventDefault();
    selectSpace(index);
  });
  tab.addEventListener("keydown", (event) => {
    let nextIndex;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (index + 1) % tabs.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (index + tabs.length - 1) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      case " ":
        nextIndex = index;
        break;
      default:
        return;
    }
    event.preventDefault();
    selectSpace(nextIndex, true);
  });
});

const currentSpace = () => tabs.findIndex((tab) => tab.hash === window.location.hash);
selectSpace(Math.max(0, currentSpace()));
spaces.classList.add("is-enhanced");
venueControls.hidden = false;
venueControls.querySelectorAll("[data-venue-step]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = Number(button.dataset.venueStep);
    selectSpace((selectedIndex + direction + tabs.length) % tabs.length);
  });
});
panels.forEach((panel) => {
  const demo = panel.querySelector(".venue-demo");
  const button = demo.querySelector(".venue-demo-button");
  const result = demo.querySelector(".venue-demo-result");
  const actionLabel = button.textContent;
  button.hidden = false;
  button.addEventListener("click", () => {
    const active = demo.classList.toggle("is-demo-active");
    result.hidden = !active;
    button.setAttribute("aria-expanded", String(active));
    button.textContent = active ? button.dataset.resetLabel : actionLabel;
  });
});
window.addEventListener("hashchange", () => {
  const index = currentSpace();
  if (index >= 0) selectSpace(index);
});

const art = document.querySelector(".hero-art");
const motion = window.matchMedia("(prefers-reduced-motion: no-preference) and (pointer: fine)");

art.addEventListener("pointermove", (event) => {
  if (!motion.matches) return;
  const bounds = art.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  art.style.setProperty("--orbit-x", `${x * 24}px`);
  art.style.setProperty("--orbit-y", `${y * 24}px`);
  art.style.setProperty("--orbit-tilt-x", `${-y * 12}deg`);
  art.style.setProperty("--orbit-tilt-y", `${x * 12}deg`);
});

function resetOrbit() {
  for (const property of ["--orbit-x", "--orbit-y", "--orbit-tilt-x", "--orbit-tilt-y"]) {
    art.style.removeProperty(property);
  }
}

art.addEventListener("pointerleave", resetOrbit);
motion.addEventListener("change", resetOrbit);
