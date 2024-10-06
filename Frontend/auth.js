document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Hardcoded admin credentials for demonstration
    const adminCredentials = {
        username: 'admin',
        password: 'admin123'
    };

    // Check credentials
    if (username === adminCredentials.username && password === adminCredentials.password) {
        localStorage.setItem('user', JSON.stringify({ role: 'admin' }));
        window.location.href = 'index.html'; // Redirect to index.html after login
    } else {
        document.getElementById('error-message').innerText = 'Invalid username or password.';
    }
});
