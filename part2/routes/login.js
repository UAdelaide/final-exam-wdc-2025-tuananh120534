document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = form.username.value;
    const password = form.password.value;

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        errorEl.textContent = data.error || 'Login failed';
      } else {
        if (data.user.role === 'owner') {
          window.location.href = '/owner-dashboard.html';
        } else if (data.user.role === 'walker') {
          window.location.href = '/walker-dashboard.html';
        } else {
          errorEl.textContent = 'Unknown role';
        }
      }
    } catch (err) {
      console.error(err);
      errorEl.textContent = 'An error occurred.';
    }
  });
});
