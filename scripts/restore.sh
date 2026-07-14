#!/bin/bash

# Database Restore Script for AI Legal OS
# WARNING: This will overwrite existing database records!

set -e

if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <path-to-backup-file.sql.gz>"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file $BACKUP_FILE not found!"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set in the environment."
  exit 1
fi

echo "WARNING: You are about to restore the database from $BACKUP_FILE."
echo "This will overwrite existing data. Are you sure? (y/n)"
read -r response

if [[ ! "$response" =~ ^[Yy]$ ]]; then
  echo "Restore cancelled."
  exit 0
fi

echo "Starting database restore..."

# Decompress and restore
gunzip -c "$BACKUP_FILE" | psql "$DATABASE_URL"

echo "Database restored successfully!"
