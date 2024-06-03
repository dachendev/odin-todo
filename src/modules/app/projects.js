import { nanoid } from 'nanoid';

export function createProjectManager({
    projects = [],
    activeProjectId,
    storeProjects,
} = {}) {
    function store() {
        if (storeProjects) {
            storeProjects(this);
        }
    }

    function addProject(project) {
        projects.push(project);
    }

    function addManyProjects(projects) {      
        projects.forEach(project => {
            projects.push(project);
        });
    }

    function getProjectById(id) {
        return projects.find(project => project.id === id);
    }

    function getProjects() {
        return projects;
    }

    function getActiveProject() {
        return projects.find(project => project.id === activeProjectId);
    }

    function getActiveProjectId() {
        return activeProjectId;
    }

    function setActiveProject(id) {
        activeProjectId = id;
    }

    return {
        store,
        addProject,
        addManyProjects,
        getProjectById,
        getProjects,
        getActiveProject,
        getActiveProjectId,
        setActiveProject,
    };
}

export function createProject({
    id = nanoid(6),
    title = 'New Project',
    todos = [],
    created = new Date(),
    updated = new Date(),
}) {
    function addTodo(todo) {
        todo.setProject(id);
        todos.push(todo);
    }

    function addManyTodos(todos) {
        todos.forEach(todo => {
            addTodo(todo);
        });
    }

    function getTodos() {
        return todos;
    }

    function getTodoById(id) {
        return todos.find(todo => todo.id === id);
    }

    function removeTodoById(id) {
        todos = todos.filter(todo => todo.id !== id);
    }

    return {
        id,
        title,
        created,
        updated,
        addTodo,
        addManyTodos,
        getTodos,
        getTodoById,
        removeTodoById,
    };
}