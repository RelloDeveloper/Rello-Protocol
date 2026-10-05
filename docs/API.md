# HTTP and MCP interfaces

## HTTP reads

| Method | Path | Result |
| --- | --- | --- |
| GET | `/api/cash/rails` | Twenty rail definitions, model caps and chain ID |
| GET | `/api/cash/stats` | Initial zero-valued network counters |
| GET | `/api/cash/jobs/open` | Empty job list |
| GET | `/api/cash/balance?address=0x…` | Public ETH/USDG balance; 400 for an invalid address |
| GET | `/api/cash/jobs/:id` | 404 when no payout matches |
| GET | `/api/access?address=0x…` | Holder eligibility and verification status |
| GET | `/api/markets` | Normalized external market feed |

POST and DELETE on the cash interface return status 503, `code: TRANSACTIONS_UNAVAILABLE`, `submitted: false`. Handle the failure before updating UI state. No transaction hash, successful payout or escrow deposit is returned.

## MCP

POST JSON-RPC requests to `/api/mcp`. Supported methods: `initialize`, `ping`, `tools/list`, `tools/call`. Notifications return 202. Malformed JSON uses error -32700; unknown methods use -32601.

Tools: `rello_rails`, `rello_balance`, `rello_job_status`, `rello_pay_fiat`, `rello_release`, `rello_dispute`. The transaction tools return `isError: true` while settlement is unavailable. The MCP endpoint is an integration surface, not a wallet signer.

## HTTP client

Import `createRelloClient` from `public/rello-client.mjs`. The supplied origin is normalized to a URL origin. Read methods use GET; payment methods use POST and JSON. Errors preserve `.code` and `.status`. Job IDs and wallet queries are URL-encoded.
