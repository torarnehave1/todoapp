// src/services/databaseService.js
import client from './client.js';
import { Databases, ID } from 'appwrite';
import config from '../config/appwriteConfig.js';

// Initialize the Databases instance with the configured client
const db = new Databases(client);

export async function createDocument(collectionKey, data) {
    try {
        const response = await db.createDocument(
            config[config.activeProject].databaseKey,
            collectionKey,
            ID.unique(),
            data
        );
        return response;
    } catch (error) {
        console.error('Error creating document:', error);
        throw error;
    }
}

export async function deleteDocument(collectionKey, documentId) {
    try {
        await db.deleteDocument(
            config[config.activeProject].databaseKey,
            collectionKey,
            documentId
        );
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
}

export async function listDocuments(collectionKey) {
    try {
        const response = await db.listDocuments(
            config[config.activeProject].databaseKey,
            collectionKey
        );
        return response.documents;
    } catch (error) {
        console.error('Error listing documents:', error);
        throw error;
    }
}
