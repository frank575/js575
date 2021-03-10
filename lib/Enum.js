/**
 * 模擬 ts 的 enum
 * @template T
 * @param {T} obj
 * @return {T & {t(val: any): string, key(val: any): string}}
 */
function Enum(obj) {
	const translation = {}
	const reverseEnum = {}
	const $enum = {}
	const t = val => translation[val]
	const key = val => reverseEnum[val]

	function addEnum(key, val) {
		if (Array.isArray(val)) {
			const [v, t] = val
			translation[v] = t
			$enum[key] = v
			reverseEnum[v] = key
		} else {
			$enum[key] = val
			reverseEnum[val] = key
		}
	}

	for (const k in obj) {
		addEnum(k, obj[k])
	}

	return { ...$enum, t, key }
}

export default Enum
