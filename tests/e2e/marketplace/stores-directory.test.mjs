import assert from 'node:assert/strict';
import test from 'node:test';

test('the stores directory renders the live marketplace heading', async () => {
  const response = await fetch('http://127.0.0.1:3000/stores');
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(body, /Discover stores near you/);
});
