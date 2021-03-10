/**
 * 檢測是否是 Mobile
 * @returns {boolean}
 */
function checkMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent,
	)
}

export default checkMobile
