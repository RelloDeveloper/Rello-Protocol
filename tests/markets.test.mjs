import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeMarkets } from '../lib/market-feed.ts';
const USDG='0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168';
const pair=(address,liquidity,extras={})=>({chainId:'robinhood',quoteToken:{address:USDG},baseToken:{address,symbol:'TKN',name:'Token'},priceUsd:'1.25',liquidity:{usd:liquidity},url:'https://dexscreener.com/robinhood/'+address,...extras});
test('selects Robinhood USDG markets, ignoring other chains, quotes, invalid prices and URLs',()=>{
  const data=normalizeMarkets({pairs:[pair('0x1',100),pair('0x2',200,{chainId:'ethereum'}),pair('0x3',300,{quoteToken:{address:'0xother'}}),pair('0x4',400,{priceUsd:'0'}),pair('0x5',500,{url:'javascript:alert(1)'})]});
  assert.equal(data.chainId,4663);assert.deepEqual(data.items.map(i=>i.address),['0x1']);
});
test('deduplicates each token using its deepest pool and caps the feed at six tokens',()=>{
  const pairs=[pair('0xa',10),pair('0xa',999),...Array.from({length:8},(_,i)=>pair('0x'+i,100+i))];
  const data=normalizeMarkets({pairs});
  assert.equal(data.items.length,6);assert.equal(data.items[0].address,'0xa');assert.equal(data.items[0].liquidityUsd,999);
  assert.equal(new Set(data.items.map(i=>i.address)).size,6);
});
test('preserves unknown metrics as null instead of invented price changes',()=>{
  const item=normalizeMarkets({pairs:[pair('0xa',100)]}).items[0];
  assert.equal(item.change24h,null);assert.equal(item.volume24h,null);
});
test('empty provider results yield an empty feed with provenance',()=>{
  const result=normalizeMarkets({});assert.deepEqual(result.items,[]);assert.equal(result.source,'DEX Screener');assert.ok(result.updatedAt);
});
