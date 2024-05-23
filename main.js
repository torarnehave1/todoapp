import { getCurrentUser, logout } from './src/services/accountService.js';
import { getTasks, addTask, renderTaskToDom } from './src/features/tasks/tasks.js';
import { switchProject } from './src/services/projectservice.js';
import { handleCSVImport, exportTasksToCSV } from './src/services/csvservice.js';
import config from './src/config/appwriteConfig.js';

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('login')) {
        setupMainApp();
    }
});

async function setupMainApp() {
    const tasksList = document.getElementById('tasks-list');
    const form = document.getElementById('form');

    if (!tasksList || !form) {
        console.error('Missing tasks-list or form element in the DOM.');
        return;
    }

    try {
        const user = await getCurrentUser();
        displayUserInfo(user);
    } catch (error) {
        console.error('Error getting logged-in user:', error);
        return;  // Return early if user is not authenticated
    }

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

    const importBtn = document.getElementById('importBtn');
    if (importBtn) {
        importBtn.style.display = 'block';
        importBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'text/csv';

            input.addEventListener('change', (event) => handleCSVImport(event, tasksList));

            input.click();
        });
    }

    const exportBtn = document.getElementById('btnExportCSV');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            try {
                const tasks = await getTasks();
                exportTasksToCSV(tasks);
            } catch (error) {
                console.error('Error exporting tasks:', error);
            }
        });
    }

    document.getElementById('selectAll').addEventListener('change', function() {
        const allCheckboxes = document.querySelectorAll('.checkbox');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    document.getElementById('SwitchProject').addEventListener('click', function() {
        const activeProject = activeProject === 'project1' ? 'project2' : 'project1';
        switchProject(activeProject);
        getTask();
    });

    document.getElementById('logout').addEventListener('click', async function() {
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });

    async function getTask() {
        try {
            const tasks = await getTasks();
            console.log('Fetched tasks:', tasks);
            tasksList.innerHTML = '';
            for (const task of tasks) {
                renderTaskToDom(task, tasksList);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }

    getTask();

    //function displayUserInfo(user) {
    //    console.log('Logged-in user:', user);
   //     const userInfoDiv = document.createElement('div');
     //   userInfoDiv.innerText = `Logged in as: ${user.name} (${user.email})`;
   //     document.body.insertBefore(userInfoDiv, document.body.firstChild);
   // }
}
