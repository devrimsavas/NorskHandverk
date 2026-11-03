# Build stage: restore and publish with the full .NET SDK
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Restore first so this layer is cached when only code changes
COPY NorskHandverk.csproj ./
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

# Runtime stage: only the ASP.NET runtime and the published files
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

# The official .NET images listen on port 8080 by default
EXPOSE 8080
ENTRYPOINT ["dotnet", "NorskHandverk.dll"]