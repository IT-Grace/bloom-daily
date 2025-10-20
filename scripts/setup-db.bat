@echo off
echo Setting up BloomDaily database...

REM Check if PostgreSQL is installed and accessible
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL not found in PATH. Please install PostgreSQL and add it to your PATH.
    echo You can download PostgreSQL from: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

REM Run the database setup script
echo Creating database and setting up permissions...
psql -U postgres -f scripts/setup-db.sql

if %errorlevel% neq 0 (
    echo ERROR: Failed to create database. Please check your PostgreSQL credentials.
    echo Make sure PostgreSQL is running and you have the correct password for the 'postgres' user.
    pause
    exit /b 1
)

echo Database setup completed successfully!
echo Running database migrations...

REM Run drizzle migrations to create tables
npm run db:push

if %errorlevel% neq 0 (
    echo ERROR: Failed to run database migrations.
    pause
    exit /b 1
)

echo ✅ Database setup complete! Your BloomDaily database is ready.
echo You can now run 'npm run dev' to start the development server.
pause