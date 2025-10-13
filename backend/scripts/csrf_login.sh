#!/usr/bin/env bash
set -e

# Request CSRF cookie and save headers/cookies
/usr/bin/curl -s -c /tmp/cookies.txt -D /tmp/headers.txt http://127.0.0.1:8000/sanctum/csrf-cookie

echo "--- HEADERS ---"
grep -i XSRF-TOKEN /tmp/headers.txt || true

# Extract token and URL-decode it with PHP
token=$(grep -i XSRF-TOKEN /tmp/headers.txt | sed -E "s/.*XSRF-TOKEN=([^;]+).*/\1/")
if [ -z "$token" ]; then
  echo "No XSRF token found"
else
  token_decoded=$(php -r "echo urldecode('$token');")
  echo "--- DECODED TOKEN ---"
  echo "$token_decoded"

  echo "--- LOGIN RESPONSE ---"
  /usr/bin/curl -s -i -b /tmp/cookies.txt -c /tmp/cookies.txt -H "X-XSRF-TOKEN: $token_decoded" -H "Content-Type: application/json" -d '{"email":"admin@imobiliaria.test","password":"Demo@12345"}' http://127.0.0.1:8000/api/login
fi

echo
echo "--- LARAVEL LOG (last 200) ---"
tail -n 200 /var/www/html/storage/logs/laravel.log
