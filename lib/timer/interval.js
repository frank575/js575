const start = state => (fun, delay = 0) => {
  stop(state)()
  state.timer = setInterval(() => fun(), delay)
}

const stop = state => () => {
  if (state.timer != null) {
    clearInterval(state.timer)
    state.timer = null
  }
}

/**
 * setInterval 封裝
 * @template T
 * @returns {{stop: function(): void, start: function(fun: function(): void, delay: number = 0): void}}
 */
function interval() {
  const state = { timer: null };
  return {
    start: start(state),
    stop: stop(state),
  };
}

export default interval;
