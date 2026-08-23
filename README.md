# The Untested API — Full Stack / Backend Take-Home Project

A Node.js and Express API project focused on debugging, automated testing, validation, and feature development.

This repository demonstrates my ability to understand an unfamiliar codebase, identify issues, write tests, fix bugs, and implement a new API feature.

## What I Worked On

- Added unit tests for the task service using Jest
- Added integration tests for Express routes using Supertest
- Tested CRUD flows, filtering, pagination, statistics, completion, validation, and missing-resource cases
- Fixed a pagination offset bug
- Implemented `PATCH /tasks/:id/assign`
- Added validation for the assignee field
- Documented additional issues and production considerations

## Test Results

The completed submission achieved:

- **2 / 2 test suites passed**
- **18 / 18 tests passed**
- **95.48% statement coverage**
- **89.53% branch coverage**
- **93.33% function coverage**
- **95.03% line coverage**

## Tech Stack

- JavaScript
- Node.js
- Express.js
- Jest
- Supertest
- REST APIs
- Git & GitHub

## API Features

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/tasks` | List tasks with filtering and pagination |
| `POST` | `/tasks` | Create a task |
| `PUT` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |
| `PATCH` | `/tasks/:id/complete` | Mark a task as completed |
| `GET` | `/tasks/stats` | Get task statistics |
| `PATCH` | `/tasks/:id/assign` | Assign or reassign a task to a user |

## Assignment Feature

I implemented the task assignment endpoint:

```http
PATCH /tasks/:id/assign
```

The endpoint:

- Requires `assignee` to be a non-empty string
- Trims surrounding whitespace
- Returns `404` when the task does not exist
- Supports reassignment

## Bug Fix

I identified and fixed a pagination bug where the documented page number was being treated like a zero-based index. After the fix, page 1 correctly starts with the first task.

Additional observations are documented in [`BUG_REPORT.md`](./BUG_REPORT.md).

## Project Structure

```text
Take-Home-Assignment-The-Untested-API/
├── BUG_REPORT.md
├── SUBMISSION_NOTES.md
├── task-api/
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/tasks.js
│   │   ├── services/taskService.js
│   │   └── utils/validators.js
│   ├── tests/
│   │   ├── taskService.test.js
│   │   └── tasks.integration.test.js
│   ├── package.json
│   └── jest.config.js
└── README.md
```

## Run Locally

```bash
git clone https://github.com/avulasailakshmi/Take-Home-Assignment-The-Untested-API.git
cd Take-Home-Assignment-The-Untested-API
git checkout submission
cd task-api
npm install
npm test
npm run coverage
npm start
```

The API runs at:

```text
http://localhost:3000
```

## What This Project Demonstrates

This project gave me practical experience with backend development, REST API design, automated testing, debugging, validation, codebase analysis, and making focused changes without unnecessarily rewriting existing functionality.

For more detail about my implementation decisions and testing approach, see [`SUBMISSION_NOTES.md`](./SUBMISSION_NOTES.md).