import { describe, it, expect } from 'vitest';
import { nextVersionNumber } from './lab';

describe('nextVersionNumber', () => {
  it('retorna 1 quando não há versões', () => {
    expect(nextVersionNumber([])).toBe(1);
  });

  it('retorna max + 1', () => {
    expect(nextVersionNumber([{ numero: 1 }])).toBe(2);
    expect(nextVersionNumber([{ numero: 1 }, { numero: 2 }, { numero: 3 }])).toBe(4);
  });

  it('ignora ordem de entrada', () => {
    expect(nextVersionNumber([{ numero: 5 }, { numero: 2 }])).toBe(6);
  });
});
