# Architecture

## Presentation and routing

`app/[[...slug]]/page.tsx` resolves the pathname and renders `components/rello.tsx`. Navigation uses native anchors. `components/cinematic-home.tsx` and `app/cinematic.css` own the entrance, video scenes and GSAP scroll choreography. The Rello entrance wordmark fades before the panels uncover the homepage.

## Wallet and access

Wallet providers are discovered through EIP-6963 and supported injected-provider fallbacks. Only the provider identifier is restored from session storage; the connected account is read with `eth_accounts`. Account changes and disconnect events clear balance and eligibility state.

`lib/holder-access.ts` compares integer token units and a decimal USD price without floating-point arithmetic. Its rule is strictly greater than $150. `lib/live-data.ts` reads balances and selects token-market data; unavailable configuration or provider errors keep eligibility false.

## Public reads

`lib/chain.ts` reads ETH/USDG through RPC and wallet activity through Blockscout. The exposure result describes public observations in a bounded sample, not a probability of identity discovery. `lib/market-feed.ts` restricts the displayed market feed to Robinhood Chain tokens quoted in USDG and chooses the deepest pool for each displayed token.

## API and client

`app/api/cash/[[...path]]/route.ts` supplies supported rails, model caps, empty network/job state and public balance reads. Write methods return an unavailable response. `public/rello-client.mjs` propagates server error codes and status. `app/api/mcp/route.ts` exposes six tools over the same read and transaction boundaries.

## Protocol boundary

The five-stage lifecycle, encrypted proof, private receiving account, escrow settlement and dispute logic are product specifications. This source does not implement or deploy the contracts and services needed to execute them. The browser holder gate is not a substitute for server-side authorization when write services are eventually added.

## Verification boundary

Eight workflows verify compilation, types and behavior. Provider fixtures exercise response handling without depending on network uptime. A passing test suite does not establish real fiat payment coverage, funded settlement, regulatory permissions, contract safety or an audit.
