/**
 * setTimeout 封裝
 * @template T
 * @returns {{stop: function(): void, start: function(fun: function(): void, delay: number = 0): void, startSync: function(function() :Promise<T>, delay: number = 0): Promise<T>}}
 */
function timeout() {
	let timer = null
	function start(fun, delay = 0) {
		if (timer == null) {
			timer = setTimeout(() => {
				fun()
			}, delay)
		}
	}
	function startSync(promiseFun, delay = 0) {
		return new Promise((resolve, reject) => {
			if (timer == null) {
				timer = setTimeout(async () => {
					try {
						resolve(await promiseFun())
					} catch (err) {
						console.error(err)
						reject(err)
					}
				}, delay)
			}
		})
	}
	function stop() {
		if (timer != null) {
			clearTimeout(timer)
			timer = null
		}
	}

	return {
		start,
		startSync,
		stop,
	}
}

export default timeout
