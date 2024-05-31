import { nanoid } from 'nanoid';

var projects = [
    createProject({ title: 'Default Project' }),
];

var activeProject = projects[0].id;

export function getProjects() {
    return projects;
}

export function getActiveProject() {
    return projects.find(project => project.id === activeProject);
}

export function setActiveProject(projectId) {
    activeProject = projectId;
    renderProjectList();
}

export function addProject(project) {
    projects.push(project);
}

export function createProject({ title = 'New Project' }) {
    var id = nanoid(6);
    var created = new Date();
    var todos = [];

    function addTodo(todo) {
        todos.push(todo);
    }

    function getTodos() {
        return todos;
    }

    return {
        id,
        title,
        created,
        addTodo,
        getTodos,
    };
}

export function setupProjectModal() {
    var addProjectButton = document.getElementById('add-project-button');
    var addProjectModal = document.getElementById('add-project-modal');
    var addProjectForm = document.querySelector('#add-project-modal form');

    addProjectButton.addEventListener('click', () => {
        addProjectModal.showModal();
    });
    
    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Get form data
        var formData = new FormData(addProjectForm);
        // Create project
        var title = formData.get('title');
        addProject(createProject({ title }));
        // Re-render project list
        renderProjectList();
        // Close modal
        addProjectModal.close();
    });

    addProjectModal.addEventListener('close', () => {
        addProjectForm.reset();
    });
}

export function renderProjectList() {
    var projectList = document.querySelector('.project-list');
    projectList.innerHTML = '';

    getProjects().forEach(project => {
        var li = document.createElement('li');

        // Set attributes
        li.classList.add('project-item');
        li.dataset.id = project.id;

        if (project.id === activeProject) {
            li.classList.add('active');
        }

        // Add text
        li.textContent = project.title;

        // Add event listeners
        li.addEventListener('click', () => {
            if (li.dataset.id !== activeProject) {
                setActiveProject(li.dataset.id);
            }
        });

        projectList.appendChild(li);
    });
}