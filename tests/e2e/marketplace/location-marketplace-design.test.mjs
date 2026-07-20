import assert from 'node:assert/strict';
import test from 'node:test';

test('the Malviya Nagar marketplace exposes five responsive Chai Smoker hero banners', async () => {
  const response = await fetch('http://127.0.0.1:3000/locations/malviya-nagar');
  const body = await response.text();

  assert.equal(response.status, 200);
  for (const banner of [
    'chai-smoker-chai-break.png',
    'chai-smoker-campus-cravings.png',
    'chai-smoker-counter-price.png',
    'chai-smoker-open-early.png',
    'chai-smoker-comfort.png',
  ]) {
    assert.match(body, new RegExp(banner));
  }
  assert.match(body, /Best Cuisines Near You/);
  assert.match(body, /Discover Malviya Nagar(?:&#x27;|')s most-loved flavours, delivered fresh to your doorstep\./);
});
