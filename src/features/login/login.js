// src/features/login/login.js
import { loginWithGitHub } from '../../services/accountService.js';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('login')) {
        setupLogin();
    }
});

function setupLogin() {
    function handleGitHubLogin() {
        const successUrl = 'http://localhost:5173/success.html';
        const failureUrl = 'http://localhost:5173/failure.html';
        loginWithGitHub(successUrl, failureUrl);
    }

    document.getElementById('login').addEventListener('click', handleGitHubLogin);
}
