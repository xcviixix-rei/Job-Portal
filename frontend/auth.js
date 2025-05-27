const API_BASE_URL_AUTH = '/api/users';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessageDiv = document.getElementById('loginMessage');
    const registerMessageDiv = document.getElementById('registerMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            
            try {
                const response = await fetch(`${API_BASE_URL_AUTH}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();

                if (response.ok) {
                    showMessage(loginMessageDiv, data.message || 'Đăng nhập thành công!', 'success');
                    localStorage.setItem('token', data.token); // Store token in localStorage
                    localStorage.setItem('user', JSON.stringify(data.user)); // Store user info
                    // Redirect to homepage or dashboard after a short delay
                    setTimeout(() => {
                        window.location.href = 'homePage.html';
                    }, 1500);
                } else {
                    showMessage(loginMessageDiv, data.message || 'Đăng nhập thất bại.', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage(loginMessageDiv, 'Lỗi kết nối. Vui lòng thử lại.', 'error');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = registerForm.fullName.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            const confirmPassword = registerForm.confirmPassword.value;

            if (password !== confirmPassword) {
                showMessage(registerMessageDiv, 'Mật khẩu xác nhận không khớp!', 'error');
                return;
            }
            if (password.length < 6) {
                showMessage(registerMessageDiv, 'Mật khẩu phải có ít nhất 6 ký tự.', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL_AUTH}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage(registerMessageDiv, data.message || 'Đăng ký thành công! Bạn sẽ được chuyển hướng...', 'success');
                    localStorage.setItem('token', data.token); // Store token
                    localStorage.setItem('user', JSON.stringify(data.user)); // Store user info
                     // Redirect to homepage or dashboard after a short delay
                    setTimeout(() => {
                        window.location.href = 'homePage.html'; // Or login.html if you prefer
                    }, 2000);
                } else {
                    showMessage(registerMessageDiv, data.message || 'Đăng ký thất bại.', 'error');
                }
            } catch (error) {
                console.error('Register error:', error);
                showMessage(registerMessageDiv, 'Lỗi kết nối. Vui lòng thử lại.', 'error');
            }
        });
    }
});

function showMessage(element, message, type = 'info') {
    if (element) {
        element.textContent = message;
        element.className = `auth-message ${type}`; // Reset classes and add new type
    }
}

// --- Functions to manage user session (can be in a separate utility file later) ---
function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
    return !!getToken(); // Returns true if token exists
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page or homepage
    window.location.href = 'login.html';
}