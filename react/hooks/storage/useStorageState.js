import { useEffect, useState, Dispatch } from 'react'

/**
 * 自動存到內存的 useState
 * @template T
 * @type {function(symbol: Symbol, initialValue: T): [T, Dispatch<T>]}
 */
const useStorageState = (() => {
	const CACHE = {}
	return (symbol, initialValue) => {
		const [state, setState] = useState(CACHE[symbol] ?? initialValue)
		useEffect(() => {
			CACHE[symbol] = state
		}, [state])
		return [state, setState]
	}
})()

export default useStorageState
