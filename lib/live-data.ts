import {RPC,validAddress} from './chain';
import {qualifies,type HolderAccess} from './holder-access';
import {MARKET_FEED_URL,normalizeMarkets} from './market-feed';
export const RELLO_TOKEN_ADDRESS=''; // Set only from the owner's confirmed Robinhood Chain contract.
const CHAIN='robinhood';
async function json(url:string,options:RequestInit={}){const r=await fetch(url,{...options,signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error('The live data provider could not complete this read.');return r.json() as Promise<any>}
async function call(method:string,params:any[]){const d=await json(RPC,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params})});if(d.error||typeof d.result!=='string'||!/^0x[0-9a-f]+$/i.test(d.result))throw new Error('Unable to read the token balance.');return d.result as string}
let marketCache:{at:number;data:any}|undefined;
export async function markets(){
 if(marketCache&&Date.now()-marketCache.at<60000)return marketCache.data;
 const data=normalizeMarkets(await json(MARKET_FEED_URL));marketCache={at:Date.now(),data};return data;
}
function units(raw:bigint,decimals:number){const base=BigInt(10)**BigInt(decimals);return decimals?`${raw/base}.${(raw%base).toString().padStart(decimals,'0')}`:String(raw)}
export async function holderAccess(address:string):Promise<HolderAccess>{
 if(!validAddress(address))throw new Error('Enter a valid wallet address.');
 const base={address,eligible:false,checkedAt:new Date().toISOString()};
 if(!validAddress(RELLO_TOKEN_ADDRESS))return {...base,status:'unconfigured',reason:'RELLO holdings cannot be verified yet.'};
 try{
 const [rawHex,decHex,data]=await Promise.all([call('eth_call',[{to:RELLO_TOKEN_ADDRESS,data:'0x70a08231'+address.slice(2).toLowerCase().padStart(64,'0')},'latest']),call('eth_call',[{to:RELLO_TOKEN_ADDRESS,data:'0x313ce567'},'latest']),json('https://api.dexscreener.com/latest/dex/tokens/'+RELLO_TOKEN_ADDRESS)]);
 const decimals=Number(BigInt(decHex));if(!Number.isInteger(decimals)||decimals<0||decimals>36)throw new Error('Unable to read token decimals.');
 const pair=(data.pairs||[]).filter((p:any)=>p.chainId===CHAIN&&p.baseToken?.address?.toLowerCase()===RELLO_TOKEN_ADDRESS.toLowerCase()&&Number(p.priceUsd)>0&&Number(p.liquidity?.usd)>0).sort((a:any,b:any)=>Number(b.liquidity.usd)-Number(a.liquidity.usd))[0];
 if(!pair)throw new Error('No current RELLO market price is available.');
 const raw=BigInt(rawHex),balance=units(raw,decimals),eligible=qualifies(raw,decimals,pair.priceUsd);
 return {...base,status:'verified',eligible,tokenAddress:RELLO_TOKEN_ADDRESS,balance,priceUsd:pair.priceUsd,valueUsd:(Number(balance)*Number(pair.priceUsd)).toFixed(2),pairUrl:pair.url};
 }catch(e:any){return {...base,status:'unavailable',reason:e.message||'Unable to verify RELLO holdings.'}}
}
