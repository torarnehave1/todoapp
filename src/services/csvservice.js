// src/services/csvService.js
import { addTask, renderTaskToDom } from '../features/tasks/tasks.js';
import Papa from 'papaparse';

export async function handleCSVImport(event, tasksList) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
        const csvData = reader.result;
        const data = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;

        for (const task of data) {
            const tnameString = task.Tname != null ? task.Tname.toString() : '';
            try {
                const response = await addTask(tnameString);
                renderTaskToDom(response, tasksList);
            } catch (error) {
                console.error('Error adding CSV data to the database:', error);
            }
        }
    };
}

export function exportTasksToCSV(tasks) {
    try {
        if (!tasks || tasks.length === 0) {
            throw new Error('No tasks available to export.');
        }

        const csvData = Papa.unparse(tasks);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'tasks.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error exporting tasks to CSV:', error);
        alert('An error occurred while exporting tasks to CSV. Please try again.');
    }
}
