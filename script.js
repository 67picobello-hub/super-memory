document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INJECTION DES URLS CONFIGURÉES
    // On récupère les variables définies dans le HTML
    const stripeBtns = document.querySelectorAll('.btn-stripe');
    const demoBtns = document.querySelectorAll('.btn-demo');
    const emailLinks = document.querySelectorAll('#email-link');

    stripeBtns.forEach(btn => btn.href = STRIPE_URL);
    demoBtns.forEach(btn => btn.href = DEMO_URL);
    emailLinks.forEach(link => link.href = `mailto:${CONTACT_EMAIL}`);

    // 2. ANIMATION AU SCROLL (FADE-IN)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // On observe toutes les sections et les cartes
    document.querySelectorAll('.section, .feature-card, .hero-text, .hero-image').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // 3. EFFET NAVBAR AU SCROLL
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.padding = '12px 0';
            nav.style.background = 'rgba(11, 11, 15, 0.95)';
        } else {
            nav.style.padding = '20px 0';
            nav.style.background = 'rgba(11, 11, 15, 0.8)';
        }
    });

});
