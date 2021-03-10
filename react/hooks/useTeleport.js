import ReactDOM from 'react-dom'
import { useEffect, useMemo, useRef } from 'react'

const TELEPORT_ID = 'tp575'

function createTeleportElement() {
  const teleport = document.createElement('div')
  teleport.id = TELEPORT_ID
  document.body.append(teleport)
  return teleport
}

/**
 * 傳送元素到 body el (default #tp575)
 * @template T
 * @param {T} children
 * @param {HTMLElement | undefined} el
 * @return {T}
 */
function useTeleport(children, el) {
  /** @type {{ current: HTMLElement }} */
  const teleportRef = useRef(null)

  useMemo(() => {
    /** @type {HTMLElement} */
    const teleport = el ? el : document.querySelector(`#${TELEPORT_ID}`)
    if (teleport != null) {
      teleportRef.current = teleport
    } else {
      teleportRef.current = createTeleportElement()
    }
  }, [])

  useEffect(() => {
    return () => {
      teleportRef.current.remove()
    }
  }, [])

  return ReactDOM.createPortal(children, teleportRef.current)
}

export default useTeleport
