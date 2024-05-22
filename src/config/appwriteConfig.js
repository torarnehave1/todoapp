// src/config/appwriteConfig.js

const config = {
    project1: {
        endpoint: import.meta.env.VITE_API_ENDPOINT_1,
        projectId: import.meta.env.VITE_API_PROJECT_ID_1,
        databaseKey: import.meta.env.VITE_API_DATABASE_KEY_1,
        collectionKey: import.meta.env.VITE_API_COLLECTION_KEY_1,
        appname: import.meta.env.VITE_API_PLATFORM_NAME_1
    },
    project2: {
        endpoint: import.meta.env.VITE_API_ENDPOINT_2,
        projectId: import.meta.env.VITE_API_PROJECT_ID_2,
        databaseKey: import.meta.env.VITE_API_DATABASE_KEY_2,
        collectionKey: import.meta.env.VITE_API_COLLECTION_KEY_2,
        appname: import.meta.env.VITE_API_PLATFORM_NAME_2
    },
    activeProject: import.meta.env.VITE_ACTIVE_PROJECT // 'project1' or 'project2'
};

export default config;
