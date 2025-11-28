import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

const Hero: React.FC = () => {
     const ref = useRef<HTMLDivElement>(null)

     // Hook into the scroll position for this specific section
     const { scrollYProgress } = useScroll({
          target: ref,
          offset: ["start start", "end start"],
     })

     // --- CINEMATIC PARALLAX TRANSFORMS ---
     // Background moves slower than foreground (0% -> 50% on scroll)
     const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
     // Background scales up slightly as you scroll down
     const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25])
     // Text fades out and moves up faster
     const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"])
     const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

     return (
          <section ref={ref} className="relative h-screen w-full overflow-hidden bg-stone-900">

               {/* --- BACKGROUND LAYER --- */}
               <motion.div
                    className="absolute inset-0 z-0 will-change-transform" // Added will-change-transform for performance
                    style={{ y: backgroundY, scale: backgroundScale }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
               >
                    <div className="absolute inset-0 bg-black/20 z-10" /> {/* Dimmer */}
                    <img
                         src="https://images.unsplash.com/photo-1602523961358-f9f03dd557db?q=80&w=2500&auto=format&fit=crop"
                         alt="Luxury candle flame in dark room"
                         className="w-full h-full object-cover opacity-90"
                         loading="eager"
                    />

                    {/* OPTIMIZATION: Removed SVG Noise filter. It causes significant lag on mobile devices. */}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-stone-950/90 z-20" />
               </motion.div>

               {/* --- AMBIENT EMBERS (Floating Particles) --- */}
               {/* OPTIMIZATION: Hidden on mobile (hidden md:block) to improve scroll performance */}
               <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden hidden md:block">
                    {[...Array(5)].map((_, i) => (
                         <motion.div
                              key={i}
                              className="absolute bg-orange-200/40 rounded-full blur-[1px]"
                              initial={{
                                   x: Math.random() * 100 + "%",
                                   y: "110%",
                                   opacity: 0,
                                   scale: 0
                              }}
                              animate={{
                                   y: "-10%",
                                   opacity: [0, 0.8, 0],
                                   scale: [0, 1.5, 0],
                                   x: `calc(${Math.random() * 100}% + ${Math.random() * 100 - 50}px)`
                              }}
                              transition={{
                                   duration: 10 + Math.random() * 10,
                                   repeat: Infinity,
                                   ease: "linear",
                                   delay: Math.random() * 2
                              }}
                              style={{
                                   width: Math.random() * 4 + 2 + "px",
                                   height: Math.random() * 4 + 2 + "px",
                              }}
                         />
                    ))}
               </div>

               {/* --- MAIN CONTENT --- */}
               <motion.div
                    className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 text-stone-100 will-change-transform"
                    style={{ y: textY, opacity: textOpacity }}
               >
                    <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">

                         {/* Badge */}
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                         >
                              <span className="inline-block border border-white/10 px-6 py-2 rounded-full text-[10px] md:text-xs tracking-[0.3em] uppercase font-medium bg-white/5 backdrop-blur-md text-white/80">
                                   Hand Poured • Est. 2025
                              </span>
                         </motion.div>

                         {/* Main Title - Staggered Reveal */}
                         <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight">
                              <span className="block overflow-hidden">
                                   <motion.span
                                        className="block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                   >
                                        The Art of
                                   </motion.span>
                              </span>
                              <span className="block overflow-hidden">
                                   <motion.span
                                        className="block italic font-light text-white/90"
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                   >
                                        Illumination
                                   </motion.span>
                              </span>
                         </h1>

                         {/* Description */}
                         <motion.p
                              className="text-stone-300/90 text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                         >
                              Small-batch soy wax. Crackling wooden wicks. Scents designed to linger in your sanctuary.
                         </motion.p>

                         {/* CTA Button */}
                         <motion.div
                              className="pt-4"
                              initial={{ opacity: 0, scale: 0.9, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                         >
                              <a
                                   href="#shop"
                                   className="group relative flex items-center gap-4 px-10 py-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full overflow-hidden transition-all duration-700 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                              >
                                   {/* Shimmer */}
                                   <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>

                                   <span className="relative z-10 text-xs font-bold uppercase tracking-[0.25em] text-white group-hover:text-white transition-colors">
                                        Discover Scents
                                   </span>
                              </a>
                         </motion.div>
                    </div>
               </motion.div>

               {/* --- SCROLL INDICATOR --- */}
               <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 hidden md:flex"
                    style={{ opacity: textOpacity }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1.0, duration: 1 }}
               >
                    <span className="text-[10px] uppercase tracking-widest text-white/60">Explore</span>
                    <motion.div
                         animate={{ y: [0, 8, 0] }}
                         transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                         <ChevronDownIcon className="w-4 h-4 text-white/60" />
                    </motion.div>
               </motion.div>
          </section>
     )
}

export default Hero
