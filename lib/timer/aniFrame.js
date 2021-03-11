const start = (state) => (fun) => {
  function run() {
    fun();
    state.timer = requestAnimationFrame(run);
  }
  state.timer = requestAnimationFrame(run);
};

const stop = (state) => () => {
  cancelAnimationFrame(state.timer);
};

/**
 * requestAnimationFrame 封裝
 * @returns {{stop: function(fun: function(): void): void, start: function(): void}}
 */
function aniFrame() {
  let state = { timer: null };
  return {
    start: start(state),
    stop: stop(state),
  };
}

export default aniFrame;
