import { createContext, useContext } from 'react'

/**
 * 創建供給者
 * @template T
 * @param {function(): T} providerService
 * @return {{inject: function(): T, Provider: function({children: *}): *}}
 */
export const useProvider = providerService => {
	const Context = createContext(null)
	const Provider = ({ children }) => <Context.Provider value={providerService()}>{children}</Context.Provider>
	const inject = () => useContext(Context)

	return {
		Provider,
		inject,
	}
}
