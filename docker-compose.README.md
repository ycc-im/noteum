# Docker Compose Configuration for Noteum

This directory contains Docker Compose configurations for running the Noteum project in different environments.

## Files Overview

- `docker-compose.yml` - Base configuration with all services
- `docker-compose.override.yml` - Development environment (automatically loaded)
- `docker-compose.prod.yml` - Production environment configuration

## Services

### PostgreSQL Database (`postgres`)

- **Port**: 5432
- **Database**: noteum
- **User**: noteum_user
- **Password**: noteum_password
- **Health Check**: Built-in PostgreSQL readiness check

### pgAdmin (`pgadmin`)

- **Port**: 8080
- **Email**: admin@noteum.dev
- **Password**: admin123
- **Access**: http://localhost:8080

### Server (`server`) - NestJS API

- **Port**: 3001 (HTTP), 5001 (gRPC)
- **Framework**: NestJS with Fastify
- **Health Check**: http://localhost:3001/health

### Web (`web`) - TanStack Start React App

- **Port**: 3000
- **Framework**: TanStack Start (React)
- **Health Check**: http://localhost:3000/api/health

## Usage

### Development Environment (Default)

```bash
# Start all services in development mode with hot reloading
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Production Environment

```bash
# Start in production mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Stop production services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

### Individual Services

```bash
# Start only database services
docker-compose up postgres pgadmin

# Start only web services (requires database)
docker-compose up web server

# Rebuild and start specific service
docker-compose up --build server
```

## Environment Variables

### Server Environment Variables

- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3001)
- `DATABASE_URL`: PostgreSQL connection string
- `POSTGRES_*`: Individual database connection parameters
- `GRPC_HOST/GRPC_PORT`: gRPC server configuration
- `LOG_LEVEL`: Logging level (debug/info/warn/error)

### Web Environment Variables

- `NODE_ENV`: Environment (development/production)
- `PORT`: Web server port (default: 3000)
- `API_URL`: Backend API URL (default: http://server:3001)

## Development Features

### Hot Reloading

- **Server**: Source code changes automatically restart the NestJS server
- **Web**: Vite development server with HMR (Hot Module Replacement)
- **Shared**: Changes in shared package affect both server and web

### Volume Mounts (Development Only)

- Source code directories are mounted for real-time updates
- Configuration files (tsconfig.json, package.json, etc.)
- Node modules are excluded to prevent conflicts

## Database Access

### Direct PostgreSQL Connection

- **Host**: localhost
- **Port**: 5432
- **Database**: noteum
- **Username**: noteum_user
- **Password**: noteum_password

### pgAdmin Web Interface

1. Open http://localhost:8080
2. Login with admin@noteum.dev / admin123
3. Add server connection:
   - Name: Noteum Database
   - Host: postgres (container name)
   - Port: 5432
   - Username: noteum_user
   - Password: noteum_password

## Health Checks and Monitoring

All services include health checks:

- **PostgreSQL**: `pg_isready` command
- **Server**: HTTP GET /health endpoint
- **Web**: HTTP GET /api/health endpoint

Check service health:

```bash
# View service status
docker-compose ps

# Check specific service health
docker-compose exec server curl http://localhost:3001/health
docker-compose exec web curl http://localhost:3000/api/health
```

## Troubleshooting

### Port Conflicts

If ports are already in use, modify the port mappings in docker-compose.yml:

```yaml
ports:
  - "3001:3001" # Change first port (host) to available port
```

### Database Connection Issues

1. Ensure PostgreSQL is healthy: `docker-compose ps postgres`
2. Check logs: `docker-compose logs postgres`
3. Verify connection from server: `docker-compose exec server curl postgres:5432`

### Build Issues

```bash
# Clean rebuild all services
docker-compose build --no-cache

# Remove all containers and volumes
docker-compose down -v
docker system prune
```

### Missing Dockerfiles

If server Dockerfile doesn't exist yet:

1. The configuration assumes it will be at `packages/server/Dockerfile`
2. Temporarily comment out the server service until the Dockerfile is ready
3. Or create a basic development Dockerfile

## Network Configuration

All services communicate through the `noteum-network` bridge network:

- Services can reach each other using container names as hostnames
- External access only through exposed ports
- Isolated from other Docker networks

## Data Persistence

- **PostgreSQL Data**: Persisted in `postgres_data` volume
- **pgAdmin Settings**: Persisted in `pgadmin_data` volume
- **Application Code**: Mounted from host (development) or built into image (production)

## Next Steps

1. Ensure both `packages/web/Dockerfile` and `packages/server/Dockerfile` exist
2. Test the configuration: `docker-compose up`
3. Verify all services start successfully
4. Check health endpoints
5. Test database connectivity
6. Verify hot reloading in development mode
