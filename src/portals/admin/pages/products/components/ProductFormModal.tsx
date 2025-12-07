import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Field, FieldArray, Form, Formik } from "formik"
import { Box, Euro, Image as ImageIcon, Loader2, Package, Plus, Ruler, Save, Tag, X } from "lucide-react"
import axios from "axios"
import type { IProductModel } from "@api-models"
import { ProductSchema } from "../core/schemas"
import { DISCOUNTS_LIST_ENDPOINT } from "@api-endpoints"
import Input from "@components/form/Input.tsx"
import TextArea from "@components/form/TextArea.tsx"
import Cursor from "@components/Cursor.tsx" // IMPORT CURSOR

interface IDiscount {
     id: number
     name: string
     type: "PERCENTAGE" | "FIXED"
     value: number
}

interface ProductFormModalProps {
     isOpen: boolean
     onClose: () => void
     onSubmit: (data: Partial<IProductModel>) => Promise<void>
     initialData?: IProductModel | null
     isSubmitting: boolean
}

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }: ProductFormModalProps) => {
     const [availableDiscounts, setAvailableDiscounts] = useState<IDiscount[]>([])

     // 1. Fetch Discounts
     useEffect(() => {
          if (isOpen) {
               axios.get(DISCOUNTS_LIST_ENDPOINT)
                    .then(res => setAvailableDiscounts(res.data))
                    .catch(console.error)
          }
     }, [isOpen])

     // 2. Handle Escape Key
     useEffect(() => {
          const handleKeyDown = (e: KeyboardEvent) => {
               if (e.key === "Escape") onClose()
          }
          if (isOpen) window.addEventListener("keydown", handleKeyDown)
          return () => window.removeEventListener("keydown", handleKeyDown)
     }, [isOpen, onClose])

     // 3. Prevent scrolling
     useEffect(() => {
          if (isOpen) {
               document.body.style.overflow = "hidden"
          } else {
               document.body.style.overflow = "unset"
          }
          return () => {
               document.body.style.overflow = "unset"
          }
     }, [isOpen])

     if (!isOpen) return null

     const initialValues = {
          name: initialData?.name || "",
          description: initialData?.description || "",
          price: initialData?.price || "",
          stock: initialData?.stock || "",
          image: initialData?.image || "",
          weight: initialData?.weight || "",
          length: initialData?.length || "",
          width: initialData?.width || "",
          height: initialData?.height || "",
          scentNotes: initialData?.scentNotes || [],
          isNew: initialData?.isNew || false,
          discountIds: initialData?.discounts?.map((d: any) => d.id) || [],
     }

     return createPortal(
          <div className="fixed inset-0 z-[9999] flex justify-end font-sans">
               {/* ADD CURSOR HERE SO IT IS VISIBLE IN THE PORTAL LAYER */}
               <Cursor />

               <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300" onClick={onClose} />

               <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-stone-100">
                    <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-white/80 backdrop-blur z-10 sticky top-0">
                         <div>
                              <h2 className="font-serif text-2xl text-stone-900 tracking-tight">{initialData ? "Edit Details" : "New Item"}</h2>
                              <p className="text-xs text-stone-400 uppercase tracking-widest mt-1 font-medium">
                                   {initialData ? `SKU: #${initialData.id}` : "Inventory Management"}
                              </p>
                         </div>
                         <button onClick={onClose} className="p-2 bg-stone-50 hover:bg-stone-100 rounded-full transition-colors border border-stone-100 group">
                              <X size={20} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
                         </button>
                    </div>

                    <Formik
                         initialValues={initialValues}
                         validationSchema={ProductSchema}
                         onSubmit={async values => {
                              const payload: any = {
                                   ...values,
                                   price: Number(values.price),
                                   stock: Number(values.stock),
                                   weight: Number(values.weight),
                                   length: Number(values.length),
                                   width: Number(values.width),
                                   height: Number(values.height),
                              }
                              await onSubmit(payload)
                         }}
                    >
                         {({ values, errors, setFieldValue }) => (
                              <Form className="flex-1 flex flex-col overflow-hidden">
                                   <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin">
                                        {/* SECTION 1: VISUALS */}
                                        <div className="flex flex-col sm:flex-row gap-6">
                                             <div className="w-full sm:w-32 h-48 sm:h-32 bg-stone-50 rounded-2xl overflow-hidden shrink-0 border border-stone-200 relative group">
                                                  {values.image ? (
                                                       <img src={values.image} className="w-full h-full object-cover" alt="Preview" />
                                                  ) : (
                                                       <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 gap-2">
                                                            <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-dashed" />
                                                            <span className="text-[10px] uppercase font-bold tracking-wider">No Image</span>
                                                       </div>
                                                  )}
                                             </div>

                                             <div className="flex-1 space-y-4">
                                                  <Field name="name">
                                                       {({ field, meta }: any) => (
                                                            <Input label="Product Name" placeholder="e.g. Midnight Amber" {...field} error={meta.error} touched={meta.touched} />
                                                       )}
                                                  </Field>

                                                  <Field name="image">
                                                       {({ field, meta }: any) => (
                                                            <Input
                                                                 label="Image URL"
                                                                 placeholder="https://..."
                                                                 icon={<ImageIcon size={14} />}
                                                                 {...field}
                                                                 error={meta.error}
                                                                 touched={meta.touched}
                                                            />
                                                       )}
                                                  </Field>
                                             </div>
                                        </div>

                                        {/* SECTION 2: METRICS */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                             <Field name="price">
                                                  {({ field, meta }: any) => (
                                                       <Input
                                                            type="number"
                                                            label="Price"
                                                            placeholder="0.00"
                                                            icon={<Euro size={14} />}
                                                            {...field}
                                                            error={meta.error}
                                                            touched={meta.touched}
                                                       />
                                                  )}
                                             </Field>

                                             <Field name="stock">
                                                  {({ field, meta }: any) => (
                                                       <Input
                                                            type="number"
                                                            label="Stock"
                                                            placeholder="0"
                                                            icon={<Package size={14} />}
                                                            {...field}
                                                            error={meta.error}
                                                            touched={meta.touched}
                                                       />
                                                  )}
                                             </Field>

                                             <div>
                                                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-1 mb-1.5 block">Status</label>
                                                  <label
                                                       className={`flex items-center justify-center gap-3 h-[50px] px-4 bg-white rounded-xl border cursor-pointer transition-all ${values.isNew ? "border-stone-900 bg-stone-50" : "border-stone-200 hover:border-stone-300"}`}
                                                  >
                                                       <Field type="checkbox" name="isNew" className="w-4 h-4 text-stone-900 rounded focus:ring-stone-900 border-stone-300" />
                                                       <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">New Arrival</span>
                                                  </label>
                                             </div>
                                        </div>

                                        {/* SECTION 3: DESCRIPTION */}
                                        <Field name="description">
                                             {({ field, meta }: any) => (
                                                  <TextArea
                                                       label="Description"
                                                       placeholder="Describe the scent profile..."
                                                       rows={4}
                                                       {...field}
                                                       error={meta.error}
                                                       touched={meta.touched}
                                                  />
                                             )}
                                        </Field>

                                        {/* SECTION 4: SCENT NOTES */}
                                        <div>
                                             <div className="flex justify-between items-center mb-2">
                                                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-1">Olfactory Notes</label>
                                                  {typeof errors.scentNotes === "string" && (
                                                       <span className="text-[10px] font-bold text-red-500 tracking-wide animate-pulse">{errors.scentNotes}</span>
                                                  )}
                                             </div>

                                             <FieldArray name="scentNotes">
                                                  {({ push, remove }) => (
                                                       <div
                                                            className={`bg-stone-50 p-5 rounded-2xl border transition-colors ${typeof errors.scentNotes === "string" ? "border-red-300 bg-red-50/10" : "border-stone-200"}`}
                                                       >
                                                            <div className="flex gap-2 mb-4 items-end">
                                                                 <div className="flex-1">
                                                                      <Input
                                                                           id="newNoteInput"
                                                                           label="Add Note"
                                                                           placeholder="e.g. Vanilla"
                                                                           onKeyDown={e => {
                                                                                if (e.key === "Enter") {
                                                                                     e.preventDefault()
                                                                                     const t = e.target as HTMLInputElement
                                                                                     if (t.value.trim()) {
                                                                                          push(t.value.trim())
                                                                                          t.value = ""
                                                                                     }
                                                                                }
                                                                           }}
                                                                      />
                                                                 </div>
                                                                 <button
                                                                      type="button"
                                                                      onClick={() => {
                                                                           const input = document.getElementById("newNoteInput") as HTMLInputElement
                                                                           if (input.value.trim()) {
                                                                                push(input.value.trim())
                                                                                input.value = ""
                                                                           }
                                                                      }}
                                                                      className="h-[50px] w-[50px] flex items-center justify-center bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors mb-[1px]"
                                                                 >
                                                                      <Plus size={18} />
                                                                 </button>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                 {values.scentNotes?.length === 0 && <span className="text-xs text-stone-400 italic">No notes added yet.</span>}
                                                                 {values.scentNotes?.map((note, idx) => (
                                                                      <span
                                                                           key={idx}
                                                                           className="bg-white border border-stone-200 pl-3 pr-2 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm text-stone-600 group hover:border-red-200 transition-colors"
                                                                      >
                                                                           {note}
                                                                           <button
                                                                                type="button"
                                                                                onClick={() => remove(idx)}
                                                                                className="text-stone-400 group-hover:text-red-500 rounded-full p-0.5 transition-colors"
                                                                           >
                                                                                <X size={12} />
                                                                           </button>
                                                                      </span>
                                                                 ))}
                                                            </div>
                                                       </div>
                                                  )}
                                             </FieldArray>
                                        </div>

                                        {/* SECTION 5: PROMOTIONS */}
                                        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                                             <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-4 flex items-center gap-2">
                                                  <Tag size={14} /> Active Promotions
                                             </h4>
                                             <div className="flex flex-wrap gap-2">
                                                  {availableDiscounts.map(discount => {
                                                       const isSelected = values.discountIds.includes(discount.id)
                                                       return (
                                                            <button
                                                                 key={discount.id}
                                                                 type="button"
                                                                 onClick={() =>
                                                                      isSelected
                                                                           ? setFieldValue(
                                                                                  "discountIds",
                                                                                  values.discountIds.filter((id: number) => id !== discount.id)
                                                                             )
                                                                           : setFieldValue("discountIds", [...values.discountIds, discount.id])
                                                                 }
                                                                 className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${isSelected ? "bg-stone-900 text-white border-stone-900 shadow-md" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-900"}`}
                                                            >
                                                                 {discount.name}{" "}
                                                                 <span className="opacity-60 ml-1">
                                                                      ({discount.type === "PERCENTAGE" ? `-${discount.value}%` : `-€${discount.value}`})
                                                                 </span>
                                                            </button>
                                                       )
                                                  })}
                                             </div>
                                        </div>

                                        {/* SECTION 6: LOGISTICS */}
                                        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 relative overflow-hidden">
                                             <div className="absolute top-0 right-0 p-4 opacity-5">
                                                  <Box size={64} />
                                             </div>
                                             <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-6 flex items-center gap-2">
                                                  <Box size={14} /> Logistics & Dimensions
                                             </h4>
                                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                  {["weight", "length", "width", "height"].map(f => (
                                                       <Field key={f} name={f}>
                                                            {({ field, meta }: any) => (
                                                                 <Input
                                                                      type="number"
                                                                      step="0.1"
                                                                      label={`${f} ${f === "weight" ? "(kg)" : "(cm)"}`}
                                                                      placeholder="0"
                                                                      icon={f === "weight" ? undefined : <Ruler size={12} />}
                                                                      {...field}
                                                                      error={meta.error}
                                                                      touched={meta.touched}
                                                                 />
                                                            )}
                                                       </Field>
                                                  ))}
                                             </div>
                                        </div>
                                   </div>

                                   {/* Footer */}
                                   <div className="px-8 py-6 border-t border-stone-100 bg-stone-50 flex justify-between items-center shrink-0">
                                        <button type="button" onClick={onClose} className="px-6 py-3 text-stone-500 font-medium hover:text-stone-900 transition-colors text-sm">
                                             Cancel
                                        </button>
                                        <button
                                             type="submit"
                                             disabled={isSubmitting}
                                             className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-stone-800 transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-stone-900/10"
                                        >
                                             {isSubmitting ? (
                                                  <>
                                                       <Loader2 className="animate-spin" size={16} /> Saving...
                                                  </>
                                             ) : (
                                                  <>
                                                       <Save size={16} /> Save Product
                                                  </>
                                             )}
                                        </button>
                                   </div>
                              </Form>
                         )}
                    </Formik>
               </div>
          </div>,
          document.body
     )
}

export default ProductFormModal
