import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

/**
 * 路由生成器
 *
 * @typedef {Object} Route
 * @property {string} path
 * @property {React.ReactNode} component
 * @property {React.ReactNode} notFound
 * @property {*} redirect
 * @property {Route[]} children
 *
 * @param {Route[]} routes
 * @returns {{Routes: React.ReactNode[]}}
 */
const createRoutes = routes => {
	const Redirects = []
	const Routes = []
	const recurMap = (children, parent, prefix) => {
		const generatorSwitch = () => (
			<Switch>
				{children.map(e => {
					e.path = `${prefix}${e.path}`
					if (e.redirect) {
						Redirects.push(
							<Redirect key={e.path} path={e.path} to={e.redirect} exact />,
						)
					}
					if (parent.notFound && !e.notFound) {
						e.notFound = parent.notFound
					}
					if (e.children) {
						const nextPath = e.path === '/' ? e.path : e.path + '/'
						return recurMap(e.children, e, nextPath)
					} else {
						const routes = [
							<Route key={e.path} path={e.path} exact>
								<e.component />
							</Route>,
						]
						if (parent.notFound) {
							routes.push(
								<Route key={e.path}>
									<parent.notFound />
								</Route>,
							)
						}
						return routes
					}
				})}
			</Switch>
		)
		return (
			<Route key={parent.path} path={parent.path}>
				{parent.component ? (
					<parent.component>{generatorSwitch()}</parent.component>
				) : (
					generatorSwitch()
				)}
			</Route>
		)
	}

	routes.forEach(e => {
		if (e.redirect) {
			Redirects.push(
				<Redirect key={e.path} path={e.path} to={e.redirect} exact />,
			)
		}
		if (e.children) {
			const nextPath = e.path === '/' ? e.path : e.path + '/'
			Routes.push(recurMap(e.children, e, nextPath))
		} else {
			Routes.push(
				<Route key={e.path} path={e.path} exact>
					<e.component />
				</Route>,
			)
		}
	})

	return {
		Routes: Redirects.concat(Routes),
	}
}
/*
	[
		{
			path: '/',
			component: Home,
		},
		{
			path: '/a',
			notFound: NotFound1,
			redirect: '/a/a',
			component: Wrap1,
			children: [
				{
					path: 'a',
					redirect: '/a/a/a',
					notFound: NotFound12,
					component: Wrap2,
					children: [
						{
							path: 'a',
							component: Home,
						},
					],
				},
				{
					path: 'b',
					component: Home,
				},
			],
		},
	]

	前↑  前↑  前↑  前↑  前↑  前↑  前↑  前↑  前↑  前↑
	編譯結果大致如下：
	後↓  後↓  後↓  後↓  後↓  後↓  後↓  後↓  後↓  後↓

	<Redirect path={'/a'} to={'/a/a'} exact />
	<Redirect path={'/a/a'} to={'/a/a/a'} exact />
	<Route path={'/'} exact>
		<Home />
	</Route>
	<Route path={'/a'}>
		<Wrap1>
			<Switch>
				<Route path={'/a/a'}>
					<Wrap2>
						<Switch>
							<Route path={'/a/a/a'} exact>
								<Home />
							</Route>
							<Route>
								<NotFound2 />
							</Route>
						</Switch>
					</Wrap2>
				</Route>
				<Route path={'/a/b'} exact>
					<Home />
				</Route>
				<Route>
					<NotFound1 />
				</Route>
			</Switch>
		</Wrap1>
	</Route>
*/
export default createRoutes
