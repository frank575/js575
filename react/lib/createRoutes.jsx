import React from 'react'
import { Redirect, Route } from 'react-router-dom'

/**
 * 初始化路由
 *
 * @typedef {Object} Route
 * @property {string} path
 * @property {React.ReactNode} component
 * @property {*} redirect
 * @property {Route[]} children
 *
 * @param {Route[]} routes
 * @returns {{Routes: React.ReactNode[]}}
 */
const createRoutes = routes => {
	const recurGenerator = (
		routes,
		ParentComponent,
		prefix = '',
		redirectComps = [],
		routeComps = [],
	) => {
		routes.forEach(e => {
			e.path = prefix + e.path
			if (e.redirect != null) {
				redirectComps.push(
					<Redirect key={e.path} path={e.path} to={e.redirect} exact />,
				)
			}
			if (ParentComponent != null) {
				if (e.component != null) {
					const Component = e.component
					e.component = props => (
						<ParentComponent {...props}>
							<Component {...props}>{props.children}</Component>
						</ParentComponent>
					)
				} else {
					e.component = ParentComponent
				}
			}
			if (e.children != null) {
				const nextPath = e.path === '/' ? e.path : e.path + '/'
				recurGenerator(
					e.children,
					e.component,
					nextPath,
					redirectComps,
					routeComps,
				)
			} else {
				if (e.component) {
					routeComps.push(
						<Route key={e.path} path={e.path} exact component={e.component} />,
					)
				}
			}
		})
		return redirectComps.concat(routeComps)
	}

	return {
		Routes: recurGenerator(routes),
	}
}

/*
	編譯結果
	<Redirect path={'/dash'} to={'/dash/example'} exact />
	<Redirect path={'/dash/example'} to={'/dash/example/example'} exact />
	<Route path={'/dash/example/example'}>
		<div>123</div>
		<Example />
	</Route>
	<Route path={'/dash/example2'}>
		<div>123</div>
		<div>456</div>
		<Example />
	</Route>
 */
export default createRoutes
