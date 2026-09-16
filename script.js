const form = document.querySelector('#memberForm');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#success').style.display = 'block';
  form.querySelector('button').textContent = 'Request Sent ✓';
});

const tournamentCard = document.querySelector('[data-details-url]');

if (tournamentCard) {
  const openTournamentDetails = () => {
    window.location.href = tournamentCard.dataset.detailsUrl;
  };

  tournamentCard.addEventListener('click', openTournamentDetails);
  tournamentCard.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') openTournamentDetails();
  });
}
