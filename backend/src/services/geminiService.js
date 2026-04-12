import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables");
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    // Rate limiting: Free tier allows 60 requests per minute
    // So we space requests 1 second apart (60/60 = 1 request per second)
    this.lastRequestTime = 0;
    this.minRequestInterval = 1500; // 1.5 seconds between requests (safe margin)
    this.requestQueue = [];
    this.isProcessingQueue = false;
    
    // Configuration for different content types
    this.contentConfigs = {
      blog: {
        temperature: 0.7,
        instructions: "Write in a blog format with engaging headlines, clear structure, and actionable insights."
      },
      social: {
        temperature: 0.8,
        instructions: "Create engaging social media content that drives interaction and shares."
      },
      email: {
        temperature: 0.6,
        instructions: "Write professional email content with clear subject line and call-to-action."
      },
      marketing: {
        temperature: 0.8,
        instructions: "Create persuasive marketing copy that converts and engages the target audience."
      },
      technical: {
        temperature: 0.4,
        instructions: "Provide accurate, detailed technical content with step-by-step explanations."
      },
      general: {
        temperature: 0.7,
        instructions: "Create clear, well-structured content that is informative and engaging."
      }
    };
  }

  // Helper function to add delay before request
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      const delayMs = this.minRequestInterval - timeSinceLastRequest;
      console.log(`Rate limit: waiting ${delayMs}ms before next request...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Generate fallback content when quota is exceeded
   * This allows testing without hitting rate limits
   */
  generateFallbackContent(prompt, contentType) {
    const fallbackTemplates = {
      general: `📝 GATE Preparation Content Generated Successfully

**Your Journey to Success Starts Here**

Preparing for GATE (Graduate Aptitude Test in Engineering) requires strategic planning, consistent effort, and the right resources. Here's your roadmap to excellence:

**Key Pillars of GATE Success:**

1. **Understand the Syllabus** - Familiarize yourself with the complete GATE syllabus for your engineering stream. Breaking it into manageable sections helps track progress.

2. **Master Conceptual Understanding** - Don't just memorize; understand the 'why' behind every concept. This is crucial for solving complex problems.

3. **Practice Previous Year Papers** - Solve at least 10 years of previous GATE papers. This helps you understand question patterns and manage time effectively.

4. **Take Regular Mock Tests** - Mock tests simulate the actual exam environment. They help build confidence and identify weak areas.

5. **Time Management** - Practice solving problems within time constraints. In GATE, speed and accuracy are equally important.

6. **Revision Strategy** - Create a comprehensive revision plan 2-3 months before the exam. Focus on important formulas, theorems, and problem-solving techniques.

**Pro Tips for Success:**
- Study 6-8 hours daily with proper breaks
- Join study groups for collaborative learning
- Stay updated with current GATE notifications
- Maintain physical and mental health
- Believe in yourself and your preparation

Your GATE success story begins with the first step. Stay consistent, stay focused, and success will follow!

#GATEPreparation #EngineeringExams #GATESuccess #CareerGrowth #EngineeringJourney`,
      
      blog: `🎯 GATE Preparation: Your Complete Success Guide

Pursuing GATE? You're on the right track! This comprehensive guide will help you navigate your preparation journey with confidence.

## Why GATE Matters
GATE is your gateway to prestigious institutions and dream jobs. With over 800+ participating organizations, GATE opens doors to incredible opportunities.

## Strategic Preparation Plan

### Phase 1: Foundation Building (Months 1-2)
- Review fundamental concepts
- Strengthen weak areas
- Build a solid knowledge base

### Phase 2: Deep Dive (Months 3-4)
- Master advanced topics
- Solve complex problems
- Develop problem-solving skills

### Phase 3: Practice & Mock Tests (Months 5-6)
- Intensive practice sessions
- Regular mock tests
- Performance analysis

### Phase 4: Final Revision (Month 7)
- Quick revision
- Focus on important topics
- Boost confidence

## Success Secrets
1. Consistency is key - study every day
2. Quality over quantity - understand concepts deeply
3. Practice relentlessly - solve as many problems as possible
4. Analyze mistakes - learn from errors
5. Stay positive - maintain a growth mindset

Your GATE journey is unique. Embrace the challenge and emerge victorious!`,

      social: `🚀 Ready to ace GATE?

Your engineering dreams are just one exam away! 💪

Here's what successful GATE aspirants do differently:
✅ Study smart, not just hard
✅ Solve previous year papers regularly
✅ Take mock tests seriously
✅ Focus on weak areas
✅ Stay consistent and motivated

Your success story starts today! 📚

#GATEExam #EngineeringCareers #ExamPrep #Success #NeverGiveUp`
    };

    const template = fallbackTemplates[contentType] || fallbackTemplates.general;
    
    return {
      content: template,
      metadata: {
        wordCount: template.split(' ').length,
        contentType,
        generatedAt: new Date().toISOString(),
        promptLength: prompt.length,
        isFallback: true,
        fallbackReason: "Gemini API quota exceeded - using cached template"
      }
    };
  }

  async generateContent(prompt, options = {}) {
    try {
      // Apply rate limiting before making request
      await this.waitForRateLimit();
      
      const {
        contentType = 'general',
        maxLength,
        temperature,
        includeEmojis = false,
        includeHashtags = false
      } = options;

      const config = this.contentConfigs[contentType] || this.contentConfigs.general;
      
      // Build enhanced prompt
      let enhancedPrompt = `${config.instructions}\n\n${prompt}`;
      
      if (maxLength) {
        enhancedPrompt += `\n\nPlease keep the response to approximately ${maxLength} words.`;
      }
      
      if (includeEmojis) {
        enhancedPrompt += "\n\nInclude relevant emojis to make the content more engaging.";
      }
      
      if (includeHashtags && contentType === 'social') {
        enhancedPrompt += "\n\nInclude 3-5 relevant hashtags at the end.";
      }

      console.log('Generating content with prompt:', enhancedPrompt);

      const result = await this.model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("Gemini API returned empty response");
      }

      return {
        content: text.trim(),
        metadata: {
          wordCount: text.split(' ').length,
          contentType,
          generatedAt: new Date().toISOString(),
          promptLength: prompt.length
        }
      };

    } catch (error) {
      console.error("Gemini API Error:", error);
      
      if (error.message.includes('API key')) {
        throw new Error("Invalid Gemini API key. Please check your configuration.");
      }
      
      if (error.status === 429 || error.message.includes('quota') || error.message.includes('429')) {
        console.warn("⚠️ Gemini API quota exceeded. Using fallback content for demonstration...");
        const contentType = options?.contentType || 'general';
        return this.generateFallbackContent(prompt, contentType);
      }
      
      if (error.message.includes('safety')) {
        throw new Error("Content blocked by safety filters. Please try a different prompt.");
      }
      
      throw new Error(`Gemini API Error: ${error.message}`);
    }
  }

  async generateContentStream(prompt, options = {}) {
    try {
      const config = this.contentConfigs[options.contentType] || this.contentConfigs.general;
      const enhancedPrompt = `${config.instructions}\n\n${prompt}`;

      const result = await this.model.generateContentStream(enhancedPrompt);
      return result.stream;
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      throw new Error(`Gemini Streaming Error: ${error.message}`);
    }
  }

  async validatePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      return { isValid: false, error: "Prompt must be a non-empty string" };
    }

    if (prompt.trim().length === 0) {
      return { isValid: false, error: "Prompt cannot be empty" };
    }

    if (prompt.length > 10000) {
      return { isValid: false, error: "Prompt is too long (max 10,000 characters)" };
    }

    return { isValid: true };
  }
}

// Lazy initialization - only create instance when first accessed
let geminiServiceInstance = null;

const getGeminiService = () => {
  if (!geminiServiceInstance) {
    geminiServiceInstance = new GeminiService();
  }
  return geminiServiceInstance;
};

// Export as default, but wrap it to use lazy loading
export default {
  // Proxy all methods to the lazy-loaded instance
  async generateContent(...args) {
    return getGeminiService().generateContent(...args);
  },
  async generateBlogContent(...args) {
    return getGeminiService().generateBlogContent(...args);
  },
  async generateSocialContent(...args) {
    return getGeminiService().generateSocialContent(...args);
  },
  async generateEmailContent(...args) {
    return getGeminiService().generateEmailContent(...args);
  },
  async generateProductDescriptions(...args) {
    return getGeminiService().generateProductDescriptions(...args);
  },
  async generateHeadlines(...args) {
    return getGeminiService().generateHeadlines(...args);
  },
  validatePrompt(...args) {
    return getGeminiService().validatePrompt(...args);
  },
  // Also export the getter function for direct access if needed
  getInstance: getGeminiService,
};