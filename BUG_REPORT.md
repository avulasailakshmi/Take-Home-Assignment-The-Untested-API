# Bug Report

## 1. Pagination skips the first page — fixed

**Location:** `task-api/src/services/taskService.js`, `getPaginated`

**Expected behavior:** `GET /tasks?page=1&limit=10` should return the first ten tasks.

**Actual behavior:** The original offset was calculated as `page * limit`, so page 1 started at index 10 and skipped the first ten tasks.

**How I found it:** A unit/integration pagination test created known tasks and requested page 1. The first task was missing.

**Fix:** Calculate the offset as `(page - 1) * limit`. A regression test now covers page 1 and page 2.

## 2. Status filtering uses partial matching — documented, not fixed

**Location:** `task-api/src/services/taskService.js`, `getByStatus`

**Expected behavior:** Since status is an enum (`todo`, `in_progress`, `done`), filtering should normally use an exact status value and invalid filters should ideally be rejected.

**Actual behavior:** The service uses `t.status.includes(status)`. A partial value such as `do` can match both `todo` and `done`, which can return unexpected results.

**How I found it:** While reviewing the service behavior and designing filter edge cases, I noticed the filter was substring-based rather than equality-based.

**Suggested fix:** Validate the query parameter against the allowed statuses and compare with `t.status === status`.

## 3. Completing a task changes its priority — documented, not fixed

**Location:** `task-api/src/services/taskService.js`, `completeTask`

**Expected behavior:** Completing a task should change its status to `done` and set `completedAt`, while leaving unrelated fields unchanged.

**Actual behavior:** `completeTask` also sets `priority: 'medium'`, so a high- or low-priority task silently loses its original priority.

**How I found it:** Reading the completion service while writing the unit test showed an unrelated priority mutation.

**Suggested fix:** Remove the `priority: 'medium'` assignment unless this is an intentional business rule. I would confirm that requirement with the product owner before changing it.
