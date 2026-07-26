#!/bin/zsh

set -eu

APP_ROOT="$(cd "$(dirname "$0")" && pwd)"
OPENAPPLY_PORT="${PORT:-4173}"

if curl --fail --silent --max-time 1 "http://127.0.0.1:${OPENAPPLY_PORT}/api/health" >/dev/null 2>&1; then
  open "http://localhost:${OPENAPPLY_PORT}"
  exit 0
fi

if [[ -n "${NODE_BIN:-}" && -x "${NODE_BIN}" ]]; then
  OPENAPPLY_NODE="${NODE_BIN}"
elif command -v node >/dev/null 2>&1; then
  OPENAPPLY_NODE="$(command -v node)"
else
  print "Node.js 20 ou plus récent est nécessaire pour lancer OpenApply."
  read -r
  exit 1
fi

cd "${APP_ROOT}"
(sleep 0.8; open "http://localhost:${OPENAPPLY_PORT}") &
PORT="${OPENAPPLY_PORT}" exec "${OPENAPPLY_NODE}" app/server.mjs
