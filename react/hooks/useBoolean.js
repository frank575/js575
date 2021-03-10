import useMethods from './useMethods'

const methods = {
	setTrue: () => true,
	setFalse: () => false,
	toggle: state => !state,
	setState: (_, e) => e,
}

/**
 * 布林鉤子
 * @param {boolean} initialValue
 * @returns {[boolean, {setTrue: function(): boolean, setFalse: function(): boolean, toggle: function(): boolean, setState: function(state: boolean): boolean}]}
 */
function useBoolean(initialValue = false) {
	const [bool, { setTrue, setFalse, toggle, setState }] = useMethods(
		initialValue,
		methods,
	)
	return [bool, { setTrue, setFalse, toggle, setState }]
}

export default useBoolean
