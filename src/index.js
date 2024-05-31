import '@fortawesome/fontawesome-free/js/brands.js';
import '@fortawesome/fontawesome-free/js/fontawesome.js';
import '@fortawesome/fontawesome-free/js/regular.js';
import '@fortawesome/fontawesome-free/js/solid.js';
import { createProject, createProjectManager } from './modules/app/projects.js';
import { createTodo } from './modules/app/todos.js';
import * as domUtils from './modules/domUtils.js';
import './style.css';

function domLoaded() {
    // Setup projects
    var projectManager = createProjectManager();

    // Add default project
    var defaultProject = createProject({ title: 'Default Project' });
    projectManager.addProject(defaultProject);
    projectManager.setActiveProject(defaultProject.id);

    // Add many projects
    projectManager.addManyProjects([
        createProject({ title: 'Project 1' }),
        createProject({ title: 'Project 2' }),
        createProject({ title: 'Project 3' }),
    ]);

    // Add many todos
    defaultProject.addManyTodos([
        createTodo({ title: 'Todo 1', dueDate: new Date('2022-01-01') }),
        createTodo({ title: 'Todo 2', dueDate: new Date(), priority: 'low' }),
        createTodo({ title: 'Todo 2', dueDate: new Date('2024-06-02'), priority: 'low' }),
        createTodo({ title: 'Todo 2', dueDate: new Date('2024-06-05'), priority: 'medium' }),
        createTodo({ title: 'Todo 2', dueDate: new Date('2024-12-05'), priority: 'medium' }),
        createTodo({ title: 'Todo 4', dueDate: new Date('2028-01-01'), priority: 'high' }),
    ]);

    // Setup modals
    domUtils.setupAddProjectModal(projectManager);
    domUtils.setupAddTodoModal(projectManager);
    domUtils.setupDismissModal();

    // Render project list
    domUtils.renderProjectList(projectManager);

    // Render content
    domUtils.renderContent(projectManager);
}

document.addEventListener('DOMContentLoaded', domLoaded);