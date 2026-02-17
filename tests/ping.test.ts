import { describe, expect, it } from 'vitest';
import { data } from '../src/commands/ping.js';

describe('ping command', () => {
  it('has correct name', () => {
    expect(data.name).toBe('ping');
  });
});
