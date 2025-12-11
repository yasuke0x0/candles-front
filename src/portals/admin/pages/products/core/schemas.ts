import * as Yup from "yup"

export const ProductSchema = Yup.object().shape({
     name: Yup.string().required("Product name is required"),
     description: Yup.string().required("Description is required"),
     price: Yup.number().min(0, "Price cannot be negative").required("Price is required"),
     stock: Yup.number().min(0, "Stock cannot be negative").integer("Stock must be a whole number").required("Stock is required"),
     image: Yup.string().url("Must be a valid URL").required("Image URL is required"),

     // Shipping
     weight: Yup.number().min(0.01, "Weight required").required("Required"),
     length: Yup.number().min(0.1, "Required").required("Required"),
     width: Yup.number().min(0.1, "Required").required("Required"),
     height: Yup.number().min(0.1, "Required").required("Required"),

     // Meta
     scentNotes: Yup.array().of(Yup.string()).min(1, "Add at least one scent note"),
     isNew: Yup.boolean(),

     discountId: Yup.number().nullable(),
})
