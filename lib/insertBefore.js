/**
 * 將元素(參數1)插入到元素(參數2)前
 * @param {HTMLElement} newNode
 * @param {HTMLElement} existingNode
 */
function insertBefore(newNode, existingNode) {
	const parent = existingNode.parentNode

	if (parent.firstChild === existingNode) {
		parent.prepend(newNode)
	} else {
		parent.insertBefore(newNode, existingNode)
	}
}

export default insertBefore
