"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define tone and option types (kept in sync with the front end)
type ToneType = "Professional" | "Neutral" | "Friendly" | "Technical" | "Optimistic" | "Casual" | "Humorous";
type LengthType = "Short" | "Medium" | "Long";
type AudienceType = "General Audience" | "Students" | "Developers" | "Journalists" | "Investors" | "Entrepreneurs" | "Researchers" | "Parents" | "Consumers" | "Healthcare Professionals";

interface ArticleData {
  title: string;
  description: string;
  topic: string;
  tone: ToneType;
  audience: AudienceType;
  length: LengthType;
  language: string;
  keywords: string; 
}

export const GeneratePrompt = async (
  prevState: { success: boolean; message: string; response: string },
  formData: FormData
) => {
  const data: ArticleData = {
    title: formData.get("title")?.toString() || "",
    description: formData.get("description")?.toString() || "",
    topic: formData.get("topic")?.toString() || "",
    tone: (formData.get("tone")?.toString() as ToneType) || "Professional",
    audience: (formData.get("audience")?.toString() as AudienceType) || "General Audience",
    length: (formData.get("length")?.toString() as LengthType) || "Medium",
    language: formData.get("language")?.toString() || "English",
    keywords: formData.get("keywords")?.toString() || "",
  };

  // Map target length to approximate word range
  const lengthMapping: Record<LengthType, string> = {
    "Short": "400-600 words",
    "Medium": "700-1000 words", 
    "Long": "1200-1500 words"
  };

  const prompt = `
You are an experienced investigative journalist with 15+ years in the field. Write a compelling, human-centered news article that reads naturally and engages readers emotionally.

ARTICLE REQUIREMENTS:
Title: "${data.title}"
Topic: "${data.topic}"
Length: ${lengthMapping[data.length] || "700-1000 words"}
Tone: ${data.tone}
Target Audience: ${data.audience}
Language: ${data.language}
Keywords to incorporate naturally: ${data.keywords}

${data.description ? `\nAdditional Context: ${data.description}` : ""}

WRITING STYLE GUIDELINES:
1. HUMAN STORYTELLING:
   - Start with a compelling human angle or real-world scenario
   - Use specific details, not generic statements
   - Include relatable examples and analogies
   - Vary sentence length for natural rhythm
   - Use active voice predominantly

2. JOURNALISTIC STRUCTURE:
   - Lead paragraph: Hook readers with the most newsworthy angle
   - Nut graf: Explain why this matters to readers
   - Body: Use inverted pyramid structure
   - Include relevant quotes (create realistic, attributed quotes)
   - End with impact or call-to-action

3. REALISTIC DETAILS:
   - Include specific numbers, dates, locations when relevant
   - Reference credible sources (create realistic source names)
   - Add context that shows broader implications
   - Use current events and trending topics for relevance

4. ENGAGEMENT TECHNIQUES:
   - Ask rhetorical questions to involve readers
   - Use transitions that create flow
   - Include surprising facts or statistics
   - Create urgency or emotional connection

5. AVOID AI-SOUNDING PATTERNS:
   - No generic phrases like "In today's world" or "As we move forward"
   - Don't start every paragraph the same way
   - Avoid overly formal or robotic language
   - Include colloquialisms appropriate to the audience

SPECIFIC REQUIREMENTS FOR ${data.tone.toUpperCase()} TONE:
${getToneGuidelines(data.tone)}

AUDIENCE-SPECIFIC ADAPTATION FOR ${data.audience.toUpperCase()}:
${getAudienceGuidelines(data.audience)}

Write the article now, ensuring it sounds like it was written by a seasoned journalist who understands their audience deeply.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8, // Slightly higher for more creative phrasing
      max_tokens: 2000, // Allow longer, in-depth articles
      presence_penalty: 0.1, // Reduce repetitive talking points
      frequency_penalty: 0.1, // Encourage varied vocabulary
    });

    console.log("ARTICLE:", response.choices[0].message.content);

    return {
      success: true,
      message: "Article generated successfully.",
      response: response.choices[0].message.content || "",
    };
  } catch (error) {
    console.error("Error generating article:", error);
    return {
      success: false,
      message: "We couldn’t generate the article. Please try again.",
      response: "",
    };
  }
};

function getToneGuidelines(tone: ToneType): string {
  const guidelines: Record<ToneType, string> = {
    "Professional": `
    - Use authoritative but accessible language
    - Include industry terminology naturally
    - Maintain credibility with factual backing
    - Balance formality with readability`,
    
    "Neutral": `
    - Maintain complete objectivity and balance
    - Present facts without emotional language
    - Use clear, straightforward sentences
    - Avoid bias or persuasive elements`,
    
    "Friendly": `
    - Write in a warm, approachable manner
    - Use inclusive language that welcomes readers
    - Include personal touches and relatable examples
    - Maintain positivity while being informative`,
    
    "Technical": `
    - Use precise, industry-specific terminology
    - Include detailed explanations of processes
    - Reference technical standards and methodologies
    - Assume audience has relevant background knowledge`,
    
    "Optimistic": `
    - Focus on positive outcomes and solutions
    - Highlight progress and opportunities
    - Use uplifting language and inspiring examples
    - Frame challenges as opportunities for growth`,
    
    "Casual": `
    - Write conversationally, like talking to a friend
    - Use contractions and everyday language
    - Include humor or light-hearted observations where appropriate
    - Keep paragraphs shorter and punchier`,
    
    "Humorous": `
    - Include appropriate wit and clever observations
    - Use amusing analogies and playful language
    - Balance entertainment with information
    - Ensure humor enhances rather than distracts from content`
  };
  
  return guidelines[tone] || guidelines["Professional"];
}

function getAudienceGuidelines(audience: AudienceType): string {
  const guidelines: Record<AudienceType, string> = {
    "General Audience": `
    - Use accessible language without jargon
    - Explain technical terms when necessary
    - Focus on broad appeal and universal relevance
    - Include diverse perspectives and examples`,
    
    "Students": `
    - Use educational tone with learning opportunities
    - Include step-by-step explanations
    - Reference relevant studies and academic sources
    - Connect to career and future implications`,
    
    "Developers": `
    - Use technical terminology appropriately
    - Include code examples or technical processes when relevant
    - Reference industry tools, frameworks, and best practices
    - Focus on practical implementation and solutions`,
    
    "Journalists": `
    - Emphasize newsworthiness and story angles
    - Include source verification and fact-checking elements
    - Reference media ethics and reporting standards
    - Focus on narrative structure and compelling leads`,
    
    "Investors": `
    - Emphasize market implications and financial impact
    - Include relevant metrics, ROI, and business potential
    - Reference market trends and competitive landscape
    - Focus on risk assessment and opportunity analysis`,
    
    "Entrepreneurs": `
    - Focus on actionable insights and business opportunities
    - Include startup-relevant challenges and solutions
    - Reference successful case studies and best practices
    - Emphasize innovation and market disruption potential`,
    
    "Researchers": `
    - Use precise, academic language
    - Include methodology and data-driven insights
    - Reference peer-reviewed sources and studies
    - Focus on evidence-based conclusions and further research needs`,
    
    "Parents": `
    - Address family-related concerns and impacts
    - Use reassuring but informative tone
    - Include practical advice for family situations
    - Focus on child safety, development, and well-being`,
    
    "Consumers": `
    - Focus on practical benefits and real-world applications
    - Include cost-benefit analysis and value propositions
    - Address common concerns and misconceptions
    - Provide actionable purchasing or usage advice`,
    
    "Healthcare Professionals": `
    - Use medical terminology appropriately
    - Include clinical implications and patient care aspects
    - Reference medical guidelines and evidence-based practices
    - Focus on professional development and patient outcomes`
  };
  
  return guidelines[audience] || guidelines["General Audience"];
}
