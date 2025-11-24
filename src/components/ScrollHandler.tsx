// src/components/ScrollHandler.tsx
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const ScrollHandler = () => {
     const { pathname, hash } = useLocation()

     // 1. Scroll to Top on Route Change
     useEffect(() => {
          window.scrollTo(0, 0)
     }, [pathname])

     // 2. Scroll to Hash on Hash Change
     useEffect(() => {
          if (hash) {
               const element = document.getElementById(hash.replace("#", ""))
               if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
               }
          }
     }, [hash])

     return null
}

export default ScrollHandler
