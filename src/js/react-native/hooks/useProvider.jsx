import React from 'react'
import { createContext, useContextSelector } from 'use-context-selector'

/**
 * 創建供給者
 * @template T, S
 * @param {function(): S} providerService
 * @return {{inject: (function(callback: function(state: S): T): T | string), Provider: function({children: *}): *}}
 */
export const useProvider = providerService => {
	const Context = createContext(null)
	const Provider = ({ children }) => (
		<Context.Provider value={providerService()}>{children}</Context.Provider>
	)
	const inject = (getter = state => undefined) =>
		useContextSelector(
			Context,
			typeof getter === 'string' ? state => state[getter] : getter,
		)

	return {
		Provider,
		inject,
	}
}
