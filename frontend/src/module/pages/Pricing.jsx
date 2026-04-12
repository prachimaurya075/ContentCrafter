import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";

const useCases = [
  {
    label: "For Students",
    emoji: "📚",
    badge: "Essays & research",
    description:
      "Turn rough ideas into clear drafts and tidy notes for class.",
    bullets: [
      "Essay outlines ready to expand",
      "Short summaries of long readings",
    ],
  },
  {
    label: "For Freelancers",
    emoji: "💼",
    badge: "Client-ready drafts",
    description:
      "Write proposals and client updates faster, without losing your tone.",
    bullets: [
      "Client proposals with clear scope",
      "Polished check-in and feedback emails",
    ],
  },
  {
    label: "For Content Creators",
    emoji: "🎥",
    badge: "Daily content engine",
    description:
      "Plan long-form pieces and break them into clips and captions.",
    bullets: [
      "Video / podcast script outlines",
      "Carousel copy with hook ideas",
    ],
  },
  {
    label: "For Marketers",
    emoji: "📈",
    badge: "Campaign copy",
    description:
      "Keep email, landing page, and social copy aligned to one idea.",
    bullets: [
      "Launch email sequences and follow-ups",
      "Benefit-focused landing page sections",
    ],
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%),_#020617] text-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <header className="mb-12 flex flex-col items-center text-center gap-3">
          <div className="max-w-3xl">
            <h1 className="text-[2.1rem] sm:text-[2.8rem] font-bold leading-tight bg-gradient-to-r from-sky-400 via-blue-400 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.6)]">
              One workspace, many ways to use it
            </h1>
            <p className="mt-4 text-sm sm:text-[1rem] text-gray-300 max-w-2xl mx-auto">
              ContentCrafter adapts to different kinds of people. Show how
              students, freelancers, creators, and marketers all get tailored
              flows instead of a one-size-fits-all chat box.
            </p>
          </div>
        </header>

        {/* Use Cases grid */}
        <section className="mb-20 mt-6">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-[1.35rem] sm:text-[1.65rem] font-semibold text-white">
              Who gets value from ContentCrafter?
            </h2>
            <p className="mt-3 text-sm sm:text-[1rem] text-gray-300">
              Four quick examples that you can walk through in your final
              project demo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase) => (
              <div
                key={useCase.label}
                className="card-animate group relative rounded-2xl border border-slate-800/80 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.20),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.18),_transparent_55%),_rgba(15,23,42,0.98)] p-7 sm:p-8 flex flex-col justify-between overflow-hidden shadow-[0_24px_60px_rgba(15,23,42,0.98)] hover:border-sky-300/90 hover:shadow-[0_0_42px_rgba(56,189,248,0.55)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-base sm:text-xl transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" aria-hidden="true">
                        {useCase.emoji}
                      </span>
                      <h3 className="text-[1rem] sm:text-[1.08rem] font-semibold text-white">
                        {useCase.label}
                      </h3>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-sky-300/40 bg-sky-500/15 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-sky-100 transition-colors duration-300 group-hover:bg-sky-400/25 group-hover:border-sky-200/70">
                      {useCase.badge}
                    </span>
                  </div>
                  <p className="text-[0.85rem] sm:text-[0.96rem] text-gray-200/95 mb-3.5">
                    {useCase.description}
                  </p>
                  <ul className="space-y-2 text-[11px] sm:text-[0.83rem] text-sky-50/95 transition-opacity duration-300 group-hover:opacity-100">
                    {useCase.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-1.5">
                        <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-sky-300 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="mt-7 inline-flex items-center justify-between rounded-full border border-slate-700/80 bg-slate-900/80 px-6 py-2.5 text-[0.78rem] sm:text-[0.86rem] text-slate-100 group-hover:border-sky-300 group-hover:text-sky-100 group-hover:bg-black/60 transition-all duration-300 group-hover:translate-y-0.5">
                  Walk through this flow
                  <span className="ml-1 text-xs group-hover:translate-x-0.5 transition-transform">→</span>
                </button>

                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400/0 via-sky-300/80 to-sky-400/0 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>

        </section>

        {/* Note */}
        <section className="max-w-2xl mx-auto text-center text-xs sm:text-sm text-gray-400">
          <p>
            This page is focused on example use cases. In a live product, each
            card would take the user into a tailored workspace with saved
            prompts, structure, and example outputs for that scenario.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Pricing;
