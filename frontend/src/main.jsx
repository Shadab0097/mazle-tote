import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import './index.css'
import App from './App.jsx'

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID';
const PAYPAL_CURRENCY = import.meta.env.VITE_PAYPAL_CURRENCY || 'INR';

// Note: PayPal SDK automatically uses sandbox when given a sandbox client ID.
// Ensure your Client ID from .env is from the PayPal Developer Sandbox app.
const initialOptions = {
  clientId: PAYPAL_CLIENT_ID,
  currency: PAYPAL_CURRENCY,
  intent: 'capture',
  // debug: true, // Disabled for production - enable for sandbox testing only
  // Optional: add components if needed
  // components: 'buttons,marks',
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PayPalScriptProvider options={initialOptions}>
      <App />
    </PayPalScriptProvider>
  </StrictMode>,
)
