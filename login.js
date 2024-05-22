import { Client, Account } from 'appwrite';

const config = {
    endpoint: import.meta.env.VITE_API_ENDPOINT_1,
    projectId: import.meta.env.VITE_API_PROJECT_ID_1
};

let client = new Client();
let account = new Account(client);

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId);

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('login')) {
        setupLogin();
    }
});

function setupLogin() {
    function loginWithGitHub() {
        account.createOAuth2Session(
            'github',
            'http://localhost:5173/success.html',
            'http://localhost:5173/failure.html'
        );
    }

    document.getElementById('login').addEventListener('click', loginWithGitHub);

    
}
