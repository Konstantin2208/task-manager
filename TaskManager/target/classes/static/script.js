// Base API URL
const API_URL = "/api/tasks";

// Fetch and display tasks
async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();

    const tasksContainer = document.getElementById("tasks-container");
    tasksContainer.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${task.title} - ${task.description}</span>
            <div class="task-actions">
                <button class="edit" onclick="openEditModal(${task.id}, '${task.title}', '${task.description}')">Edit</button>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        tasksContainer.appendChild(li);
    });
}

// Add a new task
async function addTask() {
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;

    if (!title || !description) {
        alert("Please fill out all fields.");
        return;
    }

    const newTask = { title, description, completed: false };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
    });

    document.getElementById("task-title").value = "";
    document.getElementById("task-description").value = "";
    fetchTasks();
}

// Delete a task
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
}

// Open edit modal
function openEditModal(id, title, description) {
    const modal = document.getElementById("edit-modal");
    modal.style.display = "block";

    document.getElementById("edit-task-title").value = title;
    document.getElementById("edit-task-description").value = description;

    const saveButton = document.getElementById("save-task-button");
    saveButton.onclick = () => editTask(id);
}

// Edit a task
async function editTask(id) {
    const title = document.getElementById("edit-task-title").value;
    const description = document.getElementById("edit-task-description").value;

    if (!title || !description) {
        alert("Please fill out all fields.");
        return;
    }

    const updatedTask = { title, description, completed: false };

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask)
    });

    closeModal();
    fetchTasks();
}

// Close modal
function closeModal() {
    const modal = document.getElementById("edit-modal");
    modal.style.display = "none";
}

// Event Listeners
document.getElementById("add-task-button").addEventListener("click", addTask);
document.getElementById("close-modal").addEventListener("click", closeModal);
window.onclick = function (event) {
    const modal = document.getElementById("edit-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Initial Fetch
fetchTasks();
