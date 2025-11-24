import React, { useEffect, useState } from "react"

const Features: React.FC = () => {
     const [scrollY, setScrollY] = useState(0)

     useEffect(() => {
          const handleScroll = () => setScrollY(window.scrollY)
          window.addEventListener("scroll", handleScroll)
          return () => window.removeEventListener("scroll", handleScroll)
     }, [])

     return (
          <section id="about" className="bg-white overflow-hidden">
               {/* Section 1: Wax */}
               <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
                    <div className="relative h-[60vh] lg:h-full overflow-hidden group">
                         {/* Parallax Image Wrapper */}
                         <div className="absolute inset-0 w-full h-[120%] -top-[10%]" style={{ transform: `translateY(${(scrollY - 500) * 0.1}px)` }}>
                              <img
                                   src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1200"
                                   alt="Pouring wax"
                                   className="w-full h-full object-cover"
                              />
                         </div>
                    </div>
                    <div className="flex items-center justify-center p-12 lg:p-24 bg-stone-50 reveal z-10 relative">
                         <div className="max-w-lg">
                              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">The Foundation</span>
                              <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">100% Natural Soy Wax</h2>
                              <p className="text-stone-600 leading-relaxed mb-8 text-lg font-light">
                                   We believe in purity. Our candles are crafted using exclusively renewable soy wax, ensuring a clean, slow burn that is free from toxins and
                                   paraffin. Every pour is a testament to patience and precision.
                              </p>
                              <div className="grid grid-cols-2 gap-8 border-t border-stone-200 pt-8">
                                   <div>
                                        <h4 className="font-serif text-2xl text-stone-900 mb-2">50h+</h4>
                                        <p className="text-xs uppercase tracking-widest text-stone-500">Burn Time</p>
                                   </div>
                                   <div>
                                        <h4 className="font-serif text-2xl text-stone-900 mb-2">0%</h4>
                                        <p className="text-xs uppercase tracking-widest text-stone-500">Paraffin</p>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Section 2: Scents */}
               <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
                    <div className="flex items-center justify-center p-12 lg:p-24 bg-stone-900 text-white order-2 lg:order-1 reveal z-10 relative">
                         <div className="max-w-lg">
                              <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">The Essence</span>
                              <h2 className="font-serif text-4xl md:text-5xl mb-6">Curated Botanicals</h2>
                              <p className="text-stone-300 leading-relaxed mb-8 text-lg font-light">
                                   Our scents are stories. We collaborate with master perfumers to blend phthalate-free essential oils that evoke memories of nature's most serene
                                   landscapes. From the coast of Brittany to the forests of Vermont.
                              </p>
                              <a
                                   href="#shop"
                                   className="inline-block border-b border-white pb-1 text-sm uppercase tracking-widest hover:text-accent hover:border-accent transition-colors"
                              >
                                   Explore Scents
                              </a>
                         </div>
                    </div>
                    <div className="relative h-[60vh] lg:h-full overflow-hidden group order-1 lg:order-2">
                         {/* Parallax Image Wrapper */}
                         <div className="absolute inset-0 w-full h-[120%] -top-[10%]" style={{ transform: `translateY(${(scrollY - 1200) * 0.1}px)` }}>
                              <img
                                   src="https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&q=80&w=1200"
                                   alt="Botanical ingredients"
                                   className="w-full h-full object-cover"
                              />
                         </div>
                    </div>
               </div>
          </section>
     )
}

export default Features
