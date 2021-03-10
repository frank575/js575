import { useState, Dispatch } from 'react'
import { getStorageItem, useUpdateStorage } from './util'

/**
 * 自動存到 localStorage 的 useState
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @returns {[T, Dispatch<T>]}
 */
function useLocalStorageState(key, initialValue) {
	const [state, setState] = useState(
		getStorageItem(key, initialValue, localStorage),
	)
	useUpdateStorage(key, state, localStorage)
	return [state, setState]
}

export default useLocalStorageState
