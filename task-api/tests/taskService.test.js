const taskService = require('../src/services/taskService');

describe('taskService', () => {
  beforeEach(() => taskService._reset());

  test('creates a task with defaults', () => {
    const task = taskService.create({ title: 'Write tests' });
    expect(task.title).toBe('Write tests');
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('medium');
    expect(task.assignee).toBeNull();
    expect(task.id).toBeTruthy();
  });

  test('returns all tasks and finds a task by id', () => {
    const created = taskService.create({ title: 'One' });
    expect(taskService.getAll()).toHaveLength(1);
    expect(taskService.findById(created.id)).toEqual(created);
    expect(taskService.findById('missing')).toBeUndefined();
  });

  test('filters tasks by status', () => {
    taskService.create({ title: 'Todo', status: 'todo' });
    taskService.create({ title: 'Done', status: 'done' });
    expect(taskService.getByStatus('todo')).toHaveLength(1);
  });

  test('paginates using one-based page numbers', () => {
    taskService.create({ title: 'First' });
    taskService.create({ title: 'Second' });
    taskService.create({ title: 'Third' });
    expect(taskService.getPaginated(1, 2).map((t) => t.title)).toEqual(['First', 'Second']);
    expect(taskService.getPaginated(2, 2).map((t) => t.title)).toEqual(['Third']);
  });

  test('updates an existing task and returns null for a missing task', () => {
    const created = taskService.create({ title: 'Old' });
    expect(taskService.update(created.id, { title: 'New' }).title).toBe('New');
    expect(taskService.update('missing', { title: 'Nope' })).toBeNull();
  });

  test('removes tasks and reports missing ids', () => {
    const created = taskService.create({ title: 'Delete me' });
    expect(taskService.remove(created.id)).toBe(true);
    expect(taskService.remove(created.id)).toBe(false);
    expect(taskService.getAll()).toHaveLength(0);
  });

  test('marks a task complete', () => {
    const created = taskService.create({ title: 'Finish', priority: 'high' });
    const completed = taskService.completeTask(created.id);
    expect(completed.status).toBe('done');
    expect(completed.completedAt).toBeTruthy();
    expect(taskService.completeTask('missing')).toBeNull();
  });

  test('calculates status and overdue statistics', () => {
    taskService.create({ title: 'Late', status: 'todo', dueDate: '2020-01-01T00:00:00.000Z' });
    taskService.create({ title: 'Done', status: 'done', dueDate: '2020-01-01T00:00:00.000Z' });
    taskService.create({ title: 'Working', status: 'in_progress' });
    expect(taskService.getStats()).toEqual({ todo: 1, in_progress: 1, done: 1, overdue: 1 });
  });

  test('assigns and reassigns a task', () => {
    const created = taskService.create({ title: 'Assign me' });
    expect(taskService.assignTask(created.id, '  Sai  ').assignee).toBe('Sai');
    expect(taskService.assignTask(created.id, 'Lakshmi').assignee).toBe('Lakshmi');
    expect(taskService.assignTask('missing', 'Sai')).toBeNull();
  });
});
