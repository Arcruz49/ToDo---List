# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Todo application with an ASP.NET Core Web API backend (.NET 10), a React + TypeScript frontend, and a PostgreSQL database. The `k8s/` directory is still an empty placeholder.

## Commands

### API — run from `api/TodoAPI/`

```bash
# Start the database
docker compose up -d

# Run the API (Swagger UI at http://localhost:5147)
dotnet run

# Build
dotnet build

# EF Core migrations
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

The development connection string (`appsettings.Development.json`) connects to `localhost:5432`, database `todo_db`, user `arthur.cruz`, password `todo123`.

### Frontend — run from `front/`

```bash
npm install   # first time only
npm run dev   # dev server at http://localhost:5173
npm run build # production build → dist/
npm run lint
```

The frontend reads `VITE_API_URL` from `front/.env` (defaults to `http://localhost:5147/tasks`).

## Architecture

### API — Clean Architecture (four layers)

**Domain** (`Domain/`)
- `Entities/TodoTask.cs` — single aggregate root; fields: `Id`, `Title`, `Description`, `CreatedAt`, `ConcludedAt`, `Status`, `Color`
- `Enums/TodoTaskStatus.cs` — `Pending | InProgress | Completed`, stored as a native PostgreSQL enum via `HasPostgresEnum<>`
- `Interfaces/` — `ITaskRepository` and `IUnitOfWork` contracts

**Application** (`Application/`)
- `UseCases/Task/` — one class per operation (`CreateTask`, `GetTask`, `GetTasks`, `UpdateTask`, `DeleteTask`), each with a single `ExecuteAsync` method
- `Interfaces/Task/` — one interface per use case (`ICreateTask`, etc.), all injected into the controller
- `DTOs/` — `TaskCreateRequest` (title, description, color), `TaskEditRequest` (id, title, description, color, status); `TaskResponse` record (response)

**Infrastructure** (`Infrastructure/`)
- `Data/Context.cs` — EF Core `DbContext`, maps `TodoTask` to the `tasks` table using explicit column names
- `Repositories/Task/TaskRepository.cs` — EF Core implementation of `ITaskRepository`
- `Data/UnitOfWork.cs` — wraps `SaveChangesAsync`

**Presentation**
- `Controllers/TaskController.cs` — single controller at route `tasks`, delegates every action directly to its corresponding use case

### Frontend — React + TypeScript (Vite)

- `src/types.ts` — shared types: `Task`, `TaskStatus`, `FilterStatus`, `CreateTaskPayload`, `UpdateTaskPayload`
- `src/api.ts` — Axios client wrapping all five API calls (`list`, `get`, `create`, `update`, `remove`)
- `src/hooks/useTasks.ts` — state management hook: loads tasks on mount, exposes `create`, `update`, `remove` with optimistic local updates
- `src/hooks/useToast.ts` — toast notification state
- `src/components/` — `Sidebar`, `BottomNav`, `SearchBar`, `TaskForm`, `TaskList`, `TaskCard`, `EditModal`, `ColorPicker`, `Icons`, `ToastContainer`
- `src/colors.ts` — `NOTE_COLORS` palette (6 colors: yellow, green, pink, blue, violet, orange); `resolveCardColor(colorId, fallbackIndex)` maps color ID to Tailwind class
- `src/App.tsx` — root component; handles filter, search, dark mode, and modal state

**Stack:** React 19, TypeScript 6, Tailwind CSS 4, Axios, Vite 8

**Fonts:** Inter (UI) + Caveat (handwritten style on cards), loaded from Google Fonts. `font-handwritten` utility class defined in `index.css`.

## Key Conventions

- Each use case has a dedicated interface; the controller never touches repositories or `DbContext` directly.
- `ConcludedAt` is set automatically on first transition to `Completed` status (inside `UpdateTask`).
- `Color` must be explicitly assigned in `CreateTask` and `UpdateTask` use cases — it is not copied automatically from the request.
- Global exception handling in `Program.cs` maps `KeyNotFoundException` → 404 and everything else → 500.
- Swagger UI is served at the root path (`/`) in development.
- CORS is configured for `http://localhost:5173` (Vite dev server origin).
- Enums are serialized as strings in JSON (`JsonStringEnumConverter`).
- `Npgsql.EnableLegacyTimestampBehavior` is enabled to handle `DateTime` without UTC offset issues.

## CSS / Tailwind Conventions

- Dark mode uses class strategy: `@custom-variant dark (&:where(.dark, .dark *))` in `index.css`. The `.dark` class is toggled on `<html>` by `App.tsx`; initial state is set by an inline script in `index.html` before React loads.
- Google Fonts `@import url(...)` must be the **first** line in `index.css` — it must precede `@import "tailwindcss"` to avoid PostCSS errors.
- Card rotation uses the CSS individual `rotate:` property (not `transform: rotate()`) so it composes with Tailwind v4's `scale` and `translate` utilities without conflict.
- Card colors are Tailwind utility classes stored as strings in `src/colors.ts`; Tailwind scans that file at build time to include them in the output.
