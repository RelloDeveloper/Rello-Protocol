import test from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST, DELETE } from '../app/api/cash/[[...path]]/route.ts';

test('HTTP rails expose all 20 unique destinations and the payment-model caps', async () => {
  const response=await GET(new Request('https://rello.example/api/cash/rails'));
  const data=await response.json();
  assert.equal(response.status,200);assert.equal(data.chainId,4663);
  assert.equal(data.rails.length,20);assert.equal(new Set(data.rails.map(r=>r.id)).size,20);
  assert.equal(data.caps.perJobUsd,1000);assert.equal(data.caps.maxRunnerFeeBps,500);
  assert.equal(data.caps.protocolFeeBps,100);
});
test('invalid address returns a structured 400 before RPC access', async () => {
  const response=await GET(new Request('https://rello.example/api/cash/balance?address=bad'));
  assert.equal(response.status,400);assert.equal((await response.json()).code,'INVALID_ADDRESS');
});
test('missing jobs and routes do not produce invented payout records', async () => {
  const job=await GET(new Request('https://rello.example/api/cash/jobs/missing'));
  const route=await GET(new Request('https://rello.example/api/cash/unknown'));
  assert.equal(job.status,404);assert.equal((await job.json()).code,'JOB_NOT_FOUND');
  assert.equal(route.status,404);assert.equal((await route.json()).code,'NOT_FOUND');
});
test('job board and network counts start empty', async () => {
  const board=await (await GET(new Request('https://rello.example/api/cash/jobs/open'))).json();
  const stats=await (await GET(new Request('https://rello.example/api/cash/stats'))).json();
  assert.deepEqual(board.jobs,[]);assert.equal(stats.completedJobs,0);assert.equal(stats.totalPaidUsd,0);
});
test('write methods never report a payment as submitted', async () => {
  for (const handler of [POST, DELETE]) {
    const response=await handler();const body=await response.json();
    assert.equal(response.status,503);assert.equal(body.submitted,false);
    assert.equal(body.code,'TRANSACTIONS_UNAVAILABLE');
  }
});
