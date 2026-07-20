(function () {
  const raw = localStorage.getItem('medcareCurrentUser');
  if (!raw) {
    window.location.href = './login.html';
    return;
  }

  let user;
  try {
    user = JSON.parse(raw);
  } catch (e) {
    window.location.href = './login.html';
    return;
  }

  const initials = (user.fullname || user.username || 'MC')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  document.getElementById('accountAvatar').textContent = initials || 'MC';
  document.getElementById('accountName').textContent = user.fullname || user.username;
  document.getElementById('accountUsername').textContent = `@${user.username}`;
  document.getElementById('accountFirstName').textContent = (user.fullname || user.username).split(' ')[0];

  document.getElementById('profileUsername').textContent = user.username;
  document.getElementById('profileEmail').textContent = user.email || 'Not provided';
  document.getElementById('profileSince').textContent = user.since
    ? new Date(user.since).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const appointments = [
    { doctor: 'Dr. Mike Smith', department: 'Cardiology', date: 'Jul 28, 2026', time: '10:30 AM', status: 'Confirmed' },
    { doctor: 'Dr. Sara Hassan', department: 'Pediatrics', date: 'Aug 04, 2026', time: '02:00 PM', status: 'Pending' },
  ];

  const list = document.getElementById('appointmentList');
  if (list) {
    list.innerHTML = appointments.map((a) => `
      <div class="appointment-item">
        <div class="appointment-info">
          <strong>${a.doctor}</strong>
          <span>${a.department} · ${a.date} at ${a.time}</span>
        </div>
        <span class="status-badge status-${a.status.toLowerCase()}">${a.status}</span>
      </div>
    `).join('');
  }

  const prescriptions = [
    { name: 'Atorvastatin 20mg', instructions: 'Once daily, in the evening', prescribedBy: 'Dr. Mike Smith', refillsLeft: 2 },
  ];

  const prescriptionList = document.getElementById('prescriptionList');
  if (prescriptionList) {
    prescriptionList.innerHTML = prescriptions.map((p) => `
      <div class="appointment-item">
        <div class="appointment-info">
          <strong>${p.name}</strong>
          <span>${p.instructions} · Prescribed by ${p.prescribedBy}</span>
        </div>
        <span class="status-badge status-confirmed">${p.refillsLeft} refills left</span>
      </div>
    `).join('');
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('medcareCurrentUser');
      window.location.href = './login.html';
    });
  }

  const editProfileAction = document.getElementById('editProfileAction');
  if (editProfileAction) {
    editProfileAction.addEventListener('click', (e) => {
      e.preventDefault();
      const newFullname = window.prompt('Full name', user.fullname || user.username);
      if (newFullname === null) return;
      const newEmail = window.prompt('Email', user.email || '');
      if (newEmail === null) return;

      user.fullname = newFullname.trim() || user.username;
      user.email = newEmail.trim();
      localStorage.setItem('medcareCurrentUser', JSON.stringify(user));

      const users = JSON.parse(localStorage.getItem('medcareUsers') || '{}');
      users[user.username] = { fullname: user.fullname, email: user.email, since: user.since };
      localStorage.setItem('medcareUsers', JSON.stringify(users));

      window.location.reload();
    });
  }
})();
