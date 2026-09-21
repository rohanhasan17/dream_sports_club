import { auth, db, isFirebaseConfigured } from './firebase.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const form = document.querySelector('#memberForm');
const message = document.querySelector('#success');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!isFirebaseConfigured) return show('Firebase is not configured yet. Add your project config in firebase-config.js.');
  const button = form.querySelector('button');
  button.disabled = true;
  button.textContent = 'Sending request…';
  try {
    const firstName = document.querySelector('#firstName').value.trim();
    const lastName = document.querySelector('#lastName').value.trim();
    const email = document.querySelector('#memberEmail').value.trim();
    const password = document.querySelector('#memberPassword').value;
    const account = await createUserWithEmailAndPassword(auth, email, password);
    const fullName = `${firstName} ${lastName}`;
    const photoURL = `https://api.dicebear.com/9.x/initials/svg?backgroundType=gradientLinear&seed=${encodeURIComponent(fullName)}`;
    await addDoc(collection(db, 'memberApplications'), { uid: account.user.uid, firstName, lastName, email, phone: document.querySelector('#memberPhone').value.trim(), sport: document.querySelector('#memberSport').value, photoURL, status: 'pending', createdAt: serverTimestamp() });
    form.reset();
    show('Application sent! It will appear on the Members page after admin approval.');
  } catch (error) {
    show(error.code === 'auth/email-already-in-use' ? 'This email is already registered. Please sign in instead.' : `Could not send request: ${error.message}`);
  } finally { button.disabled = false; button.textContent = 'Send Membership Request →'; }
});

function show(text) { message.textContent = text; message.style.display = 'block'; }
