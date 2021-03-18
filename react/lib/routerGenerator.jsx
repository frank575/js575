import React, { useRef } from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'

const routerGenerator = (() => {
	let preRoute, curRoute, globalBeforeEnter
	const routesMeta = {}

	const next = (okRef, pathRef) => {
		okRef.current = false
		return path => {
			if (path != null) {
				if (pathRef.current == null) {
					pathRef.current = path
				}
			} else {
				okRef.current = true
			}
		}
	}

	const recurRoutes = (prefix, routes, $render, dataRoutes = []) => {
		routes.forEach(e => {
			const { path, children, meta } = e
			e.path = prefix + e.path
			dataRoutes.push(e)
			if (meta != null) {
				delete e.meta
				routesMeta[e.path] = meta
			}
			if (children != null) {
				delete e.children
				const nextPath = path === '/' ? path : path + '/'
				recurRoutes(nextPath, children, $render, dataRoutes)
			}
		})
		return dataRoutes
	}

	const RouteWrap = ({ RouteComp, jsl }) => {
		const nextOk = useRef(true)
		const redirectPath = useRef(undefined)
		const location = useLocation()
		const { beforeEnter, path } = jsl
		const newLocation = { ...location, meta: routesMeta[path] }
		preRoute = curRoute
		if (preRoute == null) {
			preRoute = newLocation
		}
		curRoute = newLocation
		if (globalBeforeEnter != null) {
			globalBeforeEnter(curRoute, preRoute, next(nextOk, redirectPath))
		}
		if (beforeEnter != null) {
			beforeEnter(curRoute, preRoute, next(nextOk, redirectPath))
		}

		if (redirectPath.current != null)
			return <Redirect to={redirectPath.current} />
		if (!nextOk.current) return <>route next can't empty</>
		return (
			<RouteComp
				jslData={{
					from: preRoute,
					to: curRoute,
					meta: newLocation.meta,
				}}
			/>
		)
	}

	return (routes = []) => {
		const _routes = recurRoutes('', routes)
		return {
			beforeEnter: fun => {
				globalBeforeEnter = fun
			},
			create: () =>
				_routes.map(
					({
						path,
						component: RouteComp,
						redirect,
						beforeEnter,
						$render: Render,
					}) => (
						<Route
							key={path}
							path={path}
							exact
							render={() => {
								if (redirect == null) {
									const RW = (
										<RouteWrap
											RouteComp={RouteComp}
											jsl={{ beforeEnter, path }}
										/>
									)
									return Render == null ? RW : <Render>{RW}</Render>
								} else {
									return <Redirect to={redirect} />
								}
							}}
						/>
					),
				),
		}
	}
})()

const renderRoutes = (render, routes) => {
	return routes
}

export default routerGenerator
