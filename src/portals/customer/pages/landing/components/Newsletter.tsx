import React from "react"

const Newsletter: React.FC = () => (
     <section id="newsletter" className="py-24 bg-stone-50 px-6 border-t border-stone-200">
          <div className="max-w-4xl mx-auto text-center reveal">
               <h3 className="font-serif text-3xl md:text-4xl mb-6 text-stone-900">Join the Lumina Circle</h3>
               <p className="text-stone-500 mb-10 text-lg max-w-lg mx-auto">Receive exclusive access to new collections, scent profiling, and members-only events.</p>
               <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
                    <input
                         type="email"
                         placeholder="Your email address"
                         className="flex-grow bg-white border border-stone-300 px-6 py-4 focus:outline-none focus:border-stone-800 transition-colors placeholder:text-stone-400 cursor-none"
                    />
                    <button className="bg-stone-900 text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                         Subscribe
                    </button>
               </form>
          </div>
     </section>
)

export default Newsletter
