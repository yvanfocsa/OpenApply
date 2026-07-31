#!/bin/sh

set -u

APP_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export PATH

OPENAPPLY_NODE=""
for OPENAPPLY_CANDIDATE in \
  "${NODE_BIN:-}" \
  "$(command -v node 2>/dev/null || true)" \
  /opt/homebrew/bin/node \
  /usr/local/bin/node \
  "${HOME:-}/.volta/bin/node" \
  "${HOME:-}"/.nvm/versions/node/*/bin/node \
  "${HOME:-}"/.local/share/fnm/node-versions/*/installation/bin/node \
  "${HOME:-}/Library/Application Support/fnm"/node-versions/*/installation/bin/node
do
  if [ -x "${OPENAPPLY_CANDIDATE}" ] && "${OPENAPPLY_CANDIDATE}" -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 20 ? 0 : 1)' >/dev/null 2>&1; then
    OPENAPPLY_NODE="${OPENAPPLY_CANDIDATE}"
    break
  fi
done

if [ -z "${OPENAPPLY_NODE}" ]; then
  echo "Node.js 20 ou plus récent est nécessaire pour lancer OpenApply."
  echo "Installation : https://nodejs.org/"
  exit 1
fi

cd "${APP_ROOT}" || exit 1
exec "${OPENAPPLY_NODE}" scripts/start.mjs "$@"
