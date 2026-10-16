import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Livkam Error Boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    localStorage.removeItem('livkam_cached_products');
    localStorage.removeItem('livkam_cached_brands');
    localStorage.removeItem('livkam_cached_categories');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
              ⚠️
            </div>
            <h2 className="text-xl font-black text-white">Something went wrong</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              An unexpected error occurred while loading this view. You can reload the page or return to the homepage.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Refresh Application
              </button>
              <a
                href="/"
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
