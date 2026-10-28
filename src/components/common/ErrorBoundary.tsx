import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackLanguage?: 'pt' | 'en' | 'es';
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught application error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearCacheAndReload = () => {
    try {
      sessionStorage.clear();
      // Keep user preferences intact if possible, but clear transient states
      localStorage.removeItem('bookshelf_schema_version');
    } catch (e) {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const lang = this.props.fallbackLanguage || 'pt';
      const messages = {
        pt: {
          title: 'Algo inesperado aconteceu',
          desc: 'O aplicativo encontrou um erro temporário, mas seus dados continuam seguros.',
          reload: 'Recarregar Aplicativo',
          clearCache: 'Limpar Cache e Reiniciar',
          details: 'Detalhes técnicos:'
        },
        en: {
          title: 'Something unexpected happened',
          desc: 'The application encountered a temporary error, but your reading records remain safe.',
          reload: 'Reload Application',
          clearCache: 'Clear Cache & Restart',
          details: 'Technical details:'
        },
        es: {
          title: 'Algo inesperado ocurrió',
          desc: 'La aplicación encontró un error temporal, pero sus datos se encuentran seguros.',
          reload: 'Recargar Aplicación',
          clearCache: 'Limpiar Caché y Reiniciar',
          details: 'Detalles técnicos:'
        }
      }[lang];

      return (
        <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-surface-container border border-primary/20 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl" aria-hidden="true">
                sync_problem
              </span>
            </div>

            <div>
              <h1 className="font-serif text-2xl font-bold text-on-surface">
                {messages.title}
              </h1>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                {messages.desc}
              </p>
            </div>

            {this.state.error && (
              <details className="text-left bg-surface-container-lowest p-3 rounded-xl border border-primary/10 text-xs text-on-surface-variant/80 overflow-x-auto">
                <summary className="cursor-pointer font-mono font-medium text-primary">
                  {messages.details}
                </summary>
                <pre className="mt-2 font-mono whitespace-pre-wrap break-words">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary-container transition-all cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-primary-container"
              >
                {messages.reload}
              </button>

              <button
                type="button"
                onClick={this.handleClearCacheAndReload}
                className="w-full min-h-[44px] py-2 px-4 rounded-xl bg-surface-container-highest text-on-surface text-xs font-medium hover:bg-surface-container-highest/80 transition-colors cursor-pointer"
              >
                {messages.clearCache}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
