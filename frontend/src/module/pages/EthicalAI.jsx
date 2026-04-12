import React from "react";
import { Link } from "react-router-dom";

const EthicalAI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <header className="mb-10 flex flex-col items-center text-center gap-4">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-teal-400 mb-2">Principles</p>
            <h1 className="text-3xl sm:text-[2.35rem] font-semibold bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(56,189,248,0.35)]">
              Ethical AI at ContentCrafter
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
              We design ContentCrafter so AI feels helpful, honest, and safe. These simple guidelines explain how we think about responsible AI.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-1">
            <Link
              to="/user-dashboard"
              className="inline-flex items-center rounded-full border border-gray-800 bg-gray-900/60 px-4 py-2 text-xs sm:text-sm text-gray-200 hover:border-teal-400 hover:text-teal-300 transition"
            >
              Back to dashboard
            </Link>
          </div>
        </header>

        <main className="space-y-6">
          <section className="rounded-2xl border border-gray-800/70 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.14),_transparent_55%),_rgba(15,23,42,0.96)] backdrop-blur-md p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">1. People first, AI second</h2>
            <p className="text-xs sm:text-sm text-gray-300">
              AI is here to support your ideas, not replace your judgement. You stay in control: you choose what to publish, what to edit, and what to delete.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-800/70 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.14),_transparent_55%),_rgba(15,23,42,0.96)] backdrop-blur-md p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">2. Be clear and honest</h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Always review AI content before sharing. If something is a guess or creative idea, treat it as a draft, not as fact. Fact-check numbers, names, and claims when it matters.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-800/70 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.14),_transparent_55%),_rgba(15,23,42,0.96)] backdrop-blur-md p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">3. Respect people and policies</h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Do not use ContentCrafter to create hateful, harmful, or misleading content. Follow local laws, platform guidelines, and your own brand values when you publish.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-800/70 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.14),_transparent_55%),_rgba(15,23,42,0.96)] backdrop-blur-md p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">4. Simple checklist before you post</h2>
            <ul className="mt-1 space-y-1 text-xs sm:text-sm text-gray-300 list-disc list-inside">
              <li>Is this content respectful and fair?</li>
              <li>Is it clear what is opinion and what is fact?</li>
              <li>Do I have the right to share this information?</li>
              <li>Would I be comfortable putting my name or brand on it?</li>
            </ul>
          </section>
        </main>

        <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
          <Link
            to="/user-centric"
            className="rounded-full border border-sky-400/70 px-4 py-2 text-sky-100 hover:bg-sky-900/30 transition"
          >
            Learn about user-centric design
          </Link>
          <Link
            to="/innovation-focus"
            className="rounded-full border border-emerald-400/70 px-4 py-2 text-emerald-100 hover:bg-emerald-900/30 transition"
          >
            Learn about innovation focus
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EthicalAI;
