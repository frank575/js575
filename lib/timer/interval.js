import { start, stop } from "./util";

/**
 * setInterval 封裝
 * @template T
 * @returns {{stop: function(): void, start: function(fun: function(): void, delay: number = 0): void}}
 */
function interval() {
  const state = { timer: null };
  return {
    start: start(state, setInterval),
    stop: stop(state, clearInterval),
  };
}

export default interval;
