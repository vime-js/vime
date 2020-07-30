import { debounce } from '../timing';

describe('debounce', () => {
  jest.useFakeTimers();

  it('should debounce function calls', () => {
    const callback = jest.fn();
    const fn = debounce(callback, 1500);
    for (let i = 0; i <= 50; i += 1) { fn(i); }
    jest.advanceTimersByTime(1501);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(50);
  });
});
