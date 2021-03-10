/**
 * 將元素(參數1)插入到元素(參數2)後
 * @param {HTMLElement} newNode
 * @param {HTMLElement} existingNode
 */
function insertAfter(newNode, existingNode) {
	const parent = existingNode.parentNode

	if (parent.lastChild === existingNode) {
		parent.append(newNode)
	} else {
		parent.insertBefore(newNode, existingNode.nextSibling)
	}
}

export default insertAfter
