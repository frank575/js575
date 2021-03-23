import { createContext } from 'react'
import { useContextSelector } from 'use-context-selector'

/**
 * @template T
 * @typedef {T} ProviderService
 */
/**
 * 創建供給者
 * @template T
 * @param {function(): ProviderService} providerService
 * @return {{inject: function(callback: function(state: ProviderService): T): T, Provider: function({children: *}): *}}
 */
export const useProvider = providerService => {
	const Context = createContext(null)
	const Provider = ({ children }) => (
		<Context.Provider value={providerService()}>{children}</Context.Provider>
	)
	const inject = (callback = state => undefined) =>
		useContextSelector(Context, callback)

	return {
		Provider,
		inject,
	}
}
