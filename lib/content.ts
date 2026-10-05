export const rails = ['PayPal','Zelle','Venmo','Cash App','Revolut','Wise','X Money','Apple Cash','Google Pay','Lydia','Payoneer','WeChat Pay','Alipay','Pix','Mercado Pago','US bank transfer','SEPA transfer','UK bank transfer','N26','Monzo'];
export const lifecycle = [
['open','Your agent sets the terms','Choose the payment app, amount, deadline and highest runner fee. Recipient details stay out of the public job.'],
['assigned','A runner accepts','An independent person with the right payment app accepts inside your fee cap. First valid acceptance wins.'],
['funded','USDG waits in escrow','Recipient details are sealed to the assigned runner. The agent funds the agreed amount and fees.'],
['paid','A person sends the dollars','The runner pays from their own account and returns encrypted proof. The recipient uses their usual app.'],
['released','The runner gets paid back','Release after confirmation, or settle after the 24-hour dispute window. A missed deadline enables a refund.']];
export const faq = [
['Who sends the money?','An independent runner with an account on the selected payment app. They pay from their own funds, then receive USDG plus their agreed fee.'],
['What happens if nobody pays?','An unfunded job can close without moving any money. Once funded, a missed payment deadline allows the escrow to refund the agent.'],
['What if a payment does not arrive?','The agent must dispute within 24 hours of the job being marked paid. Evidence goes to an arbiter, whose decision routes escrowed USDG to the runner or back to the agent.'],
['Does the recipient see the AI agent?','The recipient sees the runner’s payment-app identity. The protocol is designed to keep the agent and its owner out of the off-chain payment.'],
['How much does a payout cost?','The payout amount, a runner fee you cap at up to 5%, and a 1% protocol fee. Network gas is separate. Conversion costs for non-USD rails must fit the runner’s quote.'],
['Is every app available everywhere?','No. Availability depends on runners, geography, the payment app’s rules and the recipient’s account. Listing a rail is not an affiliation or a guarantee of coverage.'],
['What can the public chain see?','Funding addresses, token amounts, timing and contract interactions. Privacy does not erase the transaction history or prevent all correlations.'],
['What is the token’s role?','Rello’s token is separate from payment principal: payouts are denominated in USDG. Supply, launch configuration and token utility belong in the token specification, not the payout quote.']];
export type Doc = {slug:string;title:string;group:string;intro:string;sections:{title:string;text:string;items?:string[];code?:string}[]};
export const docs:Doc[] = [
{slug:'',title:'Introduction',group:'Getting started',intro:'Agent wallets meet the apps people already use.',sections:[
{title:'The missing connection',text:'An AI agent can hold tokens and sign a transaction. A person expects payment on a familiar app or through a bank. Rello connects these two worlds through independent runners and a USDG escrow on Robinhood Chain.'},
{title:'Three parts, one payment',text:'The agent requests a payout. A runner sends the fiat payment. The escrow coordinates reimbursement and refunds.',items:['Agent: owns the funds and approves the payment terms.','Runner: fronts the fiat payment and earns an agreed fee.','Escrow: defines the two destinations for settlement, runner or agent.']},
{title:'Explore Rello',text:'Start with the agent console to build a payment plan, the runner workspace to configure your rails, or the developer hub to inspect the integration interface. The private account brings pay, receive and move into one workspace.'},
{title:'Network and settlement',text:'Robinhood Chain mainnet uses chain ID 4663 and ETH for network gas. USDG is the payout settlement asset. The Rello project token is distinct from USDG. Connect a wallet to open the app. Transaction tools require more than $150 worth of RELLO held on Robinhood Chain, verified against the confirmed token contract and a current USD market price. Read-only tools remain accessible.'}]},
{slug:'how-it-works',title:'How a payout works',group:'Getting started',intro:'Five steps. One of them is a person.',sections:lifecycle.map(([status,title,text])=>({title:title+' · '+status,text}))},
{slug:'quickstart',title:'Quickstart',group:'Getting started',intro:'Start with a payment plan, then choose an integration.',sections:[
{title:'1. Set the guardrails',text:'Choose allowed rails, a per-payment ceiling, a daily limit and the amount above which a person must approve. Cap runner fees explicitly. Never fund an agent with more than it needs.'},
{title:'2. Connect through HTTP',text:'Read supported rails and protocol limits before constructing a payment.',code:'const response = await fetch(`${origin}/api/cash/rails`);\nconst { rails, caps } = await response.json();\nconsole.log(rails, caps);'},
{title:'3. Prepare a payout',text:'A payment request includes the rail, amount in USD, recipient type, deadline and maximum runner fee. Recipient values and private keys must not be placed in a public job.'},
{title:'4. Confirm and monitor',text:'Review the quote, verify the accepted runner and escrow terms, and monitor the payout state. Release only after confirming receipt; dispute within the window if nothing arrives.'}]},
{slug:'mcp',title:'MCP server',group:'Build',intro:'A structured payment interface for your agent.',sections:[
{title:'Connect',text:'The HTTP MCP endpoint exposes public rails, balance and status queries. Payment actions share the same transaction availability checks as the website.',code:'{\n  "mcpServers": {\n    "rello": { "url": "YOUR_RELLO_ORIGIN/api/mcp" }\n  }\n}'},
{title:'Tools',text:'Use read tools to inspect the payment environment and prepare a plan.',items:['rello_rails — supported rail definitions and caps.','rello_balance — connected address balance, using public chain reads.','rello_job_status — lookup a payout state.','rello_pay_fiat — submit a payout request.','rello_release — confirm receipt and release escrow.','rello_dispute — challenge a payment inside its window.']},
{title:'Approval belongs to the owner',text:'The agent must respect the owner’s limits. A language instruction cannot authorize a higher fee, expand a rail policy or bypass a required approval.'}]},
{slug:'sdk',title:'TypeScript SDK',group:'Build',intro:'Typed read calls and explicit transaction boundaries.',sections:[
{title:'Use the browser-neutral client',text:'Download the small Rello client from the developer hub. It uses standard fetch and contains no private-key storage or signing shortcuts.',code:"import { createRelloClient } from './rello-client.mjs';\nconst rello = createRelloClient({ origin });\nconst rails = await rello.rails();\nconst job = await rello.payFiat({\n  rail: 'paypal', amountUsd: 240,\n  recipientHint: 'email', maxRunnerFeeBps: 300\n});"},
{title:'Handle errors explicitly',text:'Read the error code and HTTP status before deciding whether to retry. Never repeatedly submit a financial action after an uncertain response. Keep signing keys inside the agent’s own secure environment.'},
{title:'Read methods',text:'rails(), stats(), balance(address) and jobStatus(id) correspond to the public API. payFiat(), release() and dispute() respect the server’s transaction gate.'}]},
{slug:'api',title:'HTTP API',group:'Build',intro:'One interface for the website and integrations.',sections:[
{title:'Public reads',text:'GET /api/cash/rails returns payment rails and caps. GET /api/cash/stats returns Rello network counts. GET /api/cash/jobs/open returns the current public job board. GET /api/cash/balance?address=0x… reads ETH and USDG from Robinhood Chain.'},
{title:'Payment actions',text:'POST /api/cash/jobs creates a payout request. POST /api/cash/jobs/:id/accept, /release and /dispute define the corresponding action boundaries. They return structured errors when a transaction cannot be submitted.'},
{title:'Errors',text:'Responses use { error, code }. Validate amounts, rail identifiers and addresses before sending. An error response must be handled before updating a payment state.',code:'{ "error": "Enter a valid EVM wallet address.",\n  "code": "INVALID_ADDRESS" }'}]},
{slug:'runners',title:'Become a runner',group:'Run payouts',intro:'Use your existing payment apps. Choose your own work.',sections:[
{title:'Connect your wallet',text:'Connect an EVM wallet, verify the network and review your runner preferences. Choose the rails you can legally use, your minimum and maximum job amounts and a fee inside the agent’s cap.'},
{title:'Before paying',text:'Check that the escrow is funded, the amounts and runner destination match the assignment, and the deadline gives you enough time. Never pay just because a job appears on the board.'},
{title:'After paying',text:'Preserve payment proof. Mark the job paid only after sending the correct amount to the correct recipient. Reimbursement follows the release or dispute process.'},
{title:'Independent participation',text:'Runners front each payment using their own accounts. They are responsible for payment-app terms, restrictions, lawful participation and the risk of reversed payments.'}]},
{slug:'private-account',title:'The private account',group:'Run payouts',intro:'Pay, receive and move through a single workspace.',sections:[
{title:'Keys and discovery',text:'The account design separates viewing and spending keys. Keys belong in the client, never in application logs or public requests. A wallet connection by itself does not prove that private receiving addresses exist.'},
{title:'Fresh addresses',text:'The protocol design uses one-time receiving addresses derived from a recipient meta-address and fresh randomness. Each payment should have a new destination, while the owner sees one consolidated balance.'},
{title:'Handles and payment links',text:'A handle offers a human-readable entry point to a receiving account. A payment link carries the intended recipient and optional amount. Handles must be registered against a verified public meta-address before receiving money.'},
{title:'Move funds',text:'Withdraw to an address you control. Consolidation, repeated withdrawals and direct wallet funding can create links between addresses. The interface cannot hide information already public on-chain.'}]},
{slug:'escrow',title:'The escrow',group:'Protocol',intro:'Clear destinations. Explicit deadlines.',sections:[
{title:'Settlement rules',text:'The escrow model holds payout principal, runner fee and protocol fee. Settlement reimburses the assigned runner; eligible refunds return funds to the funding agent. An arbiter must not gain an arbitrary withdrawal destination.'},
{title:'State machine',text:'A job moves through open, assigned, funded, paid and released. It can also expire, cancel or enter a dispute. The chain becomes the source of truth once funding occurs.'},
{title:'Verify before funding',text:'Read the actual chain, contract address, verified source, fee settings and acceptance signature. Another project’s deployed contract is not Rello’s contract. Never infer deployment or an audit from this specification.'}]},
{slug:'disputes',title:'Refunds and disputes',group:'Protocol',intro:'What happens when a payout does not go to plan.',sections:[
{title:'No runner accepted',text:'No escrow funding is needed before assignment. An open request can close without moving money.'},
{title:'Deadline missed',text:'If a funded job is not marked paid by its deadline, the refund path returns the agreed escrowed funds to the agent.'},
{title:'Payment disputed',text:'The agent has 24 hours after paid status to challenge receipt. Evidence must describe the assigned recipient and payment. The arbiter decides between reimbursement and refund.'},
{title:'Release early',text:'The agent can release after checking receipt. A release is a financial action: review it carefully because it ends the escrow protection for that payment.'}]},
{slug:'fees',title:'Fees, limits and rails',group:'Protocol',intro:'Understand the full quote before approval.',sections:[
{title:'The quote',text:'Total USDG = payout amount + runner fee + 1% protocol fee. The runner fee is chosen within the agent’s cap and cannot exceed 5%. ETH gas is separate.',code:'Payout:       800.00 USDG\nRunner 1.5%:   12.00 USDG\nProtocol 1%:    8.00 USDG\nTotal:        820.00 USDG'},
{title:'Caps',text:'The payment model caps each job at $1,000 and each agent at $5,000 per day. An assignment has a 15-minute funding window. The dispute window is 24 hours.'},
{title:'Rails',text:rails.join(' · ')},
{title:'Non-USD payments',text:'For rails paying a different currency, specify the recipient’s currency and exact amount. The runner’s quote must account for conversion, rail charges and availability.'}]},
{slug:'privacy',title:'Who sees what',group:'Privacy',intro:'Privacy is a set of boundaries, not a promise of invisibility.',sections:[
{title:'Agent and runner',text:'The agent knows its intended recipient. The assigned runner needs recipient details to send the fiat payment. End-to-end encryption is the protocol design for those details and returned proof.'},
{title:'Recipient',text:'The recipient sees a payment from the runner’s account, including whatever name and reference the payment app exposes.'},
{title:'Public chain',text:'The funding address, token amount, time and contract interaction are public. Fresh runner keys and receiving addresses reduce direct account linking but do not erase this data.'},
{title:'Service',text:'A matching service can observe rails, amounts, timing and connection metadata. Encryption must be evaluated independently of marketing language.'}]},
{slug:'cant-hide',title:'What Rello cannot hide',group:'Privacy',intro:'Know the public surface before you pay.',sections:[
{title:'Amounts and timing',text:'Public chain activity can be compared with off-chain amounts and times. A distinctive payment can create a correlation even without a public recipient name.'},
{title:'Funding history',text:'The funding agent’s address and its own source of funds remain visible. One-time destinations do not retroactively conceal that history.'},
{title:'Payment-app records',text:'Payment providers keep their own account and transaction records. A runner’s identity may be visible to the recipient and provider.'},
{title:'No blanket anonymity',text:'Device metadata, repeated behavior, withdrawals and external records can connect activity. Do not treat Rello as a way to evade legal obligations.'}]},
{slug:'scanner',title:'Exposure scanner',group:'Privacy',intro:'A read-only view of a wallet’s public footprint.',sections:[
{title:'What it reads',text:'The scanner reads public Robinhood Chain explorer data: balances, recent transactions, counterparties, contract calls and activity timing. It needs no wallet connection or signature.'},
{title:'How to interpret a result',text:'The footprint indicator describes observed public activity in the returned sample. It is not a probability of identifying someone and not a security audit. Missing history is not proof of privacy.'},
{title:'Sharing',text:'Export a redacted card with coarse findings. It excludes the wallet address, balances and counterparties. Scans are not published to an Rello feed.'}]},
{slug:'faq',title:'Frequently asked questions',group:'Resources',intro:'Practical answers about the payout model.',sections:faq.map(([title,text])=>({title,text}))},
{slug:'risks',title:'Risks and acceptable use',group:'Resources',intro:'Understand the risks of moving value across systems.',sections:[
{title:'Participation risks',text:'Smart-contract errors, runner liquidity, disputed proof, provider outages, stablecoin risks and payment reversals can all affect a payout. Privacy mechanisms also have limits.'},
{title:'Acceptable use',text:'Do not use the network for fraud, illicit funds, sanctions evasion, non-consensual payments or splitting jobs to evade caps. Participants must comply with applicable law and payment-provider rules.'},
{title:'Your responsibility',text:'Check recipient details and every approval. Preserve evidence. Do not fund an agent beyond its needs. Token ownership does not guarantee payment coverage, investment returns or a share of protocol revenue.'}]},
{slug:'legal',title:'Non-affiliation',group:'Resources',intro:'Independent infrastructure on an open network.',sections:[
{title:'Independent project',text:'Rello is not a bank, payment provider or Robinhood product. It is not affiliated with, endorsed by or sponsored by Robinhood Markets or any named payment app.'},
{title:'Names and trademarks',text:'Payment-app names identify the rails runners may use. Those names and marks belong to their respective owners. Their appearance does not imply an integration agreement or endorsement.'}]}];
export const snippets = {
HTTP:"const rails = await fetch('/api/cash/rails').then(r => r.json());\nconst quote = {\n  rail: 'paypal', amountUsd: 240,\n  recipientHint: 'email', maxRunnerFeeBps: 300\n};\n// Review terms before submitting a payment request.",
TypeScript:"import { createRelloClient } from './rello-client.mjs';\n\nconst rello = createRelloClient({ origin });\nconst rails = await rello.rails();\nconst job = await rello.payFiat({\n  rail: 'paypal', amountUsd: 240,\n  recipientHint: 'email', maxRunnerFeeBps: 300\n});",
MCP:'{\n  "mcpServers": {\n    "rello": {\n      "url": "YOUR_RELLO_ORIGIN/api/mcp"\n    }\n  }\n}'
};
