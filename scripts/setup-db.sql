-- Create database setup script for BloomDaily
-- This script creates the database and ensures the user has proper permissions

-- Connect to default postgres database first
\c postgres;

-- Create the database if it doesn't exist
SELECT 'CREATE DATABASE bloomdb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'bloomdb')\gexec

-- Connect to the bloomdb database
\c bloomdb;

-- Create extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant permissions to the postgres user
GRANT ALL PRIVILEGES ON DATABASE bloomdb TO postgres;