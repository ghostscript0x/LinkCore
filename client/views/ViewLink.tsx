


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Lock, AlertCircle, Clock, Copy, Check, File, ShieldCheck, Eye, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';
import { LinkObject } from '../types';
import { importKeyFromBase64, decryptContent } from '../lib/crypto';

const ViewLink: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [link, setLink] = useState<LinkObject | null>(null);
  const [decrypted, setDecrypted] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await api.getLink(id);
        setLink(data);
        if (data.isEncrypted) {
          const keyParam = window.location.hash.split('key=')[1];
          if (!keyParam) throw new Error("Decryption key missing from URL.");
          const cryptoKey = await importKeyFromBase64(keyParam);
          setDecrypted(await decryptContent(data.content, cryptoKey));
        } else {
          setDecrypted(data.content);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) return (
    <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Decrypting content...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-md mx-auto p-10 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-6 m-4 mt-20">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
      <h2 className="text-2xl font-bold text-white">Access Denied</h2>
      <p className="text-slate-400">{error}</p>
      <Button className="w-full" onClick={() => window.location.href = '/'}>Back Home</Button>
    </div>
  );

  if (!link) return null;

  return (
    <div className="w-full max-w-4xl px-4 py-10 space-y-8 animate-in fade-in duration-500 mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-cyan-500/10 p-4 rounded-2xl border border-cyan-500/20">
            <File className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{link.fileName || 'Secure Secret'}</h1>
            <div className="flex items-center space-x-4 text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">
              <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Exp: {new Date(link.expiresAt).toLocaleTimeString()}</span>
              <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {link.currentViews}/{link.maxViews || '∞'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* Fix: Wrapped icons in spans with title attributes to resolve TypeScript 'title' prop errors on Lucide components */}
          {link.isEncrypted && (
            <span title="End-to-End Encrypted">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </span>
          )}
          {link.isOneTime && (
            <span title="Burn after Reading">
              <Trash2 className="w-6 h-6 text-purple-500" />
            </span>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[400px]">
        <div className="bg-slate-950/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{link.type} view</span>
          <Button variant="secondary" size="sm" onClick={() => { navigator.clipboard.writeText(decrypted); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}>
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <div className="p-6 sm:p-10 flex-grow">
          {link.type === 'file' || link.type === 'image' ? (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-12">
                <div className="p-10 bg-slate-950 rounded-full border border-slate-800">
                  <File className="w-16 h-16 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{link.fileName}</h3>
                  <p className="text-slate-500 text-sm mt-1">Ready for secure download</p>
                </div>
                <Button size="lg" className="px-12">Download Securely</Button>
             </div>
          ) : (
            <pre className={`whitespace-pre-wrap break-all text-slate-300 leading-relaxed ${link.type === 'code' ? 'mono text-sm p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner' : 'text-lg'}`}>
              {decrypted}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLink;