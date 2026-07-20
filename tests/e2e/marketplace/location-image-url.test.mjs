import assert from 'node:assert/strict';
import test from 'node:test';

test('the Malviya Nagar listing resolves Chai Smoker image URLs before rendering', async () => {
  const response = await fetch('http://127.0.0.1:3000/locations/malviya-nagar');
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(
    body,
    /https:\/\/cjsxbvnkzivddpeqrijx\.supabase\.co\/storage\/v1\/object\/public\/marketplace-store-assets\/chai-smoker\/card-cover-v1\.webp/,
  );
});
