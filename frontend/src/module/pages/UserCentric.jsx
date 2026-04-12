import React from "react";
import { useNavigate } from "react-router-dom";
// Temporary placeholders - create actual Header/Footer or adjust paths
const Header = () => <header className="p-4 bg-gray-800 text-white"><h1>Header</h1></header>;
const Footer = () => <footer className="p-4 bg-gray-900 text-gray-400 text-center"><p>Footer</p></footer>;

const UserCentric = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 text-gray-100 font-Poppins">
      <Header />

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 opacity-90"></div>
        <div className="relative z-10 max-w-6xl mx-auto p-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300">
            User-Centric Design System
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            User-centric design means we build the app for people first. Simple steps, clear buttons, and visible progress help everyone write better content faster.
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            If you can use a phone app, you can use ContentCrafter. We keep the interface easy and avoid confusing options.
          </p>
          <button
            onClick={() => navigate("/user-dashboard")}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-xl hover:brightness-110 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-cyan-300">Core Principles</h2>
            <ul className="space-y-4 text-gray-200">
              <li>
                <h3 className="text-xl font-semibold">Intuitive Flow</h3>
                <p className="text-gray-400">Tasks are simplified with step-by-step guidance, templates, and context-aware recommendations.</p>
              </li>
              <li>
                <h3 className="text-xl font-semibold">Strong Accessibility</h3>
                <p className="text-gray-400">WCAG-inspired color contrast, keyboard navigation, screen-reader labels, and text scaling.</p>
              </li>
              <li>
                <h3 className="text-xl font-semibold">Personalized Workspaces</h3>
                <p className="text-gray-400">User preferences, theme modes, and customizable dashboards adapt to user behavior and skill levels.</p>
              </li>
              <li>
                <h3 className="text-xl font-semibold">Real-time Feedback</h3>
                <p className="text-gray-400">AI preview, instant content scoring, and inline suggestions help users improve as they type.</p>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-cyan-300">Advanced Features</h2>
            <ul className="space-y-4 text-gray-200">
              <li>
                <h3 className="text-xl font-semibold">Adaptive UI</h3>
                <p className="text-gray-400">Components reflow fluidly across device sizes, with reduced motion and high-contrast modes available.</p>
              </li>
              <li>
                <h3 className="text-xl font-semibold">Interactive Tooltips</h3>
                <p className="text-gray-400">Context hints and guided on-screen tours help new users onboard quickly without manual documentation.</p>
              </li>
              <li>
                <h3 className="text-xl font-semibold">Keyboard-first Productivity</h3>
                <p className="text-gray-400">Hotkeys and shortcuts speed up content creation, plus full support for screen-reader workflows.</p>
              </li>
              <li>
                <h3 className="text-xl font-semibold">Feedback Loop</h3>
                <p className="text-gray-400">Users can submit suggestions in-app; insights are automatically fed into our product roadmap.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-t from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-cyan-300">User Stories & Use Cases</h2>
          <p className="text-gray-300 mb-8">Design patterns in action for creators, marketers, and team collaborations.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <article className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Creator Quick Draft</h3>
              <p className="text-gray-400">One-click templates, focus mode, and outline-to-article conversion reduce research time by 70%.</p>
            </article>
            <article className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Team Campaign Workflow</h3>
              <p className="text-gray-400">Shared workspaces, real-time comments, and version history make teamwork seamless and auditable.</p>
            </article>
            <article className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Accessibility-first Edits</h3>
              <p className="text-gray-400">Automated readability checks and alternate language support empower inclusive publishing.</p>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserCentric;
