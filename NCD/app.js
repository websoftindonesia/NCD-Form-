const form = document.querySelector('#survey-form');
const statusBox = document.querySelector('#form-status');
const submitButton = document.querySelector('#submit-button');
const welcome = document.querySelector('#welcome');
const mainContent = document.querySelector('#main-content');
const startButton = document.querySelector('#start-button');
const faculty = document.querySelector('#faculty');
const major = document.querySelector('#major');
const majorsByFaculty = {
  'Fakultas Ilmu Komputer dan Teknologi Informasi': ['Sistem Informasi', 'Sistem Komputer', 'Informatika'],
  'Fakultas Ekonomi': ['Manajemen', 'Akuntansi'],
  'Fakultas Sastra': ['Sastra Inggris', 'Sastra Jepang'],
  'Fakultas Psikologi': ['Psikologi'],
  'Fakultas Teknik Sipil dan Perencanaan': ['Teknik Sipil', 'Arsitektur'],
  'Fakultas Teknologi Industri': ['Teknik Industri', 'Teknik Elektro', 'Agroteknologi'],
  'Fakultas Ilmu Komunikasi': ['Ilmu Komunikasi'],
};
const simpleFields = ['fullName', 'email', 'faculty', 'major', 'semester'];
const groups = ['buildings', 'items', 'storageFrequency', 'situations', 'leftItems'];
const total = simpleFields.length + groups.length;

startButton.addEventListener('click', () => {
  welcome.classList.add('is-leaving');
  mainContent.inert = false;
  document.body.classList.add('started');
  revealPageElements();
  window.setTimeout(() => welcome.remove(), 500);
});

function revealPageElements() {
  const elements = [...mainContent.querySelectorAll(
    '.topbar, .hero-copy, .hero-art, .section-heading, .progress-card, .form-card, .form-grid > .field, .form-bottom, .footer-column, .footer-bottom',
  )];
  elements.forEach((element, index) => {
    element.classList.add('reveal-item');
    element.style.setProperty('--reveal-delay', `${Math.min(index * 45, 360)}ms`);
  });

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  elements.forEach((element) => observer.observe(element));
}

const heroArt = document.querySelector('.hero-art');
const brandCard = heroArt.querySelector('.brand-card');
heroArt.addEventListener('pointermove', (event) => {
  const bounds = heroArt.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  heroArt.style.setProperty('--logo-shift-x', `${x * 12}px`);
  heroArt.style.setProperty('--logo-shift-y', `${y * 10}px`);
  heroArt.style.setProperty('--logo-tilt', `${x * 5}deg`);
  brandCard.style.setProperty('--card-tilt-x', `${-y * 7}deg`);
  brandCard.style.setProperty('--card-tilt-y', `${x * 9}deg`);
});
heroArt.addEventListener('pointerleave', () => {
  heroArt.style.setProperty('--logo-shift-x', '0px');
  heroArt.style.setProperty('--logo-shift-y', '0px');
  heroArt.style.setProperty('--logo-tilt', '0deg');
  brandCard.style.setProperty('--card-tilt-x', '5deg');
  brandCard.style.setProperty('--card-tilt-y', '-9deg');
});

welcome.addEventListener('pointermove', (event) => {
  const bounds = welcome.getBoundingClientRect();
  welcome.style.setProperty('--welcome-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
  welcome.style.setProperty('--welcome-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
});
welcome.addEventListener('pointerleave', () => {
  welcome.style.setProperty('--welcome-x', '50%');
  welcome.style.setProperty('--welcome-y', '44%');
});

const loadingLogo = document.querySelector('.loading-logo-wrap');
loadingLogo.addEventListener('pointermove', (event) => {
  const bounds = loadingLogo.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  loadingLogo.style.setProperty('--logo-hover-x', `${x * 8}px`);
  loadingLogo.style.setProperty('--logo-hover-y', `${y * 6}px`);
});
loadingLogo.addEventListener('pointerleave', () => {
  loadingLogo.style.setProperty('--logo-hover-x', '0px');
  loadingLogo.style.setProperty('--logo-hover-y', '0px');
});

faculty.addEventListener('change', () => {
  major.replaceChildren(new Option('Pilih jurusan', '', true, true));
  major.options[0].disabled = true;
  (majorsByFaculty[faculty.value] || []).forEach((item) => major.add(new Option(item, item)));
  major.disabled = !majorsByFaculty[faculty.value];
  validateField(faculty);
  updateProgress();
});

document.querySelectorAll('input[name="situations"]').forEach((input) => input.addEventListener('change', () => {
  const showOther = [...document.querySelectorAll('input[name="situations"]')].some((item) => item.checked && item.value === 'Lainnya');
  document.querySelector('#situation-other-wrap').hidden = !showOther;
}));

function fieldComplete(name) {
  const input = document.getElementById(name);
  if (!input.value.trim()) return false;
  if (name === 'fullName') return input.value.trim().length >= 3;
  if (name === 'email') return /^[^\s@]+@gmail\.com$/i.test(input.value.trim());
  return true;
}
function groupComplete(name) {
  return Boolean(form.querySelector(`[name="${name}"]:checked`));
}
function updateProgress() {
  const completed = simpleFields.filter(fieldComplete).length + groups.filter(groupComplete).length;
  const progressCount = document.querySelector('#progress-count');
  if (progressCount.textContent !== String(completed)) {
    progressCount.textContent = completed;
    progressCount.classList.remove('progress-bump');
    requestAnimationFrame(() => progressCount.classList.add('progress-bump'));
  }
  document.querySelector('.progress-track').setAttribute('aria-valuenow', completed);
  document.querySelector('#progress-fill').style.width = `${(completed / total) * 100}%`;
  document.querySelector('#progress-title').textContent = completed === total ? 'Siap dikirim!' : completed >= simpleFields.length ? 'Ceritakan keseharianmu' : 'Kenalan dulu';
  document.querySelector('#stage-profile').classList.toggle('complete', simpleFields.every(fieldComplete));
  document.querySelector('#stage-campus').classList.toggle('active', completed >= simpleFields.length);
  document.querySelector('#stage-campus').classList.toggle('complete', completed === total);
  document.querySelector('#stage-profile').classList.toggle('active', completed < simpleFields.length);
}
document.querySelector('#year').textContent = new Date().getFullYear();

function validateField(input) {
  const wrapper = input.closest('.field');
  const error = document.getElementById(`${input.name}-error`);
  const value = input.value.trim();
  let message = '';
  if (!value) message = 'Bagian ini wajib diisi.';
  else if (input.name === 'fullName' && value.length < 3) message = 'Nama lengkap minimal 3 karakter.';
  else if (input.name === 'email' && !/^[^\s@]+@gmail\.com$/i.test(value)) message = 'Masukkan alamat email dengan domain @gmail.com.';
  if (wrapper) wrapper.setAttribute('aria-invalid', String(Boolean(message)));
  input.setAttribute('aria-invalid', String(Boolean(message)));
  if (error) error.textContent = message;
  return !message;
}
function validateGroup(name) {
  const fieldset = form.querySelector(`[data-name="${name}"]`);
  const valid = groupComplete(name);
  fieldset.setAttribute('aria-invalid', String(!valid));
  document.getElementById(`${name}-error`).textContent = valid ? '' : 'Pilih setidaknya satu jawaban.';
  return valid;
}
for (const name of simpleFields) {
  const input = document.getElementById(name);
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') validateField(input); updateProgress(); });
  input.addEventListener('change', () => { validateField(input); updateProgress(); });
}
form.addEventListener('change', (event) => {
  if (groups.includes(event.target.name)) {
    validateGroup(event.target.name);
    updateProgress();
  }
});
updateProgress();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusBox.className = 'form-status';
  statusBox.textContent = '';
  const validFields = simpleFields.map((name) => validateField(document.getElementById(name))).every(Boolean);
  const validGroups = groups.map(validateGroup).every(Boolean);
  if (!validFields || !validGroups) {
    (form.querySelector('[aria-invalid="true"] input, form [aria-invalid="true"] select') || form.querySelector('[aria-invalid="true"] input[type="checkbox"], form [aria-invalid="true"] input[type="radio"]'))?.focus();
    statusBox.textContent = 'Periksa kembali bagian yang ditandai sebelum mengirim.';
    statusBox.className = 'form-status visible failure';
    return;
  }
  const data = Object.fromEntries(new FormData(form).entries());
  for (const name of ['buildings', 'items', 'situations', 'leftItems']) data[name] = formDataValues(name);
  data.university = 'Universitas Gunadarma';
  submitButton.disabled = true;
  submitButton.querySelector('span:first-child').textContent = 'Mengirim jawaban...';
  submitButton.querySelector('.button-arrow').classList.add('button-spinner');
  submitButton.querySelector('.button-arrow').textContent = '';
  try {
    const { firebaseConfig, isFirebaseConfigured } = await import('./firebase-config.js');
    if (!isFirebaseConfigured) throw new Error('Firebase belum dikonfigurasi. Lengkapi firebase-config.js terlebih dahulu.');
    const [{ initializeApp, getApps, getApp }, { getFirestore, collection, addDoc, serverTimestamp }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js'),
    ]);
    const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
    await addDoc(collection(getFirestore(firebaseApp), 'survey_responses'), { ...data, createdAt: serverTimestamp() });
    form.reset();
    major.replaceChildren(new Option('Pilih fakultas terlebih dahulu', '', true, true));
    major.disabled = true;
    document.querySelector('#situation-other-wrap').hidden = true;
    form.querySelectorAll('[aria-invalid="true"]').forEach((item) => item.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field-error').forEach((item) => { item.textContent = ''; });
    updateProgress();
    statusBox.textContent = 'Terima kasih! Jawabanmu berhasil disimpan.';
    statusBox.className = 'form-status visible success';
    statusBox.focus();
  } catch (error) {
    statusBox.textContent = error.message || 'Terjadi kendala. Coba lagi sebentar lagi.';
    statusBox.className = 'form-status visible failure';
    statusBox.focus();
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector('span:first-child').textContent = 'Kirim jawaban';
    submitButton.querySelector('.button-arrow').classList.remove('button-spinner');
    submitButton.querySelector('.button-arrow').textContent = '↗';
  }
});
function formDataValues(name) { return [...form.querySelectorAll(`[name="${name}"]:checked`)].map((input) => input.value); }

