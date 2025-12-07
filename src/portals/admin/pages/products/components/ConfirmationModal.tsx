import { createPortal } from "react-dom"
import { AlertTriangle, Archive, RotateCcw } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import Cursor from "@components/Cursor.tsx"

interface ConfirmationModalProps {
     isOpen: boolean
     onClose: () => void
     onConfirm: () => void
     title: string
     description: string
     actionType: "ARCHIVE" | "RESTORE" | "DELETE"
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, description, actionType }: ConfirmationModalProps) => {
     if (!isOpen) return null

     const isRestore = actionType === "RESTORE"

     return createPortal(
          <AnimatePresence>
               <div className="fixed inset-0 z-[9999] flex items-center justify-center font-sans px-4">
                    <Cursor />

                    {/* Backdrop */}
                    <motion.div
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         onClick={onClose}
                         className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                         initial={{ opacity: 0, scale: 0.95, y: 10 }}
                         animate={{ opacity: 1, scale: 1, y: 0 }}
                         exit={{ opacity: 0, scale: 0.95, y: 10 }}
                         className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden"
                    >
                         <div className="p-6 flex flex-col items-center text-center">
                              <div
                                   className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isRestore ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                              >
                                   {actionType === "ARCHIVE" && <Archive size={28} strokeWidth={1.5} />}
                                   {actionType === "RESTORE" && <RotateCcw size={28} strokeWidth={1.5} />}
                                   {actionType === "DELETE" && <AlertTriangle size={28} strokeWidth={1.5} />}
                              </div>

                              <h3 className="font-serif text-xl text-stone-900 mb-2">{title}</h3>
                              <p className="text-sm text-stone-500 mb-8 leading-relaxed max-w-[80%]">{description}</p>

                              <div className="flex gap-3 w-full">
                                   <button
                                        onClick={onClose}
                                        className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs uppercase tracking-wider hover:bg-stone-50 transition-colors"
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        onClick={() => {
                                             onConfirm()
                                             onClose()
                                        }}
                                        className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 ${
                                             isRestore ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" : "bg-red-600 hover:bg-red-700 shadow-red-200"
                                        }`}
                                   >
                                        {isRestore ? "Confirm Restore" : "Confirm Archive"}
                                   </button>
                              </div>
                         </div>
                    </motion.div>
               </div>
          </AnimatePresence>,
          document.body
     )
}

export default ConfirmationModal
