# Notes Backend

This is a NestJS backend for the Notes application using PostgreSQL.

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` to match your PostgreSQL settings.
   Example values:
   ```ini
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=Kavya@2004
   DB_NAME=notesapp
   PORT=3000
   ```

4. Create the database in PostgreSQL if it does not exist:
   ```sql
   CREATE DATABASE notesapp;
   ```

5. Start the backend in development:
   ```bash
   npm run start:dev
   ```

## API Endpoints

- `GET /` - health check
- `GET /users` - list users
- `GET /users/:id` - get user by id
- `POST /users` - create a user

## Notes

- The backend uses TypeORM with `synchronize: true` for development.
- For production, disable `synchronize` and use migrations.
