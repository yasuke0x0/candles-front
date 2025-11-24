import React from "react"

const Marquee: React.FC = () => {
     const content = "• Complimentary Shipping on Orders Over $150 • Hand-poured in Provence • Sustainable Soy Wax Blends • Artisan Crafted Vessels "

     return (
          <div className="bg-stone-900 text-white py-3 overflow-hidden relative z-50 border-b border-stone-800">
               <div className="whitespace-nowrap flex">
                    <div className="animate-marquee flex gap-4 items-center">
                         <span className="text-xs uppercase tracking-[0.3em] font-medium px-4">{content}</span>
                         <span className="text-xs uppercase tracking-[0.3em] font-medium px-4">{content}</span>
                         <span className="text-xs uppercase tracking-[0.3em] font-medium px-4">{content}</span>
                         <span className="text-xs uppercase tracking-[0.3em] font-medium px-4">{content}</span>
                    </div>
                    <div className="animate-marquee flex gap-4 items-center absolute top-3 left-0 translate-x-full">
                         <span className="text-xs uppercase tracking-[0.3em] font-medium px-4">{content}</span>
                         <span className="text-xs uppercase tracking-[0.3em] font-medium px-4">{content}</span>
                         <span className="text-xs uppercase tracking-[0.3em] font-medium px-4">{content}</span>
                         <span className="text-xs uppercase tracking-[0.3em] font-medium px-4">{content}</span>
                    </div>
               </div>
          </div>
     )
}

export default Marquee
