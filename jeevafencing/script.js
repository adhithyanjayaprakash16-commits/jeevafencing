/* ============================================================
   JEEVA FENCING COMPANY — SCRIPT.JS
   Handles: Navbar toggle, Scroll effects, FAQ accordion,
            Active nav link highlighting, Contact form feedback
   ============================================================ */

/* ============================================================
   1. NAVBAR — MOBILE TOGGLE
   ============================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// Close menu if clicking outside
document.addEventListener('click', (e) => {
  if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  }
});

/* ============================================================
   1.5. TOP BAR — MOBILE TOGGLE
   ============================================================ */
const topBarToggle = document.getElementById('topBarToggle');
const topBar       = document.getElementById('topBar');

if (topBarToggle && topBar) {
  topBarToggle.addEventListener('click', () => {
    topBar.classList.toggle('is-expanded');
  });
}

/* ============================================================
   2. NAVBAR — SCROLL SHADOW
   ============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightActiveSection();
});

/* ============================================================
   3. ACTIVE NAV LINK — SCROLL SPY
   ============================================================ */
const sections   = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

function highlightActiveSection() {
  let currentSection = '';
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   4. FAQ — ACCORDION
   ============================================================ */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer   = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all open items
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', false);
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      }
    });

    // Toggle current item
    if (isOpen) {
      item.classList.remove('open');
      question.setAttribute('aria-expanded', false);
      answer.style.maxHeight = null;
    } else {
      item.classList.add('open');
      question.setAttribute('aria-expanded', true);
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ============================================================
   5. CONTACT FORM — SIMPLE VALIDATION & SUCCESS MESSAGE
   ============================================================ */
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const endpoint = contactForm.action;

    fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(() => {
      formSuccess.textContent = '✅ Message sent! We will contact you shortly.';
      formSuccess.style.display = 'block';
      contactForm.reset();
      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 6000);
    })
    .catch(() => {
      formSuccess.textContent = '⚠️ There was a problem submitting the form. Please try again later.';
      formSuccess.style.display = 'block';
      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 6000);
    });
  });
}

/* ============================================================
   6. SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    }
  });
});

/* ============================================================
   7. SCROLL REVEAL — FADE IN ON SCROLL
   ============================================================ */
const revealElements = document.querySelectorAll(
  '.why-card, .product-card, .gallery-item, .testimonial-card, .faq-item, .about-content, .about-img-wrap'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el, index) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.5s ease ${index * 0.06}s, transform 0.5s ease ${index * 0.06}s`;
  revealObserver.observe(el);
});

/* ============================================================
   8. GALLERY — LIGHTBOX (simple)
   ============================================================ */
const galleryItems = document.querySelectorAll('.gallery-item img');

galleryItems.forEach(img => {
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.88);
      display: flex; align-items: center; justify-content: center;
      cursor: zoom-out; animation: fadeIn 0.2s ease;
    `;

    const lightboxImg = document.createElement('img');
    lightboxImg.src   = img.src;
    lightboxImg.alt   = img.alt;
    lightboxImg.style.cssText = `
      max-width: 90vw; max-height: 88vh;
      border-radius: 10px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      object-fit: contain;
    `;

    overlay.appendChild(lightboxImg);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    overlay.addEventListener('click', () => {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
    });
  });
});

/* ============================================================
   END OF SCRIPT.JS
   ============================================================ */
