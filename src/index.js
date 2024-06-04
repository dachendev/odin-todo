import '@fortawesome/fontawesome-free/js/brands.js';
import '@fortawesome/fontawesome-free/js/fontawesome.js';
import '@fortawesome/fontawesome-free/js/regular.js';
import '@fortawesome/fontawesome-free/js/solid.js';
import { createProject, createProjectManager } from './modules/app/projects.js';
import { createTodo } from './modules/app/todos.js';
import * as domUtils from './modules/domUtils.js';
import { loadProjects, storeProjects } from './modules/storageUtils.js';
import './style.css';
import Logo from './assets/logo.jpg';

window.APP_NAME = 'Do it.';

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
        var defaultProject = createProject({ title: 'Default' });
        projectManager.addProject(defaultProject);
        projectManager.setActiveProject(defaultProject.id);

        var now = new Date();
        now.setHours(0, 0, 0, 0);

        // Add todos
        defaultProject.addManyTodos([
            createTodo({ title: 'Join the Dark Side', priority: 'high', dueDate: new Date('2022-01-01') }),
            createTodo({ title: 'Execute Order 66', priority: 'high', dueDate: now }),
            createTodo({ title: 'Kill the Jedi', priority: 'high' }),
            createTodo({ title: 'Say hi to Darth Jar Jar', priority: 'low' }),
        ]);
    }

    // Update head
    document.title = `${projectManager.getActiveProject().title} - ${window.APP_NAME}`;
    document.getElementById('logo').src = Logo;

    /* Setup DOM */
    // Setup modals
    domUtils.setupAddProjectModal(projectManager);
    domUtils.setupAddTodoModal(projectManager);
    domUtils.setupEditTodoModal(projectManager);
    domUtils.setupDismissModal();

    // Setup events
    domUtils.onProjectTitleChange(projectManager);
    domUtils.onCheckboxChange(projectManager);

    // Render
    domUtils.renderProjectList(projectManager);
    domUtils.renderProjectSelects(projectManager);
    domUtils.renderContent(projectManager);
}

document.addEventListener('DOMContentLoaded', domLoaded);