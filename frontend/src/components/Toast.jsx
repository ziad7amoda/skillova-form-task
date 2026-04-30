import { Toaster } from 'sonner'

export default function Toast() {
  return (
    <Toaster
      richColors
      position="top-right"
      theme="dark"
      toastOptions={{
        style: {
          background: '#1a2236',
          border: '1px solid #1e293b',
          color: '#e8e4dc',
          fontFamily: 'Outfit, system-ui, sans-serif',
          fontSize: '0.875rem',
        },
      }}
    />
  )
}
