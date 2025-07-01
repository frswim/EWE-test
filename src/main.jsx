import React from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.jsx'

import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from './wallet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)