import axios, { AxiosError } from "axios"


// 2. Define the interceptor logic
const errorInterceptor = (error: AxiosError<any>) => {
     // Any status codes that falls outside the range of 2xx cause this function to trigger

     if (error.response && error.response.data) {
          const { message, code } = error.response.data

          // Check if the response matches your Adonis exception structure
          if (message) {
               // Instead of throwing a new Error, we attach the custom data to the existing Axios error
               // This preserves the original error structure (stack, config, etc.)
               ;(error as CustomAxiosError).customError = {
                    message,
                    code,
                    status: error.response.status,
               }
          }
     }

     // Pass the modified (or original) error down the chain
     return Promise.reject(error)
}

// 3. Apply it to the global default instance (so standard 'import axios' works)
axios.interceptors.response.use(response => response, errorInterceptor)

// Define a custom interface that extends AxiosError
// This tells TypeScript that our errors might have these extra properties
export interface CustomAxiosError extends AxiosError {
     customError?: {
          message: string
          code?: string
          status?: number
     }
}

export function isCustomAxiosError(error: any): error is CustomAxiosError {
     return error && typeof error === 'object' && 'customError' in error
}
