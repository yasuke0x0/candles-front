import React, { useEffect, useRef, useState } from "react"

const Cursor: React.FC = () => {
     const cursorRef = useRef<HTMLDivElement>(null)
     const [isHovering, setIsHovering] = useState(false)
     const [isVisible, setIsVisible] = useState(false)

     useEffect(() => {
          const updateCursor = (e: MouseEvent) => {
               if (!cursorRef.current) return

               // 1. Instant movement (Direct DOM update for best performance)
               cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`

               // 2. Show cursor on first move
               if (!isVisible) setIsVisible(true)

               // 3. Simple hover detection
               const target = e.target as HTMLElement
               const isClickable = target.closest("a, button, input, .cursor-pointer")
               setIsHovering(!!isClickable)
          }

          window.addEventListener("mousemove", updateCursor)

          return () => window.removeEventListener("mousemove", updateCursor)
     }, [isVisible])

     // Hide on touch devices
     if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
          return null
     }

     return (
          <div
               ref={cursorRef}
               className={`
        fixed top-0 left-0 pointer-events-none z-[9999]
        flex items-center justify-center
        -translate-x-1/2 -translate-y-1/2
        transition-opacity duration-200
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
               // Note: inline styles for "top" and "left" are not needed because we use transform in JS
               style={{ top: 0, left: 0 }}
          >
               {/* The Candle Flame */}
               <div
                    className={`
          rounded-full bg-orange-400
          shadow-[0_0_15px_3px_rgba(251,146,60,0.6)]
          transition-all duration-200 ease-in-out
          ${isHovering ? "w-6 h-6 opacity-60 bg-orange-300" : "w-3 h-3 opacity-90"}
        `}
               />
          </div>
     )
}

export default Cursor
