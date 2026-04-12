import React from "react";
import { useNavigate } from "react-router-dom";
// Temporary placeholders - create actual Header/Footer or adjust paths
const Header = () => <header className="p-4 bg-slate-950 text-white"><h1>Header</h1></header>;
const Footer = () => <footer className="p-4 bg-slate-900 text-gray-400 text-center"><p>Footer</p></footer>;

const InnovationFocus = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white font-Poppins">
      <Header />

      <section className="pt-20 pb-14 px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-cyan-200 sm:text-5xl">
                  Innovation Focus
                </h1>
                <p className="mt-3 max-w-2xl text-gray-300 sm:text-lg">
                  Deep dive into how ContentCrafter stays ahead: new model features, collaborative feedback loops, and actionable insights that help you publish better content faster.
                </p>
              </div>
              <span className="inline-flex whitespace-nowrap rounded-full bg-cyan-500/20 px-4 py-2 text-cyan-100 text-sm font-semibold">
                new: design sprint tour + expert recipes
              </span>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <article className="rounded-2xl border border-cyan-500/30 bg-slate-800/80 p-6 shadow-inner transition hover:-translate-y-1 hover:bg-cyan-950/30">
                <h2 className="text-xl font-bold text-cyan-300">1. Context-Aware Synthesis</h2>
                <p className="mt-2 text-gray-300">Our pipeline dynamically weights prompts and user signals. It blends past editing history, required format, and audience effect into one high-quality response.</p>
                <ul className="mt-3 space-y-2 text-gray-200">
                  <li>• Session memory retains voice and brand cues</li>
                  <li>• Instant variant generation (formal, casual, SEO-ready)</li>
                  <li>• Compliance-safe content planning mode</li>
                </ul>
              </article>

              <article className="rounded-2xl border border-blue-500/30 bg-slate-800/80 p-6 shadow-inner transition hover:-translate-y-1 hover:bg-blue-950/30">
                <h2 className="text-xl font-bold text-blue-300">2. Smart Experiment Dashboard</h2>
                <p className="mt-2 text-gray-300">Measure quality improvement with clear metrics and simple charts. Switch between tactics and compare performance in real time without losing workflow momentum.</p>
                <ul className="mt-3 space-y-2 text-gray-200">
                  <li>• A/B test content versions in one click</li>
                  <li>• Audience preference scoring (engagement/clarity)</li>
                  <li>• Model drift alerts when style changes</li>
                </ul>
              </article>

              <article className="rounded-2xl border border-indigo-500/30 bg-slate-800/80 p-6 shadow-inner transition hover:-translate-y-1 hover:bg-indigo-950/30">
                <h2 className="text-xl font-bold text-indigo-300">3. Co-Create Mode & Rapid Prototyping</h2>
                <p className="mt-2 text-gray-300">Build with collaboration controls and live suggestion lanes. Invite team members, lock key terms, and refine the piece with one unified timeline.</p>
                <ul className="mt-3 space-y-2 text-gray-200">
                  <li>• Live onboarding guide for new drafts</li>
                  <li>• Version snapshots + rollback safeguards</li>
                  <li>• Quick publish checklists for consistency</li>
                </ul>
              </article>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-cyan-500/30 bg-gray-900/70 p-6">
              <h3 className="text-lg font-bold text-cyan-200">Why this matters</h3>
              <p className="mt-2 text-gray-300">Innovation produces measurable ROI. Teams using these features report 30% less editing cycles and 20% faster delivery in real customer tests.</p>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-gray-900/70 p-6">
              <h3 className="text-lg font-bold text-blue-200">How to try it</h3>
              <ol className="mt-2 list-decimal pl-5 text-gray-200 space-y-2">
                <li>Pick a creative brief or blog topic.</li>
                <li>Enable "Co-Create Mode" and select metric benchmark.</li>
                <li>Run a "Variant Experiment" and review insights panel.</li>
              </ol>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/user-dashboard')} className="rounded-xl bg-cyan-500 px-6 py-3 text-black font-semibold transition hover:bg-cyan-400">
              Back to Dashboard
            </button>
            <button onClick={() => navigate('/ethical-ai')} className="rounded-xl border border-cyan-300 px-6 py-3 text-cyan-100 transition hover:bg-cyan-700/20">
              See Ethical AI Focus
            </button>
            <button onClick={() => navigate('/user-centric')} className="rounded-xl border border-blue-300 px-6 py-3 text-blue-100 transition hover:bg-blue-700/20">
              See User-Centric Focus
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InnovationFocus;
