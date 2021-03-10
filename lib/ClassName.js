/**
 * 似 Vue 的 class obj 方式寫 className
 * @type {{create(Object.<string, boolean>, ...string): string}}
 */
const ClassName = {
	create(obj, ...classNames) {
		let className = classNames.join(' ')
		for (const k in obj) {
			if (obj[k] === true) {
				className += ' ' + k
			}
		}
		return className
	},
}

export default ClassName
