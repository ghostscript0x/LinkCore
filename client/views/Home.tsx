import React, { useState, useRef } from 'react';
import { 
  FileText, Code, Image as ImageIcon, File, 
  Settings, Lock, Shield, Eye, Clock, Copy, 
  Check, Plus, X, Zap, Download, KeyRound
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CreateLinkOptions, ContentType } from '../types';
import { api } from '../lib/api';
import { generateEncryptionKey, exportKeyToBase64, encryptContent } from '../lib/crypto';

const Home: React.FC = () => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<ContentType>('text');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const [options, setOptions] = useState<CreateLinkOptions>({
    expiry: '24h',
    maxViews: 0,
    encrypt: true,
    oneTime: false,
    downloadOnly: false,
    password: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = async () => {
    setIsUploading(true);
    try {
      let finalContent = content;
      let encryptionKey = '';

      if (options.encrypt) {
        const key = await generateEncryptionKey();
        encryptionKey = await exportKeyToBase64(key);
        if (content) finalContent = await encryptContent(content, key);
      }

      const fileMeta = file ? { name: file.name, size: file.size, mime: file.type } : undefined;
      const id = await api.createLink(finalContent || 'FILE_BLOB', type, options, fileMeta);
      
      const baseUrl = window.location.origin + window.location.pathname + '#/v/' + id;
      setGeneratedUrl(encryptionKey ? `${baseUrl}#key=${encryptionKey}` : baseUrl);
      setIsSuccess(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-xl px-4 py-12 mx-auto">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-white">Link Created</h2>
            <p className="text-slate-400">Your secure link is ready to be shared.</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center space-x-3">
             <input readOnly value={generatedUrl} className="bg-transparent flex-grow text-sm mono text-slate-300 focus:outline-none truncate" />
             <Button variant="secondary" size="sm" onClick={() => { navigator.clipboard.writeText(generatedUrl); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}>
               {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
             </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => window.open(generatedUrl, '_blank')}>Preview</Button>
            <Button onClick={() => { setIsSuccess(false); setContent(''); setFile(null); }}>New Link</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl px-4 py-10 sm:py-20 mx-auto">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Privacy made <span className="text-cyan-400">Simple</span>.
        </h1>
        <p className="text-lg text-slate-400 max-w-lg mx-auto">
          Share files and text securely. Zero tracking. Automatic destruction.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex border-b border-slate-800 p-2 overflow-x-auto">
           {['text', 'code', 'file'].map((t) => (
             <button 
               key={t}
               onClick={() => { if(t === 'file') { fileInputRef.current?.click(); } else { setType(t as ContentType); setFile(null); } }}
               className={`flex-1 min-w-[100px] flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all ${type === t || (t === 'file' && !!file) ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
               {t === 'text' && <FileText className="w-4 h-4" />}
               {t === 'code' && <Code className="w-4 h-4" />}
               {t === 'file' && <Plus className="w-4 h-4" />}
               <span className="font-semibold capitalize">{t}</span>
             </button>
           ))}
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {file ? (
            <div className="bg-slate-950 rounded-2xl p-8 border-2 border-dashed border-slate-800 flex flex-col items-center space-y-4">
               <File className="w-12 h-12 text-cyan-400" />
               <div className="text-center">
                 <p className="text-white font-medium">{file.name}</p>
                 <p className="text-slate-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
               </div>
               <button onClick={() => setFile(null)} className="text-red-400 text-sm flex items-center hover:underline"><X className="w-4 h-4 mr-1"/> Remove</button>
            </div>
          ) : (
            <textarea
              placeholder={type === 'code' ? "// Paste your code here..." : "Type or paste your secret message..."}
              className={`w-full h-64 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none ${type === 'code' ? 'mono text-sm' : 'text-lg'}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
            <button onClick={() => setShowOptions(!showOptions)} className="flex items-center space-x-2 text-slate-400 hover:text-white group">
              <Settings className={`w-5 h-5 ${showOptions ? 'rotate-90 text-cyan-400' : ''} transition-transform duration-300`} />
              <span className={`font-semibold text-sm ${showOptions ? 'text-cyan-400' : ''}`}>Advanced Options</span>
            </button>
            <Button size="lg" className="w-full sm:w-auto px-10 py-4" disabled={!content && !file} isLoading={isUploading} onClick={handleCreate}>
              <Zap className="w-5 h-5 mr-2" />
              Generate Link
            </Button>
          </div>

          {showOptions && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase flex items-center"><Clock className="w-3 h-3 mr-1.5" /> Expiry</span>
                    <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:ring-1 focus:ring-cyan-500 outline-none" value={options.expiry} onChange={(e)=>setOptions({...options, expiry: e.target.value as any})}>
                      <option value="1h">1 Hour</option>
                      <option value="24h">24 Hours</option>
                      <option value="7d">7 Days</option>
                      <option value="30d">30 Days</option>
                    </select>
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase flex items-center"><Eye className="w-3 h-3 mr-1.5" /> View Limit</span>
                    <input type="number" min="0" className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:ring-1 focus:ring-cyan-500 outline-none" value={options.maxViews} onChange={(e)=>setOptions({...options, maxViews: parseInt(e.target.value)||0})} placeholder="0 for unlimited" />
                  </label>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer" onClick={()=>setOptions({...options, encrypt: !options.encrypt})}>
                    <span className="text-sm font-semibold text-slate-300 flex items-center"><Lock className="w-4 h-4 mr-2 text-cyan-400" /> Client-Side Encryption</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${options.encrypt ? 'bg-cyan-600' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${options.encrypt ? 'left-6' : 'left-1'}`} />
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer" onClick={()=>setOptions({...options, oneTime: !options.oneTime})}>
                    <span className="text-sm font-semibold text-slate-300 flex items-center"><Shield className="w-4 h-4 mr-2 text-purple-400" /> Burn After Reading</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${options.oneTime ? 'bg-purple-600' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${options.oneTime ? 'left-6' : 'left-1'}`} />
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer" onClick={()=>setOptions({...options, downloadOnly: !options.downloadOnly})}>
                    <span className="text-sm font-semibold text-slate-300 flex items-center"><Download className="w-4 h-4 mr-2 text-emerald-400" /> Force Download Only</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${options.downloadOnly ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${options.downloadOnly ? 'left-6' : 'left-1'}`} />
                    </div>
                 </div>
                 <div className="relative">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-bold text-slate-500 uppercase flex items-center"><KeyRound className="w-3 h-3 mr-1.5" /> Password (Optional)</span>
                      <input 
                        type="password" 
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:ring-1 focus:ring-cyan-500 outline-none" 
                        value={options.password} 
                        onChange={(e)=>setOptions({...options, password: e.target.value})} 
                        placeholder="Set access password" 
                      />
                    </label>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={(e)=> { const s = e.target.files?.[0]; if(s){ setFile(s); setType(s.type.startsWith('image/') ? 'image' : 'file'); setContent(''); } }} className="hidden" />
    </div>
  );
};

export default Home;