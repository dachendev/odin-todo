import { createProject } from './app/projects.js';
import { createTodo } from './app/todos.js';
import { differenceInDays, compareAsc, isThisYear, format as formatDate } from 'date-fns';

/* Modals */

export function setupAddProjectModal(projectManager) {
    var addProjectButton = document.getElementById('add-project-button');
    var addProjectModal = document.getElementById('add-project-modal');
    var addProjectForm = document.querySelector('#add-project-modal form');

    addProjectButton.addEventListener('click', () => {
        // Show modal
        addProjectModal.showModal();
    });
    
    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        var formData = new FormData(e.currentTarget);

        // Create & add project
        var title = formData.get('title');
        projectManager.addProject(createProject({ title }));

        // Re-render project list
        renderProjectList(projectManager);
        renderProjectSelect(projectManager);

        // Close modal
        addProjectModal.close();
    });

    addProjectModal.addEventListener('close', () => {
        // Reset form
        addProjectForm.reset();
    });
}

export function setupAddTodoModal(projectManager) {
    var addTodoButton = document.getElementById('add-todo-button');
    var addTodoModal = document.getElementById('add-todo-modal');
    var addTodoForm = document.querySelector('#add-todo-modal form');

    // Add project select
    renderProjectSelect(projectManager);

    addTodoButton.addEventListener('click', () => {
        // Select active project
        var projectSelect = addTodoForm.querySelector('[name="project"]');
        projectSelect.value = projectManager.getActiveProjectId();

        // Show modal
        addTodoModal.showModal();
    });
    
    addTodoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        var formData = new FormData(e.currentTarget);

        // Create & add todo
        var title = formData.get('title');
        var description = formData.get('description');
        var dueDate = formData.get('dueDate');
        var priority = formData.get('priority');
        var project = formData.get('project'); // Project ID

        if (priority === 'unset') {
            priority = null;
        }
        
        var todo = createTodo({ title, description, dueDate, priority, project });
        projectManager.getProjectById(project).addTodo(todo);

        // Re-render content if project is active
        if (project === projectManager.getActiveProjectId()) {
            renderContent(projectManager);
        }

        // Close modal
        addTodoModal.close();
    });

    addTodoModal.addEventListener('close', () => {
        // Reset form
        addTodoForm.reset();
    });
}

export function setupDismissModal() {
    document.querySelectorAll('[data-dismiss="modal"]').forEach(el => {
        el.addEventListener('click', () => {
            var openModal = document.querySelector('.modal[open]');
            if (openModal) {
                openModal.close();
            }
        });
    });
}

export function renderProjectSelect(projectManager) {
    var addTodoForm = document.querySelector('#add-todo-modal form');
    var projectSelect = addTodoForm.querySelector('[name="project"]');

    // Clear options
    projectSelect.innerHTML = '';

    projectManager.getProjects().forEach(project => {
        var option = document.createElement('option');
        
        // Add option attributes
        option.value = project.id;
        option.textContent = project.title;

        // Add option
        projectSelect.appendChild(option);
    });
}

/* Content */

export function setActiveProject(projectManager, projectId) {
    // Don't set active project if it's already active
    if (projectId === projectManager.getActiveProjectId()) {
        return;
    }

    projectManager.setActiveProject(projectId);

    // Update active project in project list
    var projectList = document.getElementById('project-list');
    
    projectList.querySelectorAll('li').forEach(li => {
        li.classList.remove('active');
    });

    projectList.querySelector(`li[data-id="${projectId}"]`).classList.add('active');

    // Re-render content
    renderContent(projectManager);
}

export function createProjectItem(projectManager, project) {
    var li = document.createElement('li');

    // Add classes
    li.classList.add('project-item');
    if (project.id === projectManager.getActiveProjectId()) {
        li.classList.add('active');
    }

    // Add data attributes
    li.dataset.id = project.id;

    // Add content
    li.textContent = project.title;

    // Add event listeners
    li.addEventListener('click', () => {
        if (li.dataset.id !== projectManager.getActiveProjectId()) {
            // Set active project
            setActiveProject(projectManager, li.dataset.id);
        }
    });

    return li;
}

export function renderProjectList(projectManager) {
    var projectList = document.getElementById('project-list');

    // Clear list
    projectList.innerHTML = '';

    projectManager.getProjects().forEach(project => {
        var li = createProjectItem(projectManager, project);
        projectList.appendChild(li);
    });
}

export function createTodoItem(todo) {
    var li = document.createElement('li');

    // Add classes
    li.classList.add('todo-item');

    if (todo.completed) {  
        li.classList.add('completed');
    }

    // Add data attributes
    li.dataset.id = todo.id;

    /* Add content */

    // Checkbox
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'completed';
    checkbox.classList.add('todo-completed');
    checkbox.checked = todo.completed;
    li.appendChild(checkbox);

    // Due Date
    if (todo.dueDate) {
        var dueDate = document.createElement('span');
        dueDate.classList.add('todo-due-date');

        // Determine due date color & text
        var now = new Date();
        var dueIn = differenceInDays(todo.dueDate, now);

        if (dueIn === 0) {
            dueDate.classList.add('due-today');
            dueDate.textContent = 'Today';
        } else if (compareAsc(todo.dueDate, now) < 0) {
            dueDate.classList.add('due-overdue');
            dueDate.textContent = 'Overdue';
        } else if (dueIn === 1) {
            dueDate.classList.add('due-tomorrow');
            dueDate.textContent = 'Tomorrow';
        } else if (dueIn <= 7) {
            dueDate.classList.add('due-soon');
            dueDate.textContent = `${dueIn} days`;
        } else if (isThisYear(todo.dueDate)) {
            dueDate.textContent = formatDate(todo.dueDate, 'MMM d');
        } else {
            dueDate.textContent = formatDate(todo.dueDate, 'PP');
        }

        li.appendChild(dueDate);
    }

    // Title
    var title = document.createElement('span');
    title.classList.add('todo-title');
    title.textContent = todo.title;
    li.appendChild(title);

    // Details
    var details = document.createElement('div');
    details.classList.add('todo-details');
    li.appendChild(details);

    // Priority
    if (todo.priority) {
        var priority = document.createElement('span');
        priority.classList.add('todo-priority');
        priority.classList.add(`priority-${todo.priority}`);

        // Set priority text
        priority.textContent = todo.priority;

        details.appendChild(priority);
    }


    /* END Add content */
    
    // Add event listeners
    checkbox.addEventListener('change', () => {
        // Toggle completed
        if (checkbox.checked) {
            todo.complete();
            li.classList.add('completed');
        } else {
            todo.uncomplete();
            li.classList.remove('completed');
        }
    });


    return li;
}

export function renderContent(projectManager) {
    var projectTitle = document.getElementById('project-title');
    var todoList = document.getElementById('todo-list');

    var project =  projectManager.getActiveProject();
    var todos = project.getTodos();

    // Set project title
    projectTitle.textContent = project.title;

    // Clear list
    todoList.innerHTML = '';

    todos.forEach(todo => {
        var li = createTodoItem(todo);
        todoList.appendChild(li);
    });
}