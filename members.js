import { db, isFirebaseConfigured } from './firebase.js';
import { collection, onSnapshot, orderBy, query } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const grid = document.querySelector('#memberGrid');
const loading = document.querySelector('#memberLoading');
if (!isFirebaseConfigured) loading.textContent = 'Connect Firebase to show approved members here.';
else onSnapshot(query(collection(db, 'members'), orderBy('approvedAt', 'desc')), (snapshot) => {
  grid.innerHTML = snapshot.docs.length ? snapshot.docs.map((item) => {
    const member = item.data();
    return `<article class="member-card"><img src="${member.photoURL}" alt="${member.firstName} ${member.lastName}"><div><span class="member-sport">${member.sport}</span><h3>${member.firstName} ${member.lastName}</h3><p>Dream Sports Club member</p><dl><div><dt>Status</dt><dd>Active</dd></div><div><dt>Joined</dt><dd>${member.approvedAt?.toDate().getFullYear() || ''}</dd></div><div><dt>Sport</dt><dd>${member.sport}</dd></div></dl></div></article>`;
  }).join('') : '<p class="empty-members">No approved members yet.</p>';
  loading.style.display = 'none';
}, () => { loading.textContent = 'Members could not be loaded. Check Firebase rules.'; });
