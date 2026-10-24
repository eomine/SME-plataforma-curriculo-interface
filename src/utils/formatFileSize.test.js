import { describe, expect, it } from 'vitest';
import formatFileSize from 'utils/formatFileSize';

describe('formatFileSize', () => {
  it('formata em KB até 1 MB', () => {
    expect(formatFileSize(512)).toBe('1 KB');
    expect(formatFileSize(150 * 1024)).toBe('150 KB');
    expect(formatFileSize(1024 * 1024)).toBe('1024 KB');
  });

  it('formata em MB acima de 1 MB', () => {
    expect(formatFileSize(1024 * 1024 + 1)).toBe('1 MB');
    expect(formatFileSize(2.6 * 1024 * 1024)).toBe('3 MB');
  });
});
