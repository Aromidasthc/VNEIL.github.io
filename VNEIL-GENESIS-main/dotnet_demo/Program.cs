/*
 * VNEIL‑GENESIS .NET demo application.
 *
 * Purpose:
 *   Provide a minimal ASP.NET Core endpoint that returns the health
 *   status of the .NET demo. This uses the minimal API approach
 *   introduced in .NET 6 and updated for .NET 9.
 *
 * Assumptions:
 *   - The application will run on .NET 9.0 or newer.
 *   - There is no authentication or complex routing logic; only a health
 *     check endpoint is exposed.
 *
 * Invariants:
 *   - The `/api/health` route always returns an HTTP 200 with a JSON
 *     payload containing "status" and "demo" keys.
 *
 * Failure modes:
 *   - The app may fail to start if the host cannot bind to the configured
 *     port or if the necessary ASP.NET Core packages are missing.
 *
 * Example:
 *   dotnet run --project dotnet_demo
 */

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;

// Create a WebApplication builder and build the app
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Define the health endpoint using the minimal API pattern
app.MapGet("/api/health", () => Results.Json(new { status = "ok", demo = "vneil-genesis-dotnet" }));

// Run the application. By default, the app listens on http://localhost:5000 and
// http://localhost:5001 for HTTPS. Configuration can be customized via
// ASP.NET Core environment variables or appsettings.json if needed.
app.Run();