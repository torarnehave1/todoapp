// src/features/tasks/tasks.js
import { listDocuments, createDocument, deleteDocument } from '../../services/databaseService.js';
import config from '../../config/appwriteConfig.js';
import { getCurrentUser } from '../../services/accountService.js';

console.log("Tasks.js is loaded!");

// Function to fetch and render tasks
async function fetchAndRenderTasks() {
    console.log("Fetching and rendering tasks...");
    try {
        const tasks = await listDocuments(config[config.activeProject].collectionKey);
        console.log("Fetched tasks:", tasks);
        const tasksList = document.getElementById('tasks-list');
        if (!tasksList) {
            console.error('Missing tasks-list element in the DOM.');
            return;
        }

        tasksList.innerHTML = ''; // Clear existing tasks

        tasks.forEach(task => {
            console.log("Rendering task:", task);
            renderTaskToDom(task, tasksList);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Render task to the DOM
function renderTaskToDom(task, tasksList) {
    console.log("Rendering task to DOM:", task);
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
        console.log("Deleting task:", task.$id);
        removeTask(task.$id);
        document.getElementById(`task-${task.$id}`).remove();
    });

    wrapper.addEventListener('click', async (e) => {
        if (e.target.className === 'complete-true') {
            e.target.className = 'complete-false';
        } else {
            e.target.className = 'complete-true';
        }
    });
}

// Function to add a task
async function addTask(taskBody) {
    try {
        const response = await createDocument(config[config.activeProject].collectionKey, { body: taskBody });
        console.log("Task added:", response);
        return response;
    } catch (error) {
        console.error('Error adding task:', error);
        throw error;
    }
}

// Function to remove a task
async function removeTask(taskId) {
    try {
        await deleteDocument(config[config.activeProject].collectionKey, taskId);
        console.log("Task removed:", taskId);
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}

// Function to display user information
async function displayUserInfo() {
    try {
        const user = await getCurrentUser();
        console.log('Logged-in user:', user);
        const userInfoDiv = document.createElement('div');
        userInfoDiv.innerText = `Logged in as: ${user.name} (${user.email})`;
        document.body.insertBefore(userInfoDiv, document.body.firstChild);
    } catch (error) {
        console.error('Error getting logged-in user:', error);
    }
}

// Initialize the task fetching and rendering when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM fully loaded and parsed");
    await displayUserInfo();
    fetchAndRenderTasks();

    const form = document.getElementById('form');
    const tasksList = document.getElementById('tasks-list');
    if (form && tasksList) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const taskBody = e.target.body.value;
            if (taskBody === '') {
                alert('Please add a task');
                return;
            }

            try {
                const response = await addTask(taskBody);
                renderTaskToDom(response, tasksList);
                form.reset();
            } catch (error) {
                console.error('Error adding task:', error);
            }
        });
    } else {
        console.error('Missing form or tasks-list element in the DOM.');
    }
});

// Export functions
export { fetchAndRenderTasks, addTask, removeTask, renderTaskToDom };
