// testLogin.js
import { loginWithGitHub, getCurrentUser, logout } from './src/services/accountService.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Testing Appwrite login and session");

    // Add event listener for login button
    const loginButton = document.getElementById('login');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            loginWithGitHub(
                'http://localhost:5173/success.html',
                'http://localhost:5173/failure.html'
            );
        });
    }

    // Check if the user is logged in
    try {
        const user = await getCurrentUser();
        console.log("Logged-in user:", user);

        const userInfoDiv = document.createElement('div');
        userInfoDiv.innerText = `Logged in as: ${user.name} (${user.email})`;
        document.body.insertBefore(userInfoDiv, document.body.firstChild);
    } catch (error) {
        console.error('Error getting logged-in user:', error);
    }

    // Add event listener for logout button
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await logout();
                window.location.reload();
            } catch (error) {
                console.error('Error logging out:', error);
            }
        });
    }
});
