import React from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'

let globalBeforeEnter
const ROUTE_INFO = {
	from: undefined,
	to: undefined,
	meta: undefined,
}
const ROUTES_META = {}

const next = state => {
	state.ok = false
	return path => {
		if (path != null) {
			if (state.redirectTo == null) {
				state.redirectTo = path
			}
		} else {
			state.ok = true
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
	const condState = {
		ok: true,
		redirectTo: undefined,
	}
	const location = useLocation()
	ROUTE_INFO.meta = ROUTES_META[location.pathname]
	ROUTE_INFO.to = location
	if (ROUTE_INFO.from == null) {
		ROUTE_INFO.from = location
	}
	if (globalBeforeEnter != null) {
		globalBeforeEnter(ROUTE_INFO.to, ROUTE_INFO.from, next(condState))
	}
	if (beforeEnter != null) {
		beforeEnter(ROUTE_INFO.to, ROUTE_INFO.from, next(condState))
	}
	if (condState.redirectTo != null)
		return <Redirect to={condState.redirectTo} />
	if (!condState.ok) return <>route next can't empty</>
	return <RouteComp jslLocation={ROUTE_INFO} />
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
						ROUTE_INFO.from = ROUTE_INFO.to
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
