#!/usr/bin/env bash
set -e

echo "--- ENV ---"
php -r 'echo "DB_HOST=".getenv("DB_HOST")."\nDB_PORT=".getenv("DB_PORT")."\nDB_DATABASE=".getenv("DB_DATABASE")."\nDB_USERNAME=".getenv("DB_USERNAME")."\nDB_PASSWORD=".getenv("DB_PASSWORD")."\n";'

echo
echo "--- PDO TEST ---"
php -r 'try { $dsn = "pgsql:host=".getenv("DB_HOST").";port=".getenv("DB_PORT").";dbname=".getenv("DB_DATABASE"); $pdo = new PDO($dsn, getenv("DB_USERNAME"), getenv("DB_PASSWORD")); echo "OK\n"; } catch (Exception $e) { echo "ERROR: " . $e->getMessage() . "\n"; }'

echo
echo "--- SESSION CONFIG ---"
php -r 'print_r(require "config/session.php");'