#!/usr/bin/env bash
# Start API + Vite dev server (requires backend/.env and MongoDB).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ ! -f "$ROOT/backend/.env" ]]; then
  echo "Missing backend/.env — copy backend/env.example to backend/.env and set MONGO_URI and JWT_SECRET."
  exit 1
fi

cleanup() { kill 0 2>/dev/null || true; }
trap cleanup EXIT INT TERM

echo "==> Backend (default http://localhost:5000)"
(cd "$ROOT/backend" && npm start) &
sleep 1
echo "==> Frontend http://localhost:5173"
(cd "$ROOT/frontend" && npm run dev) &
wait
