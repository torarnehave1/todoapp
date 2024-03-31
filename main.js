import { Client, Databases, ID } from 'appwrite';

/**
 * Initializes a new Appwrite client.
 *
 * @param {Object} config - The configuration object.
 * @param {string} config.endpoint - The endpoint URL of the Appwrite server. 
 * @param {string} config.project - The project ID.
 * @param {string} [config.key] - The project API key.
 * @param {string} [config.locale] - The Appwrite locale code. 
 * @returns {Client} The Appwrite client instance.
 */

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
const projectId = import.meta.env.VITE_API_PROJECT_ID;
const databaseKey = import.meta.env.VITE_API_DATABASE_KEY;
const collectionKey = import.meta.env.VITE_API_COLLECTION_KEY;

//console.log(apiEndpoint, projectId, databaseKey, collectionKey);


const client = new Client();
//const databaseId = VITE_API_DATABASE_KEY //'6606a184338e6f8737e0'; // Database ID
//const collectionId = VITE_API_COLLECTION_KEY 
client
    .setEndpoint(apiEndpoint)
    .setProject(projectId);
   // console.log('FASFS') 
//console.log(databaseKey)    

const db = new Databases(client);

const tasksList = document.getElementById('tasks-list');
const form = document.getElementById('form');

form.addEventListener('submit', addTask)

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
                //console.log(data);
                // Add the code to process the CSV data here
            // Ny Code
                
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
    
    
    
    // Add the code to import the CSV file here
});


document.getElementById('selectAll').addEventListener('change', function() {
    const allCheckboxes = document.querySelectorAll('.checkbox');
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});

// Select all task p elements
// Select all task name elements


async function getTask() {
    try {
        const response = await db.listDocuments(databaseKey, collectionKey);
        //console.log(response);
       // console.log('JIPPI This will appear in the integrated terminal');

        for (const task of response.documents) {
            await rendertoDom(task);
        }

    } catch (error) {
        console.error('Error fetching documents:', error);
    }
}


getTask()

async function rendertoDom(task) {

    // console.log(`Render to DOM called, task id: ${task.$id}`);

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
        deleteTask(task.$id)
     
   

    })

    wrapper.addEventListener('click', async (e) => {
        //toggleTask(task.$id)
    //const tasknamw = document.getElementById(`taskname-${task.$id}`);
       console.log(e);
    if (e.target.className === 'complete-true') {
           e.target.className = 'complete-false';
       } else {
        e.target.className = 'complete-true';
       }
       // task.completed =!task.completed;
       // e.target.className = `completed-${task.completed}`
    })


    

}

async function deleteTask(taskId) {
    try {
        const response = await db.deleteDocument(
            databaseKey, 
            collectionKey, 
            taskId);

            document.getElementById(`task-${taskId}`).remove();
       
       // location.reload();
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
        '6606a184338e6f8737e0',
        '6606a1b3b518504eb993',
        ID.unique(),
        {
            body: taskBody,
        }
    )

    rendertoDom(response)
    form.reset()

}
