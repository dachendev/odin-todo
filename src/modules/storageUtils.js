import { createProject } from './app/projects.js';
import { createTodo } from './app/todos.js';

export function storeProjects(projectManager) {
    var projects = projectManager.getProjects();

    function stringifyTodos(todos) {
        return JSON.stringify(todos.map(todo => {
            return {
                id: todo.id,
                title: todo.title,
                priority: todo.priority,
                dueDate: todo.dueDate,
                project: todo.project,
                notes: todo.notes,
                completed: todo.completed,
                created: todo.created,
                updated: todo.updated,
            }
        }));
    }

    // Stringify projects
    projects = JSON.stringify(projects.map(project => {
        return {
            id: project.id,
            title: project.title,
            todos: stringifyTodos(project.getTodos()),
            created: project.created,
            updated: project.updated,
        }
    }));

    // Save to local storage
    localStorage.setItem('projects', projects);
}

export function loadProjects() {
    var projects = localStorage.getItem('projects');

    if (projects) {
        projects = JSON.parse(projects).map(project => {
            project.todos = JSON.parse(project.todos).map(todo => {
                todo.dueDate = new Date(todo.dueDate);

                return createTodo(todo);
            });

            return createProject(project);
        });
    }

    return projects;
}