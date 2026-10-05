import {holderAccess} from '../../../lib/live-data';
import {validAddress} from '../../../lib/chain';
export async function GET(request:Request){const address=new URL(request.url).searchParams.get('address')||'';if(!validAddress(address))return Response.json({error:'Enter a valid wallet address.'},{status:400});return Response.json(await holderAccess(address),{headers:{'Cache-Control':'no-store'}})}
