import {markets} from '../../../lib/live-data';
export async function GET(){try{return Response.json(await markets(),{headers:{'Cache-Control':'public, max-age=60'}})}catch{return Response.json({error:'Market data is temporarily unavailable.'},{status:503,headers:{'Cache-Control':'no-store'}})}}
