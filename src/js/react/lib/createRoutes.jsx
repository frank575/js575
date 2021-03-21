import { ReactElement } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

/**
 * 路由生成器
 *
 * @typedef {Object} Route
 * @property {string} path
 * @property {ReactElement} component
 * @property {ReactElement} notFound
 * @property {*} redirect
 * @property {Route[]} children
 *
 * @param {Route[]} routes
 * @returns {{Routes: ReactElement[]}}
 */
export const createRoutes = routes => {
	const Redirects = []
	const Routes = []
	const recurMap = (
		parentChildren,
		ParentNotFound,
		{ path: parentPath, component: ParentComponent },
		prefix,
	) => {
		const Children = (
			<Switch>
				{parentChildren.map((e, i) => {
					const {
						path,
						redirect,
						children,
						component: Component,
						notFound: NotFound,
					} = e
					const concatPath = `${prefix}${path}`
					if (redirect) {
						Redirects.push(
							<Redirect
								key={concatPath}
								path={concatPath}
								to={redirect}
								exact
							/>,
						)
					}
					if (children) {
						const nextPath = concatPath === '/' ? concatPath : concatPath + '/'
						return recurMap(children, NotFound || ParentNotFound, e, nextPath)
					} else {
						const routes = [
							<Route
								key={concatPath}
								path={concatPath}
								exact
								component={Component}
							/>,
						]
						if (i === parentChildren.length - 1 && ParentNotFound) {
							routes.push(
								<Route key={`${concatPath}--404`} component={ParentNotFound} />,
							)
						}
						return routes
					}
				})}
			</Switch>
		)
		return (
			<Route key={prefix} path={prefix}>
				{props =>
					ParentComponent ? (
						<ParentComponent {...props}>{Children}</ParentComponent>
					) : (
						Children
					)
				}
			</Route>
		)
	}

	for (let i = 0; i < routes.length; i++) {
		const e = routes[i]
		const {
			redirect,
			path,
			children,
			component: Component,
			notFound: NotFound,
		} = e
		if (redirect) {
			Redirects.push(<Redirect key={path} path={path} to={redirect} exact />)
		}
		if (children) {
			const nextPath = path === '/' ? path : path + '/'
			Routes.push(recurMap(children, NotFound, e, nextPath))
		} else {
			Routes.push(<Route key={path} path={path} exact component={Component} />)
		}
	}

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
					notFound: NotFound2,
					component: Wrap2,
					children: [
						{
							path: 'a',
							component: AAA,
						},
						{
							path: 'b',
							component: AAB,
						},
					],
				},
				{
					path: 'b',
					component: AB,
				},
			],
		},
		{
			path: '/b',
			redirect: '/b/a',
			children: [
				{
					path: 'a',
					component: BA,
				}
			]
		},
	]

	前↑  前↑  前↑  前↑  前↑  前↑  前↑  前↑  前↑  前↑
	編譯結果大致如下：
	後↓  後↓  後↓  後↓  後↓  後↓  後↓  後↓  後↓  後↓

	<Redirect path={'/a'} to={'/a/a'} exact />
	<Redirect path={'/a/a'} to={'/a/a/a'} exact />
	<Redirect path={'/b'} to={'/b/a'} exact />
	<Route path={'/'} exact component={Home} />
	<Route path={'/a'}>
		{props =>
			<Wrap1 {...props}>
				<Switch>
					<Route path={'/a/a'}>
						{props =>
							<Wrap2 {...props}>
								<Switch>
									<Route path={'/a/a/a'} exact component={AAA} />
									<Route path={'/a/a/b'} exact component={AAB} />
									<Route component={NotFound2} />
								</Switch>
							</Wrap2>
						}
					</Route>
					<Route path={'/a/b'} exact component={AB} />
					<Route component={NotFound1} />
				</Switch>
			</Wrap1>
		}
	</Route>
	<Route path={'/b'}>
		<Switch>
			<Route path={'/b/a'} exact component={BA} />
		</Switch>
	</Route>
*/
