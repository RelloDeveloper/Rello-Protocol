import type {ComponentPropsWithoutRef} from 'react';

// Document navigation keeps every route usable without a client-router response.
export default function SiteLink(props:ComponentPropsWithoutRef<'a'>){
 return <a {...props}/>;
}
