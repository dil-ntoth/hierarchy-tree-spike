import { useRef, useEffect, useCallback } from 'react'
import throttle from 'lodash/throttle'

const windowScrollPositionKey: { [key in 'x' | 'y']: keyof Window } = {
  y: 'pageYOffset',
  x: 'pageXOffset'
}

const documentScrollPositionKey: { [key in 'x' | 'y']: 'scrollTop' | 'scrollLeft' } = {
  y: 'scrollTop',
  x: 'scrollLeft'
}

const getScrollPosition = (axis: 'x' | 'y') =>
  window[windowScrollPositionKey[axis]] ||
  (document.documentElement as HTMLElement)[documentScrollPositionKey[axis] as 'scrollTop' | 'scrollLeft'] ||
  document.body[documentScrollPositionKey[axis]] ||
  0

export const ReactWindowScroller = ({
  children,
  throttleTime = 10,
  isGrid = false
}) => {
  const ref = useRef<any>(null)
  const outerRef = useRef<any>(null)

  useEffect(() => {
    const handleWindowScroll = throttle(() => {
      const { offsetTop = 0, offsetLeft = 0 } = outerRef.current || {}
      const scrollTop = getScrollPosition('y') - offsetTop
      const scrollLeft = getScrollPosition('x') - offsetLeft
      if (isGrid) ref.current && ref.current.scrollTo({ scrollLeft, scrollTop })
      if (!isGrid) ref.current && ref.current.scrollTo(scrollTop)
    }, throttleTime)

    window.addEventListener('scroll', handleWindowScroll)
    return () => {
      handleWindowScroll.cancel()
      window.removeEventListener('scroll', handleWindowScroll)
    }
  }, [isGrid])

  const onScroll = useCallback(
    ({ scrollLeft, scrollTop, scrollOffset, scrollUpdateWasRequested }) => {
      if (!scrollUpdateWasRequested) return
      const top = getScrollPosition('y')
      const left = getScrollPosition('x')
      const { offsetTop = 0, offsetLeft = 0 } = outerRef.current || {}

      scrollOffset += Math.min(top, offsetTop)
      scrollTop += Math.min(top, offsetTop)
      scrollLeft += Math.min(left, offsetLeft)

      if (!isGrid && scrollOffset !== top) window.scrollTo(0, scrollOffset)
      if (isGrid && (scrollTop !== top || scrollLeft !== left)) {
        window.scrollTo(scrollLeft, scrollTop)
      }
    },
    [isGrid]
  )

  return children({
    ref,
    outerRef,
    style: {
      width: isGrid ? 'auto' : '100%',
      height: '100%',
      display: 'inline-block'
    },
    onScroll
  })
}