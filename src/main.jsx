import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from './wallet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <App />
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>
)