import { login, isAuthenticated } from './auth.js';

if (isAuthenticated()) {
  window.location.href = '/pages/dashboard.html';
}

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const result = login(email, password);

  if (result.success) {
    window.location.href = '/pages/dashboard.html';
  } else {
    errorMessage.textContent = result.message;
    errorMessage.classList.add('show');

    setTimeout(() => {
      errorMessage.classList.remove('show');
    }, 3000);
  }
});
