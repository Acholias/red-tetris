import { describe, it, expect } from 'vitest';
import { rotations } from './rotations'

describe('rotation', () => {
  it('2x2 rotation clock wise', () => {
    // 1. Setup
    const cells = [
        ' ', 'T',
        'T', 'T',
    ];

    // 2. Action
    const result = rotations['2x2'](cells);

    // 3. Assert
    const expected = [
        'T', ' ',
        'T', 'T',
    ];
    expect(result).toEqual(expected);
  });

  it('3x3 rotation clock wise', () => {
    // 1. Setup
    const cells = [
        ' ', ' ', 'L',
        'L', 'L', 'L',
        ' ', ' ', ' ',
    ];

    // 2. Action
    const result = rotations['3x3'](cells);

    // 3. Assert
    const expected = [
        ' ', 'L', ' ',
        ' ', 'L', ' ',
        ' ', 'L', 'L',
    ];
    expect(result).toEqual(expected);
  });

  it('4x4 rotation clock wise', () => {
    // 1. Setup
    const cells = [
        ' ', ' ', ' ', ' ',
        'I', 'I', 'I', 'I',
        ' ', ' ', ' ', ' ',
        ' ', ' ', ' ', ' ',
    ];

    // 2. Action
    const result = rotations['4x4'](cells);

    // 3. Assert
    const expected = [
        ' ', ' ', 'I', ' ',
        ' ', ' ', 'I', ' ',
        ' ', ' ', 'I', ' ',
        ' ', ' ', 'I', ' ',
    ];
    expect(result).toEqual(expected);
  });

  it('5x5 rotation clock wise', () => {
    // 1. Setup
    const cells = [
        ' ', ' ', ' ', ' ', ' ',
        ' ', ' ', ' ', ' ', ' ',
        'I', 'I', 'I', 'I', 'I',
        ' ', ' ', ' ', ' ', ' ',
        ' ', ' ', ' ', ' ', ' ',
    ];

    // 2. Action
    const result = rotations['5x5'](cells);

    // 3. Assert
    const expected = [
        ' ', ' ', 'I', ' ', ' ',
        ' ', ' ', 'I', ' ', ' ',
        ' ', ' ', 'I', ' ', ' ',
        ' ', ' ', 'I', ' ', ' ',
        ' ', ' ', 'I', ' ', ' ',
    ];
    expect(result).toEqual(expected);
  });
});
