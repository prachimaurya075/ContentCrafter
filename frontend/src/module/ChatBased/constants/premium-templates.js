export const PREMIUM_TEMPLATES = {
  systemPrompt: `Act as a premium writing assistant. Be concise, structured, and SEO-aware. Always provide clear headings, bullets, and actionable outputs.`,

  personas: [
    {
      id: 'content-writer',
      name: 'Content Writer',
      desc: 'Focus on hooks, audience, and clarity.',
      icon: '📝',
      prefix: 'Use Content Writer persona: '
    },
    {
      id: 'developer',
      name: 'Developer',
      desc: 'Prefer technical accuracy; include code samples.',
      icon: '💻',
      prefix: 'Use Developer persona: '
    },
    {
      id: 'interviewer',
      name: 'Interviewer',
      desc: 'Ask brief clarifying questions; provide concise answers.',
      icon: '🎤',
      prefix: 'Use Interviewer persona: '
    }
  ],

  categories: {
    'blog-writing': {
      id: 'blog-writing',
      title: 'Blog Writing',
      icon: '📄',
      prompts: [
        {
          title: 'SEO Blog Draft',
          template: `SEO Blog Draft
Topic: {topic}. Keywords: {keywords}. Audience: {audience}. Tone: {tone}. 
Create a blog with: SEO title, meta description, outline, and full draft. Keep sections 150-200 words.`
        },
        {
          title: 'Outline First',
          template: `Outline First, Then Draft
Create a 6-section outline for {topic} using {keywords}. Then expand into a 900-word draft with headings and bullet lists.`
        },
        {
          title: 'Long + Short Combo',
          template: `Long + Short Combo
Write a 1200-word blog on {topic} + 3 short summaries (Twitter, LinkedIn, Instagram) from the blog.`
        }
      ]
    },
    'instagram-captions': {
      id: 'instagram-captions',
      title: 'Instagram Captions',
      icon: '📱',
      prompts: [
        {
          title: '5 Captions',
          template: `Write 5 Instagram captions for {topic}. Include 2 emoji max, CTA, and 8 hashtags.`
        },
        {
          title: 'Viral Caption',
          template: `Create a viral caption for {topic} in {tone}. Format: hook + value + CTA.`
        },
        {
          title: '3 Styles',
          template: `Give me 3 captions: educational, storytelling, and witty for {topic}.`
        }
      ]
    },
    'youtube-scripts': {
      id: 'youtube-scripts',
      title: 'YouTube Scripts',
      icon: '🎥',
      prompts: [
        {
          title: '6-min Script',
          template: `Write a 6-minute YouTube script on {topic}. Include hook, intro, 3 key points, CTA.`
        },
        {
          title: '4-min Script',
          template: `Make a 4-minute script in {tone}. Add timestamps and B-roll ideas.`
        },
        {
          title: 'Full Package',
          template: `Create a script + title + description + 10 tags for {topic}.`
        }
      ]
    },
    'seo-articles': {
      id: 'seo-articles',
      title: 'SEO Articles',
      icon: '🔍',
      prompts: [
        {
          title: '1500-word Article',
          template: `Write a 1500-word SEO article on {topic} with {keywords}. Include FAQ, summary, and CTA.`
        },
        {
          title: 'Keyword Outline',
          template: `Give me a keyword-optimized outline + H2/H3 titles for {topic}.`
        },
        {
          title: 'Full SEO',
          template: `Write an SEO article using {keywords}; include internal links ideas and meta.`
        }
      ]
    }
  }
};

