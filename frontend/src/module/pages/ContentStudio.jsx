import React from "react";
import Header from "../components/Header/Header";

const ContentStudio = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <Header />
       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <header className="mb-12 flex flex-col items-center text-center gap-4">
          <div className="max-w-3xl">
            <h1 className="text-[1.9rem] sm:text-[2.6rem] font-semibold bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(56,189,248,0.35)]">
              One place for all your content
            </h1>
            <p className="mt-4 text-sm sm:text-[0.98rem] text-gray-300 max-w-2xl mx-auto">
              Plan, write, and organize blogs, social posts, and more in a single
              AI-powered workspace. Simple to understand, ready to grow with you.
            </p>
            <p className="mt-2 text-[0.85rem] sm:text-[0.96rem] font-medium bg-gradient-to-r from-sky-300 via-blue-400 to-teal-300 bg-clip-text text-transparent">
              Think of it as your hub for content ideas, drafts, and social-ready pieces.
            </p>
          </div>
        </header>

        {/* What lives inside Content Studio */}
        <section className="mb-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[1.02rem] sm:text-[1.15rem] font-semibold text-white">What you manage inside Content Studio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-animate rounded-2xl border border-gray-800/70 bg-gradient-to-b from-sky-900/70 via-slate-900 to-slate-950 backdrop-blur-md p-5 sm:p-6 shadow-[0_18px_40px_rgba(15,23,42,0.9)] hover:border-sky-400/80 hover:shadow-[0_0_32px_rgba(56,189,248,0.5)] transition-all duration-300 hover:-translate-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Long form</p>
            <h2 className="text-[1rem] sm:text-[1.08rem] font-medium text-white mb-1">Articles & blogs</h2>
            <p className="text-[0.85rem] sm:text-[0.96rem] text-gray-300">
              Turn ideas into full articles with outlines, drafts, and final edits
              in one focused view.
            </p>
          </div>
          <div className="card-animate rounded-2xl border border-gray-800/70 bg-gradient-to-b from-sky-900/70 via-slate-900 to-slate-950 backdrop-blur-md p-5 sm:p-6 shadow-[0_18px_40px_rgba(15,23,42,0.9)] hover:border-sky-400/80 hover:shadow-[0_0_32px_rgba(56,189,248,0.5)] transition-all duration-300 hover:-translate-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Social first</p>
            <h2 className="text-[1rem] sm:text-[1.08rem] font-medium text-white mb-1">Posts & hooks</h2>
            <p className="text-[0.85rem] sm:text-[0.96rem] text-gray-300">
              Draft Instagram captions, LinkedIn posts, and short hooks together,
              with AI helping at every step.
            </p>
          </div>
          <div className="card-animate rounded-2xl border border-gray-800/70 bg-gradient-to-b from-sky-900/70 via-slate-900 to-slate-950 backdrop-blur-md p-5 sm:p-6 shadow-[0_18px_40px_rgba(15,23,42,0.9)] hover:border-sky-400/80 hover:shadow-[0_0_32px_rgba(56,189,248,0.5)] transition-all duration-300 hover:-translate-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Workflows</p>
            <h2 className="text-[1rem] sm:text-[1.08rem] font-medium text-white mb-1">AI flows & future tools</h2>
            <p className="text-[0.85rem] sm:text-[0.96rem] text-gray-300">
              Use chat, templates, and Creator Wizard today, and easily plug in new
              content types later.
            </p>
          </div>
          </div>
        </section>

        {/* How it helps you day to day */}
        <section className="max-w-3xl mx-auto mt-6 rounded-2xl border border-gray-800/70 bg-gray-950/80 backdrop-blur-md p-5 sm:p-6">
          <h2 className="text-[0.95rem] sm:text-[1.02rem] font-semibold text-white mb-3.5">How Content Studio helps you</h2>
          <ul className="space-y-2 text-[0.8rem] sm:text-[0.95rem] text-gray-300">
            <li className="flex items-start gap-2">
              <span className="mt-[4px] h-1.5 w-1.5 rounded-full bg-teal-400 flex-shrink-0" />
              <span>One clear place instead of many tabs, docs, and tools.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[4px] h-1.5 w-1.5 rounded-full bg-teal-400 flex-shrink-0" />
              <span>AI chat, templates, and prompts working together for blogs and social content.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[4px] h-1.5 w-1.5 rounded-full bg-teal-400 flex-shrink-0" />
              <span>Room to add new formats later, without confusing your users.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ContentStudio;
