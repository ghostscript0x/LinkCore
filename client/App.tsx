
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { ShieldCheck, Zap, Ghost, Github, Heart } from 'lucide-react';

const Home = lazy(() => import('./views/Home'));
const ViewLink = lazy(() => import('./views/ViewLink'));
const Privacy = lazy(() => import('./views/Privacy'));
const Terms = lazy(() => import('./views/Terms'));
const PrivacyPolicy = lazy(() => import('./views/PrivacyPolicy'));

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-cyan-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Zap className="w-6 h-6 text-slate-950" fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-100">Link<span className="text-cyan-400">Core</span></span>
          </Link>
          <nav className="flex items-center space-x-4 sm:space-x-8 text-sm font-medium text-slate-400">
            <Link to="/" className="hover:text-cyan-400 transition-colors hidden xs:block">Home</Link>
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors">How it Works</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center space-y-4">
               <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyan-500"></div>
               <p className="text-slate-500 text-sm">Loading LinkCore...</p>
            </div>
          </div>
        }>
          {children}
        </Suspense>
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-slate-800/50 pb-8 mb-8">
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-slate-800 p-1 rounded-md">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">LinkCore</span>
              </Link>
              <p className="text-slate-500 text-sm text-center md:text-left max-w-xs">
                Empowering individuals with ephemeral, secure, and private data sharing tools.
              </p>
            </div>

            <div className="flex justify-center space-x-8 text-sm font-medium text-slate-400">
              <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
            </div>

            <div className="flex justify-center md:justify-end space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <div className="p-2 bg-slate-900 rounded-full text-slate-400">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 space-y-4 md:space-y-0 uppercase tracking-widest font-bold">
            <p>&copy; {currentYear} LINKCORE LABS. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1.5">
                <Heart className="w-3 h-3 text-red-500" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Ghost className="w-3 h-3 text-purple-500" />
                <span>Zero Retention</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/v/:id" element={<ViewLink />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<div className="p-20 text-center">404 Not Found</div>} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
