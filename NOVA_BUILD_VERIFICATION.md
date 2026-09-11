# NOVA Studio build verification

This repository uses `pnpm@9.14.4` and Node.js 20 in CI. The verification workflow installs the locked dependencies with `pnpm install --frozen-lockfile` and runs `pnpm run build` with production environment settings.

Vercel deployment configuration is kept in `vercel.json`.

Provider secrets must be configured in the deployment platform and must never be committed to this repository.
