import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MoodProvider } from './context/MoodContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { QueueProvider } from './context/QueueContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import ToastStack from './components/ToastStack.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <MoodProvider>
        <QueueProvider>
          <ToastProvider>
            <App />
            <ToastStack />
          </ToastProvider>
        </QueueProvider>
      </MoodProvider>
    </ThemeProvider>
  </StrictMode>,
)
