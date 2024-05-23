// src/services/client.js
import config from '../config/appwriteConfig.js';
import { Client } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();

// Set the endpoint and project ID based on the active project
client
    .setEndpoint(config[config.activeProject].endpoint)
    .setProject(config[config.activeProject].projectId);

export default client;
