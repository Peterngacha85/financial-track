class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.checkAuth();
    }

    attachEventListeners() {
        const loginForm = document.getElementById('login-form');
        const signupLink = document.getElementById('signup-link');
        const logoutLink = document.getElementById('logout-link');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (signupLink) {
            signupLink.addEventListener('click', (e) => this.showSignupForm(e));
        }

        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => this.handleLogout(e));
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const users = this.getUsers();
            if (users[username] && users[username].password === this.hashPassword(password)) {
                this.setCurrentUser(username);
                this.redirectToDashboard();
            } else {
                this.showError('Invalid username or password');
            }
        } catch (error) {
            this.showError('An error occurred during login');
            console.error(error);
        }
    }

    showSignupForm(e) {
        e.preventDefault();
        const loginForm = document.getElementById('login-form');
        loginForm.innerHTML = `
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <div class="mb-3">
                <label for="confirm-password" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="confirm-password" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Sign Up</button>
        `;
        loginForm.removeEventListener('submit', (e) => this.handleLogin(e));
        loginForm.addEventListener('submit', (e) => this.handleSignup(e));
        document.querySelector('.card-title').textContent = 'Sign Up for Finance Tracker';
        document.querySelector('p.text-center').innerHTML = 'Already have an account? <a href="#" id="login-link">Login</a>';
        document.getElementById('login-link').addEventListener('click', (e) => this.showLoginForm(e));
    }

    showLoginForm(e) {
        e.preventDefault();
        window.location.reload();
    }

    handleSignup(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        try {
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const users = this.getUsers();
            if (users[username]) {
                throw new Error('Username already exists');
            }

            users[username] = { password: this.hashPassword(password) };
            this.setUsers(users);
            this.setCurrentUser(username);
            this.redirectToDashboard();
        } catch (error) {
            this.showError(error.message);
        }
    }

    handleLogout(e) {
        e.preventDefault();
        this.clearCurrentUser();
        this.redirectToLogin();
    }

    checkAuth() {
        this.currentUser = this.getCurrentUser();
        if (this.currentUser) {
            if (this.isLoginPage()) {
                this.redirectToDashboard();
            } else {
                this.updateWelcomeMessage();
            }
        } else if (!this.isLoginPage()) {
            this.redirectToLogin();
        }
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('users')) || {};
    }

    setUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    setCurrentUser(username) {
        this.currentUser = { username };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    clearCurrentUser() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isLoginPage() {
        return window.location.pathname.endsWith('index.html');
    }

    redirectToDashboard() {
        window.location.href = 'dashboard.html';
    }

    redirectToLogin() {
        window.location.href = 'index.html';
    }

    updateWelcomeMessage() {
        const welcomeElement = document.getElementById('user-welcome');
        if (welcomeElement) {
            welcomeElement.textContent = `Welcome, ${this.currentUser.username}!`;
        }
    }

    showError(message) {
        alert(message);
    }

    hashPassword(password) {
        // In a real application, use a proper hashing algorithm
        // This is a simple hash for demonstration purposes only
        return btoa(password);
    }
}

// Initialize the AuthManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});