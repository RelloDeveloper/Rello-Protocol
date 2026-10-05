export const MARKET_FEED_URL='https://api.dexscreener.com/latest/dex/tokens/0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168';
const USDG='0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168';
export function normalizeMarkets(data:any){
 const pairs=(data.pairs||[]).filter((p:any)=>p.chainId==='robinhood'&&p.quoteToken?.address?.toLowerCase()===USDG.toLowerCase()&&Number(p.priceUsd)>0&&/^https:\/\/dexscreener\.com\/robinhood\//.test(p.url||'')).sort((a:any,b:any)=>(b.liquidity?.usd||0)-(a.liquidity?.usd||0));
 const seen=new Set<string>();const items=pairs.filter((p:any)=>{const a=p.baseToken.address.toLowerCase();if(seen.has(a))return false;seen.add(a);return true}).slice(0,6).map((p:any)=>({address:p.baseToken.address,symbol:p.baseToken.symbol,name:p.baseToken.name,priceUsd:p.priceUsd,change24h:p.priceChange?.h24??null,volume24h:p.volume?.h24??null,liquidityUsd:p.liquidity?.usd??null,url:p.url}));
 return {items,source:'DEX Screener',chainId:4663,updatedAt:new Date().toISOString()};
}
