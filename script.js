/* ===== PAP MECATRÓNICA – script.js ===== */

// ==========================================
// 1. NAVBAR – scroll effect + active links
// ==========================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const backToTop = document.getElementById('back-to-top');

if (navbar) {
  window.addEventListener('scroll', () => {
    // Scrolled class
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Back-to-top visibility
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Reveal animations
    revealElements();

    // Animate salary bars when in view
    animateSalaryBars();

    // Animate progress bars when in view
    animateProgressBars();
  }, { passive: true });
}

// ==========================================
// 2. HAMBURGER MENU
// ==========================================
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('nav-links');

if (hamburger && navLinksMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksMenu.classList.toggle('open');
  });

  // Close on link click
  navLinksMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksMenu.classList.remove('open');
    });
  });
}

// ==========================================
// 3. HERO PARTICLE ANIMATION
// ==========================================
function initParticles() {
  const particlesEl = document.getElementById('particles');
  if (!particlesEl) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  particlesEl.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#0ea5e9' : '#38bdf8';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create particles
  for (let i = 0; i < 120; i++) {
    particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.12;
          ctx.strokeStyle = '#0ea5e9';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(draw);
  }

  draw();
}

initParticles();

// ==========================================
// 4. ANIMATED COUNTER (HERO STATS)
// ==========================================
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString('pt-PT');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString('pt-PT');
    }
  }, 16);
}

// Trigger counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.dataset.target);
        animateCounter(stat, target);
      });
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ==========================================
// 5. SCROLL REVEAL ANIMATION
// ==========================================
function revealElements() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
}

// Mark elements for reveal
const revealTargets = [
  '.pillar-card', '.curiosidade-card', '.school-card',
  '.futuro-card', '.salary-card', '.saida-item',
  '.timeline-card', '.section-header', '.sobre-text', '.sobre-cards'
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.07}s`;
  });
});

// Run once on load
setTimeout(revealElements, 100);

// ==========================================
// 6. SALARY BARS ANIMATION
// ==========================================
let salaryAnimated = false;

function animateSalaryBars() {
  if (salaryAnimated) return;
  const section = document.getElementById('salarios');
  if (!section) return;
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    salaryAnimated = true;
    document.querySelectorAll('.salary-bar').forEach(bar => {
      const width = bar.dataset.width;
      setTimeout(() => {
        bar.style.width = width + '%';
      }, 200);
    });
  }
}

// ==========================================
// 7. PROGRESS BARS ANIMATION (FUTURO)
// ==========================================
let progressAnimated = false;

function animateProgressBars() {
  if (progressAnimated) return;
  const section = document.getElementById('futuro');
  if (!section) return;
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    progressAnimated = true;
    document.querySelectorAll('.progress-bar').forEach(bar => {
      const w = bar.dataset.width || '0';
      // Use CSS custom property to animate the ::after pseudo-element width
      setTimeout(() => {
        bar.style.setProperty('--bar-width', w + '%');
      }, 300);
    });
  }
}

// ==========================================
// 8. TABS (SCHOOLS SECTION)
// ==========================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    const tabEl = document.getElementById(tab);
    if (tabEl) tabEl.classList.add('active');
  });
});

// ==========================================
// 9. FAQ ACCORDION
// ==========================================
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    const answer = btn.nextElementSibling;

    // Close all
    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      if (b.nextElementSibling) b.nextElementSibling.classList.remove('open');
    });

    // Toggle current
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      if (answer) answer.classList.add('open');
    }
  });
});

// ==========================================
// 10. CONTACT FORM
// ==========================================
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !email || !mensagem) {
      return;
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'A enviar...';
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      formSuccess.style.display = 'block';
      submitBtn.textContent = 'Enviar Mensagem';
      submitBtn.disabled = false;

      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 5000);
    }, 1200);
  });
}

// ==========================================
// 10.1. LINKS IN 2 DIFFERENT TABS
// ==========================================
const ytToggle = document.getElementById('yt-toggle');
const ytPopup = document.getElementById('yt-popup');
const ytWrapper = document.getElementById('yt-wrapper');

if (ytToggle && ytPopup && ytWrapper) {
  ytToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isOpen = ytPopup.classList.toggle('open');
    ytToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!ytWrapper.contains(e.target)) {
      ytPopup.classList.remove('open');
      ytToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ytPopup.classList.remove('open');
      ytToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ==========================================
// 11. BACK TO TOP
// ==========================================
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==========================================
// 12. SMOOTH SCROLL for all anchor links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72);
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ==========================================
// 13. GALLERY LIGHTBOX
// ==========================================
(function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Create lightbox DOM
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('role', 'dialog');
  lightbox.style.cssText = `
    display:none;position:fixed;inset:0;z-index:9999;
    background:rgba(5,10,21,0.95);
    backdrop-filter:blur(10px);
    align-items:center;justify-content:center;
    cursor:pointer;
  `;
  lightbox.innerHTML = `
    <div style="position:relative;max-width:90vw;max-height:90vh;">
      <img id="lb-img" src="" alt="" style="max-width:90vw;max-height:85vh;object-fit:contain;border-radius:12px;display:block;" />
      <div id="lb-caption" style="text-align:center;color:#94a3b8;font-size:0.9rem;margin-top:1rem;"></div>
      <button id="lb-close" aria-label="Fechar" style="
        position:fixed;top:1.5rem;right:1.5rem;
        width:44px;height:44px;border-radius:50%;
        background:rgba(255,255,255,0.1);border:none;
        color:white;font-size:1.5rem;cursor:pointer;
        display:flex;align-items:center;justify-content:center;
      ">×</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');

  function open(img, caption) {
    lbImg.src = img;
    lbImg.alt = caption;
    lbCaption.textContent = caption;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.dataset.caption || '';
      if (img) open(img.src, caption);
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  lbClose.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

// ==========================================
// Initial scroll check
// ==========================================
if (navbar) {
  window.dispatchEvent(new Event('scroll'));
}

// ==========================================
// 14. HEADER SANDWICH MENU
// ==========================================
const headerSandwich = document.getElementById('header-sandwich');
const headerMenuPopup = document.getElementById('header-menu-popup');

if (headerSandwich && headerMenuPopup) {
  headerSandwich.addEventListener('click', (e) => {
    e.stopPropagation();
    headerSandwich.classList.toggle('open');
    headerMenuPopup.classList.toggle('open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!headerSandwich.contains(e.target) && !headerMenuPopup.contains(e.target)) {
      headerSandwich.classList.remove('open');
      headerMenuPopup.classList.remove('open');
    }
  });

  // Close when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      headerSandwich.classList.remove('open');
      headerMenuPopup.classList.remove('open');
    }
  });
}

// ==========================================
// 15. MAPA INTERATIVO (LEAFLET)
// ==========================================
function initInteractiveMap() {
    const mapContainer = document.getElementById('map-leaflet');
    if (!mapContainer) return;

    // Inicializa o mapa centrado em Portugal
    const map = L.map('map-leaflet').setView([39.5, -8.3], 7);

    // Camada de mapa (Usando um estilo escuro para combinar com o site)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Dados das Instituições
    const locais = [
        // Escolas Profissionais
        { nome: "EPRM – Escola Profissional de Rio Maior", tipo: "Escola Profissional", coords: [39.3364, -8.9357] },
        { nome: "EPB – Escola Profissional de Braga", tipo: "Escola Profissional", coords: [41.5511, -8.4281] },
        { nome: "EPT – Escola Profissional de Trancoso", tipo: "Escola Profissional", coords: [40.7778, -7.3489] },
        { nome: "EPVL – Escola Profissional Vasconcellos Lebre", tipo: "Escola Profissional", coords: [40.3965, -8.4526] },
        { nome: "ETPC – Escola Técnico Profissional de Cantanhede", tipo: "Escola Profissional", coords: [40.3461, -8.5939] },
        { nome: "EPA – Escola Profissional de Aveiro", tipo: "Escola Profissional", coords: [40.6405, -8.6537] },
        // Faculdades
        { nome: "Instituto Superior Técnico (IST)", tipo: "Faculdade", coords: [38.7367, -9.1389] },
        { nome: "Universidade do Minho", tipo: "Faculdade", coords: [41.5615, -8.3973] },
        { nome: "Universidade de Coimbra", tipo: "Faculdade", coords: [40.2075, -8.4245] },
        { nome: "ISEP – Inst. Superior de Engenharia do Porto", tipo: "Faculdade", coords: [41.1779, -8.6075] },
        { nome: "Instituto Politécnico de Setúbal", tipo: "Faculdade", coords: [38.5205, -8.8398] },
        { nome: "ISEL – Inst. Superior de Eng. de Lisboa", tipo: "Faculdade", coords: [38.7556, -9.1157] }
    ];

    locais.forEach(local => {
        // Criar o marcador (PIN)
        const marker = L.circleMarker(local.coords, {
            radius: 8,
            fillColor: local.tipo === "Faculdade" ? "#f59e0b" : "#0ea5e9", // Laranja para Fac, Azul para Escola
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        // Conteúdo do Popup
        const popupContent = `
            <div class="custom-popup">
                <span class="popup-type">${local.tipo}</span>
                <span class="popup-title">${local.nome}</span>
            </div>
        `;

        // Bind do popup
        marker.bindPopup(popupContent, { closeButton: false, offset: L.point(0, -8) });

        // Efeito de "Expandir" ao passar o rato (Mouseover)
        marker.on('mouseover', function(e) {
            this.openPopup();
            this.setStyle({ radius: 12, fillOpacity: 1 }); // Aumenta o tamanho do pin
        });

        // Efeito de "Recolher" ao tirar o rato (Mouseout)
        marker.on('mouseout', function(e) {
            this.closePopup();
            this.setStyle({ radius: 8, fillOpacity: 0.8 }); // Volta ao tamanho normal
        });
        
        // Se clicar, o mapa faz zoom na escola
        marker.on('click', function(e) {
            map.setView(e.latlng, 13);
        });
    });
}

// Chamar a função após carregar o DOM
document.addEventListener('DOMContentLoaded', initInteractiveMap);
