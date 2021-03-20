import _React, { createContext, useContext } from 'react'

let React = React
if (process.env.NODE_ENV === 'production') {
	React = _React
}

/**
 * 創建供給者
 * @template T
 * @param {function(): T} providerService
 * @return {{inject: function(): T, Provider: function({children: *}): *}}
 */
const useProvider = providerService => {
	const Context = createContext(null)

	const Provider = ({ children }) => (
		<Context.Provider value={providerService()}>{children}</Context.Provider>
	)

	const inject = () => useContext(Context)

	return {
		Provider,
		inject,
	}
}

export default useProvider
