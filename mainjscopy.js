import { Client, Databases, ID } from 'appwrite';

const client = new Client();
const databaseId = '6606a184338e6f8737e0'; // Database ID
const collectionId = '6606a1b3b518504eb993'; // Collection ID

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6606a08fa5e4453119f3');

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
                         '6606a184338e6f8737e0',
                        '6606a1b3b518504eb993',
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
        const response = await db.listDocuments(databaseId, collectionId);
        console.log(response);
        console.log('JIPPI This will appear in the integrated terminal');

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
    <strong class="delete" id="delete-${task.$id}">x</strong>
    </div>`;

    tasksList.insertAdjacentHTML('afterbegin', taskwrapper);

    const deleteButton = document.getElementById(`delete-${task.$id}`);
    deleteButton.addEventListener('click', () => {
        deleteTask(task.$id)
    
   

    })

}

async function deleteTask(taskId) {
    try {
        const response = await db.deleteDocument('6606a184338e6f8737e0', '6606a1b3b518504eb993', taskId);
        console.log(response);
        console.log('JIPPI This will appear in the integrated terminal');
        location.reload();
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
