import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export const ProductToast = ({ message }: { message: string }) => (
     <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
     >
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-sm font-bold tracking-wide">{message}</span>
     </motion.div>
)
