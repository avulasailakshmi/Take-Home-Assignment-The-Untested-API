# Submission Notes

## What I changed

I added unit tests for the task service and integration tests for the Express routes using Jest and Supertest. The tests cover the normal CRUD flows, filtering, pagination, statistics, completion, validation errors, missing task IDs, and the new assignment endpoint.

I fixed the pagination offset bug so page numbering behaves as the API documentation suggests: page 1 starts with the first task.

I also implemented `PATCH /tasks/:id/assign`. The endpoint requires `assignee` to be a non-empty string, trims surrounding whitespace, returns 404 for a missing task, and allows reassignment. I chose to allow reassignment because the brief does not say an existing assignment must be immutable, and changing ownership is a common task-management operation.

## What I would test next

With more time, I would add stricter query-parameter tests for invalid page/limit values, exact status filtering, malformed JSON, very long input strings, date/time boundary cases, and repeated completion calls. I would also add tests around concurrency and persistence once the in-memory store is replaced with a database.

## What surprised me

The pagination calculation treated the documented page number like a zero-based index. I also noticed that status filtering uses substring matching and that completing a task resets its priority to `medium`. I documented those behaviors in `BUG_REPORT.md` rather than changing unrelated behavior without confirming the intended business rules.

## Questions before production

Before shipping, I would confirm whether PUT is intended to be a full replacement or partial update, whether status filtering must reject invalid values, whether completing a task should preserve priority, and whether reassignment should be unrestricted or require authorization. I would also ask about authentication, persistence, input-length limits, API logging, rate limiting, and the expected error-response format.

## Running the project

From `task-api`:

```bash
npm install
npm test
npm run coverage
npm start
```

The assignment asks for at least 80% coverage. The added tests are designed to exercise all service functions and all documented route flows; the final coverage percentage should be verified locally with `npm run coverage` before submission.
