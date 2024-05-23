// src/services/projectService.js
import client from './client.js';
import config from '../config/appwriteConfig.js';
import { Databases } from 'appwrite';

let db;

export function switchProject(project) {
    activeProject = project;

    client
        .setEndpoint(config[project].endpoint)
        .setProject(config[project].projectId);

    db = new Databases(client);
    document.getElementById('projectname').innerText = config[project].appname;
}

export function getDatabaseInstance() {
    return db;
}
