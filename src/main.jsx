import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// REMOVED index.css to stop it from breaking your x.css styles
// REMOVED StrictMode to prevent double-rendering state issues

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)