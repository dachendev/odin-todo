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
    var defaultProject = createProject({ title: '✏️ Todos' });
    projectManager.addProject(defaultProject);
    projectManager.setActiveProject(defaultProject.id);

    // Add many projects
    projectManager.addManyProjects([
        createProject({ title: '🧹 Chores' }),
        createProject({ title: '💐 Mom\'s Birthday' }),
        createProject({ title: '💼 Work' }),
    ]);

    // Add many todos
    defaultProject.addManyTodos([
        createTodo({ title: 'Todo 1', dueDate: new Date('2022-01-01') }),
        createTodo({ title: 'Todo 2', dueDate: new Date(), priority: 'low' }),
        createTodo({ title: 'Todo 2', dueDate: new Date('2024-06-02'), priority: 'low' }),
        createTodo({ title: 'Todo 2', dueDate: new Date('2024-06-05'), priority: 'medium' }),
        createTodo({ title: 'Todo 2', dueDate: new Date('2024-12-05'), priority: 'medium' }),
        createTodo({ title: 'Todo 4', dueDate: new Date('2028-01-01'), priority: 'high', notes: 'Some notes' }),
    ]);

    // Setup modals
    domUtils.setupAddProjectModal(projectManager);
    domUtils.setupAddTodoModal(projectManager);
    domUtils.setupEditTodoModal(projectManager);
    domUtils.setupDismissModal();

    // Setup projects
    domUtils.renderProjectList(projectManager);
    domUtils.renderProjectSelects(projectManager);

    // Setup content
    domUtils.setupProjectTitle(projectManager);
    domUtils.renderContent(projectManager);
}

document.addEventListener('DOMContentLoaded', domLoaded);