import { useCallback, useState } from 'react'

/**
 * loading 鉤子
 * @returns {[{loading: boolean | undefined} & Object.<string, boolean | undefined>, (function(asyncFun: Promise<void>, keys?: string[]): Promise<void>)]}
 */
export const useLoad = () => {
	const [loading, setLoading] = useState({ loading: false })
	const bindLoading = useCallback(
		async (asyncFun, keys = []) => {
			const isKeys = keys.length
			const loaders = isKeys
				? keys.reduce((p, k) => ((p[k] = true), p), {})
				: { loading: true }
			setLoading(loaders)
			await asyncFun()
			setLoading({ loading: false })
		},
		[setLoading],
	)
	return [loading, bindLoading]
}
