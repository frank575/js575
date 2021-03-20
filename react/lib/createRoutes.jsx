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
	const recurMap = (
		parentChildren,
		{ path: parentPath, notFound: ParentNotFound, component: ParentComponent },
		prefix,
	) => {
		const generatorSwitch = () => (
			<Switch>
				{parentChildren.map((e, i) => {
					const { redirect, children, component: Component } = e
					const path = `${prefix}${e.path}`
					if (redirect) {
						Redirects.push(
							<Redirect key={path} path={path} to={redirect} exact />,
						)
					}
					if (ParentNotFound && !e.notFound) {
						e.notFound = ParentNotFound
					}
					if (children) {
						const nextPath = path === '/' ? path : path + '/'
						return recurMap(children, e, nextPath)
					} else {
						const routes = [
							<Route key={path} path={path} exact component={Component} />,
						]
						if (i === parentChildren.length - 1 && ParentNotFound) {
							routes.push(
								<Route key={`${path}404`} component={ParentNotFound} />,
							)
						}
						return routes
					}
				})}
			</Switch>
		)

		return (
			<Route key={parentPath} path={parentPath}>
				{props =>
					ParentComponent ? (
						<ParentComponent {...props}>{generatorSwitch()}</ParentComponent>
					) : (
						generatorSwitch()
					)
				}
			</Route>
		)
	}

	routes.forEach(e => {
		const { redirect, path, children, component: Component } = e
		if (redirect) {
			Redirects.push(<Redirect key={path} path={path} to={redirect} exact />)
		}
		if (children) {
			const nextPath = path === '/' ? path : path + '/'
			Routes.push(recurMap(children, e, nextPath))
		} else {
			Routes.push(<Route key={path} path={path} exact component={Component} />)
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
						{
							path: 'b',
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
	<Route path={'/'} exact component={Home} />
	<Route path={'/a'}>
		{props =>
			<Wrap1 {...props}>
				<Switch>
					<Route path={'/a/a'}>
						{props =>
							<Wrap2 {...props}>
								<Switch>
									<Route path={'/a/a/a'} exact component={Home} />
									<Route path={'/a/a/b'} exact component={Home} />
									<Route component={NotFound2} />
								</Switch>
							</Wrap2>
						}
					</Route>
					<Route path={'/a/b'} exact component={Home} />
					<Route component={NotFound1} />
				</Switch>
			</Wrap1>
		}
	</Route>
*/
export default createRoutes
