import React, { useRef } from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'

let globalBeforeEnter
const ROUTE_INFO = {
	from: undefined,
	to: undefined,
	meta: undefined,
}
const ROUTES_META = {}

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

const recurRoutes = (prefix, routes, ParentRender, dataRoutes = []) => {
	routes.forEach(e => {
		const { path, children, meta, render: Render } = e
		e.path = prefix + e.path
		dataRoutes.push(e)
		if (meta != null) {
			delete e.meta
			ROUTES_META[e.path] = meta
		}
		if (ParentRender != null) {
			if (Render != null) {
				e.render = ({ children }) => (
					<ParentRender>
						<Render>{children}</Render>
					</ParentRender>
				)
			} else {
				e.render = ParentRender
			}
		}
		if (children != null) {
			delete e.children
			const nextPath = path === '/' ? path : path + '/'
			recurRoutes(nextPath, children, Render, dataRoutes)
		}
	})
	return dataRoutes
}

const RouteWrap = ({ RouteComp, beforeEnter }) => {
	const nextOk = useRef(true)
	const redirectPath = useRef(undefined)
	const location = useLocation()
	ROUTE_INFO.meta = ROUTES_META[location.pathname]
	ROUTE_INFO.from = ROUTE_INFO.to
	if (ROUTE_INFO.from == null) {
		ROUTE_INFO.from = location
	}
	ROUTE_INFO.to = location
	if (globalBeforeEnter != null) {
		globalBeforeEnter(
			ROUTE_INFO.to,
			ROUTE_INFO.from,
			next(nextOk, redirectPath),
		)
	}
	if (beforeEnter != null) {
		beforeEnter(ROUTE_INFO.to, ROUTE_INFO.from, next(nextOk, redirectPath))
	}
	if (redirectPath.current != null)
		return <Redirect to={redirectPath.current} />
	if (!nextOk.current) return <>route next can't empty</>
	return (
		<RouteComp
			jslLocation={{
				from: ROUTE_INFO.from,
				to: ROUTE_INFO.to,
				meta: ROUTE_INFO.meta,
			}}
		/>
	)
}

const init = (routes = []) =>
	recurRoutes('', routes).map(
		({ path, component: RouteComp, redirect, beforeEnter, render: Render }) => (
			<Route
				key={path}
				path={path}
				exact
				render={() => {
					if (redirect == null) {
						const RW = (
							<RouteWrap RouteComp={RouteComp} beforeEnter={beforeEnter} />
						)
						return Render == null ? RW : <Render>{RW}</Render>
					} else {
						return <Redirect to={redirect} />
					}
				}}
			/>
		),
	)

const beforeEnter = fun => {
	globalBeforeEnter = fun
}

const RouterGenerator = {
	init,
	beforeEnter,
}

export default RouterGenerator
