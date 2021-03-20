// routeHistory

// doingTime
const doingTime = (doingMs = 0) => {
	const sec = 1000
	const min = sec * 60
	const hour = min * 60
	const day = hour * 24
	const days = Math.floor(doingMs / day)
	const strDays = String(days).padStart(2, '0')
	const hours = String(Math.floor((doingMs / hour) % 24)).padStart(2, '0')
	const mins = String(Math.floor((doingMs / min) % 60)).padStart(2, '0')
	const secs = String(Math.floor((doingMs / sec) % 60)).padStart(2, '0')
	if (days > 0) {
		return `${strDays} : ${hours} : ${mins} : ${secs}`
	} else {
		return `${hours} : ${mins} : ${secs}`
	}
}

// moment time START
class TimeModel {
	formatToTime: string = 'YYYY-MM-DD HH:mm:ss'
	formatToMinute: string = 'YYYY-MM-DD HH:mm'
	formatToDate: string = 'YYYY-MM-DD'

	thisWeek: () => moment.Moment[] = () => [
		moment().isoWeekday(1).startOf('day'),
		moment().endOf('day'),
	]

	lastWeek: () => moment.Moment[] = () => [
		moment().isoWeekday(-6).startOf('day'),
		moment().isoWeekday(0).endOf('day'),
	]

	thisMonth: () => moment.Moment[] = () => [
		moment().date(1).startOf('day'),
		moment().endOf('day'),
	]

	lastMonth: () => moment.Moment[] = () => [
		moment()
			.month(moment().month() - 1)
			.date(1)
			.startOf('day'),
		moment()
			.month(moment().month() - 1)
			.endOf('month'),
	]

	msTranslate(ms: number = 0) {
		const sec = 1000
		const min = sec * 60
		// const hour = min * 60
		// const day = hour * 24
		// const cDay = Math.floor(ms / day)
		// const cHour = Math.floor((ms / hour) % 24)
		const cMin = Math.floor((ms / min) % 60)
		const cSec = Math.floor((ms / sec) % 60)

		// return `${cDay}天 ${cHour}時 ${cMin}分 ${cSec}秒`
		if (cMin > 0) {
			return `${cMin}${t('簡寫:分')} ${cSec}${t('簡寫:秒')}`
		} else {
			return `${cSec}${t('簡寫:秒')}`
		}
	}
}
// moment time END
