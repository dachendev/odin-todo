export function createTodo({ title, description, dueDate, priority, completed = false }) {
    var id = nanoid(6);
    var created = new Date();

    return {
        id,
        title,
        description,
        dueDate,
        priority,
        created,
        completed
    }
}