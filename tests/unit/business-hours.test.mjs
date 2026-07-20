import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';

const sourcePath = path.resolve('src/lib/marketplace/business-hours.ts');

function loadBusinessHours() {
  const source = fs.readFileSync(sourcePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', compiled)(module, module.exports);
  return module.exports;
}

test('opens a published store during its Supabase hours', () => {
  const { getStoreAvailability } = loadBusinessHours();
  const availability = getStoreAvailability(
    { status: 'PUBLISHED', businessHours: { all: '06:00-23:30' } },
    new Date('2026-07-20T06:30:00.000Z'),
  );

  assert.equal(availability.isOpen, true);
  assert.equal(availability.canOrder, true);
  assert.equal(availability.statusLabel, 'Open now');
  assert.equal(availability.closesAt, '2026-07-20T18:00:00.000Z');
  assert.match(availability.closesLabel, /^Closes at 11:30\s?pm$/i);
});

test('closes after hours and returns the next opening time', () => {
  const { getStoreAvailability } = loadBusinessHours();
  const availability = getStoreAvailability(
    { status: 'PUBLISHED', businessHours: { all: '06:00-23:30' } },
    new Date('2026-07-19T19:30:00.000Z'),
  );

  assert.equal(availability.isOpen, false);
  assert.equal(availability.canOrder, false);
  assert.equal(availability.nextOpenAt, '2026-07-20T00:30:00.000Z');
  assert.match(availability.nextOpenLabel, /^Opens today at 6:00\s?am$/i);
});

test('supports overnight opening ranges', () => {
  const { getStoreAvailability } = loadBusinessHours();
  const availability = getStoreAvailability(
    { status: 'ACTIVE', businessHours: { all: '18:00-02:00' } },
    new Date('2026-07-19T19:00:00.000Z'),
  );

  assert.equal(availability.isOpen, true);
});

test('a temporary closure blocks ordering until the later valid opening', () => {
  const { getStoreAvailability } = loadBusinessHours();
  const availability = getStoreAvailability(
    {
      status: 'ACTIVE',
      businessHours: { all: '06:00-23:30' },
      temporarilyClosedUntil: '2026-07-20T05:30:00.000Z',
    },
    new Date('2026-07-20T03:30:00.000Z'),
  );

  assert.equal(availability.isOpen, false);
  assert.equal(availability.canOrder, false);
  assert.equal(availability.nextOpenAt, '2026-07-20T05:30:00.000Z');
  assert.match(availability.nextOpenLabel, /^Opens today at 11:00\s?am$/i);
});
