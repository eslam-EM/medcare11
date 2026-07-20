document.documentElement.classList.add('js-ready');

let loadedDoctors = [];

async function loadDoctors() {
  const grid = document.getElementById('doctorsGrid');
  if (grid === null) return;

  grid.innerHTML = Array.from({ length: 3 }, () => '<div class="skeleton"></div>').join('');

  try {
    const res = await fetch('data/doctors.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const doctors = await res.json();
    loadedDoctors = doctors;

    grid.innerHTML = doctors.map(doc => `
      <article class="doctor-card">
        <div class="doctor-photo">
          <img src="${doc.photo}" alt="${doc.name}" loading="lazy">
        </div>
        <div class="doctor-info">
          <div class="role">${doc.role}</div>
          <h3>${doc.name}</h3>
          <div class="doctor-social">
            <a href="${doc.social.linkedin}" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
            <a href="${doc.social.facebook}" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
            <a href="${doc.social.instagram}" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          </div>
        </div>
        <button type="button" class="doctor-view" data-doctor-id="${doc.id}">View Profile</button>
      </article>
    `).join('');
  } catch (err) {
    grid.innerHTML = `<p style="color:#d64545">Couldn't load doctors right now. ${err.message}</p>`;
  }
}

function initDoctorModal() {
  const modal = document.getElementById('doctorModal');
  const grid = document.getElementById('doctorsGrid');
  if (!modal || !grid) return;

  const openModal = (doctor) => {
    document.getElementById('doctorModalPhoto').src = doctor.photo;
    document.getElementById('doctorModalPhoto').alt = doctor.name;
    document.getElementById('doctorModalRole').textContent = doctor.role;
    document.getElementById('doctorModalName').textContent = doctor.name;
    document.getElementById('doctorModalExperience').textContent = `${doctor.experience} experience`;
    document.getElementById('doctorModalEducation').textContent = doctor.education;
    document.getElementById('doctorModalPhone').textContent = doctor.phone;
    document.getElementById('doctorModalEmail').textContent = doctor.email;
    document.getElementById('doctorModalBio').textContent = doctor.bio;
    document.getElementById('doctorModalSocial').innerHTML = `
      <a href="${doctor.social.linkedin}" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
      <a href="${doctor.social.facebook}" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
      <a href="${doctor.social.instagram}" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
    `;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  };

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-doctor-id]');
    if (!btn) return;
    const doctor = loadedDoctors.find((d) => String(d.id) === btn.dataset.doctorId);
    if (doctor) openModal(doctor);
  });

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-modal]')) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

function initAuthHeader() {
  const btn = document.querySelector('.header-actions .btn-outline');
  if (!btn) return;
  const raw = localStorage.getItem('medcareCurrentUser');
  if (!raw) return;

  try {
    const user = JSON.parse(raw);
    const firstName = (user.fullname || user.username || '').split(' ')[0];
    btn.textContent = firstName ? `Hi, ${firstName}` : 'My Account';
    btn.setAttribute('href', './account.html');
  } catch (e) {
    localStorage.removeItem('medcareCurrentUser');
  }
}

function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const toggle = () => header.classList.toggle('scrolled', window.scrollY > 10);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

function initMobileNav() {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!header || !toggle || !nav) return;

  const closeNav = () => {
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeNav();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) closeNav();
  });

  document.addEventListener('click', (e) => {
    if (header.classList.contains('nav-open') && !header.contains(e.target)) closeNav();
  });
}

function initReveal() {
  const items = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((el) => observer.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach((el) => {
      el.textContent = parseInt(el.dataset.count, 10).toLocaleString() + (el.dataset.suffix || '');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((el) => observer.observe(el));
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\-\s()]{7,}$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const department = String(data.get('department') || '').trim();

    if (!name || !email || !phone || !department) {
      status.textContent = 'Please fill in all required fields.';
      status.className = 'form-status error';
      return;
    }
    if (!emailRegex.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.className = 'form-status error';
      return;
    }
    if (!phoneRegex.test(phone)) {
      status.textContent = 'Please enter a valid phone number.';
      status.className = 'form-status error';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    status.textContent = '';
    status.className = 'form-status';

    setTimeout(() => {
      status.textContent = `Thank you, ${name}! Your appointment request has been received — we'll contact you shortly at ${email}.`;
      status.className = 'form-status success';
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      form.reset();
    }, 1100);
  });
}

loadDoctors();
setFooterYear();
initHeaderScroll();
initMobileNav();
initReveal();
initCounters();
initContactForm();
initDoctorModal();
initAuthHeader();
