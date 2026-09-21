import { auth, db, isFirebaseConfigured } from './firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const login = document.querySelector('#adminLogin');
const message = document.querySelector('#adminMessage');
const area = document.querySelector('#applications');
const grid = document.querySelector('#applicationGrid');
let isAdmin = false;
if (!isFirebaseConfigured) message.textContent = 'Add Firebase configuration in firebase-config.js first.';
login.addEventListener('submit', async (event) => { event.preventDefault(); try { await signInWithEmailAndPassword(auth, document.querySelector('#adminEmail').value, document.querySelector('#adminPassword').value); } catch { message.textContent = 'Sign-in failed. Check the email and password.'; } });
if (isFirebaseConfigured) onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  const admin = await getDoc(doc(db, 'admins', user.uid));
  if (!admin.exists()) { message.textContent = 'This account is not an approved administrator.'; return; }
  isAdmin = true; login.hidden = true; area.hidden = false; loadApplications();
});
async function loadApplications() {
  const results = await getDocs(query(collection(db, 'memberApplications'), orderBy('createdAt', 'desc')));
  grid.innerHTML = results.docs.length ? results.docs.map((item) => { const member = item.data(); return `<article class="application-card"><img src="${member.photoURL}" alt="${member.firstName}"><div><span>${member.sport}</span><h3>${member.firstName} ${member.lastName}</h3><p>${member.email}<br>${member.phone}</p><button data-approve="${item.id}">Approve member</button><button class="reject" data-reject="${item.id}">Reject</button></div></article>`; }).join('') : '<p>No pending applications.</p>';
  grid.querySelectorAll('[data-approve]').forEach((button) => button.addEventListener('click', () => approve(button.dataset.approve)));
  grid.querySelectorAll('[data-reject]').forEach((button) => button.addEventListener('click', () => reject(button.dataset.reject)));
}
async function approve(id) { if (!isAdmin) return; const application = await getDoc(doc(db, 'memberApplications', id)); const member = application.data(); await setDoc(doc(db, 'members', member.uid), { ...member, status: 'approved', approvedAt: serverTimestamp() }); await deleteDoc(doc(db, 'memberApplications', id)); loadApplications(); }
async function reject(id) { if (!isAdmin || !confirm('Reject this application?')) return; await deleteDoc(doc(db, 'memberApplications', id)); loadApplications(); }
