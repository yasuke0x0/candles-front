import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Field, FieldArray, Form, Formik } from "formik"
import { useQueryClient } from "@tanstack/react-query" // Import QueryClient
import { AlertCircle, Archive, Box, Edit2, Euro, Image as ImageIcon, Loader2, Package, Plus, RotateCcw, Ruler, Save, Tag, Trash2, X } from "lucide-react"
import axios from "axios"
import type { IProductModel } from "@api-models"
import { ProductSchema } from "../core/schemas"
import { DISCOUNTS_CREATE_ENDPOINT, DISCOUNTS_DELETE_ENDPOINT, DISCOUNTS_LIST_ENDPOINT, DISCOUNTS_MODIFY_ENDPOINT } from "@api-endpoints"
import Input from "@components/form/Input.tsx"
import TextArea from "@components/form/TextArea.tsx"
import Cursor from "@components/Cursor.tsx"
import DiscountFormModal, { type IDiscount } from "@portals/admin/pages/products/components/DiscountFormModal.tsx"

interface ProductFormModalProps {
     isOpen: boolean
     onClose: () => void
     onSubmit: (data: Partial<IProductModel>) => Promise<void>
     initialData?: IProductModel | null
     isSubmitting: boolean
     onArchive?: (id: number) => void
}

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting, onArchive }: ProductFormModalProps) => {
     const queryClient = useQueryClient() // Initialize Query Client
     const [availableDiscounts, setAvailableDiscounts] = useState<IDiscount[]>([])
     const [formError, setFormError] = useState<string | null>(null)

     // --- DISCOUNT MODAL STATE ---
     const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false)
     const [editingDiscount, setEditingDiscount] = useState<IDiscount | null>(null)
     const [isDiscountSubmitting, setIsDiscountSubmitting] = useState(false)

     // 1. Fetch Discounts Helper
     const fetchDiscounts = () => {
          axios.get(DISCOUNTS_LIST_ENDPOINT)
               .then(res => setAvailableDiscounts(res.data))
               .catch(console.error)
     }

     // Initial Fetch
     useEffect(() => {
          if (isOpen) fetchDiscounts()
     }, [isOpen])

     // --- DISCOUNT HANDLERS ---
     const handleOpenCreateDiscount = () => {
          setEditingDiscount(null)
          setIsDiscountModalOpen(true)
     }

     const handleOpenEditDiscount = (discount: IDiscount, e: React.MouseEvent) => {
          e.stopPropagation()
          setEditingDiscount(discount)
          setIsDiscountModalOpen(true)
     }

     // FIX: Added setFieldValue and currentIds to handle the constraint error
     const handleDiscountDelete = async (id: number, e: React.MouseEvent, setFieldValue: any, currentIds: number[]) => {
          e.stopPropagation()
          if (!window.confirm("Are you sure you want to delete this promotion? This cannot be undone.")) return

          try {
               await axios.delete(DISCOUNTS_DELETE_ENDPOINT(id))

               // 1. Remove from local list
               fetchDiscounts()

               // 2. Refresh the main product grid so prices update
               queryClient.invalidateQueries({ queryKey: ["admin-products"] })

               // 3. FIX: If the deleted discount was selected in the form, deselect it immediately
               if (currentIds.includes(id)) {
                    setFieldValue("discountIds", [])
               }

          } catch (error) {
               console.error("Failed to delete discount", error)
               alert("Could not delete discount. It might be in use.")
          }
     }

     const handleDiscountSubmit = async (data: Partial<IDiscount>) => {
          setIsDiscountSubmitting(true)
          try {
               if (editingDiscount?.id) {
                    await axios.put(DISCOUNTS_MODIFY_ENDPOINT(editingDiscount.id), data)
               } else {
                    await axios.post(DISCOUNTS_CREATE_ENDPOINT, data)
               }
               fetchDiscounts()
               // FIX: Refresh main grid so new/updated discounts reflect on prices immediately
               queryClient.invalidateQueries({ queryKey: ["admin-products"] })
               setIsDiscountModalOpen(false)
          } catch (error) {
               console.error("Failed to save discount", error)
          } finally {
               setIsDiscountSubmitting(false)
          }
     }

     // --- EXISTING LOGIC ---
     useEffect(() => {
          if (!isOpen) setFormError(null)
     }, [isOpen])

     useEffect(() => {
          const handleKeyDown = (e: KeyboardEvent) => {
               if (e.key === "Escape" && !isDiscountModalOpen) onClose()
          }
          if (isOpen) window.addEventListener("keydown", handleKeyDown)
          return () => window.removeEventListener("keydown", handleKeyDown)
     }, [isOpen, onClose, isDiscountModalOpen])

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
          isNew: initialData ? Boolean(initialData.isNew) : false,
          discountIds: initialData?.discounts?.map((d: any) => d.id) || [],
     }

     const isArchived = initialData?.status === "ARCHIVED"

     return createPortal(
          <div className="fixed inset-0 z-[9999] flex justify-end font-sans">
               <Cursor />

               <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300" onClick={onClose} />

               <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-stone-100">
                    <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-white/80 backdrop-blur z-10 sticky top-0">
                         <div>
                              <div className="flex items-center gap-3">
                                   <h2 className="font-serif text-2xl text-stone-900 tracking-tight">{initialData ? "Edit Details" : "New Item"}</h2>
                                   {isArchived && (
                                        <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-[10px] font-bold uppercase tracking-wider rounded border border-stone-200">
                                             Archived
                                        </span>
                                   )}
                              </div>
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
                         enableReinitialize={true}
                         onSubmit={async values => {
                              try {
                                   setFormError(null)
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
                              } catch (error: any) {
                                   console.error("Submission Error:", error)
                                   let message = "An unexpected error occurred. Please try again."
                                   if (error?.customError?.message) {
                                        message = error.customError.message
                                   } else if (error?.response?.data?.message) {
                                        message = error.response.data.message
                                   } else if (error?.message) {
                                        message = error.message
                                   }
                                   setFormError(message)
                                   setTimeout(() => {
                                        const errorElement = document.getElementById("form-error-alert")
                                        if (errorElement) {
                                             errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
                                        }
                                   }, 100)
                              }
                         }}
                    >
                         {({ values, errors, setFieldValue }) => (
                              <Form className="flex-1 flex flex-col overflow-hidden">
                                   <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin">
                                        {formError && (
                                             <div id="form-error-alert" className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                                  <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                                                  <div className="flex-1">
                                                       <h4 className="text-sm font-bold text-red-900">Submission Failed</h4>
                                                       <p className="text-xs text-red-700 mt-1">{formError}</p>
                                                  </div>
                                             </div>
                                        )}

                                        {/* Visuals */}
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
                                                            <Input label="Image URL" placeholder="https://..." icon={<ImageIcon size={14} />} {...field} error={meta.error} touched={meta.touched} />
                                                       )}
                                                  </Field>
                                             </div>
                                        </div>
                                        {/* Metrics */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                             <Field name="price">
                                                  {({ field, meta }: any) => (
                                                       <Input type="number" label="Price" placeholder="0.00" icon={<Euro size={14} />} {...field} error={meta.error} touched={meta.touched} />
                                                  )}
                                             </Field>
                                             <Field name="stock">
                                                  {({ field, meta }: any) => (
                                                       <Input type="number" label="Stock" placeholder="0" icon={<Package size={14} />} {...field} error={meta.error} touched={meta.touched} />
                                                  )}
                                             </Field>
                                             <div>
                                                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 ml-1 mb-1.5 block">Status</label>
                                                  <label
                                                       className={`flex items-center justify-center gap-3 h-[50px] px-4 bg-white rounded-xl border cursor-pointer transition-all ${
                                                            values.isNew ? "border-stone-900 bg-stone-50" : "border-stone-200 hover:border-stone-300"
                                                       }`}
                                                  >
                                                       <Field type="checkbox" name="isNew" className="w-4 h-4 text-stone-900 rounded focus:ring-stone-900 border-stone-300" />
                                                       <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">New Arrival</span>
                                                  </label>
                                             </div>
                                        </div>
                                        {/* Description */}
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
                                        {/* Scent Notes */}
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

                                        {/* Promotions */}
                                        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                                             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                                                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 flex items-center gap-2">
                                                       <Tag size={14} /> Active Promotions (Max 1)
                                                  </h4>
                                                  <button
                                                       type="button"
                                                       onClick={handleOpenCreateDiscount}
                                                       className="w-full sm:w-auto text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 bg-white border border-stone-200 px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 hover:border-stone-400 transition-all shadow-sm active:scale-95"
                                                  >
                                                       <Plus size={12} /> New Promotion
                                                  </button>
                                             </div>

                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                  {availableDiscounts.map(discount => {
                                                       const isSelected = values.discountIds.includes(discount.id!)
                                                       return (
                                                            <div key={discount.id} className="relative group w-full">
                                                                 <button
                                                                      type="button"
                                                                      onClick={() =>
                                                                           isSelected
                                                                                ? setFieldValue("discountIds", [])
                                                                                : setFieldValue("discountIds", [discount.id])
                                                                      }
                                                                      className={`w-full text-left pl-4 pr-24 py-3.5 rounded-xl border transition-all flex items-center justify-between relative overflow-hidden ${
                                                                           isSelected
                                                                                ? "bg-stone-900 text-white border-stone-900 shadow-md transform scale-[1.01]"
                                                                                : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 shadow-sm"
                                                                      }`}
                                                                 >
                                                                      {/* Name Section - Truncates properly now */}
                                                                      <div className="flex-1 min-w-0 mr-3">
                                                                           <p className={`font-bold text-xs truncate leading-relaxed ${isSelected ? "text-white" : "text-stone-900"}`}>
                                                                                {discount.name}
                                                                           </p>
                                                                      </div>

                                                                      {/* Value Badge - Always aligned */}
                                                                      <div
                                                                           className={`shrink-0 text-[10px] font-mono font-bold px-2 py-1 rounded-md border ${
                                                                                isSelected
                                                                                     ? "bg-white/20 text-white border-transparent"
                                                                                     : "bg-stone-100 text-stone-500 border-stone-200"
                                                                           }`}
                                                                      >
                                                                           {discount.type === "PERCENTAGE" ? `-${discount.value}%` : `-€${discount.value}`}
                                                                      </div>
                                                                 </button>

                                                                 {/* Action Buttons (Edit + Delete) - Perfectly Centered */}
                                                                 <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pl-2">
                                                                      {/* Divider if active to separate text area from actions slightly */}
                                                                      <div className={`h-6 w-px mr-1 ${isSelected ? "bg-white/20" : "bg-stone-200"}`} />

                                                                      <button
                                                                           type="button"
                                                                           onClick={e => handleOpenEditDiscount(discount, e)}
                                                                           className={`p-2 rounded-lg transition-all active:scale-90 ${
                                                                                isSelected
                                                                                     ? "text-stone-300 hover:text-white hover:bg-white/20"
                                                                                     : "text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                                                                           }`}
                                                                           title="Edit Promotion"
                                                                      >
                                                                           <Edit2 size={14} />
                                                                      </button>
                                                                      <button
                                                                           type="button"
                                                                           onClick={e => handleDiscountDelete(discount.id!, e, setFieldValue, values.discountIds)}
                                                                           className={`p-2 rounded-lg transition-all active:scale-90 ${
                                                                                isSelected
                                                                                     ? "text-red-300 hover:text-red-200 hover:bg-red-900/50"
                                                                                     : "text-stone-300 hover:text-red-600 hover:bg-red-50"
                                                                           }`}
                                                                           title="Delete Promotion"
                                                                      >
                                                                           <Trash2 size={14} />
                                                                      </button>
                                                                 </div>
                                                            </div>
                                                       )
                                                  })}
                                             </div>
                                        </div>

                                        {/* Logistics */}
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

                                   {/* Footer Actions */}
                                   <div className="px-8 py-6 border-t border-stone-100 bg-stone-50 flex justify-between items-center shrink-0">
                                        <div className="flex items-center gap-3">
                                             <button
                                                  type="button"
                                                  onClick={onClose}
                                                  className="px-6 py-3 text-stone-500 font-medium hover:text-stone-900 transition-colors text-sm"
                                             >
                                                  Cancel
                                             </button>
                                             {initialData && onArchive && (
                                                  <button
                                                       type="button"
                                                       onClick={() => {
                                                            if (initialData.id) {
                                                                 onArchive(initialData.id)
                                                                 onClose()
                                                            }
                                                       }}
                                                       className="px-4 py-3 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-100 hover:border-stone-300 transition-all text-sm font-bold flex items-center gap-2"
                                                       title={isArchived ? "Restore Product" : "Archive Product"}
                                                  >
                                                       {isArchived ? <RotateCcw size={16} /> : <Archive size={16} />}
                                                       <span className="hidden sm:inline">{isArchived ? "Restore" : "Archive"}</span>
                                                  </button>
                                             )}
                                        </div>

                                        <button
                                             type="submit"
                                             disabled={isSubmitting}
                                             className="bg-stone-900 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-stone-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-stone-900/10
                                                  h-[46px] w-[46px] sm:w-auto sm:px-8 sm:py-3" // Circular icon on mobile, Wide on desktop
                                        >
                                             {isSubmitting ? (
                                                  <Loader2 className="animate-spin" size={18} />
                                             ) : (
                                                  <>
                                                       <Save size={18} />
                                                       <span className="hidden sm:inline">Save Product</span>
                                                  </>
                                             )}
                                        </button>
                                   </div>
                              </Form>
                         )}
                    </Formik>

                    {/* DISCOUNT FORM MODAL */}
                    <DiscountFormModal
                         isOpen={isDiscountModalOpen}
                         onClose={() => setIsDiscountModalOpen(false)}
                         onSubmit={handleDiscountSubmit}
                         initialData={editingDiscount}
                         isSubmitting={isDiscountSubmitting}
                    />
               </div>
          </div>,
          document.body
     )
}

export default ProductFormModal
