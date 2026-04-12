import React from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    badge: "Start",
    body: [
      "These Terms of Service (the \"Terms\") govern your access to and use of ContentCrafter.",
      "By creating an account or using the product, you agree to be bound by these Terms.",
      "If you are using ContentCrafter on behalf of a company or team, you confirm you have authority to accept these Terms for that organization.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility & Account",
    badge: "Account",
    body: [
      "You must be at least 18 years old, or the age of majority in your jurisdiction, to use ContentCrafter.",
      "You are responsible for maintaining the confidentiality of your login credentials and for all activity that happens under your account.",
      "Please notify us immediately if you believe your account has been accessed without authorization.",
    ],
  },
  {
    id: "use-of-service",
    title: "Use of the Service",
    badge: "Use",
    body: [
      "You agree to use ContentCrafter only for lawful purposes and in accordance with these Terms.",
      "You will not attempt to reverse engineer, probe, or circumvent any technical limitations or security features.",
      "You are responsible for any content you input into the system and for how you choose to use the outputs.",
    ],
  },
  {
    id: "ai-content",
    title: "AI-Generated Content",
    badge: "AI",
    body: [
      "ContentCrafter uses AI models to generate suggestions, drafts, and ideas based on your inputs.",
      "AI-generated content may be inaccurate, incomplete, or not up to date. You should always review, edit, and fact-check outputs before publishing.",
      "You are solely responsible for any decisions or actions you take based on AI-generated content.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    badge: "IP",
    body: [
      "ContentCrafter and its underlying software, branding, and design are owned or licensed by us and are protected by applicable laws.",
      "You retain ownership of the original content you provide to the service and, subject to applicable law and third-party rights, the outputs you choose to use.",
      "Nothing in these Terms grants you any right to use our trademarks, logos, or brand elements without prior written permission.",
    ],
  },
  {
    id: "fair-use",
    title: "Fair Use & Limits",
    badge: "Usage",
    body: [
      "We may apply reasonable technical or usage limits (for example, on request volume or file size) to protect the stability of the service.",
      "You agree not to abuse free tiers, trial plans, or promotional offers by creating multiple accounts or otherwise circumventing plan limits.",
      "We may monitor high-level usage patterns to improve reliability and prevent misuse.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Data",
    badge: "Privacy",
    body: [
      "We handle your data in line with our Privacy Policy, which explains what we collect and how we use it.",
      "You should not upload sensitive personal information unless it is strictly necessary and you have the right to do so.",
      "By using the service, you consent to the processing of your information as described in the Privacy Policy.",
    ],
  },
  {
    id: "termination",
    title: "Suspension & Termination",
    badge: "Status",
    body: [
      "We may suspend or terminate your access if you materially or repeatedly breach these Terms or use the service in a way that could harm us or others.",
      "You can stop using ContentCrafter at any time. Some information may remain in backups or logs for a limited period as part of normal operations.",
      "Upon termination, your right to access and use the service will immediately cease.",
    ],
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    badge: "Changes",
    body: [
      "We may update these Terms from time to time to reflect product changes, legal requirements, or improvements.",
      "If we make material changes, we will take reasonable steps to notify you (for example, via email or in-product notice).",
      "Your continued use of ContentCrafter after changes take effect means you accept the updated Terms.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    badge: "Support",
    body: [
      "If you have questions about these Terms, you can reach us at:",
      "Email: contentcrafter@gmail.com",
    ],
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[2.1rem] sm:text-[2.7rem] font-bold leading-tight bg-gradient-to-r from-sky-400 via-blue-400 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(56,189,248,0.45)]">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl">
              Please read these Terms carefully. They outline the rules and expectations for using ContentCrafter.
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

        {/* Content */}
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
              <div className="space-y-2 text-xs sm:text-sm text-gray-300">
                {section.body.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Terms;
