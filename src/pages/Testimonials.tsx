import React from "react"
import { Quote, Star } from "lucide-react"

const Testimonials: React.FC = () => {
     const reviews = [
          {
               name: "Sarah Jenkins",
               role: "Interior Designer",
               text: "The Midnight Amber scent transformed my living room into a sanctuary. The burn is exceptionally clean, and the vessel is a piece of art in itself.",
               rating: 5,
          },
          {
               name: "Michael Chen",
               role: "Verified Buyer",
               text: "I've tried many luxury brands, but Lumina's complexity of scent is unmatched. The Sage & Sea Salt captures the coast perfectly.",
               rating: 5,
          },
          {
               name: "Elena Rodriguez",
               role: "Wellness Coach",
               text: "A daily ritual I can't live without. The packaging, the unboxing, the scent—everything speaks of quiet luxury and care.",
               rating: 5,
          },
     ]

     return (
          <section className="py-32 bg-stone-900 text-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white blur-[100px]"></div>
                    <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-accent blur-[120px]"></div>
               </div>

               <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20 reveal">
                         <Quote size={48} className="mx-auto mb-6 text-stone-700" />
                         <h2 className="font-serif text-3xl md:text-5xl mb-4">Reflections</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                         {reviews.map((review, idx) => (
                              <div key={idx} className="text-center reveal" style={{ transitionDelay: `${idx * 150}ms` }}>
                                   <div className="flex justify-center gap-1 text-accent mb-6">
                                        {[...Array(review.rating)].map((_, i) => (
                                             <Star key={i} size={14} fill="currentColor" />
                                        ))}
                                   </div>
                                   <p className="text-stone-300 text-lg leading-relaxed mb-8 font-light italic font-serif">"{review.text}"</p>
                                   <div>
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-1">{review.name}</h4>
                                        <p className="text-xs text-stone-500">{review.role}</p>
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>
          </section>
     )
}

export default Testimonials
