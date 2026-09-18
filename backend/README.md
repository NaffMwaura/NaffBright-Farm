# NaffBright Farm backend

This is the first backend slice for NaffBright Farm: a small ASP.NET Core Web API for managing cows.

## C# and .NET in plain language

- **C#** is the programming language used in files such as `Program.cs` and `Controllers/CowsController.cs`.
- **.NET** is the platform that runs C# programs. It includes the runtime, libraries, project system, and commands such as `dotnet build` and `dotnet run`.
- **ASP.NET Core** is the part of .NET used to build web APIs and websites.
- **Entity Framework Core (EF Core)** is a .NET library that lets us work with PostgreSQL using C# classes and LINQ instead of writing every SQL statement by hand.
- **Npgsql** is the PostgreSQL provider that lets EF Core communicate with PostgreSQL.

## How the pieces fit

```text
React frontend -> HTTP/JSON -> ASP.NET Core controller -> EF Core -> PostgreSQL
```

The frontend will eventually call routes such as `GET /api/cows`. The controller receives the request, EF Core queries PostgreSQL, and the API returns JSON.

Authentication is intentionally not part of this first slice. We will add it after the core domain and frontend login flow are understood.

## PostgreSQL setup

Install PostgreSQL locally and create a database named `naffbright_farm`, or use an existing PostgreSQL instance. Then update the connection string in `appsettings.json`:

```json
"FarmDatabase": "Host=localhost;Port=5432;Database=naffbright_farm;Username=postgres;Password=your-local-password"
```

Do not commit a real password. Later, use .NET user secrets or environment variables for local secrets.

Apply the schema migration from this directory:

```powershell
dotnet ef database update
```

The first migration creates the `Cows` table and a unique index for `TagNumber`. When we change a model, create another migration and apply it:

```powershell
dotnet ef migrations add DescribeTheChange
dotnet ef database update
```

If `dotnet ef` is not found immediately after installing it, reopen the terminal or run the global tool directly from `%USERPROFILE%\.dotnet\tools\dotnet-ef`.

## Run the API

From this directory:

```powershell
dotnet run
```

Swagger is available at the URL printed by the command, usually `http://localhost:5xxx/swagger`.

## First API routes

- `GET /api/cows` lists cows.
- `GET /api/cows/{id}` gets one cow.
- `POST /api/cows` creates a cow.
- `DELETE /api/cows/{id}` removes a cow.

Example request body:

```json
{
  "tagNumber": "NF-HF-202",
  "breed": "Holstein-Friesian",
  "dateOfBirth": "2023-04-15",
  "sex": "Female",
  "status": "Milking"
}
```

## What to learn next

1. Understand the request flow through `CowsController`.
2. Learn how `FarmDbContext` maps `Cow` to the database.
3. Add update validation and a dedicated request DTO.
4. Add milk production records related to a cow.
5. Connect the React frontend to these endpoints.
6. Add login and role-based authorization once the data flow is clear.
