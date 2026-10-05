import { readFile, access } from 'node:fs/promises';
import ts from 'typescript';

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.') && context.parentURL) {
    const base = new URL(specifier, context.parentURL);
    for (const extension of ['.ts', '.tsx']) {
      const candidate = new URL(base.href + extension);
      try { await access(candidate); return { url: candidate.href, shortCircuit: true }; } catch {}
    }
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.ts') || url.endsWith('.tsx')) {
    const source = await readFile(new URL(url), 'utf8');
    return { format: 'module', shortCircuit: true, source: ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
      fileName: new URL(url).pathname,
    }).outputText };
  }
  return nextLoad(url, context);
}
