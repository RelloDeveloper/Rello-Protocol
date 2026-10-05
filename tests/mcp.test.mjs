import test from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST } from '../app/api/mcp/route.ts';
const request=body=>new Request('https://rello.example/api/mcp',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});

test('MCP initializes with Rello identity and six documented tools',async()=>{
  const init=await (await POST(request({jsonrpc:'2.0',id:1,method:'initialize'}))).json();
  assert.equal(init.result.serverInfo.name,'rello');
  const list=await (await POST(request({jsonrpc:'2.0',id:2,method:'tools/list'}))).json();
  assert.equal(list.result.tools.length,6);
  assert.deepEqual(list.result.tools.map(t=>t.name),['rello_rails','rello_balance','rello_job_status','rello_pay_fiat','rello_release','rello_dispute']);
});
test('MCP returns parse and method errors as JSON-RPC errors',async()=>{
  const malformed=await POST(new Request('https://rello.example/api/mcp',{method:'POST',body:'{'}));
  assert.equal((await malformed.json()).error.code,-32700);
  const unknown=await POST(request({id:1,method:'unknown'}));
  assert.equal((await unknown.json()).error.code,-32601);
  assert.equal((await GET()).status,405);
});
test('MCP notifications receive no invented result',async()=>{
  const response=await POST(request({jsonrpc:'2.0',method:'notifications/initialized'}));
  assert.equal(response.status,202);assert.equal(await response.text(),'');
});
test('MCP transaction tools return an error without submitting funds',async()=>{
  for(const name of ['rello_pay_fiat','rello_release','rello_dispute']){
    const response=await (await POST(request({id:1,method:'tools/call',params:{name,arguments:{}}}))).json();
    assert.equal(response.result.isError,true);
    assert.match(response.result.content[0].text,/No funds were moved/);
  }
});
test('MCP balance rejects an invalid address',async()=>{
  const result=await (await POST(request({id:1,method:'tools/call',params:{name:'rello_balance',arguments:{address:'bad'}}}))).json();
  assert.equal(result.result.isError,true);
});
