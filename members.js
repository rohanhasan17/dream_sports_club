import { db, isFirebaseConfigured } from './firebase.js';
import { collection, onSnapshot, orderBy, query } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const grid = document.querySelector('#memberGrid');
const loading = document.querySelector('#memberLoading');
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const getAge = (dateOfBirth) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth || '')) return '—';
  const [year, month, day] = dateOfBirth.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day || birthDate > today) return '—';
  let age = today.getFullYear() - year;
  if (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day)) age--;
  return age;
};
if (!isFirebaseConfigured) loading.textContent = 'Connect Firebase to show approved members here.';
else onSnapshot(query(collection(db, 'members'), orderBy('approvedAt', 'desc')), (snapshot) => {
  grid.innerHTML = snapshot.docs.length ? snapshot.docs.map((item) => {
    const member = item.data();
    const name = `${member.firstName || ''} ${member.lastName || ''}`.trim();
    const photo = escapeHTML(member.photoURL || 'image/logo.png');
    return `<article class="member-card"><img src="${photo}" alt="${escapeHTML(name)}"><div><span class="member-sport">${escapeHTML(member.sport || 'Member')}</span><h3>${escapeHTML(name)}</h3><p>Dream Sports Club member</p><dl><div><dt>Status</dt><dd>Active</dd></div><div><dt>Age</dt><dd>${getAge(member.dateOfBirth)}</dd></div><div><dt>Joined</dt><dd>${member.approvedAt?.toDate().getFullYear() || ''}</dd></div><div><dt>Sport</dt><dd>${escapeHTML(member.sport || '—')}</dd></div></dl><a class="member-details-link" href="member-details.html?id=${encodeURIComponent(item.id)}">View player stats <span>→</span></a></div></article>`;
  }).join('') : '<p class="empty-members">No approved members yet.</p>';
  loading.style.display = 'none';
}, () => { loading.textContent = 'Members could not be loaded. Check Firebase rules.'; });
