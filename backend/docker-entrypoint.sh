#!/bin/sh
set -e
echo "Running database migrations..."
npm run migrate
echo "Starting backend..."
exec npm run dev
