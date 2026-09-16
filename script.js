const form = document.querySelector('#memberForm');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#success').style.display = 'block';
  form.querySelector('button').textContent = 'Request Sent ✓';
});
