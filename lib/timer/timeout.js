import { start, stop } from "./util";

const startSync = (state) => (promiseFun, delay = 0) => {
  return new Promise((resolve, reject) => {
    if (state.timer == null) {
      state.timer = setTimeout(async () => {
        try {
          resolve(await promiseFun());
        } catch (err) {
          console.error(err);
          reject(err);
        }
      }, delay);
    }
  });
};

/**
 * setTimeout 封裝
 * @template T
 * @returns {{stop: function(): void, start: function(fun: function(): void, delay: number = 0): void, startSync: function(function() :Promise<T>, delay: number = 0): Promise<T>}}
 */
function timeout() {
  const state = { timer: null };
  return {
    start: start(state, setTimeout),
    startSync: startSync(state),
    stop: stop(state, clearTimeout),
  };
}

export default timeout;
