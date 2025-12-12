import { useEffect, useRef, useState } from "react"
import { Loader2, MapPin } from "lucide-react"
import axios from "axios"
import Input from "./Input"
import { MAPS_AUTOCOMPLETE_ENDPOINT, MAPS_DETAILS_ENDPOINT } from "@api-endpoints"

interface AddressAutocompleteProps {
     label: string
     name: string
     value: string
     onChange: (e: any) => void
     onBlur: (e: any) => void
     onSelect: (data: { address: string; city: string; zip: string; country: string }) => void
     error?: string
     touched?: boolean
     placeholder?: string
}

const AddressAutocomplete = ({ label, name, value, onChange, onBlur, onSelect, error, touched, placeholder }: AddressAutocompleteProps) => {
     const [predictions, setPredictions] = useState<{ description: string; placeId: string }[]>([])
     const [showSuggestions, setShowSuggestions] = useState(false)
     const [isLoading, setIsLoading] = useState(false)
     const isSelectionRef = useRef(false)
     const wrapperRef = useRef<HTMLDivElement>(null)

     // Close dropdown when clicking outside
     useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
               if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                    setShowSuggestions(false)
               }
          }
          document.addEventListener("mousedown", handleClickOutside)
          return () => document.removeEventListener("mousedown", handleClickOutside)
     }, [])

     // Debounce and Fetch Predictions
     useEffect(() => {
          const fetchPredictions = async () => {
               if (value.length < 3 || isSelectionRef.current) {
                    setPredictions([])
                    isSelectionRef.current = false
                    return
               }

               setIsLoading(true)
               try {
                    const res = await axios.get(MAPS_AUTOCOMPLETE_ENDPOINT, { params: { input: value } })
                    setPredictions(res.data)
                    setShowSuggestions(true)
               } catch (err) {
                    console.error("Maps error", err)
               } finally {
                    setIsLoading(false)
               }
          }

          const timer = setTimeout(fetchPredictions, 500)
          return () => clearTimeout(timer)
     }, [value])

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          isSelectionRef.current = false
          onChange(e)
          if (e.target.value.length >= 3) setShowSuggestions(true)
     }

     const handlePredictionSelect = async (placeId: string, description: string) => {
          isSelectionRef.current = true

          const syntheticEvent = {
               target: { name, value: description },
          }
          onChange(syntheticEvent)

          setShowSuggestions(false)
          setIsLoading(true)

          try {
               const res = await axios.get(MAPS_DETAILS_ENDPOINT, { params: { placeId } })
               const { address, city, zip, country } = res.data
               onSelect({ address, city, zip, country })
          } catch (err) {
               console.error("Details error", err)
          } finally {
               setIsLoading(false)
          }
     }

     return (
          <div className="relative" ref={wrapperRef}>
               <Input
                    label={label}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    onBlur={onBlur}
                    error={error}
                    touched={touched}
                    placeholder={placeholder}
                    // FIX: Use "new-password" to aggressively disable address autofill
                    autoComplete="new-password"
                    // FIX: Prevent password managers from interfering
                    {...{ "data-lpignore": "true", "data-1p-ignore": "true" } as any}
               />

               {isLoading && (
                    <div className="absolute right-3 top-[38px] text-stone-400">
                         <Loader2 size={16} className="animate-spin" />
                    </div>
               )}

               {showSuggestions && predictions.length > 0 && (
                    <div className="absolute z-50 w-full bg-white border border-stone-200 rounded-xl shadow-xl mt-1 overflow-hidden max-h-60 overflow-y-auto">
                         {predictions.map(p => (
                              <button
                                   key={p.placeId}
                                   type="button"
                                   onClick={() => handlePredictionSelect(p.placeId, p.description)}
                                   className="w-full text-left px-4 py-3 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors border-b border-stone-100 last:border-0 flex items-start gap-3"
                              >
                                   <MapPin size={16} className="mt-0.5 shrink-0 text-stone-400" />
                                   <span>{p.description}</span>
                              </button>
                         ))}
                    </div>
               )}
          </div>
     )
}

export default AddressAutocomplete
