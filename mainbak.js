import { Client, Databases, Account, ID } from 'appwrite';

// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', () => {
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
    const projectId = import.meta.env.VITE_API_PROJECT_ID;
    const databaseKey = import.meta.env.VITE_API_DATABASE_KEY;
    const collectionKey = import.meta.env.VITE_API_COLLECTION_KEY;

    // Initialize the Appwrite Client
    const client = new Client();
    client.setEndpoint(apiEndpoint).setProject(projectId);

    // Initialize the Account service
    const account = new Account(client);

    // Function to handle GitHub OAuth login
    function loginWithGitHub() {
        account.createOAuth2Session(
            'github', // provider
            'http://localhost:5173/success.html', // success URL
            'http://localhost:5173/failure.html' // failure URL
            // ['repo', 'user'] // scopes
        );
    }

    // Initialize the Database service
    const db = new Databases(client);

    const tasksList = document.getElementById('tasks-list');
    const form = document.getElementById('form');

    form.addEventListener('submit', addTask);

    const importBtn = document.getElementById('importBtn');
    importBtn.style.display = 'block';
    importBtn.addEventListener('click', () => {
        // Move input creation and properties inside the click event listener
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'text/csv';

        input.addEventListener('change', () => {
            const file = input.files[0];
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                const csvData = reader.result;
                const data = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;
                // Add the code to process the CSV data here

                data.forEach(async (task) => {
                    console.log(task);
                    const tnameString = task.Tname != null ? task.Tname.toString() : ''; 
                    try {
                        const response = await db.createDocument(
                            databaseKey,
                            collectionKey,
                            ID.unique(),
                            {
                                body: tnameString,
                            }
                        );

                        // Render new tasks to the DOM
                        rendertoDom(response);
                    } catch (error) {
                        console.error('Error adding CSV data to the database:', error);
                    }
                });
            };
        });

        input.click(); // Now this click is considered as part of a direct user action
    });

    document.getElementById('selectAll').addEventListener('change', function() {
        const allCheckboxes = document.querySelectorAll('.checkbox');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    async function getTask() {
        try {
            const response = await db.listDocuments(databaseKey, collectionKey);
            console.log('Fetched tasks:', response.documents); // Debugging: Log fetched tasks
            for (const task of response.documents) {
                await rendertoDom(task);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }

    getTask();

    async function rendertoDom(task) {
        console.log('Rendering task:', task); // Debugging: Log task being rendered

        const taskwrapper = `<div class="task-wrapper" id="task-${task.$id}">
            <input type="checkbox" class="checkbox" id="check-${task.$id}">
            <p class="complete-${task.completed}" id="taskname-${task.$id}">${task.body}</p>
            <strong class="delete" id="delete-${task.$id}"><span class="material-symbols-outlined">
            delete
            </span></strong>
        </div>`;

        tasksList.insertAdjacentHTML('afterbegin', taskwrapper);

        const deleteButton = document.getElementById(`delete-${task.$id}`);
        const wrapper = document.getElementById(`taskname-${task.$id}`);
        
        deleteButton.addEventListener('click', () => {
            deleteTask(task.$id);
        });

        wrapper.addEventListener('click', async (e) => {
            if (e.target.className === 'complete-true') {
                e.target.className = 'complete-false';
            } else {
                e.target.className = 'complete-true';
            }
        });
    }

    async function deleteTask(taskId) {
        try {
            const response = await db.deleteDocument(databaseKey, collectionKey, taskId);
            document.getElementById(`task-${taskId}`).remove();
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    }

    async function addTask(e) {
        e.preventDefault();
        const taskBody = e.target.body.value;

        if (taskBody === '') {
            alert('Please add a task');
            return;
        }

        const response = await db.createDocument(
            databaseKey,
            collectionKey,
            ID.unique(),
            {
                body: taskBody,
            }
        );

        rendertoDom(response);
        form.reset();
    }
});
