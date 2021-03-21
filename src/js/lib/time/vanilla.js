const SECOND_MS = 1000
const MINUTE_MS = SECOND_MS * 60
const HOUR_MS = MINUTE_MS * 60
const DAY_MS = HOUR_MS * 24

const format = (() => {
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	]
	const abridgeDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]
	const abridgeMonths = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	]

	const padStartZero = number => {
		if (number < 10) {
			return `0${number}`
		}
		return number
	}

	const _format = (date, ft) => {
		const replacer = (match, $y, $M, $d, $Hh, $m, $s, $t) => {
			if ($y != null) {
				const year = date.getFullYear()
				const yearStr = String(year)
				const lastYearStr = yearStr.substr(-2)
				switch (match) {
					// 2020
					case 'yyyy':
						return yearStr
					// 2002: 02, 2020: 20
					case 'yy':
						return lastYearStr
					// 2002: 2, 2020: 20
					case 'y':
						return Number(lastYearStr) > 9 ? lastYearStr : yearStr.substr(-1)
				}
			} else if ($M != null) {
				const month = date.getMonth()
				switch (match) {
					// December
					case 'MMMM':
						return months[month]
					// Dec
					case 'MMM':
						return abridgeMonths[month]
					// 12: 12, 6: 06
					case 'MM':
						return padStartZero(month + 1)
					// 12: 12, 6: 6
					case 'M':
						return String(month + 1)
				}
			} else if ($d != null) {
				const day = date.getDay()
				const getDate = date.getDate()
				switch (match) {
					// Sunday
					case 'dddd':
						return days[day]
					// Sun
					case 'ddd':
						return abridgeDays[day]
					// 7: 07
					case 'dd':
						return padStartZero(getDate)
					// 7: 7
					case 'd':
						return String(getDate)
				}
			} else if ($Hh != null) {
				const hour = date.getHours()
				const minusHour = hour - 12
				const computedHour = minusHour > 0 ? minusHour : hour
				switch (match) {
					// 20: 20, 8: 08
					case 'HH':
						return padStartZero(hour)
					// 20: 20, 8: 8
					case 'H':
						return String(hour)
					// 20: 08, 8: 08
					case 'hh':
						return padStartZero(computedHour)
					// 20: 8, 8: 8
					case 'h':
						return String(computedHour)
				}
			} else if ($m != null) {
				const minute = date.getMinutes()
				switch (match) {
					// 20: 20, 8: 08
					case 'mm':
						return padStartZero(minute)
					// 20: 20, 8: 8
					case 'm':
						return String(minute)
				}
			} else if ($s != null) {
				const second = date.getSeconds()
				switch (match) {
					// 20: 20, 8: 08
					case 'ss':
						return padStartZero(second)
					// 20: 20, 8: 8
					case 's':
						return String(second)
				}
			} else if ($t != null) {
				const hour = date.getHours()
				const cond = hour > 12
				const tt = cond ? 'PM' : 'AM'
				const t = cond ? 'P' : 'A'
				switch (match) {
					// 20: PM, 8: AM
					case 'tt':
						return tt
					// 20: P, 8: A
					case 't':
						return t
				}
			}
			return match
		}

		if (typeof date === 'string') {
			date = new Date(date)
		}
		return ft.replace(
			/(yyyy|yy|y)|(MMMM|MMM|MM|M)|(dddd|ddd|dd|d)|(HH|H|hh|h)|(mm|m)|(ss|s)|(tt|t)/g,
			replacer,
		)
	}

	/**
	 * 格式化日期
	 * @param date [Date|DateString] = new Date()
	 * @param type [string] = yyyy-MM-dd 採時間轉換規範定義
	 */
	return (date = new Date(), ft = 'yyyy-MM-dd') => _format(date, ft)
})()

/**
 * 倒計時格式化
 * @param {number} ms 倒數的毫秒數
 * @param {{ to?: 'day' | 'hour' | 'minute' | 'second', mode?: 'all' | 'last', text?: { end?: string, day?: string, hour?: string, minute?: string, second?: string } }} options
 * @returns {string}
 */
const countdown = (ms = 0, options = {}) => {
	const to = options.to || 'day' // 'day' | 'hour' | 'minute' | 'second'
	const mode = options.mode || 'all' // 'all' | 'last'
	const texts = {
		end: options.text?.end,
		day: options.text?.day || '天 ',
		hour: options.text?.hour || '時 ',
		minute: options.text?.minute || '分 ',
		second: options.text?.second || '秒',
	}
	const s = ms / SECOND_MS
	const getResult = times => {
		if (mode === 'all') {
			let result = ''
			for (const k in times) {
				result += `${times[k]}${texts[k]}`
			}
			return result
		} else {
			let pass = false
			let result = ''
			for (const k in times) {
				const t = times[k]
				if (pass) {
					result += `${t}${texts[k]}`
					continue
				}
				if (t > 0) {
					pass = true
					result += `${t}${texts[k]}`
					continue
				}
				if (t === 0 && k === 'second') {
					result = texts.end || `0${texts.second}`
				}
			}
			return result
		}
	}
	switch (to) {
		case 'second': {
			const second = ~~s
			return getResult({ second })
		}
		case 'minute': {
			const minute = ~~(ms / MINUTE_MS)
			const second = ~~(s % 60)
			return getResult({ minute, second })
		}
		case 'hour': {
			const hour = ~~(ms / HOUR_MS)
			const minute = ~~((ms / MINUTE_MS) % 60)
			const second = ~~(s % 60)
			return getResult({ hour, minute, second })
		}
		case 'day':
		default: {
			const day = ~~(ms / DAY_MS)
			const hour = ~~((ms / HOUR_MS) % 24)
			const minute = ~~((ms / MINUTE_MS) % 60)
			const second = ~~(s % 60)
			return getResult({ day, hour, minute, second })
		}
	}
}

const createStartDate = date => {
	const _date = date ? new Date(date) : new Date()
	_date.setHours(0)
	_date.setMinutes(0)
	_date.setSeconds(0)
	return _date
}

const createEndDate = date => {
	const _date = date ? new Date(date) : new Date()
	_date.setHours(23)
	_date.setMinutes(59)
	_date.setSeconds(59)
	return _date
}

const recentDateResult = (increaseTime, ft, start) => {
	const date = new Date(Date.now() + increaseTime)
	const result = start ? createStartDate(date) : createEndDate(date)
	return !ft ? result : format(result, ft)
}

const weekResult = (increaseDay = 0, ft) => {
	const date = new Date()
	const time = date.getTime()
	const currentDay = date.getDay()
	const minusTime = DAY_MS * (currentDay - 1 + increaseDay)
	date.setTime(time - minusTime)
	const start = createStartDate(date)
	date.setTime(time - minusTime + DAY_MS * 6)
	const end = createEndDate(date)
	const result = [start, end]
	return !ft ? result : result.map(e => format(e, ft))
}

const PER_MONTH_DAY_NUM = {
	0: 31,
	// 1 用算的
	2: 31,
	3: 30,
	4: 31,
	5: 30,
	6: 31,
	7: 31,
	8: 30,
	9: 31,
	10: 30,
	11: 31,
}
const monthResult = (last, ft) => {
	const start = new Date()
	let year = start.getFullYear()
	let month = start.getMonth()
	if (last) {
		if (month === 0) {
			month = 11
			year--
		} else {
			month--
		}
	}
	start.setFullYear(year)
	start.setMonth(month)
	start.setDate(1)
	start.setHours(0)
	start.setMinutes(0)
	start.setSeconds(0)
	let date = PER_MONTH_DAY_NUM[month]
	if (date == null) {
		if ((year % 4 === 0 && !(year % 100 === 0)) || year % 400 === 0) {
			date = 29
		} else {
			date = 28
		}
	}
	const result = [start, new Date(`${year}-${month + 1}-${date} 23:59:59`)]
	return !ft ? result : result.map(e => format(e, ft))
}

/**
 * 取得今天日期
 * @param {string} ft 格式化
 * @param {boolean} start [start=false] true 為 00:00:00, false 為 23:59:59
 * @returns {Date|string}
 */
const today = (ft, start = false) => {
	const result = start ? createStartDate() : createEndDate()
	return !ft ? result : format(result, ft)
}

/**
 * 取得明天日期
 * @param {string} ft 格式化
 * @param {boolean} start [start=false] true 為 00:00:00, false 為 23:59:59
 * @returns {Date|string}
 */
const tomorrow = (ft, start = false) => recentDateResult(DAY_MS, ft, start)

/**
 * 取得後天日期
 * @param {string} ft 格式化
 * @param {boolean} start [start=false] true 為 00:00:00, false 為 23:59:59
 * @returns {Date|string}
 */
const acquired = (ft, start = false) => recentDateResult(DAY_MS * 2, ft, start)

/**
 * 取得昨天日期
 * @param {string} ft 格式化
 * @param {boolean} start [start=false] true 為 00:00:00, false 為 23:59:59
 * @returns {Date|string}
 */
const yesterday = (ft, start = false) => recentDateResult(-DAY_MS, ft, start)

/**
 * 取得前天日期
 * @param {string} ft 格式化
 * @param {boolean} start [start=false] true 為 00:00:00, false 為 23:59:59
 * @returns {Date|string}
 */
const theDayBeforeYesterday = (ft, start = false) =>
	recentDateResult(-DAY_MS * 2, ft, start)

/**
 * 取得近七天(今天到本周星期日)
 * @param {string} ft 格式化
 * @returns {Date[]|string[]}
 */
const nearlySevenDays = ft => {
	const date = new Date()
	const time = date.getTime()
	const minusDay = 7 - date.getDay()
	const start = createStartDate(date)
	date.setTime(time + DAY_MS * minusDay)
	const end = createEndDate(date)
	const result = [start, end]
	return !ft ? result : result.map(e => format(e, ft))
}

/**
 * 取得本周日期(星期一到日)
 * @param {string} ft 格式化
 * @returns {Date[]|string[]}
 */
const thisWeek = ft => weekResult(0, ft)

/**
 * 取得上周日期(星期一到日)
 * @param {string} ft 格式化
 * @returns {Date[]|string[]}
 */
const lastWeek = ft => weekResult(7, ft)

/**
 * 取得本月日期(1 - 28 | 29 | 30 | 31)
 * @param {string} ft 格式化
 * @returns {Date[]|string[]}
 */
const thisMonth = ft => monthResult(false, ft)

/**
 * 取得上個月日期(1 - 28 | 29 | 30 | 31)
 * @param {string} ft 格式化
 * @returns {Date[]|string[]}
 */
const lastMonth = ft => monthResult(true, ft)

export const vtime = {
	format,
	countdown,
	today,
	tomorrow,
	acquired,
	yesterday,
	theDayBeforeYesterday,
	thisWeek,
	lastWeek,
	nearlySevenDays,
	thisMonth,
	lastMonth,
}
