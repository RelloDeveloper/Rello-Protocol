# Getting started

## Prerequisites

Node.js 22.13+ and pnpm 11.25.0. The lockfile pins dependency resolution. Install with `pnpm install --frozen-lockfile`; do not remove the lockfile to resolve a setup error.

## Development

Run `pnpm dev` and open http://localhost:5173. `pnpm build` produces the Vinext/Cloudflare application output. The clean-clone execution profile is portable. The deployed ChatGPT Site uses an environment-owned profile that is intentionally excluded from this repository.

No secret is needed for wallet discovery, the payment planner, the public read APIs or tests. Rello does not collect private keys. Do not commit `.env` files, wallet material, provider credentials or local tool state.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Cinematic homepage |
| `/app` | Wallet-gated overview |
| `/app/pay`, `/app/receive`, `/app/move`, `/app/agents` | Account tools |
| `/agents` | Agent payment planning |
| `/run` | Runner workspace |
| `/dev` | Developer interfaces |
| `/scan` | Public exposure reader |
| `/live` | Activity and market data |
| `/docs` | Product documentation |

Transaction interfaces require more than $150 of $RELLO. `lib/live-data.ts` deliberately has an empty token address. Configure it only after confirming the owner's deployment, chain and token metadata; failed verification must remain locked.

## Verification

Run `pnpm typecheck`, `pnpm test`, then `pnpm build`. Tests replace external fetches with scoped test fixtures where needed and never request a wallet signature or transfer funds. GitHub workflows use these same commands.

## Deployment

The `.openai/hosting.json` copy contains no Site identifier and no credentials. The existing Rello Site remains independently managed. To deploy a separate clone, configure your own Cloudflare/Sites hosting and resource bindings. Do not assume publishing a GitHub repository changes the deployed Site.
