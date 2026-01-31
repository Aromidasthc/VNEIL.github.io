/**
 * MODULE: VNEIL-GENESIS .NET Demo
 * 
 * Purpose: Minimal .NET console application for demonstrating VNEIL-GENESIS C# setup
 * 
 * Assumptions:
 * - .NET runtime is installed (6.0+)
 * - Console output is UTF-8 encoded
 * 
 * Invariants:
 * - Exits with code 0 on success
 * - Prints health check message to stdout
 * - All errors are caught and logged
 * 
 * Failure Modes:
 * - Unexpected exception: logs to stderr and exits with code 1
 * 
 * Example:
 *   dotnet run --project dotnet_demo
 */

using System;

class Program
{
    static int Main(string[] args)
    {
        try
        {
            // Health check simulation
            var healthStatus = new
            {
                status = "ok",
                demo = "vneil-genesis-dotnet",
                timestamp = DateTime.UtcNow
            };
            
            Console.WriteLine($"VNEIL-GENESIS .NET Demo");
            Console.WriteLine($"Status: {healthStatus.status}");
            Console.WriteLine($"Demo: {healthStatus.demo}");
            Console.WriteLine($"Timestamp: {healthStatus.timestamp:yyyy-MM-dd HH:mm:ss} UTC");
            Console.WriteLine("\n✅ .NET demo running successfully");
            
            return 0; // Success
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error: {ex.Message}");
            return 1; // Failure
        }
    }
}
