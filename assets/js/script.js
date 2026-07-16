const root = document.documentElement;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const copyEmailButton = document.querySelector(".copy-email");
const toast = document.querySelector(".toast");
const cursorGlow = document.querySelector(".cursor-glow");

const storedTheme = localStorage.getItem("portfolio-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
root.dataset.theme = storedTheme || preferredTheme;

function updateThemeIcon() {
  themeIcon.textContent = root.dataset.theme === "dark" ? "☼" : "☾";
}

updateThemeIcon();

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  updateThemeIcon();
});

menuToggle?.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 20);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const navAnchors = [...document.querySelectorAll(".nav-links a")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((anchor) => {
        anchor.classList.toggle("active", anchor.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-38% 0px -55% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

copyEmailButton?.addEventListener("click", async () => {
  const email = copyEmailButton.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    toast.classList.add("visible");
    copyEmailButton.textContent = "Copied!";
    setTimeout(() => {
      toast.classList.remove("visible");
      copyEmailButton.textContent = "Copy email";
    }, 1800);
  } catch {
    window.location.href = `mailto:${email}`;
  }
});

document.getElementById("current-year").textContent = new Date().getFullYear();

if (window.matchMedia("(pointer: fine)").matches && cursorGlow) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

const typingElement = document.querySelector(".typing-line");

if (typingElement && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const words = JSON.parse(typingElement.dataset.words);
  let wordIndex = 0;
  let letterIndex = words[0].length;
  let deleting = true;

  const type = () => {
    const currentWord = words[wordIndex];

    if (deleting) {
      letterIndex -= 1;
      typingElement.textContent = currentWord.slice(0, letterIndex);

      if (letterIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 450);
        return;
      }
    } else {
      const nextWord = words[wordIndex];
      letterIndex += 1;
      typingElement.textContent = nextWord.slice(0, letterIndex);

      if (letterIndex === nextWord.length) {
        deleting = true;
        setTimeout(type, 1700);
        return;
      }
    }

    setTimeout(type, deleting ? 42 : 72);
  };

  setTimeout(type, 1500);
}
