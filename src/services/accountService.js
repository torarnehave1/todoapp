// src/services/accountService.js
import client from './client.js';
import { Account } from 'appwrite';

// Initialize the Account instance with the configured client
const account = new Account(client);

// Function to handle GitHub OAuth login
export function loginWithGitHub(successUrl, failureUrl) {
    console.log("Starting GitHub login");
    return account.createOAuth2Session(
        'github',
        successUrl,
        failureUrl
    ).then(response => {
        console.log("GitHub login initiated successfully:", response);
        window.location.href = '/success.html'
    }).catch(error => {
        console.error("Error initiating GitHub login:", error);
    });
}

// Function to get the currently logged-in user
export async function getCurrentUser() {
    console.log("getCurrentUser called");
    
    try {
        //const user = await account.get();
       // console.log("User fetched:", user);
        //return user;
    } catch (error) {
        console.error('Error getting logged-in user:', error);
        if (error.code === 401) {
            // Redirect to login if user is not authenticated
           // window.location.href = '/login.html';
        }
        throw error;
    }
}

// Function to log out the current user
export async function logout() {
    console.log("Logging out user");
    try {
        await account.deleteSession('current');
        console.log('Logged out successfully');
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
}

export default account;
