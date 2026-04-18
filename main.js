// Navigation scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 20);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// Smooth scroll offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const position = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Message Sent';
    btn.style.background = 'var(--amber)';
    btn.style.color = 'var(--bg)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}

// Field Notes form handling (submits to Kit)
const fieldNotesForm = document.getElementById('fieldNotesForm');
if (fieldNotesForm) {
  fieldNotesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = fieldNotesForm.querySelector('button');
    const email = fieldNotesForm.querySelector('input[name="email_address"]').value;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    fetch('https://app.kit.com/forms/9340479/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_address: email })
    })
    .then(res => {
      if (res.ok || res.redirected) {
        btn.textContent = 'Subscribed ✓';
        fieldNotesForm.reset();
        setTimeout(() => {
          btn.textContent = 'Subscribe';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Subscription failed');
      }
    })
    .catch(() => {
      // Fallback: submit the form normally (opens Kit confirmation page)
      fieldNotesForm.removeEventListener('submit', arguments.callee);
      fieldNotesForm.submit();
      btn.textContent = 'Subscribe';
      btn.disabled = false;
    });
  });
}

// Expandable product cards
document.querySelectorAll('.product-card[data-expandable]').forEach(card => {
  const toggle = card.querySelector('.product-card__toggle');
  if (toggle) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.toggle('expanded');
    });
  }
  card.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });
});

// Scroll-triggered fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Target all animatable elements
const animatables = document.querySelectorAll(
  '.values__item, .offering-card, .audience-item, .method-step, ' +
  '.speaking__track, .talk-card, .training__offering-card, ' +
  '.consult-card, .process-step, .product-card, ' +
  '.listen__card, .about__beliefs, .contact__info-item'
);

animatables.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.08}s, transform 0.5s ease ${(i % 4) * 0.08}s`;
  observer.observe(el);
});

// Stagger grid children
document.querySelectorAll('.offerings__grid, .products__grid, .audiences__grid, .training__scenarios, .consulting__types, .listen__grid').forEach(grid => {
  Array.from(grid.children).forEach((child, index) => {
    child.style.transitionDelay = `${index * 0.1}s`;
  });
});

// Inject visible class styles
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
`);
