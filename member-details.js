import { db, isFirebaseConfigured } from './firebase.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const message = document.querySelector('#playerMessage');
const profile = document.querySelector('#playerProfile');
const params = new URLSearchParams(window.location.search);
const memberId = params.get('id');

if (!isFirebaseConfigured) {
  message.textContent = 'Connect Firebase to view player profiles.';
} else if (!memberId) {
  message.textContent = 'No member was selected. Return to the member directory.';
} else {
  try {
    const result = await getDoc(doc(db, 'members', memberId));
    if (!result.exists() || result.data().status !== 'approved') {
      message.textContent = 'This member profile could not be found.';
    } else {
      const member = result.data();
      const stats = member.stats || {};
      const setStat = (id, value) => {
        document.getElementById(id).textContent = Number.isFinite(Number(value)) ? Number(value).toLocaleString() : '0';
      };
      document.querySelector('#playerName').textContent = `${member.firstName || ''} ${member.lastName || ''}`.trim();
      document.querySelector('#playerSport').textContent = member.sport || 'Club member';
      const photo = document.querySelector('#playerPhoto');
      photo.src = member.photoURL || 'image/logo.png';
      photo.alt = `${member.firstName || ''} ${member.lastName || ''}`.trim();
      setStat('cricketMatches', stats.cricket?.matchesPlayed);
      setStat('cricketRuns', stats.cricket?.runs);
      setStat('cricketWickets', stats.cricket?.wickets);
      setStat('footballMatches', stats.football?.matchesPlayed);
      setStat('footballGoals', stats.football?.goals);
      setStat('footballAssists', stats.football?.assists);
      message.hidden = true;
      profile.hidden = false;
    }
  } catch {
    message.textContent = 'Player profile could not be loaded. Check Firebase rules and try again.';
  }
}
