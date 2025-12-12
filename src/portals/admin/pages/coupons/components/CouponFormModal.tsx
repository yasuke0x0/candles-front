import { useEffect } from "react"
import { createPortal } from "react-dom"
import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { AnimatePresence, motion } from "framer-motion" // Import framer-motion
import { Calendar, DollarSign, Hash, Loader2, Percent, Power, RotateCcw, Save, Ticket, X } from "lucide-react"
import type { ICoupon } from "@api-models"
import Input from "@components/form/Input.tsx"
import TextArea from "@components/form/TextArea.tsx"
import Cursor from "@components/Cursor.tsx"

interface CouponFormModalProps {
     isOpen: boolean
     onClose: () => void
     onSubmit: (data: Partial<ICoupon>) => Promise<void>
     initialData?: ICoupon | null
     isSubmitting: boolean
     onArchive?: (coupon: ICoupon) => void
}

// Validation Schema
const CouponSchema = Yup.object().shape({
     code: Yup.string().required("Required").uppercase(),
     type: Yup.string().oneOf(["PERCENTAGE", "FIXED"]).required(),
     value: Yup.number().positive("Must be positive").required("Required"),
     minOrderAmount: Yup.number().min(0, "Cannot be negative").nullable(),
     maxUses: Yup.number().integer("Must be an integer").min(1).nullable(),
     expiresAt: Yup.date().nullable(),
     description: Yup.string().max(255),
})

const CouponFormModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting, onArchive }: CouponFormModalProps) => {
     // Handle Escape Key
     useEffect(() => {
          const handleKeyDown = (e: KeyboardEvent) => {
               if (e.key === "Escape") onClose()
          }
          if (isOpen) {
               window.addEventListener("keydown", handleKeyDown)
               document.body.style.overflow = "hidden"
          }
          return () => {
               window.removeEventListener("keydown", handleKeyDown)
               document.body.style.overflow = "unset"
          }
     }, [isOpen, onClose])

     const initialValues = {
          code: initialData?.code || "",
          type: initialData?.type || "PERCENTAGE",
          value: initialData?.value || "",
          description: initialData?.description || "",
          minOrderAmount: initialData?.minOrderAmount || "",
          maxUses: initialData?.maxUses || "",
          expiresAt: initialData?.endsAt ? new Date(initialData.endsAt).toISOString().split("T")[0] : "",
          isActive: initialData?.isActive !== undefined ? Boolean(initialData.isActive) : true,
     }

     return createPortal(
          <div className="fixed inset-0 z-[9999] flex justify-end font-sans pointer-events-none">
               <Cursor />

               <AnimatePresence>
                    {isOpen && (
                         <>
                              {/* Backdrop */}
                              <motion.div
                                   initial={{ opacity: 0 }}
                                   animate={{ opacity: 1 }}
                                   exit={{ opacity: 0 }}
                                   transition={{ duration: 0.2 }}
                                   className="absolute inset-0 bg-stone-900/30 backdrop-blur-[2px] pointer-events-auto"
                                   onClick={onClose}
                              />

                              {/* Slide-over Panel */}
                              <motion.div
                                   // Start off-screen right
                                   initial={{ x: "100%" }}
                                   // Slide to center
                                   animate={{ x: 0 }}
                                   // Slide back off-screen right
                                   exit={{ x: "100%" }}
                                   transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                   className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-stone-100 pointer-events-auto"
                              >
                                   {/* Header */}
                                   <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                        <div>
                                             <h2 className="font-serif text-2xl text-stone-900 tracking-tight">{initialData ? "Edit Coupon" : "New Coupon"}</h2>
                                             <p className="text-xs text-stone-400 uppercase tracking-widest mt-1 font-medium">Marketing & Promotions</p>
                                        </div>
                                        <button onClick={onClose} className="p-2 bg-stone-50 hover:bg-stone-100 rounded-full transition-colors border border-stone-100">
                                             <X size={20} className="text-stone-400" />
                                        </button>
                                   </div>

                                   {/* Form */}
                                   <Formik
                                        initialValues={initialValues}
                                        validationSchema={CouponSchema}
                                        enableReinitialize={true}
                                        onSubmit={async values => {
                                             const payload: any = {
                                                  ...values,
                                                  value: Number(values.value),
                                                  minOrderAmount: values.minOrderAmount ? Number(values.minOrderAmount) : null,
                                                  maxUses: values.maxUses ? Number(values.maxUses) : null,
                                                  expiresAt: values.expiresAt || null,
                                             }
                                             await onSubmit(payload)
                                        }}
                                   >
                                        {({ values }) => (
                                             <Form className="flex-1 flex flex-col overflow-hidden">
                                                  <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin">
                                                       {/* CODE & TYPE */}
                                                       <div className="grid grid-cols-2 gap-6">
                                                            <Field name="code">
                                                                 {({ field, meta }: any) => (
                                                                      <Input
                                                                           label="Coupon Code"
                                                                           placeholder="SUMMER25"
                                                                           icon={<Ticket size={14} />}
                                                                           {...field}
                                                                           error={meta.error}
                                                                           touched={meta.touched}
                                                                           style={{ textTransform: "uppercase" }}
                                                                      />
                                                                 )}
                                                            </Field>

                                                            <div>
                                                                 <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-1 mb-1.5 block">Type</label>
                                                                 <div className="flex gap-2">
                                                                      {["PERCENTAGE", "FIXED"].map(type => (
                                                                           <label
                                                                                key={type}
                                                                                className={`flex-1 cursor-pointer border rounded-xl px-2 py-3.5 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                                                                                     values.type === type
                                                                                          ? "bg-stone-900 text-white border-stone-900 shadow-md"
                                                                                          : "bg-white text-stone-500 border-stone-200 hover:border-stone-300"
                                                                                }`}
                                                                           >
                                                                                <Field type="radio" name="type" value={type} className="hidden" />
                                                                                {type === "PERCENTAGE" ? <Percent size={14} /> : <DollarSign size={14} />}
                                                                                <span className="text-xs uppercase tracking-wide">{type === "PERCENTAGE" ? "%" : "Flat"}</span>
                                                                           </label>
                                                                      ))}
                                                                 </div>
                                                            </div>
                                                       </div>

                                                       {/* VALUE */}
                                                       <Field name="value">
                                                            {({ field, meta }: any) => (
                                                                 <Input
                                                                      type="number"
                                                                      label="Discount Value"
                                                                      placeholder={values.type === "PERCENTAGE" ? "20" : "10.00"}
                                                                      icon={values.type === "PERCENTAGE" ? <Percent size={14} /> : <DollarSign size={14} />}
                                                                      {...field}
                                                                      error={meta.error}
                                                                      touched={meta.touched}
                                                                 />
                                                            )}
                                                       </Field>

                                                       {/* DESCRIPTION */}
                                                       <Field name="description">
                                                            {({ field, meta }: any) => (
                                                                 <TextArea
                                                                      label="Description"
                                                                      placeholder="Internal note (e.g. Black Friday Special)"
                                                                      rows={3}
                                                                      {...field}
                                                                      error={meta.error}
                                                                      touched={meta.touched}
                                                                 />
                                                            )}
                                                       </Field>

                                                       <div className="h-px bg-stone-100" />

                                                       {/* LIMITS SECTION */}
                                                       <div className="grid grid-cols-2 gap-6">
                                                            <Field name="minOrderAmount">
                                                                 {({ field, meta }: any) => (
                                                                      <Input
                                                                           type="number"
                                                                           label="Min Order (€)"
                                                                           placeholder="0.00"
                                                                           {...field}
                                                                           error={meta.error}
                                                                           touched={meta.touched}
                                                                      />
                                                                 )}
                                                            </Field>

                                                            <Field name="maxUses">
                                                                 {({ field, meta }: any) => (
                                                                      <Input
                                                                           type="number"
                                                                           label="Usage Limit"
                                                                           placeholder="Unlimited"
                                                                           icon={<Hash size={14} />}
                                                                           {...field}
                                                                           error={meta.error}
                                                                           touched={meta.touched}
                                                                      />
                                                                 )}
                                                            </Field>
                                                       </div>

                                                       {/* EXPIRY & STATUS */}
                                                       <div className="grid grid-cols-2 gap-6 items-start">
                                                            <Field name="expiresAt">
                                                                 {({ field, meta }: any) => (
                                                                      <Input
                                                                           type="date"
                                                                           label="Expiration Date"
                                                                           icon={<Calendar size={14} />}
                                                                           {...field}
                                                                           error={meta.error}
                                                                           touched={meta.touched}
                                                                      />
                                                                 )}
                                                            </Field>

                                                            <div>
                                                                 <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-1 mb-1.5 block">Status</label>
                                                                 <label
                                                                      className={`flex items-center justify-center gap-3 h-[50px] px-4 bg-white rounded-xl border cursor-pointer transition-all ${
                                                                           values.isActive ? "border-green-500 bg-green-50/50" : "border-stone-200"
                                                                      }`}
                                                                 >
                                                                      <Field
                                                                           type="checkbox"
                                                                           name="isActive"
                                                                           className="w-4 h-4 text-green-600 rounded focus:ring-green-600 border-gray-300"
                                                                      />
                                                                      <span
                                                                           className={`text-xs font-bold uppercase tracking-wider ${values.isActive ? "text-green-700" : "text-stone-500"}`}
                                                                      >
                                                                           {values.isActive ? "Active" : "Inactive"}
                                                                      </span>
                                                                 </label>
                                                            </div>
                                                       </div>
                                                  </div>

                                                  {/* Footer Actions */}
                                                  <div className="px-8 py-6 border-t border-stone-100 bg-stone-50 flex justify-between items-center">
                                                       <div className="flex gap-2">
                                                            <button
                                                                 type="button"
                                                                 onClick={onClose}
                                                                 className="px-6 py-3 text-stone-500 font-medium hover:text-stone-900 transition-colors text-sm"
                                                            >
                                                                 Cancel
                                                            </button>

                                                            {/* ARCHIVE BUTTON */}
                                                            {initialData && onArchive && (
                                                                 <button
                                                                      type="button"
                                                                      onClick={() => {
                                                                           onArchive(initialData)
                                                                      }}
                                                                      className="px-4 py-3 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-100 hover:border-stone-300 transition-all text-sm font-bold flex items-center gap-2"
                                                                      title={initialData.isActive ? "Archive Coupon" : "Restore Coupon"}
                                                                 >
                                                                      {initialData.isActive ? <Power size={16} /> : <RotateCcw size={16} />}
                                                                      <span className="hidden sm:inline">{initialData.isActive ? "Disable" : "Enable"}</span>
                                                                 </button>
                                                            )}
                                                       </div>

                                                       <button
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                            className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-stone-800 transition-all flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-stone-900/10"
                                                       >
                                                            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                                            Save Coupon
                                                       </button>
                                                  </div>
                                             </Form>
                                        )}
                                   </Formik>
                              </motion.div>
                         </>
                    )}
               </AnimatePresence>
          </div>,
          document.body
     )
}

export default CouponFormModal
