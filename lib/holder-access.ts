export type HolderAccess={eligible:boolean;status:'verified'|'unconfigured'|'unavailable';address:string;balance?:string;valueUsd?:string;priceUsd?:string;checkedAt:string;reason?:string;pairUrl?:string;tokenAddress?:string};
export const ACCESS_THRESHOLD_USD=150;
export function qualifies(raw:bigint,decimals:number,price:string){
 if(raw<BigInt(0)||!Number.isInteger(decimals)||decimals<0||decimals>36)throw new Error('Invalid token balance');
 const match=/^(\d+)(?:\.(\d{1,36}))?$/.exec(price);
 if(!match)throw new Error('Invalid market price');
 const scale=BigInt(10)**BigInt((match[2]||'').length);
 const numerator=BigInt(match[1]+(match[2]||''));
 if(numerator===BigInt(0))throw new Error('Invalid market price');
 return raw*numerator>BigInt(150)*(BigInt(10)**BigInt(decimals))*scale;
}
