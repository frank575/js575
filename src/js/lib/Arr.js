/**
 * 更新第 i 筆資料
 * @param {number} index
 * @param {*} value
 * @returns {function(*[]): *[]}
 */
const update = (index, value) => {
	return arr => [...arr.slice(0, index), value, ...arr.slice(index + 1)]
}

/**
 * 新增資料到最後(不限筆數)
 * @param {...*} value
 * @returns {function(*[]): *[]}
 */
const push = (...value) => {
	return arr => [...arr, ...value]
}

/**
 * 新增資料到最前(不限筆數)
 * @param {...*} value
 * @returns {function(*[]): *[]}
 */
const unshift = (...value) => {
	return arr => [...value, ...arr]
}

/**
 * 移除最末筆資料
 * @returns {function(*[]): *[]}
 */
const pop = () => {
	return arr => arr.slice(0, -1)
}

/**
 * 移除第一筆資料
 * @returns {function(*[]): *[]}
 */
const shift = () => {
	return arr => arr.slice(1)
}

/**
 * 取出地 i 筆資料並插入
 * @param {number} from
 * @param {number} to
 * @param {...*} value
 * @returns {function(*[]): *[]}
 */
const splice = (from, to, ...value) => {
	return arr => [...arr.slice(0, from), ...value, ...arr.slice(from + to)]
}

export const Arr = {
	update,
	unshift,
	push,
	pop,
	shift,
	splice,
}
