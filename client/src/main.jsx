import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import UserAppProvider from './context/UserAppContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <UserAppProvider>
   <BrowserRouter>
      <App />
    </BrowserRouter>
   </UserAppProvider>
  </StrictMode>,
)
