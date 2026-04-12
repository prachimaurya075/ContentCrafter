import geminiService from '../services/geminiService.js';
import pdfParse from 'pdf-parse';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const generateChatContent = asyncHandler(async (req, res) => {
  try {
    const { prompt, contentType = 'general', tone = 'professional', audience = 'general' } = req.body;
    
    if (!prompt || prompt.trim().length === 0) {
      throw new ApiError(400, "Prompt is required and cannot be empty");
    }

    // Enhance the prompt with context
    const enhancedPrompt = `
Content Type: ${contentType}
Target Audience: ${audience}
Tone: ${tone}

User Request: ${prompt}

Please create high-quality, engaging content that matches the specified requirements. 
Make it actionable and valuable for the target audience. 
Format the response with proper structure and ensure it's ready to use.
    `;

    const result = await geminiService.generateContent(enhancedPrompt, { contentType });
    
    if (!result || !result.content) {
      throw new ApiError(500, "Failed to generate content");
    }

    return res.status(200).json(
      new ApiResponse(200, {
        content: result.content,
        prompt: prompt,
        metadata: {
          ...result.metadata,
          contentType,
          tone,
          audience,
        }
      }, result.metadata?.isFallback ? "Content generated (demo mode - quota limited)" : "Content generated successfully")
    );

  } catch (error) {
    console.error('Chat generation error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(500, `Failed to generate content: ${error.message}`);
  }
});

export const generateContentWithContext = asyncHandler(async (req, res) => {
  try {
    const { 
      prompt, 
      previousMessages = [], 
      contentType = 'general',
      maxLength,
      includeExamples = false
    } = req.body;
    
    if (!prompt) {
      throw new ApiError(400, "Prompt is required");
    }

    // Build context from previous messages
    let contextPrompt = '';
    if (previousMessages.length > 0) {
      contextPrompt = `Previous conversation context:\n${previousMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\n`;
    }

    // Create comprehensive prompt
    const fullPrompt = `${contextPrompt}Current request: ${prompt}

Please provide a ${contentType} response${maxLength ? ` in approximately ${maxLength} words` : ''}${includeExamples ? ' with relevant examples' : ''}.`;

    const generatedContent = await geminiService.generateContent(fullPrompt);
    
    return res.status(200).json(
      new ApiResponse(200, {
        content: generatedContent,
        context: {
          prompt,
          previousMessages: previousMessages.slice(-5), // Keep last 5 messages for context
          contentType,
          generatedAt: new Date().toISOString()
        }
      }, "Contextual content generated successfully")
    );

  } catch (error) {
    console.error('Contextual generation error:', error);
    throw new ApiError(500, `Failed to generate contextual content: ${error.message}`);
  }
});

export const summarizeFile = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "File is required");
    }

    const { originalname, mimetype, buffer, size } = req.file;
    const maxSizeBytes = 2 * 1024 * 1024;
    if (size > maxSizeBytes) {
      throw new ApiError(413, "File too large. Max 2MB.");
    }

    let extractedText = "";

    if (mimetype === "application/pdf") {
      const parsed = await pdfParse(buffer);
      extractedText = parsed.text || "";
    } else if (mimetype.startsWith("text/")) {
      extractedText = buffer.toString("utf-8");
    } else {
      throw new ApiError(415, "Unsupported file type. Use PDF or text files.");
    }

    const normalized = extractedText.replace(/\s+/g, " ").trim();
    if (!normalized) {
      throw new ApiError(400, "No readable text found in the file");
    }

    const snippet = normalized.slice(0, 12000);
    const prompt = `Summarize the following document in 6-8 concise bullet points and 3 key takeaways. Keep it under 180 words.\n\nDocument:\n${snippet}`;

    const result = await geminiService.generateContent(prompt, {
      contentType: "general",
      maxLength: 180,
    });

    if (!result || !result.content) {
      throw new ApiError(500, "Failed to summarize document");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          fileName: originalname,
          summary: result.content,
          metadata: result.metadata,
        },
        "File summarized successfully"
      )
    );
  } catch (error) {
    console.error("File summarization error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Failed to summarize file: ${error.message}`);
  }
});