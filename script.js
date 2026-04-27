/* ============================================================
   PILOT ENTREPRENEUR — script.js
   ============================================================ */

/* ────────────────────────────────────────────────────────────
   ✏️  VARIABLES À MODIFIER ICI
   ──────────────────────────────────────────────────────────── */
const STRIPE_URL     = "https://ton-lien-stripe.com";   // ← Lien paiement / essai gratuit
const DEMO_URL       = "#";                              // ← Lien démo (vidéo, page, calendly…)
const CONTACT_EMAIL  = "contact@pilot.com";             // ← Email de contact

/* ────────────────────────────────────────────────────────────
   INJECTION DES LIENS DANS LA PAGE
   (ne pas modifier — fonctionne automatiquement)
   ──────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {

  // ── Liens Stripe ──────────────────────────────────────────
  document.querySelectorAll(".js-stripe-url").forEach(el => {
    if (el.tagName === "A") el.href = STRIPE_URL;
  });

  // ── Liens Démo ────────────────────────────────────────────
  document.querySelectorAll(".js-demo-url").forEach(el => {
    if (el.tagName === "A") el.href = DEMO_URL;
  });

  // ── Email de contact ──────────────────────────────────────
  document.querySelectorAll(".js-contact-email").forEach(el => {
    el.href = `mailto:${CONTACT_EMAIL}`;
    el.textContent = el.textContent || CONTACT_EMAIL;
  });

  /* ──────────────────────────────────────────────────────────
     NAVBAR — scroll → fond opaque
     ────────────────────────────────────────────────────────── */
  const navbar = document.getElementById("navbar");
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ──────────────────────────────────────────────────────────
     MENU BURGER MOBILE
     ────────────────────────────────────────────────────────── */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks   = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    // Fermer le menu au clic sur un lien
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     ANIMATIONS FADE-IN AU SCROLL (IntersectionObserver)
     ────────────────────────────────────────────────────────── */
  const fadeEls = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // une seule fois
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  // Éléments hero : visibles immédiatement sans attendre le scroll
  const heroFades = document.querySelectorAll(".hero .fade-in");
  heroFades.forEach(el => el.classList.add("visible"));

  // Autres éléments : observés au scroll
  fadeEls.forEach(el => {
    if (!el.closest(".hero")) observer.observe(el);
  });

  /* ──────────────────────────────────────────────────────────
     FORMULAIRE CTA — soumission (à connecter à votre backend)
     ────────────────────────────────────────────────────────── */
  const ctaForm  = document.getElementById("ctaForm");
  const ctaEmail = document.getElementById("ctaEmail");

  if (ctaForm) {
    ctaForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = ctaEmail ? ctaEmail.value.trim() : "";

      if (!email || !isValidEmail(email)) {
        shakeElement(ctaEmail);
        return;
      }

      /* ── TODO : remplacer par votre intégration ──────────────
         Option A : redirect vers Stripe avec l'email en param
           window.location.href = `${STRIPE_URL}?prefilled_email=${encodeURIComponent(email)}`;

         Option B : appel API Mailchimp / Brevo / Convertkit
           fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) })

         Pour l'instant : redirect vers STRIPE_URL
         ─────────────────────────────────────────────────────── */
      window.location.href = STRIPE_URL;
    });
  }

  /* ──────────────────────────────────────────────────────────
     SMOOTH SCROLL LINKS (ancres internes)
     ────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 80; // hauteur navbar fixe
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ──────────────────────────────────────────────────────────
     STAGGER ANIMATION — cartes features (délai progressif)
     ────────────────────────────────────────────────────────── */
  document.querySelectorAll(".feature-card, .trust-card").forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });

}); // fin DOMContentLoaded


/* ────────────────────────────────────────────────────────────
   UTILITAIRES
   ──────────────────────────────────────────────────────────── */

/** Vérifie qu'un email est valide */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Animation de secousse sur un élément invalide */
function shakeElement(el) {
  if (!el) return;
  el.style.animation = "none";
  void el.offsetWidth; // reflow
  el.style.animation = "shake 0.4s ease";
  el.addEventListener("animationend", () => { el.style.animation = ""; }, { once: true });
}

/* Keyframes shake (injection dynamique) */
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);
