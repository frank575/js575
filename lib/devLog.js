const env = import.meta.env.MODE
const isDev = env === 'development'

/**
 * 只有 development 模式下才能 console.log，參數同原生
 * @param {...*} args
 */
function devLog(...args) {
	if (isDev) {
		console.log(...args)
	}
}

export default devLog
