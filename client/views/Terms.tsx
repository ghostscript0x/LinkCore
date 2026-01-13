
import React from 'react';
import { ScrollText, Gavel, AlertTriangle, Scale } from 'lucide-react';

const Terms: React.FC = () => {
  const lastUpdated = "October 24, 2024";

  return (
    <div className="w-full max-w-4xl px-4 py-16 sm:py-24 mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
          Legal Agreement
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Terms of <span className="text-cyan-400">Service</span>
        </h1>
        <p className="text-slate-400">Last Updated: {lastUpdated}</p>
      </div>

      <div className="prose prose-invert prose-slate max-w-none bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-10">
        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-white">
            <ScrollText className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold m-0">1. Acceptance of Terms</h2>
          </div>
          <p className="text-slate-400 leading-relaxed">
            By accessing or using LinkCore, you agree to be bound by these Terms of Service. If you do not agree to all of the terms and conditions, you may not access the service. LinkCore is provided "as is" and "as available" without any warranties.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-white">
            <Gavel className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold m-0">2. Permitted Use</h2>
          </div>
          <p className="text-slate-400 leading-relaxed">
            You are responsible for your use of the Service and for any content you provide. You agree not to use the service for any illegal purposes or to share content that:
          </p>
          <ul className="list-disc pl-6 text-slate-400 space-y-2">
            <li>Violates local, state, or international laws.</li>
            <li>Contains malware, viruses, or harmful code.</li>
            <li>Infringes upon the intellectual property rights of others.</li>
            <li>Involves unauthorized access to other systems.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-white">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold m-0">3. Ephemeral Nature</h2>
          </div>
          <p className="text-slate-400 leading-relaxed">
            You acknowledge that LinkCore is an ephemeral service. Links and their associated content are automatically deleted after their expiration date or view limit is reached. We are not responsible for any data loss resulting from this automatic deletion.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-white">
            <Scale className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold m-0">4. Limitation of Liability</h2>
          </div>
          <p className="text-slate-400 leading-relaxed">
            In no event shall LinkCore Labs, its directors, or employees be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
        </section>
      </div>

      <div className="text-center text-slate-500 text-sm">
        Questions about these terms? Contact us via GitHub.
      </div>
    </div>
  );
};

export default Terms;
