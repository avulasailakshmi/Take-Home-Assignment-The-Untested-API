const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('Task API', () => {
  beforeEach(() => taskService._reset());

  test('POST /tasks creates a task', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Test API', priority: 'high' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test API');
  });

  test('POST /tasks rejects an empty title and invalid values', async () => {
    expect((await request(app).post('/tasks').send({ title: ' ' })).status).toBe(400);
    expect((await request(app).post('/tasks').send({ title: 'x', status: 'invalid' })).status).toBe(400);
    expect((await request(app).post('/tasks').send({ title: 'x', priority: 'urgent' })).status).toBe(400);
    expect((await request(app).post('/tasks').send({ title: 'x', dueDate: 'not-a-date' })).status).toBe(400);
  });

  test('GET /tasks lists, filters and paginates tasks', async () => {
    taskService.create({ title: 'One', status: 'todo' });
    taskService.create({ title: 'Two', status: 'done' });
    taskService.create({ title: 'Three', status: 'todo' });
    expect((await request(app).get('/tasks')).body).toHaveLength(3);
    expect((await request(app).get('/tasks?status=done')).body).toHaveLength(1);
    const page = await request(app).get('/tasks?page=1&limit=2');
    expect(page.body.map((t) => t.title)).toEqual(['One', 'Two']);
  });

  test('PUT /tasks/:id updates a task and handles validation/not found', async () => {
    const task = taskService.create({ title: 'Old' });
    const updated = await request(app).put(`/tasks/${task.id}`).send({ title: 'New', status: 'in_progress' });
    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe('New');
    expect((await request(app).put(`/tasks/${task.id}`).send({ title: '' })).status).toBe(400);
    expect((await request(app).put('/tasks/missing').send({ title: 'Valid' })).status).toBe(404);
  });

  test('DELETE /tasks/:id deletes a task and returns 404 for missing id', async () => {
    const task = taskService.create({ title: 'Delete' });
    expect((await request(app).delete(`/tasks/${task.id}`)).status).toBe(204);
    expect((await request(app).delete(`/tasks/${task.id}`)).status).toBe(404);
  });

  test('PATCH /tasks/:id/complete completes a task and handles missing id', async () => {
    const task = taskService.create({ title: 'Complete' });
    const res = await request(app).patch(`/tasks/${task.id}/complete`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('done');
    expect(res.body.completedAt).toBeTruthy();
    expect((await request(app).patch('/tasks/missing/complete')).status).toBe(404);
  });

  test('GET /tasks/stats returns counts and overdue count', async () => {
    taskService.create({ title: 'Late', dueDate: '2020-01-01T00:00:00.000Z' });
    taskService.create({ title: 'Done', status: 'done' });
    const res = await request(app).get('/tasks/stats');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ todo: 1, in_progress: 0, done: 1, overdue: 1 });
  });

  test('PATCH /tasks/:id/assign assigns and reassigns a task', async () => {
    const task = taskService.create({ title: 'Assignment' });
    let res = await request(app).patch(`/tasks/${task.id}/assign`).send({ assignee: 'Sai Lakshmi' });
    expect(res.status).toBe(200);
    expect(res.body.assignee).toBe('Sai Lakshmi');
    res = await request(app).patch(`/tasks/${task.id}/assign`).send({ assignee: 'Another User' });
    expect(res.status).toBe(200);
    expect(res.body.assignee).toBe('Another User');
  });

  test('PATCH /tasks/:id/assign rejects empty/missing names and missing tasks', async () => {
    const task = taskService.create({ title: 'Assignment' });
    expect((await request(app).patch(`/tasks/${task.id}/assign`).send({ assignee: ' ' })).status).toBe(400);
    expect((await request(app).patch(`/tasks/${task.id}/assign`).send({})).status).toBe(400);
    expect((await request(app).patch('/tasks/missing/assign').send({ assignee: 'Sai' })).status).toBe(404);
  });
});
