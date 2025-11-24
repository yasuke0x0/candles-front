import React from "react"
import { Facebook, Flame, Instagram, Twitter } from "lucide-react"
import moment from "moment/moment"

const Footer: React.FC = () => {
     const currentYear = moment().format("YYYY")
     return (
          <footer className="bg-stone-950 text-white pt-24 pb-12 border-t border-stone-900">
               <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
                         <div className="md:col-span-4 space-y-8 text-center md:text-left">
                              <div className="flex items-center justify-center md:justify-start gap-2">
                                   <div className="w-6 h-6 bg-white text-stone-900 flex items-center justify-center rounded-full">
                                        <Flame size={14} fill="currentColor" />
                                   </div>
                                   <span className="font-serif text-xl font-bold tracking-tight">Lumina</span>
                              </div>
                              <p className="text-stone-400 leading-relaxed max-w-xs mx-auto md:mx-0 font-light">
                                   Illuminating spaces with nature's finest scents. Sustainable, ethical, and handcrafted for your sanctuary.
                              </p>
                              <div className="flex gap-4 justify-center md:justify-start">
                                   {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                        <a
                                             key={i}
                                             href="#"
                                             className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center text-stone-400 hover:bg-white hover:text-stone-900 hover:border-white transition-all duration-300"
                                        >
                                             <Icon size={18} />
                                        </a>
                                   ))}
                              </div>
                         </div>

                         <div className="md:col-span-2 md:col-start-7 text-center md:text-left">
                              <h4 className="font-serif text-lg mb-6 text-stone-200">Shop</h4>
                              <ul className="space-y-4 text-stone-400 text-sm">
                                   {["All Candles", "New Arrivals", "Best Sellers", "Accessories", "Gift Sets"].map(item => (
                                        <li key={item}>
                                             <a href="#" className="hover:text-white transition-colors hover:pl-2 duration-300 inline-block">
                                                  {item}
                                             </a>
                                        </li>
                                   ))}
                              </ul>
                         </div>

                         <div className="md:col-span-2 text-center md:text-left">
                              <h4 className="font-serif text-lg mb-6 text-stone-200">Company</h4>
                              <ul className="space-y-4 text-stone-400 text-sm">
                                   {["Our Story", "Sustainability", "Careers", "Press"].map(item => (
                                        <li key={item}>
                                             <a href="#" className="hover:text-white transition-colors hover:pl-2 duration-300 inline-block">
                                                  {item}
                                             </a>
                                        </li>
                                   ))}
                              </ul>
                         </div>

                         <div className="md:col-span-2 text-center md:text-left">
                              <h4 className="font-serif text-lg mb-6 text-stone-200">Support</h4>
                              <ul className="space-y-4 text-stone-400 text-sm">
                                   {["Contact Us", "Shipping & Returns", "FAQ", "Privacy Policy"].map(item => (
                                        <li key={item}>
                                             <a href="#" className="hover:text-white transition-colors hover:pl-2 duration-300 inline-block">
                                                  {item}
                                             </a>
                                        </li>
                                   ))}
                              </ul>
                         </div>
                    </div>

                    <div className="border-t border-stone-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-stone-600 uppercase tracking-widest">
                         <p>© {currentYear} Lumina Botanicals. All rights reserved.</p>
                         <div className="flex gap-8">
                              <a href="#" className="hover:text-stone-400 transition-colors">
                                   Privacy
                              </a>
                              <a href="#" className="hover:text-stone-400 transition-colors">
                                   Terms
                              </a>
                         </div>
                    </div>
               </div>
          </footer>
     )
}

export default Footer
