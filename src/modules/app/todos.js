import { nanoid } from 'nanoid';

export function createTodo({
    id = nanoid(6),
    completed = false,
    title = 'New Todo',
    priority = null,
    dueDate = null,
    notes = '',
    project = null,
    created = new Date(),
    updated = new Date(),
}) {
    function complete() {
        this.completed = true;
    }

    function uncomplete() {
        this.completed = false;
    }

    function setProject(projectId) {
        this.project = projectId;
    }

    return {
        id,
        completed,
        title,
        priority,
        dueDate,
        notes,
        project,
        created,
        updated,
        complete,
        uncomplete,
        setProject
    };
}