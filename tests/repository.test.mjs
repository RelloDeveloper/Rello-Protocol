import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { docs, lifecycle, rails } from '../lib/content.ts';

test('documentation slugs and the five payout-model states are unique',()=>{
  assert.equal(new Set(docs.map(d=>d.slug)).size,docs.length);
  assert.deepEqual(lifecycle.map(s=>s[0]),['open','assigned','funded','paid','released']);
  assert.equal(rails.length,20);
});
test('manifest and layout point to an existing Rello icon',()=>{
  const manifest=JSON.parse(readFileSync('public/manifest.webmanifest','utf8'));
  assert.equal(manifest.name,'Rello');
  for(const icon of manifest.icons)assert.ok(existsSync('public'+icon.src),icon.src);
  const icon=readFileSync('public/brand/rello-icon.png');assert.equal(icon.subarray(1,4).toString(),'PNG');
  assert.match(readFileSync('app/layout.tsx','utf8'),/rello-icon\.png/);
});
test('README local file references exist',()=>{
  const readme=readFileSync('README.md','utf8');
  const paths=[...readme.matchAll(/(?:href|src)="((?:docs\/|\.github\/)[^"]+)"|\]\(((?:docs\/|\.github\/)[^)]+)\)/g)].map(m=>m[1]||m[2]);
  assert.ok(paths.length>4);
  for(const path of paths)assert.ok(existsSync(path.split('#')[0]),path);
});
test('all eight CI definitions have read-only repository permission and real check commands',()=>{
  for(const name of ['build','typecheck','holder-access','sdk','http-api','mcp','markets','repository']){
    const source=readFileSync('.github/workflows/'+name+'.yml','utf8');
    assert.match(source,/contents: read/);assert.match(source,/pnpm (build|typecheck|test:)/);
    assert.match(source,/workflow_dispatch/);assert.doesNotMatch(source,/continue-on-error:\s*true/);
  }
});
