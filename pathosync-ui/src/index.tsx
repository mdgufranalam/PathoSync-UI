import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import SaaSApp from './SaaSApp';
import './styles/globals.css';

// Determine which app to load based on URL or environment
function AppRouter() {
    // Check if we're on a SaaS subdomain or path
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // SaaS Portal conditions
    const isSaaSSubdomain = hostname.startsWith('admin.') ||
        hostname.startsWith('portal.') ||
        hostname.startsWith('saas.');

    const isSaaSPath = pathname.startsWith('/admin') ||
        pathname.startsWith('/portal') ||
        pathname.startsWith('/saas');

    const isSaaSMode = isSaaSSubdomain || isSaaSPath ||
        new URLSearchParams(window.location.search).get('mode') === 'saas';

    // Load appropriate app
    if (isSaaSMode) {
        return <SaaSApp />;
    } else {
        return <App />;
    }
}

// Initialize the app
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<AppRouter />);
}

// Add some global CSS for the router
const style = document.createElement('style');
style.textContent = `
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  * {
    box-sizing: border-box;
  }
  
  #root {
    min-height: 100vh;
  }
`;
document.head.appendChild(style);