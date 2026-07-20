async function loadDoctors() {
  const grid = document.getElementById('doctorsGrid');
  if (grid === null) return;

  grid.innerHTML = Array.from({ length: 3 }, () => '<div class="skeleton"></div>').join('');

  try {
    const res = await fetch('data/doctors.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const doctors = await res.json();

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
        <a href="#" class="doctor-view">View Profile</a>
      </article>
    `).join('');
  } catch (err) {
    grid.innerHTML = `<p style="color:#d64545">Couldn't load doctors right now. ${err.message}</p>`;
  }
}
loadDoctors();
