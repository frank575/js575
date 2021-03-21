/**
 * 下載 blob File
 * @param {*} blob
 * @param {string} fileName
 * @param {string} fileType
 */
export const downloadBlob = (blob, fileName, fileType) => {
	const url = window.URL.createObjectURL(new Blob([blob]))
	const link = document.createElement('a')
	link.style.display = 'none'
	link.href = url
	link.setAttribute('download', `${fileName}.${fileType}`)
	document.body.appendChild(link)
	link.click()
}
