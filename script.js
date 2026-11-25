// Small, dependency-free interactions for the portfolio.
const loader = document.querySelector(".page-loader");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#primary-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

window.addEventListener("load", () => {
  window.setTimeout(() => loader?.classList.add("is-hidden"), 450);
}, { once: true });

// Keep the mobile menu accessible and close it after navigating.
function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation menu");
  navMenu?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navMenu?.classList.toggle("is-open", !isExpanded);
  document.body.classList.toggle("menu-open", !isExpanded);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => {
  if (window.innerWidth > 650) closeMenu();
});

// Highlight the section currently in view without polling on every scroll event.
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));
}

// Reveal content as it enters view; keep everything visible on older browsers.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// A single CSS radial glow follows a mouse pointer; no per-frame animation loop.
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
  }, { passive: true });
}

document.querySelector("#current-year").textContent = String(new Date().getFullYear());

// Set this to your real address when you're ready to receive portfolio messages.
const contactEmail = "your.email@example.com";
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.classList.remove("is-error");

  if (!form.reportValidity()) return;

  if (contactEmail === "your.email@example.com") {
    formStatus.textContent = "Please replace the placeholder email in script.js before using the contact form.";
    formStatus.classList.add("is-error");
    return;
  }

  const formData = new FormData(form);
  const subject = `Portfolio message from ${formData.get("name")}`;
  const body = `From: ${formData.get("name")} (${formData.get("email")})\n\n${formData.get("message")}`;
  window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formStatus.textContent = "Your email app is opening with your message.";
});
