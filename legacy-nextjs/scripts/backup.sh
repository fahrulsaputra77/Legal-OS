#!/bin/bash

# Database Backup Script for AI Legal OS
# Should be executed via cron job or CI/CD pipeline

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/ai_legal_os_backup_$TIMESTAMP.sql.gz"

# Ensure the backup directory exists
mkdir -p "$BACKUP_DIR"

echo "Starting database backup..."

# Requires standard Postgres environment variables to be set (e.g. DATABASE_URL)
# For this script we assume DATABASE_URL is available
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set in the environment."
  exit 1
fi

# Execute pg_dump, compress on the fly
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"

echo "Backup completed successfully! Saved to: $BACKUP_FILE"

# Optional: Clean up old backups (keep last 7 days)
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -delete
echo "Old backups cleaned up."
