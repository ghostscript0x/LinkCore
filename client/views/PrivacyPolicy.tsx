
import React from 'react';
import { ShieldCheck, EyeOff, Trash2, Key, Database } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "October 24, 2024";

  return (
    <div className="w-full max-w-4xl px-4 py-16 sm:py-24 mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
          Your Privacy
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Privacy <span className="text-cyan-400">Policy</span>
        </h1>
        <p className="text-slate-400">Last Updated: {lastUpdated}</p>
      </div>

      <div className="prose prose-invert prose-slate max-w-none bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-10">
        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-white">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold m-0">1. Data Collection</h2>
          </div>
          <p className="text-slate-400 leading-relaxed">
            LinkCore is designed to collect as little data as possible. We do not require accounts, email addresses, or any personal identification. 
          </p>
          <ul className="list-disc pl-6 text-slate-400 space-y-2">
            <li><strong>Content:</strong> We store the content you upload only until its expiration or view limit is reached. If encryption is enabled, this content is stored in encrypted format.</li>
            <li><strong>Logs:</strong> We do not maintain persistent logs of IP addresses or browsing activity beyond what is required for short-term rate limiting to prevent abuse.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-white">
            <Key className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold m-0">2. Encryption</h2>
          </div>
          <p className="text-slate-400 leading-relaxed">
            When client-side encryption is used, the encryption keys are never transmitted to our servers. The keys are stored in the URL fragment, which is not sent to the server by your browser. We have no way to decrypt your data.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-white">
            <Trash2 className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold m-0">3. Data Retention</h2>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Data retention is ephemeral. Content is automatically purged from our database and storage providers (like Cloudinary) immediately upon expiration or consumption of a one-time link.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-white">
            <EyeOff className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold m-0">4. Third Parties</h2>
          </div>
          <p className="text-slate-400 leading-relaxed">
            We use a limited number of third-party services to provide the LinkCore experience:
          </p>
          <ul className="list-disc pl-6 text-slate-400 space-y-2">
            <li><strong>Cloudinary:</strong> Used for temporary storage of file blobs.</li>
            <li><strong>Redis/PostgreSQL:</strong> Managed hosting for metadata and ephemeral state.</li>
          </ul>
          <p className="text-slate-400">We do not sell your data to any third parties.</p>
        </section>
      </div>

      <div className="text-center text-slate-500 text-sm">
        Our privacy commitment is built into our code.
      </div>
    </div>
  );
};

export default PrivacyPolicy;
