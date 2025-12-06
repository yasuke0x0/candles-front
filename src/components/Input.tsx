import React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
     label: string
     icon?: React.ReactNode
     error?: string | undefined
     touched?: boolean | undefined
}

const Input: React.FC<InputProps> = ({ label, icon, error, touched, className, ...props }) => (
     <div className={`space-y-1.5 ${className}`}>
          <div className="flex justify-between">
               <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-1">{label}</label>
               {touched && error && <span className="text-[10px] font-bold text-red-500 tracking-wide animate-pulse">{error}</span>}
          </div>
          <div className="relative group">
               <input
                    className={`w-full px-4 py-3.5 bg-white border rounded-xl text-stone-900 placeholder:text-stone-300 focus:outline-none transition-all text-sm font-medium ${
                         touched && error
                              ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                    }`}
                    {...props}
               />
               {icon && (
                    <div
                         className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                              touched && error ? "text-red-400" : "text-stone-400 group-focus-within:text-stone-900"
                         }`}
                    >
                         {icon}
                    </div>
               )}
          </div>
     </div>
)

export default Input
