import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css' 


const rootElement = document.getElementById('container')

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    )
} else {
    console.error("No se encontró el elemento con id 'container' en tu index.html")
}