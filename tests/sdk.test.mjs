import test from 'node:test';
import assert from 'node:assert/strict';
import { createRelloClient } from '../public/rello-client.mjs';

test('SDK uses the supplied origin and sends reads without a request body', async t => {
  let seen;
  t.mock.method(globalThis, 'fetch', async (url, options) => { seen = {url, options}; return Response.json({rails:[]}); });
  const client = createRelloClient({origin:'https://rello.example/unused-path'});
  assert.deepEqual(await client.rails(), {rails:[]});
  assert.equal(seen.url, 'https://rello.example/api/cash/rails');
  assert.equal(seen.options.method, 'GET');
  assert.equal(seen.options.body, undefined);
});
test('SDK encodes lookup identifiers and wallet query strings', async t => {
  const requests=[];
  t.mock.method(globalThis, 'fetch', async url => { requests.push(url); return Response.json({}); });
  const client=createRelloClient({origin:'https://rello.example'});
  await client.jobStatus('job/with?query'); await client.balance('0x123 &x=y');
  assert.equal(requests[0], 'https://rello.example/api/cash/jobs/job%2Fwith%3Fquery');
  assert.equal(requests[1], 'https://rello.example/api/cash/balance?address=0x123%20%26x%3Dy');
});
test('SDK preserves structured transaction errors instead of returning a successful job', async t => {
  let seen;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    seen={url,options}; return Response.json({error:'Transactions unavailable',code:'TRANSACTIONS_UNAVAILABLE',submitted:false},{status:503});
  });
  const client=createRelloClient({origin:'https://rello.example'});
  await assert.rejects(client.payFiat({rail:'paypal',amountUsd:240}), error => error.status===503 && error.code==='TRANSACTIONS_UNAVAILABLE');
  assert.equal(seen.options.method,'POST');
  assert.deepEqual(JSON.parse(seen.options.body),{rail:'paypal',amountUsd:240});
});
test('release and dispute retain their own encoded action paths', async t => {
  const requests=[];
  t.mock.method(globalThis, 'fetch', async url => {requests.push(url);return Response.json({});});
  const client=createRelloClient({origin:'https://rello.example'});
  await client.release('a/b'); await client.dispute('a/b');
  assert.deepEqual(requests,['https://rello.example/api/cash/jobs/a%2Fb/release','https://rello.example/api/cash/jobs/a%2Fb/dispute']);
});
