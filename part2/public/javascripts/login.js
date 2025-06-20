// public/js/login.js

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('error');

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorDiv.textContent = data.error || 'Login failed';
      errorDiv.classList.remove('d-none');
      return;
    }

    // Redirect based on user role
    if (data.role === 'owner') {
      window.location.href = '/owner-dashboard.html';
    } else if (data.role === 'walker') {
      window.location.href = '/walker-dashboard.html';
    } else {
      errorDiv.textContent = 'Unknown role';
      errorDiv.classList.remove('d-none');
    }

  } catch (err) {
    errorDiv.textContent = 'Server error. Please try again.';
    errorDiv.classList.remove('d-none');
  }
});
