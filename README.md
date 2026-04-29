# Todo App

A full-stack task management application built with ASP.NET Core (.NET 10), React + TypeScript, and PostgreSQL. The API follows Clean Architecture, and the entire stack runs with a single Docker Compose command.

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Backend  | ASP.NET Core 10, Entity Framework Core, Npgsql  |
| Frontend | React 19, TypeScript 6, Tailwind CSS 4, Axios   |
| Database | PostgreSQL 16                                   |
| Infra    | Docker, Docker Compose                          |

## Features

- Create, read, update, and delete tasks
- Task status workflow: `Pending` → `In Progress` → `Completed`
- Color-coded task cards (6 color options)
- Full-text search and status filtering
- Dark mode (persisted across sessions)
- Toast notifications for user feedback
- Responsive layout with sidebar (desktop) and bottom navigation (mobile)

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose

### Run with Docker

```bash
docker compose up --build
```

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| API      | http://localhost:5147 |
| Swagger  | http://localhost:5147 |

### Run locally (development)

**1. Start the database**

```bash
docker compose up db -d
```

**2. Start the API** (from `api/TodoAPI/`)

```bash
dotnet run
```

The API will be available at `http://localhost:5147` with Swagger UI at the root.

**3. Start the frontend** (from `front/`)

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Project Structure

```
.
├── api/TodoAPI/          # ASP.NET Core Web API
│   ├── Domain/           # Entities, enums, repository interfaces
│   ├── Application/      # Use cases, DTOs, use case interfaces
│   ├── Infrastructure/   # EF Core context, repository implementations
│   └── Controllers/      # HTTP layer — delegates to use cases
├── front/                # React + TypeScript frontend
│   └── src/
│       ├── components/   # UI components
│       ├── hooks/        # useTasks, useToast
│       ├── api.ts        # Axios API client
│       ├── types.ts      # Shared TypeScript types
│       └── colors.ts     # Card color palette
├── docker-compose.yml
└── k8s/                  # Kubernetes manifests (planned)
```

## API Reference

Base URL: `http://localhost:5147/tasks`

| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| GET    | `/tasks`      | List all tasks     |
| GET    | `/tasks/{id}` | Get a single task  |
| POST   | `/tasks`      | Create a task      |
| PUT    | `/tasks/{id}` | Update a task      |
| DELETE | `/tasks/{id}` | Delete a task      |

Full interactive documentation is available via Swagger UI at `http://localhost:5147`.

## Architecture

The API is organized around Clean Architecture principles with four layers:

- **Domain** — core entities and contracts; no external dependencies
- **Application** — one use case class per operation, each with a single `ExecuteAsync` method
- **Infrastructure** — EF Core implementation of repository and unit-of-work interfaces
- **Presentation** — a single `TaskController` that resolves use cases via dependency injection

The controller never accesses repositories or `DbContext` directly.

## Database Migrations

Run from `api/TodoAPI/`:

```bash
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

## Environment Variables

### API (`appsettings.Development.json`)

| Variable                              | Default                                                                 |
| ------------------------------------- | ----------------------------------------------------------------------- |
| `ConnectionStrings__DefaultConnection`| `Host=localhost;Port=5432;Database=todo_db;Username=arthur.cruz;Password=todo123` |

### Frontend (`front/.env`)

| Variable       | Default                       |
| -------------- | ----------------------------- |
| `VITE_API_URL` | `http://localhost:5147/tasks` |

## License

MIT
