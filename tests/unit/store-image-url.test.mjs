import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';

const sourcePath = path.resolve('src/lib/marketplace/store-image-url.ts');

function loadImageUrlResolver() {
  const source = fs.readFileSync(sourcePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', compiled)(module, module.exports);
  return module.exports.resolveStoreImageUrl;
}

test('resolves a bare storage filename to the public storefront-assets URL', () => {
  const resolveStoreImageUrl = loadImageUrlResolver();

  assert.equal(
    resolveStoreImageUrl('chai-smoker-storefront.jpg', 'https://cjsxbvnkzivddpeqrijx.supabase.co'),
    'https://cjsxbvnkzivddpeqrijx.supabase.co/storage/v1/object/public/storefront-assets/chai-smoker-storefront.jpg',
  );
});
