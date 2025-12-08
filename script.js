const nav = document.querySelector('.nav');
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelectorAll('.nav a');
const animated = document.querySelectorAll('[data-animate]');
let sections = [];

// mobile nav toggle
toggle.addEventListener('click', () => {
  nav.classList.toggle('is-open');
});

links.forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
}));

function computeSections() {
  sections = Array.from(document.querySelectorAll('section')).map(section => ({
    id: section.id,
    top: section.offsetTop
  }));
}

computeSections();
window.addEventListener('resize', computeSections);

// active state on scroll
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  let current = sections[0]?.id;
  sections.forEach(section => {
    if (scrollPos >= section.top) current = section.id;
  });
  links.forEach(link => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
  });
});

// intersection animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

animated.forEach(el => observer.observe(el));

// simple contact form feedback
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  form.reset();
  const toast = document.createElement('div');
  toast.textContent = 'Đã nhận thông tin! Tôi sẽ phản hồi trong 48h.';
  toast.className = 'toast';
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
});
