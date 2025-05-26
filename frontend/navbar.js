document.addEventListener('DOMContentLoaded', () => {
    updateNavbarOnLoad();
});

function updateNavbarOnLoad() {
    const navLinksContainer = document.querySelector('nav.navbar ul.nav-links');
    if (!navLinksContainer) {
        console.error("Navbar links container not found!");
        return;
    }

    // Clear existing dynamic links (Login, User Info, Logout) to prevent duplication on re-renders
    const existingLoginLink = navLinksContainer.querySelector('a[href="login.html"]');
    if (existingLoginLink && existingLoginLink.parentElement) navLinksContainer.removeChild(existingLoginLink.parentElement);
    
    const existingUserInfo = document.getElementById('nav-user-info');
    if (existingUserInfo && existingUserInfo.parentElement) navLinksContainer.removeChild(existingUserInfo.parentElement);
    
    const existingLogoutLink = document.getElementById('nav-logout-link');
    if (existingLogoutLink && existingLogoutLink.parentElement) navLinksContainer.removeChild(existingLogoutLink.parentElement);


    const user = getUser(); // From auth.js
    const employerButtonLi = navLinksContainer.querySelector('li a.btn-employer')?.parentElement; // Get the <li> containing the employer button

    if (isLoggedIn() && user) {
        // User is logged in
        const userInfoLi = document.createElement('li');
        userInfoLi.id = 'nav-user-info';
        // You can make this a link to a profile page later
        userInfoLi.innerHTML = `<a href="#" style="color: #ffd65b;">Chào, ${user.fullName || user.email}</a>`;

        const logoutLi = document.createElement('li');
        const logoutLink = document.createElement('a');
        logoutLink.id = 'nav-logout-link';
        logoutLink.href = '#';
        logoutLink.textContent = 'Đăng xuất';
        logoutLink.style.cursor = 'pointer';
        logoutLink.onclick = (e) => {
            e.preventDefault();
            logout(); // from auth.js
        };
        logoutLi.appendChild(logoutLink);

        if (employerButtonLi) {
            navLinksContainer.insertBefore(userInfoLi, employerButtonLi);
            navLinksContainer.insertBefore(logoutLi, employerButtonLi);
        } else {
            // Fallback if employer button isn't found (shouldn't happen with current HTML)
            navLinksContainer.appendChild(userInfoLi);
            navLinksContainer.appendChild(logoutLi);
        }

    } else {
        // User is not logged in
        const loginLi = document.createElement('li');
        loginLi.innerHTML = `<a href="login.html">Đăng nhập</a>`;

        if (employerButtonLi) {
            navLinksContainer.insertBefore(loginLi, employerButtonLi);
        } else {
            navLinksContainer.appendChild(loginLi);
        }
    }
}