# Purple Cross — Employee Management

A front-end employee management dashboard for Purple Cross Ltd. It lets the
company view, search, create, edit and delete employee records, replacing a
manual spreadsheet workflow with a scalable, responsive web app.

Built with **Vue 3**, **TypeScript**, **Vuetify 3**, **Pinia** and **Vite**.

## Features

- **Employee grid** with all key columns and human-friendly status labels:
  - Date of Employment → _Employed soon_ (future) / _Currently employed_ (past)
  - Termination Date → _To be terminated_ (future) / _Terminated_ (past) / _Active_ (none)
  - Status shown as a colour-coded chip alongside the actual date.
- **Search, filtering and sorting** — free-text search (name / code / occupation)
  plus department, occupation and status filters, with sortable columns.
- **Pagination** (10 / 25 / 50 / 100 per page) to comfortably handle 200+ records.
- **Row actions** — View (profile), Edit (opens the profile in edit mode) and
  Delete (with a confirmation dialog).
- **Create employee** — a floating action button opens a validated form.
- **Validation** — required fields (Code, Full Name, Occupation, Department),
  employee-code format and uniqueness, name format, and a termination-after-
  employment check.
- **Import / export** — export the current data as JSON or CSV, and import a
  JSON file with per-record validation and merge / replace modes.
- **Responsive** layout that adapts from wide tables down to stacked mobile cards.
- **Light / dark theme** toggle, remembered across sessions.
- Data is **persisted to `localStorage`**, so changes survive a page refresh.

## Tech stack

| Concern         | Choice                                   |
| --------------- | ---------------------------------------- |
| Framework       | Vue 3 (`<script setup>`) + TypeScript    |
| UI library      | Vuetify 3                                |
| State           | Pinia (with `localStorage` persistence)  |
| Routing         | Vue Router                               |
| Build / tooling | Vite, ESLint, oxlint, Prettier           |
| Tests           | Vitest                                   |

## Getting started

Requires Node `^20.19.0 || >=22.12.0`.

```sh
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # type-check + production build
npm run test:unit  # run unit tests
npm run lint       # oxlint + eslint
```

## Project structure

```
src/
  components/      Reusable UI (status chip, form, dialogs)
  composables/     Filtering, snackbar, theme toggle
  data/            Seed employee data (JSON)
  layouts/         App shell (app bar, breadcrumbs, snackbar)
  router/          Routes and page titles
  stores/          Pinia employee store (single source of truth)
  types/           Employee domain types
  utils/           Pure logic: status, dates, validation, import/export
  views/           List, Create and Profile pages
```

## Architecture & key decisions

- **Single source of truth.** All employee data lives in one Pinia store. Since
  this is a front-end-only app, the store seeds from the bundled JSON and
  persists every change to `localStorage`.
- **Logic kept out of components.** Status labels, date formatting, validation
  and import/export are pure functions in `utils/`, and filtering is a
  composable. This keeps components thin and the core logic unit-testable.
- **One form for create and edit.** `EmployeeForm` is driven by a `mode` prop;
  Edit opens it inline on the employee's profile (as the brief specifies), while
  Create renders it on its own route.
- **Status is derived, not stored.** Employment and termination labels are
  computed from the dates at day resolution, so they stay correct over time.
- **Resilient import.** Invalid records are skipped and reported rather than
  failing the whole import, and storage access is wrapped so private-mode /
  quota errors don't break the app.

## Assumptions

- "Front-end only" — there is no backend; `localStorage` stands in for
  persistence, and the seed JSON is the initial dataset.
- Employee `code` is the unique identifier and follows the `EMP###` pattern.
- An employee with no termination date is treated as **Active**.
