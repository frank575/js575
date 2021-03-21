const start = state => (fun, delay = 0) => {
	stop(state)()
	state.timer = setTimeout(() => fun(), delay)
}

const startSync = state => (promiseFun, delay = 0) => {
	return new Promise((resolve, reject) => {
		stop(state)()
		state.timer = setTimeout(async () => {
			try {
				const res = await promiseFun()
				state.timer = null
				resolve(res)
			} catch (err) {
				console.error(err)
				state.timer = null
				reject(err)
			}
		}, delay)
	})
}

const stop = state => () => {
	if (state.timer != null) {
		clearTimeout(state.timer)
		state.timer = null
	}
}

/**
 * setTimeout 封裝
 * @template T
 * @returns {{stop: function(): void, start: function(fun: function(): void, delay: number = 0): void, startSync: function(function() :Promise<T>, delay: number = 0): Promise<T>}}
 */
export const timeout = () => {
	const state = { timer: null }
	return {
		start: start(state),
		startSync: startSync(state),
		stop: stop(state),
	}
}
