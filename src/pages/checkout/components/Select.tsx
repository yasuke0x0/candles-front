import React from "react"
import { ChevronDown } from "lucide-react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
     label: string
     error?: string
     touched?: boolean
}

const Select: React.FC<SelectProps> = ({ label, error, touched, className, children, value, ...props }) => {
     // Determine if the select is "empty" (showing placeholder)
     const isPlaceholder = value === "" || value === undefined

     return (
          <div className={`space-y-1.5 ${className}`}>
               <div className="flex justify-between">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-1">{label}</label>
                    {touched && error && <span className="text-[10px] font-bold text-red-500 tracking-wide animate-pulse">{error}</span>}
               </div>
               <div className="relative group">
                    {/* The Native Select Element */}
                    <select
                         value={value} // Ensure value is passed explicitly to control the placeholder check
                         className={`w-full px-4 py-3.5 bg-white border rounded-xl focus:outline-none transition-all text-sm font-medium appearance-none cursor-pointer ${
                              touched && error
                                   ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                   : "border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                         } ${
                              // Apply placeholder color if empty, otherwise standard text color
                              isPlaceholder ? "text-stone-300" : "text-stone-900"
                         }`}
                         {...props}
                    >
                         {children}
                    </select>

                    {/* Custom Dropdown Arrow (Absolute Positioned) */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 group-focus-within:text-stone-900 transition-colors">
                         <ChevronDown size={16} />
                    </div>
               </div>
          </div>
     )
}

export default Select
