#!/bin/bash

DB_FILE="travelAlarm.db"

# Remove old DB
rm -f $DB_FILE

# Create new DB
sqlite3 $DB_FILE < schema.sql
sqlite3 $DB_FILE < seed.sql

echo "Database $DB_FILE created successfully!"