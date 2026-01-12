import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './api/AuthContext';

// Configuration de QueryClient avec des options par défaut
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Récupération de l'élément racine avec vérification
try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error("L'élément racine 'root' est introuvable dans le DOM");
  }

  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false}  />
        )}
      </QueryClientProvider>
    </StrictMode>
  );
} catch (error) {
  console.error('Erreur lors du rendu de l\'application:', error);
  
  // Afficher un message d'erreur dans l'UI si possible
  const errorElement = document.createElement('div');
  errorElement.style.padding = '20px';
  errorElement.style.color = 'red';
  errorElement.style.fontFamily = 'sans-serif';
  errorElement.innerHTML = `
    <h2>Une erreur est survenue lors du chargement de l'application</h2>
    <p>${error instanceof Error ? error.message : 'Erreur inconnue'}</p>
    <p>Veuillez recharger la page ou contacter le support technique.</p>
  `;
  
  document.body.appendChild(errorElement);
}
