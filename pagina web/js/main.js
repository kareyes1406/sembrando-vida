// --- Navbar Scroll Effect ---
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Mobile Menu Toggle ---
const mobileBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

mobileBtn.addEventListener('click', () => {
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    }
});

// --- WhatsApp Modal ---
const btnWhatsapp = document.getElementById('btn-whatsapp');
const modalWhatsapp = document.getElementById('whatsapp-modal');
const closeWhatsapp = document.getElementById('close-whatsapp');

btnWhatsapp.addEventListener('click', () => {
    modalWhatsapp.classList.add('active');
    
    // Auto-close simulated logic
    setTimeout(() => {
        modalWhatsapp.classList.remove('active');
    }, 3000);
});

closeWhatsapp.addEventListener('click', () => {
    modalWhatsapp.classList.remove('active');
});

// Close modal on click outside
modalWhatsapp.addEventListener('click', (e) => {
    if (e.target === modalWhatsapp) {
        modalWhatsapp.classList.remove('active');
    }
});
