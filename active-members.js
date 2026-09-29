import { db, isFirebaseConfigured } from './firebase.js';
import { collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const counters = document.querySelectorAll('[data-active-member-count]');
if (counters.length) {
  const showCount = (value) => counters.forEach((counter) => { counter.textContent = value; });
  if (!isFirebaseConfigured) showCount('—');
  else onSnapshot(collection(db, 'members'), (snapshot) => showCount(snapshot.size), () => showCount('—'));
}
