export const start = (state, setTimerFun) => (fun, delay = 0) => {
  if (state.timer == null) {
    state.timer = setTimerFun(() => {
      if (setTimerFun === setTimeout) state.timer = null;
      fun();
    }, delay);
  }
};

export const stop = (state, clearTimerFun) => () => {
  if (state.timer != null) {
    clearTimerFun(state.timer);
    state.timer = null;
  }
};
