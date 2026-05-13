#!/usr/bin/env bash
# Install dependencies for frontend and backend.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Installing frontend…"
(cd "$ROOT/frontend" && npm install)

echo "==> Installing backend…"
(cd "$ROOT/backend" && npm install)

if [[ ! -f "$ROOT/backend/.env" ]]; then
  echo ""
  echo "==> No backend/.env found. Copy env.example:"
  echo "    cp \"$ROOT/backend/env.example\" \"$ROOT/backend/.env\""
  echo "    # Then edit MONGO_URI and JWT_SECRET"
fi

echo ""
echo "Done. Next:"
echo "  1. MongoDB running locally (or set MONGO_URI in backend/.env)"
echo "  2. cp backend/env.example backend/.env  && edit it"
echo "  3. (optional) cd backend && npm run seed"
echo "  4. Terminal A: cd backend && npm start"
echo "  5. Terminal B: cd frontend && npm run dev"
echo "Or run both: bash \"$ROOT/scripts/run-local.sh\""
