import test from 'node:test';
import assert from 'node:assert/strict';
import { qualifies } from '../lib/holder-access.ts';
import { holderAccess } from '../lib/live-data.ts';

test('requires strictly more than $150, including the smallest token increment', () => {
  assert.equal(qualifies(150n * 10n ** 18n, 18, '1'), false);
  assert.equal(qualifies(150n * 10n ** 18n + 1n, 18, '1'), true);
  assert.equal(qualifies(149n * 10n ** 18n, 18, '1'), false);
});
test('prices fractional and zero-decimal tokens without floating point rounding', () => {
  assert.equal(qualifies(600000000n, 6, '0.25'), false);
  assert.equal(qualifies(600000001n, 6, '0.25'), true);
  assert.equal(qualifies(150n, 0, '1'), false);
  assert.equal(qualifies(151n, 0, '1'), true);
});
test('rejects invalid balances, decimals, and market prices', () => {
  for (const [raw, decimals, price] of [[-1n,18,'1'],[1n,37,'1'],[1n,1.5,'1'],[1n,18,'0'],[1n,18,'NaN'],[1n,18,'-1'],[1n,18,'1e3']]) {
    assert.throws(() => qualifies(raw, decimals, price));
  }
});
test('missing token deployment never unlocks holder access', async () => {
  const result = await holderAccess('0x' + '1'.repeat(40));
  assert.equal(result.eligible, false);
  assert.equal(result.status, 'unconfigured');
  assert.ok(result.checkedAt);
});
test('invalid wallets fail before a network request', async () => {
  await assert.rejects(holderAccess('not-a-wallet'), /valid wallet/);
});
