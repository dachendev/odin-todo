import { nanoid } from 'nanoid';

export function createTodo({
    id = nanoid(6),
    title = 'New Todo',
    description = '',
    dueDate = null,
    priority = null,
    completed = false,
    project = null,
    created = new Date(),
}) {
    function complete() {
        completed = true;
    }

    function uncomplete() {
        completed = false;
    }

    function setProject(projectId) {
        project = projectId;
    }

    return {
        id,
        title,
        description,
        dueDate,
        priority,
        completed,
        project,
        created,
        complete,
        uncomplete,
        setProject,
    };
}