import { useEffect } from "react"
import { createPortal } from "react-dom"
import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { Calendar, DollarSign, Loader2, Percent, Save, Tag, X } from "lucide-react"
import Input from "@components/form/Input.tsx"
import Cursor from "@components/Cursor.tsx"

export interface IDiscount {
     id?: number
     name: string
     type: "PERCENTAGE" | "FIXED"
     value: number
     isActive: boolean
     startsAt?: string | null
     endsAt?: string | null
}

interface DiscountFormModalProps {
     isOpen: boolean
     onClose: () => void
     onSubmit: (data: Partial<IDiscount>) => Promise<void>
     initialData?: IDiscount | null
     isSubmitting: boolean
}

// Validation
const DiscountSchema = Yup.object().shape({
     name: Yup.string().required("Required"),
     type: Yup.string().oneOf(["PERCENTAGE", "FIXED"]).required(),
     value: Yup.number().positive("Must be positive").required("Required"),
})

const DiscountFormModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }: DiscountFormModalProps) => {
     useEffect(() => {
          const handleKeyDown = (e: KeyboardEvent) => {
               if (e.key === "Escape") onClose()
          }
          if (isOpen) window.addEventListener("keydown", handleKeyDown)
          return () => window.removeEventListener("keydown", handleKeyDown)
     }, [isOpen, onClose])

     if (!isOpen) return null

     const initialValues = {
          name: initialData?.name || "",
          type: initialData?.type || "PERCENTAGE",
          value: initialData?.value || "",
          startsAt: initialData?.startsAt ? new Date(initialData.startsAt).toISOString().split("T")[0] : "",
          endsAt: initialData?.endsAt ? new Date(initialData.endsAt).toISOString().split("T")[0] : "",
          isActive: initialData?.isActive ?? true,
     }

     return createPortal(
          <div className="fixed inset-0 z-[10000] flex justify-center items-center font-sans px-4">
               <Cursor />
               <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />

               <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                         <h2 className="font-serif text-lg text-stone-900">{initialData ? "Edit Promotion" : "New Promotion"}</h2>
                         <button onClick={onClose} className="p-1 hover:bg-stone-200 rounded-full transition-colors">
                              <X size={18} className="text-stone-500" />
                         </button>
                    </div>

                    <Formik
                         initialValues={initialValues}
                         validationSchema={DiscountSchema}
                         onSubmit={async values => {
                              await onSubmit({
                                   ...values,
                                   value: Number(values.value),
                                   startsAt: values.startsAt || null,
                                   endsAt: values.endsAt || null,
                              })
                         }}
                    >
                         {({ values, isSubmitting: formSubmitting }) => (
                              <Form className="p-6 space-y-5">
                                   <Field name="name">
                                        {({ field, meta }: any) => (
                                             <Input
                                                  label="Promotion Name"
                                                  placeholder="e.g. Summer Sale"
                                                  icon={<Tag size={14} />}
                                                  {...field}
                                                  error={meta.error}
                                                  touched={meta.touched}
                                             />
                                        )}
                                   </Field>

                                   <div className="grid grid-cols-2 gap-4">
                                        <div>
                                             <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-1 mb-1.5 block">Type</label>
                                             <div className="flex gap-1">
                                                  {["PERCENTAGE", "FIXED"].map(type => (
                                                       <label
                                                            key={type}
                                                            className={`flex-1 cursor-pointer border rounded-xl py-3 flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                                                                 values.type === type
                                                                      ? "bg-stone-900 text-white border-stone-900"
                                                                      : "bg-white text-stone-500 border-stone-200 hover:border-stone-300"
                                                            }`}
                                                       >
                                                            <Field type="radio" name="type" value={type} className="hidden" />
                                                            {type === "PERCENTAGE" ? <Percent size={12} /> : <DollarSign size={12} />}
                                                            {type === "PERCENTAGE" ? "%" : "Flat"}
                                                       </label>
                                                  ))}
                                             </div>
                                        </div>
                                        <Field name="value">
                                             {({ field, meta }: any) => <Input type="number" label="Value" placeholder="0" {...field} error={meta.error} touched={meta.touched} />}
                                        </Field>
                                   </div>

                                   <div className="grid grid-cols-2 gap-4">
                                        <Field name="startsAt">{({ field }: any) => <Input type="date" label="Start Date" icon={<Calendar size={14} />} {...field} />}</Field>
                                        <Field name="endsAt">{({ field }: any) => <Input type="date" label="End Date" icon={<Calendar size={14} />} {...field} />}</Field>
                                   </div>

                                   <button
                                        type="submit"
                                        disabled={isSubmitting || formSubmitting}
                                        className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-stone-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-stone-900/10 mt-2"
                                   >
                                        {isSubmitting || formSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                        Save Promotion
                                   </button>
                              </Form>
                         )}
                    </Formik>
               </div>
          </div>,
          document.body
     )
}

export default DiscountFormModal
