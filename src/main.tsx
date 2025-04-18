
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

try {
  const root = document.getElementById("root");
  
  if (!root) {
    throw new Error("Root element not found");
  }
  
  createRoot(root).render(<App />);
} catch (error) {
  // Handle critical startup errors
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
      <h1>Application Error</h1>
      <p>The application failed to start. Please refresh the page or contact support.</p>
    </div>
  `;
}
