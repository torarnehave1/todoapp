async function rendertoDom(task) {
    const taskwrapper = `<div class="task-wrapper" id="task-${task.$id}">
    <input type="checkbox" class="checkbox" id="check-${task.$id}">
    <p class="complete-${task.completed}" id="taskname-${task.$id}">${task.body}</p>
    <strong class="delete" id="delete-${task.$id}">x</strong>
    </div>`;

    tasksList.insertAdjacentHTML('afterbegin', taskwrapper);

    const deleteButton = document.getElementById(`delete-${task.$id}`);
    const wrapper = document.getElementById(`check-${task.$id}`);

    deleteButton.addEventListener('click', () => {
        deleteTask(task.$id);
    });

    wrapper.addEventListener('click', async (e) => {
        const taskName = document.getElementById(`taskname-${task.$id}`);
        if (wrapper.checked) {
            taskName.classList.remove('complete-false');
            taskName.classList.add('complete-true');
        } else {
            taskName.classList.remove('complete-true');
            taskName.classList.add('complete-false');
        }
    });
}
