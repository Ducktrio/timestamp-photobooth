import { Semaphore } from '../../../main/helpers/semaphore';

describe('Semaphore', () => {
  test('should allow only a limited number of concurrent accesses', async () => {
    const semaphore = new Semaphore('test', 2);
    let concurrent = 0;
    let maxConcurrent = 0;

    const task = async () => {
      const release = await semaphore.acquire();
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise((resolve) => setTimeout(resolve, 50)); // simulate work
      concurrent--;
      release.release();
    };

    await Promise.all([task(), task(), task(), task()]);
    expect(maxConcurrent).toBeLessThanOrEqual(2);
  });

  test('should queue tasks when limit is reached', async () => {
    const semaphore = new Semaphore('test', 1);
    const executionOrder: number[] = [];

    const task = async (id: number) => {
      const release = await semaphore.acquire();
      executionOrder.push(id);
      await new Promise((resolve) => setTimeout(resolve, 20));
      release.release();
    };

    await Promise.all([task(1), task(2), task(3)]);
    expect(executionOrder).toEqual([1, 2, 3]);
  });

  test('should not allow more than limit to run in parallel', async () => {
    const semaphore = new Semaphore('test', 3);
    let current = 0;
    let maxSeen = 0;

    const task = async () => {
      const release = await semaphore.acquire();
      current++;
      maxSeen = Math.max(maxSeen, current);
      await new Promise((res) => setTimeout(res, 30));
      current--;
      release.release();
    };

    await Promise.all(Array.from({ length: 10 }, task));
    expect(maxSeen).toBeLessThanOrEqual(3);
  });

  test('release should free up a slot', async () => {
    const semaphore = new Semaphore('test', 1);
    const results: string[] = [];

    const first = async () => {
      const release = await semaphore.acquire();
      results.push('first');
      await new Promise((res) => setTimeout(res, 30));
      release.release();
    };

    const second = async () => {
      const release = await semaphore.acquire();
      results.push('second');
      release.release();
    };

    await Promise.all([first(), second()]);
    expect(results).toEqual(['first', 'second']);
  });
});
