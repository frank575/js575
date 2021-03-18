import React, { useMemo, useRef } from 'react'
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

	const recurRoutes = (prefix, routes, dataRoutes = []) => {
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
				recurRoutes(nextPath, children, dataRoutes)
			}
		})
		return dataRoutes
	}

	const RouteWrap = ({ RouteComp, jsl }) => {
		const nextOk = useRef(true)
		const redirectPath = useRef(undefined)
		const jslData = useRef({})
		const location = useLocation()

		useMemo(() => {
			const { beforeEnter, path, group } = jsl
			const newLocation = { ...location, meta: routesMeta[path], group }
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
			jslData.current = {
				from: preRoute,
				to: curRoute,
				meta: newLocation.meta,
				group,
			}
		}, [])

		if (redirectPath.current != null)
			return <Redirect to={redirectPath.current} />
		if (!nextOk.current) return <>route next can't empty</>
		return <RouteComp jslData={jslData.current} />
	}

	const mapRoutes = (routes, groupKey) =>
		routes[
			groupKey
		].map(({ path, component: RouteComp, redirect, beforeEnter }) => (
			<Route
				key={path}
				path={path}
				exact
				render={() =>
					redirect == null ? (
						<RouteWrap
							RouteComp={RouteComp}
							jsl={{ beforeEnter, path, group: groupKey }}
						/>
					) : (
						<Redirect to={redirect} />
					)
				}
			/>
		))

	return (routes = []) => {
		const groupRoutes = {}
		if (Array.isArray(routes)) {
			groupRoutes.$$common = recurRoutes('', routes)
		} else {
			for (const k in routes) {
				groupRoutes[k] = recurRoutes('', routes[k])
			}
		}
		return {
			beforeEnter: fun => {
				globalBeforeEnter = fun
			},
			create: groupKey => {
				if (groupKey == null) {
					const routes = []
					for (const k in groupRoutes) {
						routes.push(mapRoutes(groupRoutes, k))
					}
					return routes
				} else {
					return mapRoutes(groupRoutes, groupKey)
				}
			},
		}
	}
})()

export default routerGenerator
