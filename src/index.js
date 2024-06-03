import '@fortawesome/fontawesome-free/js/brands.js';
import '@fortawesome/fontawesome-free/js/fontawesome.js';
import '@fortawesome/fontawesome-free/js/regular.js';
import '@fortawesome/fontawesome-free/js/solid.js';
import { createProject, createProjectManager } from './modules/app/projects.js';
import { createTodo } from './modules/app/todos.js';
import * as domUtils from './modules/domUtils.js';
import { loadProjects, storeProjects } from './modules/storageUtils.js';
import './style.css';

function domLoaded() {
    // Load projects from local storage
    var projects = loadProjects();

    // Create project manager
    var projectManager;

    if (projects) {
        projectManager = createProjectManager({ projects, activeProjectId: projects[0].id, storeProjects });
    } else {
        projectManager = createProjectManager({ storeProjects });

        // Create default project
        var defaultProject = createProject({ title: '✏️ Todos' });
        projectManager.addProject(defaultProject);
        projectManager.setActiveProject(defaultProject.id);

        // Add todos
        defaultProject.addManyTodos([
            createTodo({ title: 'Todo 1' }),
            createTodo({ title: 'Todo 2' }),
            createTodo({ title: 'Todo 3' }),
        ]);
    }

    /* Setup DOM */
    // Setup modals
    domUtils.setupAddProjectModal(projectManager);
    domUtils.setupAddTodoModal(projectManager);
    domUtils.setupEditTodoModal(projectManager);
    domUtils.setupDismissModal();

    // Setup events
    domUtils.onProjectTitleChange(projectManager);

    // Render
    domUtils.renderProjectList(projectManager);
    domUtils.renderProjectSelects(projectManager);
    domUtils.renderContent(projectManager);
}

document.addEventListener('DOMContentLoaded', domLoaded);