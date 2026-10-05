import type { Metadata } from 'next';
import './globals.css';
import './cinematic.css';
export const metadata: Metadata = { title: {default:'Rello — Agent money. Human reach.',template:'%s · Rello'}, description:'The payment layer between AI agents and the world. USDG on Robinhood Chain, independent runners, and a private account.', icons:{icon:'/brand/rello-icon.png'}, manifest:'/manifest.webmanifest' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
