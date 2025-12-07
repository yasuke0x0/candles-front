import React from "react"

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
     label: string
     error?: string | undefined
     touched?: boolean | undefined
}

const TextArea: React.FC<TextAreaProps> = ({ label, error, touched, className, ...props }) => (
     <div className={`space-y-1.5 ${className}`}>
          <div className="flex justify-between">
               <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-1">{label}</label>
               {touched && error && (
                    <span className="text-[10px] font-bold text-red-500 tracking-wide animate-pulse">{error}</span>
               )}
          </div>
          <textarea
               className={`w-full px-4 py-3.5 bg-white border rounded-xl text-stone-900 placeholder:text-stone-300 focus:outline-none transition-all text-sm font-medium resize-none ${
                    touched && error
                         ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                         : "border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
               }`}
               {...props}
          />
     </div>
)

export default TextArea
