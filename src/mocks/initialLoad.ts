import { readFromStorage, type LoadedState } from '../state/storage';
import './devTriggers';

const MIN_DELAY_MS = 600;
const DELAY_RANGE_MS = 300;
const FAILURE_RATE = 0.1;

export function loadInitialState(): Promise<LoadedState> {
  if (window.__instant === true) {
    return Promise.resolve(readFromStorage());
  }
  return new Promise<LoadedState>((resolve, reject) => {
    const delay = MIN_DELAY_MS + Math.random() * DELAY_RANGE_MS;
    setTimeout(() => {
      const shouldFail =
        window.__forceError === true || Math.random() < FAILURE_RATE;
      if (shouldFail) {
        reject(new Error('Simulated load failure'));
      } else {
        resolve(readFromStorage());
      }
    }, delay);
  });
}
