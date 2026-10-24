import { describe, expect, it, vi } from 'vitest';
import onKeyActivate from 'utils/onKeyActivate';

function keyEvent(key) {
  return { key, preventDefault: vi.fn() };
}

describe('onKeyActivate', () => {
  it('aciona o handler com Enter e espaço, repassando o evento', () => {
    const handler = vi.fn();
    const onKeyDown = onKeyActivate(handler);

    for (const key of ['Enter', ' ']) {
      const event = keyEvent(key);
      onKeyDown(event);
      expect(handler).toHaveBeenLastCalledWith(event);
      expect(event.preventDefault).toHaveBeenCalled();
    }
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('ignora as outras teclas', () => {
    const handler = vi.fn();
    const event = keyEvent('Tab');
    onKeyActivate(handler)(event);
    expect(handler).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
