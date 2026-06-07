// --- Authentication Logic (Simulated with LocalStorage) ---

document.addEventListener('DOMContentLoaded', () => {
    
    // Check if user is already logged in (redirect from index.html if so)
    // In index.html we could add logic to change "Mi Cuenta" button destination.

    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                // Get mock users from global variable (loaded via users.js)
                const users = window.usersData;
                
                // Find user
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Save session to localStorage (excluding password for safety, even if mock)
                    const sessionData = {
                        id: user.id,
                        email: user.email,
                        nombre: user.nombre,
                        rol: user.rol,
                        finca: user.finca,
                        puntos: user.puntos,
                        avatarColor: user.avatarColor
                    };
                    
                    localStorage.setItem('sv_session', JSON.stringify(sessionData));
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    // Show error
                    errorMessage.style.display = 'block';
                    // Hide after 3 seconds
                    setTimeout(() => {
                        errorMessage.style.display = 'none';
                    }, 3000);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                errorMessage.innerText = "Error de conexión. Intenta nuevamente.";
                errorMessage.style.display = 'block';
            }
        });
    }

    // Logout logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('sv_session');
            window.location.href = 'index.html';
        });
    }
});
