import { auth, db, isFirebaseConfigured } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const links = document.querySelectorAll('.admin-link');
if (links.length && isFirebaseConfigured) {
  onAuthStateChanged(auth, async (user) => {
    let isAdmin = false;
    if (user) {
      try {
        isAdmin = (await getDoc(doc(db, 'admins', user.uid))).exists();
      } catch {
        isAdmin = false;
      }
    }

    links.forEach((link) => {
      link.classList.toggle('is-signed-in', isAdmin);
      link.setAttribute('aria-label', 'Admin');
    });
  });
}
