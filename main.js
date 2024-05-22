import config from './src/config/appwriteConfig.js';
import { Client, Databases, Account, ID } from 'appwrite';



let activeProject = import.meta.env.VITE_ACTIVE_PROJECT;

let client = new Client();
let db;
let account;

function switchProject(project) {
    activeProject = project;

    client
        .setEndpoint(config[activeProject].endpoint)
        .setProject(config[activeProject].projectId);

    db = new Databases(client);
    account = new Account(client);
    document.getElementById('projectname').innerText = config[activeProject].appname;
}

switchProject(activeProject);

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('login')) {
        setupMainApp();
    } else {
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

async function setupMainApp() {
    const tasksList = document.getElementById('tasks-list');
    const form = document.getElementById('form');

    if (!tasksList || !form) {
        console.error('Missing tasks-list or form element in the DOM.');
        return;
    }

    try {
        const user = await account.get();
        displayUserInfo(user);
    } catch (error) {
        console.error('Error getting logged-in user:', error);
    }

    form.addEventListener('submit', addTask);

    const importBtn = document.getElementById('importBtn');
    if (importBtn) {
        importBtn.style.display = 'block';
        importBtn.addEventListener('click', () => {
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

                    data.forEach(async (task) => {
                        const tnameString = task.Tname != null ? task.Tname.toString() : '';
                        try {
                            const response = await db.createDocument(
                                config[activeProject].databaseKey,
                                config[activeProject].collectionKey,
                                ID.unique(),
                                {
                                    body: tnameString,
                                }
                            );

                            rendertoDom(response);
                        } catch (error) {
                            console.error('Error adding CSV data to the database:', error);
                        }
                    });
                };
            });

            input.click();
        });
    }

    document.getElementById('selectAll').addEventListener('change', function() {
        const allCheckboxes = document.querySelectorAll('.checkbox');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    document.getElementById('SwitchProject').addEventListener('click', function() {
        activeProject = activeProject === 'project1' ? 'project2' : 'project1';
        switchProject(activeProject);
        getTask();
    });

    document.getElementById('logout').addEventListener('click', async function() {
        try {
            await account.deleteSession('current');
            console.log('Logged out successfully');
            window.location.href = 'http://localhost:5173/login.html';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });

    async function getTask() {
        try {
            const response = await db.listDocuments(
                config[activeProject].databaseKey,
                config[activeProject].collectionKey
            );
            console.log('Fetched tasks:', response.documents);
            tasksList.innerHTML = '';
            for (const task of response.documents) {
                await rendertoDom(task);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }

    getTask();

    async function rendertoDom(task) {
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
            await db.deleteDocument(
                config[activeProject].databaseKey,
                config[activeProject].collectionKey,
                taskId
            );

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

        try {
            const response = await db.createDocument(
                config[activeProject].databaseKey,
                config[activeProject].collectionKey,
                ID.unique(),
                {
                    body: taskBody,
                }
            );

            rendertoDom(response);
            form.reset();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    function displayUserInfo(user) {
        console.log('Logged-in user:', user);
        const userInfoDiv = document.createElement('div');
        userInfoDiv.innerText = `Logged in as: ${user.name} (${user.email})`;
        document.body.insertBefore(userInfoDiv, document.body.firstChild);
    }
}
