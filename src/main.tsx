
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx starting up...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
}

console.log('Root element found, creating React root...');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('React app rendered successfully');
