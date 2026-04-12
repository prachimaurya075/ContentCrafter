import React from "react";
import { Link } from "react-router-dom";

const featureGroups = [
  {
    label: "Writing experience",
    features: [
      {
        title: "AI chat workspace",
        description:
          "Ask questions, brainstorm ideas, and refine drafts in a ChatGPT-style interface designed specifically for creators.",
        chip: "Chat-Based",
      },
      {
        title: "Creator Wizard",
        description:
          "Turn your idea, keywords, and tone into a high-quality prompt in just a few guided steps.",
        chip: "Guided",
      },
      {
        title: "Genre-based flows",
        description:
          "Dedicated flows for blogs, YouTube scripts, Instagram captions, LinkedIn posts, and more.",
        chip: "Templates",
      },
    ],
  },
  {
    label: "Productivity & workflow",
    features: [
      {
        title: "Conversation history",
        description:
          "Automatically save and revisit your best conversations so you never lose a strong hook or outline.",
        chip: "History",
      },
      {
        title: "Smart categories",
        description:
          "Switch between Business, Content, Creative, and Social modes so the AI matches your channel and voice.",
        chip: "Context",
      },
      {
        title: "One-click sharing",
        description:
          "Copy full conversations, last answers, or LinkedIn-ready drafts in a single click.",
        chip: "Share",
      },
    ],
  },
  {
    label: "Experience & design",
    features: [
      {
        title: "Creator-first layout",
        description:
          "A clean, distraction-free interface focused on the page you are writing, not on settings.",
        chip: "UX",
      },
      {
        title: "Dark, focused theme",
        description:
          "Soft gradients, subtle glow, and typography tuned for long writing sessions.",
        chip: "Design",
      },
      {
        title: "Fast and responsive",
        description:
          "Built with a modern stack so panels, sidebars, and chat updates feel instant.",
        chip: "Performance",
      },
    ],
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        {/* Header */}
        <header className="mb-10 flex flex-col items-center text-center gap-4">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-teal-400 mb-2">Product</p>
            <h1 className="text-3xl sm:text-[2.35rem] font-semibold bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(56,189,248,0.35)]">
              Features built for creators
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-xl">
              ContentCrafter combines an AI chat assistant with focused writing tools so you can move from idea to publish-ready content in less time.
            </p>
          </div>

          <div className="flex gap-3 mt-2">
            <Link
              to="/user-dashboard"
              className="inline-flex items-center rounded-full border border-gray-800 bg-gray-900/60 px-4 py-2 text-xs sm:text-sm text-gray-200 hover:border-teal-400 hover:text-teal-300 transition"
            >
              Back to dashboard
            </Link>
          </div>
        </header>

        {/* Key highlights */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-sm p-5 sm:p-6 shadow-[0_18px_45px_rgba(15,23,42,0.75)]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">For everyday content</p>
            <h2 className="text-sm sm:text-base font-medium text-white mb-1">Blogs, posts, scripts</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Draft SEO articles, YouTube scripts, and social posts without leaving the same workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-sm p-5 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">AI + structure</p>
            <h2 className="text-sm sm:text-base font-medium text-white mb-1">Chat meets templates</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Start from quick cards or Creator Wizard, then refine everything with natural chat.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-sm p-5 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Made for focus</p>
            <h2 className="text-sm sm:text-base font-medium text-white mb-1">Clean, modern UI</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              A layout inspired by the best AI tools, tuned specifically for content creators.
            </p>
          </div>
        </section>

        {/* Feature groups */}
        <section className="space-y-10">
          {featureGroups.map((group) => (
            <div key={group.label} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  {group.label}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {group.features.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-gray-800/70 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.14),_transparent_55%),_rgba(15,23,42,0.96)] backdrop-blur-md p-5 sm:p-6 hover:border-sky-300/90 hover:shadow-[0_0_30px_rgba(56,189,248,0.32)] transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm sm:text-base font-medium text-white">
                        {feature.title}
                      </h3>
                      <span className="inline-flex items-center rounded-full border border-teal-400/50 bg-teal-500/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-teal-200">
                        {feature.chip}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Principles section */}
        <section className="mt-14 space-y-5">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.2em] text-teal-400 mb-1">Principles</p>
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              The ideas behind ContentCrafter
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-400">
              Simple, human-first principles that guide how we design features and how we expect AI to be used.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-800/70 bg-gray-900/70 backdrop-blur-md p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-medium text-white mb-1">User-centric design</h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  Keep the interface simple, predictable, and comfortable so creators can focus on ideas, not settings.
                </p>
              </div>
              <Link
                to="/user-centric"
                className="mt-4 inline-flex items-center text-[11px] sm:text-xs font-medium text-teal-300 hover:text-teal-200"
              >
                Learn about user-centric design
                <span className="ml-1">→</span>
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-800/70 bg-gray-900/70 backdrop-blur-md p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-medium text-white mb-1">Innovation focus</h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  Experiment with new patterns, but keep them grounded in real creator workflows and measurable improvements.
                </p>
              </div>
              <Link
                to="/innovation-focus"
                className="mt-4 inline-flex items-center text-[11px] sm:text-xs font-medium text-teal-300 hover:text-teal-200"
              >
                Learn about innovation focus
                <span className="ml-1">→</span>
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-800/70 bg-gray-900/70 backdrop-blur-md p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-medium text-white mb-1">Ethical AI</h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  Use AI to amplify good work only: respect people, avoid harm, and keep humans in control of final decisions.
                </p>
              </div>
              <Link
                to="/ethical-ai"
                className="mt-4 inline-flex items-center text-[11px] sm:text-xs font-medium text-teal-300 hover:text-teal-200"
              >
                Learn about ethical AI
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Features;
