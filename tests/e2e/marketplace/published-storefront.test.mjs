import assert from 'node:assert/strict';
import test from 'node:test';

test('a published store remains visible on its storefront route', async () => {
  const response = await fetch('http://127.0.0.1:3000/store/chai-smoker');
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(body, /CHAI SMOKER/i);
  assert.match(body, /Adrak Chai \(150ml\)/i);
});

test('store availability follows Supabase hours and keeps the menu browseable when closed', async () => {
  const [availabilityResponse, storefrontResponse] = await Promise.all([
    fetch('http://127.0.0.1:3000/api/marketplace/stores/chai-smoker/availability'),
    fetch('http://127.0.0.1:3000/store/chai-smoker'),
  ]);
  const availability = await availabilityResponse.json();
  const storefront = await storefrontResponse.text();

  assert.equal(availabilityResponse.status, 200);
  assert.equal(typeof availability.isOpen, 'boolean');
  assert.equal(typeof availability.canOrder, 'boolean');
  assert.equal(availability.canOrder, availability.isOpen);
  assert.match(storefront, /Adrak Chai \(150ml\)/i);

  if (!availability.canOrder) {
    assert.match(availability.nextOpenLabel ?? availability.statusLabel, /Closed|Opens/i);
    assert.match(storefront, /Ordering closed/i);
    assert.match(storefront, /menu remains available to browse/i);
  }
});
