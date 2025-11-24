import React, { useEffect, useState } from "react"
import { ChevronDownIcon } from "@heroicons/react/24/outline" // Assuming you have heroicons installed

const Hero: React.FC = () => {
     const [scrollY, setScrollY] = useState(0)

     useEffect(() => {
          const handleScroll = () => setScrollY(window.scrollY)
          window.addEventListener("scroll", handleScroll)
          return () => window.removeEventListener("scroll", handleScroll)
     }, [])

     return (
          <section className="relative h-screen w-full overflow-hidden bg-stone-900">
               {/* --- Parallax Background --- */}
               <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute inset-0 w-full h-[120%] -top-[10%]" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
                         {/* Updated Image: A moody, high-res shot focusing on the glow of a candle
               in a dark setting. This feels much more intimate and "scent" focused.
            */}
                         <img
                              src="https://images.unsplash.com/photo-1602523961358-f9f03dd557db?q=80&w=2500&auto=format&fit=crop"
                              alt="Luxury candle flame in dark room"
                              className="w-full h-full object-cover opacity-90 animate-slow-zoom"
                         />
                    </div>

                    {/* Gradient Overlay: Darker at bottom for text readability, slightly warm in center */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-stone-900/20 to-stone-950/90"></div>
               </div>

               {/* --- Main Content --- */}
               <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-stone-100">
                    <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
                         {/* Badge / Tagline */}
                         <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                              <span className="inline-block border border-white/20 px-4 py-1.5 rounded-full text-[10px] md:text-xs tracking-[0.3em] uppercase font-medium bg-white/5 backdrop-blur-md">
                                   Hand Poured • Est. 2025
                              </span>
                         </div>

                         {/* Main Title - More "Candle" Focused */}
                         <h1
                              className="font-serif text-5xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight animate-fade-in-up text-transparent bg-clip-text bg-gradient-to-b from-white to-stone-400"
                              style={{ animationDelay: "0.4s" }}
                         >
                              The Art of <br />
                              <span className="italic font-light text-white">Illumination</span>
                         </h1>

                         {/* Description - Evocative Sensory Language */}
                         <p className="text-stone-300 text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                              Small-batch soy wax. Crackling wooden wicks. Scents designed to linger in your sanctuary.
                         </p>

                         {/* CTA Button */}
                         <div className="pt-8 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
                              <a
                                   href="#shop"
                                   className="group relative flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                              >
                                   {/* Shimmer Effect Layer */}
                                   <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>

                                   {/* Text */}
                                   <span className="relative z-10 text-xs font-bold uppercase tracking-[0.25em] text-white/90 group-hover:text-white transition-colors">
                                        Discover Scents
                                   </span>
                              </a>
                         </div>
                    </div>
               </div>

               {/* --- Scroll Indicator --- */}
               <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60 animate-pulse">
                    <span className="text-[10px] uppercase tracking-widest text-white/80">Explore</span>
                    <ChevronDownIcon className="w-5 h-5 text-white" />
               </div>
          </section>
     )
}

export default Hero
