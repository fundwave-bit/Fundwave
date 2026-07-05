import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { trpc } from "@/lib/trpc"
import { ToastProvider } from "@/components/ui/toast"
import App from "./App"
import "./index.css"

const token = localStorage.getItem("token")

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/trpc",
      headers() {
        return token ? { Authorization: `Bearer ${token}` } : {}
      },
    }),
  ],
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
)
