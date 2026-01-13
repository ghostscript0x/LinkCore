
import React from 'react';
import { Shield, EyeOff, Trash2, Key, Database, Ghost, Lock, Github, ExternalLink } from 'lucide-react';

const Privacy: React.FC = () => {
  const sections = [
    {
      icon: <Key className="w-8 h-8 text-cyan-400" />,
      title: "Zero-Knowledge Encryption",
      description: "LinkCore uses AES-256-GCM client-side encryption. This means your data is encrypted in your browser before it ever touches our servers. We never see your plaintext content or your encryption keys."
    },
    {
      icon: <Trash2 className="w-8 h-8 text-purple-400" />,
      title: "Ephemeral by Design",
      description: "Everything on LinkCore is temporary. Links are automatically destroyed after they expire or reach their view limit. Once a link is deleted, it's gone from our database and cache forever."
    },
    {
      icon: <EyeOff className="w-8 h-8 text-emerald-400" />,
      title: "No Accounts, No Tracking",
      description: "We don't want your data. LinkCore requires no accounts, logs no IP addresses longer than necessary for rate limiting, and uses no third-party tracking cookies."
    },
    {
      icon: <Database className="w-8 h-8 text-blue-400" />,
      title: "Isolated Infrastructure",
      description: "Each shared object is an isolated entity. We don't link pieces of data together or build user profiles. Your privacy is protected by technical isolation."
    }
  ];

  return (
    <div className="w-full max-w-5xl px-4 py-16 sm:py-24 mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Privacy is a <span className="text-cyan-400 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Human Right</span>.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          At LinkCore, we don't just promise privacy—we enforce it through mathematics and architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-slate-700 transition-colors space-y-4">
            <div className="bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-800 shadow-inner">
              {section.icon}
            </div>
            <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            <p className="text-slate-400 leading-relaxed">
              {section.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="bg-cyan-500/10 p-6 rounded-full">
            <Shield className="w-16 h-16 text-cyan-400" />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white">How Encryption Works here</h2>
            <p className="text-slate-300">
              When you enable "Encrypted" mode, LinkCore generates a unique cryptographic key locally. 
              Your data is encrypted, and the resulting ciphertext is sent to us. The key is appended to your 
              URL as a <strong>hash fragment (#)</strong>. 
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold uppercase tracking-widest">
              <span className="flex items-center text-slate-400"><Lock className="w-4 h-4 mr-2" /> AES-GCM-256</span>
              <span className="flex items-center text-slate-400"><Key className="w-4 h-4 mr-2" /> Client-Side Only</span>
              <span className="flex items-center text-slate-400"><Ghost className="w-4 h-4 mr-2" /> Zero Logs</span>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-sm overflow-x-auto text-slate-400 shadow-inner">
          <p className="text-cyan-400 mb-2">// Server logs for encrypted links look like this:</p>
          <p>GET /api/links/aB3xP9qLm2</p>
          <p>RESPONSE: {"{ content: \"U2FsdGVkX1+v...\", is_encrypted: true }"}</p>
          <p className="mt-4 text-emerald-400">// The key never leaves your computer:</p>
          <p>URL: linkcore.app/#/v/aB3xP9qLm2<span className="text-red-400">#key=Q2xhdWRl...</span></p>
          <p className="text-slate-500 italic mt-2 text-xs">Fragment data (#) is never sent to servers by web browsers.</p>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6 pt-8">
        <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
        <div className="flex flex-col items-center space-y-4">
          <p className="text-slate-500 text-sm text-center">
            Transparency is a key part of trust. Our code is open for anyone to inspect.
          </p>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white px-6 py-3 rounded-full transition-all group shadow-lg"
          >
            <Github className="w-5 h-5" />
            <span className="font-semibold">View Source on GitHub</span>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
