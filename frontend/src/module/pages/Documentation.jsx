import React from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    id: "overview",
    title: "What is ContentCrafter?",
    badge: "Overview",
    description:
      "ContentCrafter is your AI-first writing workspace for creators. Plan, write, and refine content for blogs, YouTube, Instagram, LinkedIn, and more — all inside a focused, distraction-free interface.",
    items: [
      "Chat-based assistant for natural conversations with AI.",
      "Genre-based flows for blogs, scripts, captions, and more.",
      "Creator Wizard to quickly generate high-quality prompts.",
      "Saved conversations so you can revisit your best ideas.",
    ],
  },
  {
    id: "getting-started",
    title: "Getting Started",
    badge: "Basics",
    description:
      "Follow these steps to start creating with ContentCrafter in a few minutes.",
    items: [
      "Create an account or log in with your existing credentials.",
      "From the main dashboard, open the AI Writing workspace.",
      "Choose between Chat-based or Genre-based creation flows.",
      "Start with a quick template card or type your own prompt.",
    ],
  },
  {
    id: "chat-based",
    title: "Chat-Based Writing",
    badge: "AI Chat",
    description:
      "Use the chat interface when you want an interactive, back-and-forth experience with the AI.",
    items: [
      "Use the left sidebar to switch between conversations or start a new chat.",
      "Select a category such as Business, Content, Creative, or Social to give the AI better context.",
      "Pick a quick-start card (email, LinkedIn post, hooks, etc.) when you are not sure how to start.",
      "Ask follow-up questions, refine tone, or request shorter/longer versions directly in the chat.",
    ],
  },
  {
    id: "creator-wizard",
    title: "Creator Wizard",
    badge: "Guided",
    description:
      "The Creator Wizard helps you move from a rough idea to a polished AI prompt in three simple steps.",
    items: [
      "Describe your topic (for example: a YouTube script, SEO blog, or Instagram reel).",
      "Add your main keywords so the AI can optimize for search and relevance.",
      "Choose the tone you want — professional, friendly, bold, educational, and more.",
      "Click \"Use in chat\" to automatically send the crafted prompt into the conversation.",
    ],
  },
  {
    id: "genre-based",
    title: "Genre-Based Workflows",
    badge: "Templates",
    description:
      "Genre-based tools are designed for specific types of content so you can move faster with less typing.",
    items: [
      "Pick a genre such as Blog, YouTube, Instagram, or LinkedIn.",
      "Fill in the small form (topic, audience, goal, tone).",
      "Generate drafts, outlines, captions, hooks, and more for that specific channel.",
      "Use the chat to refine, expand, or translate what you generated.",
    ],
  },
  {
    id: "sharing",
    title: "Sharing & Reuse",
    badge: "Workflow",
    description:
      "Everything you write with ContentCrafter is designed to be reused, shared, and repurposed across platforms.",
    items: [
      "Copy any AI response or your full conversation transcript in one click.",
      "Use the share options to copy content as a LinkedIn-ready post draft.",
      "Reuse strong hooks, intros, and CTAs across different channels.",
      "Return to previous conversations from the sidebar at any time.",
    ],
  },
  {
    id: "best-practices",
    title: "Best Practices",
    badge: "Tips",
    description:
      "A few simple habits will help you get consistently better results from the AI.",
    items: [
      "Be specific about audience, platform, and goal in your prompts.",
      "Mention the tone and length you want (for example: 150-word LinkedIn post, friendly tone).",
      "Iterate: ask the AI to refine, shorten, expand, or change the angle.",
      "Use categories (Business, Content, Creative, Social) so outputs match your use case.",
    ],
  },
];

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        {/* Header */}
        <header className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[2.25rem] sm:text-[2.8rem] font-bold leading-tight bg-gradient-to-r from-sky-400 via-blue-400 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(56,189,248,0.55)]">
              ContentCrafter Guide
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl">
              Learn how to get the most out of ContentCrafter — from your first login
              to publishing content that feels on-brand and ready to share.
            </p>
          </div>
          <div className="flex gap-3 mt-2 sm:mt-0">
            <Link
              to="/user-dashboard"
              className="inline-flex items-center rounded-full border border-gray-800 bg-gray-900/60 px-4 py-2 text-xs sm:text-sm text-gray-200 hover:border-teal-400 hover:text-teal-300 transition"
            >
              Back to dashboard
            </Link>
          </div>
        </header>

        {/* Top callouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-sm p-4 sm:p-5 shadow-[0_18px_45px_rgba(15,23,42,0.75)]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">For creators</p>
            <h2 className="text-sm sm:text-base font-medium text-white mb-1">All your content in one place</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Plan, draft, and polish content for every channel — without leaving your workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-sm p-4 sm:p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">AI-first</p>
            <h2 className="text-sm sm:text-base font-medium text-white mb-1">Chat + structured flows</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Move between freeform AI chat and guided templates like Creator Wizard or genre-based tools.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/60 backdrop-blur-sm p-4 sm:p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Premium UX</p>
            <h2 className="text-sm sm:text-base font-medium text-white mb-1">Designed for focus</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              A clean, ChatGPT-style interface tuned for real-world creators and teams.
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_minmax(0,0.9fr)] gap-8">
          {/* Main content */}
          <main className="space-y-6">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="rounded-2xl border border-gray-800/70 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.16),_transparent_55%),_rgba(15,23,42,0.96)] backdrop-blur-md p-5 sm:p-6 hover:border-sky-400/90 hover:shadow-[0_0_40px_rgba(56,189,248,0.32)] transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center rounded-full border border-sky-400/60 bg-sky-500/15 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-sky-100">
                    {section.badge}
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                    <span className="text-xs text-cyan-300/80">{String(index + 1).padStart(2, "0")}</span>
                    {section.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mb-3">
                  {section.description}
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </main>

          {/* Sidebar navigation */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-800/70 bg-gray-950/80 backdrop-blur-sm p-4 sm:p-5 sticky top-20">
              <p className="text-[11px] font-medium text-gray-400 mb-3 uppercase tracking-[0.16em]">
                On this page
              </p>
              <nav className="space-y-1 text-xs sm:text-sm">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-full px-3 py-2 text-gray-400 hover:text-teal-300 hover:bg-gray-900/80 transition"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
