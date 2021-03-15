import { useCallback, useEffect, useMemo, useRef, useState, MutableRefObject } from 'react'

/**
 * 加載用鉤子
 * @template T
 * @param {Promise<*> | T} promiseFun
 * @param {{append?: (HTMLElement | MutableRefObject<HTMLElement>), run?: (string | boolean | Array.<string, ...*>)}} [options= { run: 'run' }] options
 * @returns {{error: string, pending: Object.<keyof T, boolean>, loading: boolean, exec: (T & { run: function(...args): Promise<*> })}}
 */
function useLoad(promiseFun, options) {
	const isFun = useMemo(() => typeof promiseFun === 'function', [promiseFun])
	const run = useRef(options?.run ?? 'run')
	const append = useRef(options?.append)
	const throttle = useRef({})
	const [state, setState] = useState({
		error: undefined,
		pending: {},
		loading: false,
	})

	const getRemoveThrottle = useCallback(key => {
		delete throttle.current[key]
		return Object.keys(throttle.current).length ? throttle.current : false
	}, [])

	const pFun = useCallback(async (fun, key, ...args) => {
		if (throttle.current[key]) {
			return
		}
		throttle.current[key] = true

		try {
			setState({ error: undefined, pending: throttle.current, loading: true })
			const result = await fun.call(promiseFun, ...args)
			setState({ error: undefined, pending: getRemoveThrottle(key), loading: false })
			return result
		} catch (error) {
			console.error(error)
			setState({ error, pending: getRemoveThrottle(key), loading: false })
		}
	}, [])

	const exec = useMemo(() => {
		if (isFun) {
			return { run: async (...args) => await pFun(promiseFun, 'run', ...args) }
		} else {
			return Object.keys(promiseFun).reduce((p, e) => (p[e] = async (...args) => await pFun(promiseFun[e], e, ...args), p), {})
		}
	}, [promiseFun, pFun])

	useEffect(() => {
		const { current } = run
		if (current !== false) {
			if (Array.isArray(current)) {
				const key = current.splice(0, 1)
				exec[key](...current)
			} else {
				exec[current]()
			}
		}
	}, [])

	return { error: state.error, pending: state.pending, loading: state.loading, exec }
}

export default useLoad
