import  { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Envoyer l'erreur à un service de logging en production
    if (import.meta.env.PROD) {
      // TODO: Intégrer avec un service comme Sentry
      // Sentry.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Une erreur est survenue
              </h1>
              <p className="text-gray-600 mb-6">
                L'application a rencontré une erreur inattendue.
              </p>
              <details className="text-left bg-gray-50 p-4 rounded border border-gray-200">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Détails techniques
                </summary>
                <div className="mt-2 text-sm text-gray-600">
                  <p className="font-mono bg-red-50 p-2 rounded">
                    {this.state.error?.message || 'Erreur inconnue'}
                  </p>
                </div>
              </details>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Recharger la page
                </button>
                <button
                  onClick={() => this.setState({ hasError: false, error: undefined })}
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
