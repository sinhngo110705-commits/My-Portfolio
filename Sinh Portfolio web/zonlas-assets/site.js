const spaces = document.querySelector("[data-spaces]");
const tabList = spaces.querySelector(".space-tabs");
const tabs = Array.from(tabList.querySelectorAll("a"));
const panels = tabs.map((tab) => document.querySelector(tab.hash));

function selectSpace(index, moveFocus = false) {
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
