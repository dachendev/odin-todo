import { createProject } from './app/projects.js';
import { createTodo } from './app/todos.js';
import * as dateFns from 'date-fns';

/* Modals */

export function setupAddProjectModal(projectManager) {
    var addProjectButtons = document.querySelectorAll('.add-project-button');
    var addProjectModal = document.getElementById('add-project-modal');
    var addProjectForm = document.querySelector('#add-project-modal form');

    addProjectButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Show modal
            addProjectModal.showModal();
        });
    });
    
    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        var formData = new FormData(e.currentTarget);

        // Create & add project
        var title = formData.get('title');
        projectManager.addProject(createProject({ title }));

        // Persist projects to local storage
        projectManager.store();

        // Re-render project list
        renderProjectList(projectManager);
        renderProjectSelects(projectManager);

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
        var priority = formData.get('priority');
        var dueDate = formData.get('dueDate');
        var notes = formData.get('notes');
        var project = formData.get('project'); // Project ID
 
        if (priority === 'unset') {
            priority = null;
        }

        console.log('Due date before:', dueDate);

        if (dueDate) {
            dueDate = new Date(dueDate.replace(/-/g, '/'));
        } else {
            dueDate = null;
        }

        var todo = createTodo({ title, priority, dueDate, notes, project });
        projectManager.getProjectById(project).addTodo(todo);

        // Persist projects to local storage
        projectManager.store();

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

export function setupEditTodoModal(projectManager) {
    var todoList = document.getElementById('todo-list');
    var editTodoModal = document.getElementById('edit-todo-modal');
    var editTodoForm = document.querySelector('#edit-todo-modal form');
    var deleteTodoButton = document.getElementById('delete-todo-button');

    todoList.addEventListener('click', (e) => {
        // Delegate event to todo item
        if (e.target.classList.contains('todo-item')) {
            // Get todo
            var todoId = e.target.dataset.id;
            var todo = projectManager.getActiveProject().getTodoById(todoId);
            console.log('Todo:', todo);

            // Set form data
            editTodoForm.querySelector('[name="id"]').value = todo.id;
            editTodoForm.querySelector('[name="title"]').value = todo.title;
            editTodoForm.querySelector('[name="priority"]').value = todo.priority;
            editTodoForm.querySelector('[name="dueDate"]').valueAsDate = todo.dueDate;
            editTodoForm.querySelector('[name="notes"]').value = todo.notes;
            editTodoForm.querySelector('[name="project"]').value = todo.project;

            if (todo.priority === null) {
                editTodoForm.querySelector('[name="priority"]').value = 'unset';
            }

            // Show modal
            editTodoModal.showModal();
        }
    });

    editTodoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        var formData = new FormData(e.currentTarget);

        // Get todo
        var todoId = formData.get('id');
        var todo = projectManager.getActiveProject().getTodoById(todoId);

        // Update todo
        var title = formData.get('title');
        var priority = formData.get('priority');
        var dueDate = formData.get('dueDate');
        var notes = formData.get('notes');
        var project = formData.get('project'); // Project ID

        if (priority === 'unset') {
            priority = null;
        }

        if (dueDate) {
            dueDate = new Date(dueDate.replace(/-/g, '/'));
        } else {
            dueDate = null;
        }

        todo.title = title;
        todo.priority = priority;
        todo.dueDate = dueDate;
        todo.notes = notes;
        
        if (project !== todo.project) {
            // Remove from old project
            var oldProject = projectManager.getProjectById(todo.project);
            oldProject.removeTodoById(todo.id);

            // Add to new project
            var newProject = projectManager.getProjectById(project);
            newProject.addTodo(todo);
            todo.setProject(newProject.id);
        }

        // Persist projects to local storage
        projectManager.store();

        // Re-render content
        renderContent(projectManager);

        // Close modal
        editTodoModal.close();
    });

    editTodoModal.addEventListener('close', () => {
        // Reset form
        editTodoForm.reset();
    });

    // Delete todo
    deleteTodoButton.addEventListener('click', () => {
        // Get todo
        var todoId = editTodoForm.querySelector('[name="id"]').value;
        var todo = projectManager.getActiveProject().getTodoById(todoId);

        // Remove from project
        projectManager.getActiveProject().removeTodoById(todo.id);

        // Persist projects to local storage
        projectManager.store();

        // Re-render content
        renderContent(projectManager);

        // Close modal
        editTodoModal.close();
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

export function renderProjectSelects(projectManager) {
    var projectSelects = document.querySelectorAll('select[name="project"]');
    var projectOptions = '';

    projectManager.getProjects().forEach(project => {
        projectOptions += `<option value="${project.id}">${project.title}</option>`;
    });

    projectSelects.forEach(select => {
        select.innerHTML = projectOptions;
    });
}

/* Content */

export function setActiveProject(projectManager, projectId) {
    var project = projectManager.getProjectById(projectId);

    // Don't set active project if it's already active
    if (project.id === projectManager.getActiveProjectId()) {
        return;
    }

    projectManager.setActiveProject(project.id);

    // Update head
    document.title = `${project.title} - ${window.APP_NAME}`;

    // Update active project in project list
    var projectList = document.getElementById('project-list');
    
    projectList.querySelectorAll('li').forEach(li => {
        li.classList.remove('active');
    });

    projectList.querySelector(`li[data-id="${project.id}"]`).classList.add('active');

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

    // Priority
    if (todo.priority) {
        var priority = document.createElement('span');
        priority.classList.add('todo-priority');
        priority.classList.add(`priority-${todo.priority}`);
        li.appendChild(priority);
    }

    // Due Date
    if (todo.dueDate) {
        var dueDate = document.createElement('span');
        dueDate.classList.add('todo-due-date');

        // Determine due date color & text
        var now = new Date().setHours(0, 0, 0, 0);
        var dueIn = dateFns.differenceInDays(todo.dueDate, now);

        if (dateFns.isToday(todo.dueDate)) {
            dueDate.textContent = 'Today';
        } else if (dateFns.compareAsc(todo.dueDate, now) < 0) {
            dueDate.textContent = 'Overdue';
        } else if (dueIn === 1) {
            dueDate.textContent = 'Tomorrow';
        } else if (dueIn <= 7) {
            dueDate.textContent = `${dueIn} days`;
        } else if (dateFns.isThisYear(todo.dueDate)) {
            dueDate.textContent = dateFns.format(todo.dueDate, 'MMM d');
        } else {
            dueDate.textContent = dateFns.format(todo.dueDate, 'PP');
        }

        li.appendChild(dueDate);
    }

    // Title
    var title = document.createElement('span');
    title.classList.add('todo-title');
    title.textContent = todo.title;
    li.appendChild(title);

    // Notes
    if (todo.notes) {
        var notesIndicator = document.createElement('span');
        notesIndicator.classList.add('todo-notes-indicator');

        // Add icon
        var icon = document.createElement('i');
        icon.classList.add('fa-regular');
        icon.classList.add('fa-note-sticky');
        notesIndicator.appendChild(icon);

        li.appendChild(notesIndicator);
    }

    /* END Content */
    
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

export function onProjectTitleChange(projectManager) {
    var project = projectManager.getActiveProject();
    var projectTitle = document.getElementById('project-title');

    projectTitle.addEventListener('change', (e) => {
        project.title = e.currentTarget.value;

        // Persist projects to local storage
        projectManager.store();

        // Re-render project list
        renderProjectList(projectManager);
    });
}

export function renderContent(projectManager) {
    var todoList = document.getElementById('todo-list');
    var project = projectManager.getActiveProject();
    var todos = project.getTodos();

    // Set project title
    document.getElementById('project-title').value = project.title;

    // Clear list
    todoList.innerHTML = '';

    todos.forEach(todo => {
        var li = createTodoItem(todo);
        todoList.appendChild(li);
    });
}