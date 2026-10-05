import Rello from '../../components/rello';
import {docs} from '../../lib/content';
export async function generateMetadata({params}:{params:Promise<{slug?:string[]}>}){const {slug=[]}=await params;const path=slug.join('/');const item=docs.find(d=>d.slug===slug.slice(1).join('/'));return {title:path.startsWith('docs')?item?.title||'Documentation':path?({dev:'Developers',run:'Runner network',scan:'Exposure scanner',agents:'Agent console',live:'Activity',app:'Private account',download:'Rello on mobile',alerts:'Job alerts',terms:'Terms',privacy:'Privacy'} as Record<string,string>)[path]||'Workspace':'Agent money. Human reach.'}}
export default async function Page({params}:{params:Promise<{slug?:string[]}>}){const {slug=[]}=await params;return <Rello path={'/'+slug.join('/')} />}
