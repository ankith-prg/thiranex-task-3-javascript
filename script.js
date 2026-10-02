// DOM Selectors
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// State Management: Load from window.localStorage or default to empty array
let tasks = JSON.parse(window.localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Initialize App (READ)
renderTasks();

// CREATE: Add a new task
todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    
    if (taskText !== '') {
        const newTask = {
            id: Date.now().toString(), // Unique ID
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        saveAndRender();
        todoInput.value = ''; // Clear input
    }
});

// DELEGATED EVENT LISTENERS (For Update and Delete actions)
todoList.addEventListener('click', function(e) {
    const target = e.target;
    // Find the closest parent <li> element to get the task ID
    const li = target.closest('li');
    if (!li) return;
    
    const id = li.dataset.id;

    // DELETE Task
    if (target.classList.contains('delete-btn')) {
        tasks = tasks.filter(task => task.id !== id);
        saveAndRender();
    }
    // UPDATE: Toggle Completion Status
    else if (target.type === 'checkbox') {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveAndRender();
        }
    }
    // UPDATE: Edit Task Text
    else if (target.classList.contains('edit-btn')) {
        const task = tasks.find(task => task.id === id);
        const newText = prompt('Edit your task:', task.text);
        
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveAndRender();
        }
    }
});

// ADVANCED FILTERING Logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Update UI for active button
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Apply filter state and re-render
        currentFilter = this.dataset.filter;
        renderTasks();
    });
});

// Helper Function: Save to window.localStorage and Update DOM
function saveAndRender() {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Helper Function: Create Dynamic DOM Elements based on state
function renderTasks() {
    // Clear current list
    todoList.innerHTML = '';

    // Apply current filter (All, Active, Completed)
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Generate dynamic DOM elements
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.id = task.id; // Store ID in data attribute for delegation
        if (task.completed) li.classList.add('completed');

        // Build inner HTML for the list item
        li.innerHTML = `
            <div class="task-info">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        
        // Attach to the DOM
        todoList.appendChild(li);
    });
}