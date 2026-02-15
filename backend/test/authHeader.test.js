import test from 'node:test';
import assert from 'node:assert/strict';
import { getBearerToken } from '../src/utils/authHeader.js';

test('getBearerToken returns token for valid Bearer header', () => {
  assert.equal(getBearerToken('Bearer abc.def'), 'abc.def');
});

test('getBearerToken returns null for invalid header', () => {
  assert.equal(getBearerToken('Basic xxxxxx'), null);
  assert.equal(getBearerToken('Bearer'), null);
  assert.equal(getBearerToken('Bearer token extra'), null);
  assert.equal(getBearerToken(undefined), null);
});
