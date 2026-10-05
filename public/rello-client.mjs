/** Rello HTTP client. No private-key collection or custody. */
export function createRelloClient({origin}) {
  const base = new URL(origin).origin;
  async function request(path,body) {
    const response = await fetch(base+'/api/cash/'+path, {method:body?'POST':'GET',...(body?{headers:{'content-type':'application/json'},body:JSON.stringify(body)}:{})});
    const data = await response.json();
    if(!response.ok){const error=new Error(data.error||'Request failed');error.code=data.code;error.status=response.status;throw error;}
    return data;
  }
  return {rails:()=>request('rails'),stats:()=>request('stats'),balance:(address)=>request('balance?address='+encodeURIComponent(address)),jobStatus:(id)=>request('jobs/'+encodeURIComponent(id)),payFiat:(input)=>request('jobs',input),release:(id)=>request('jobs/'+encodeURIComponent(id)+'/release',{}),dispute:(id)=>request('jobs/'+encodeURIComponent(id)+'/dispute',{})};
}
