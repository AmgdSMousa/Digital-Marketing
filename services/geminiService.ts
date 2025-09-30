import { GoogleGenAI, Type } from '@google/genai';
import type { EmailCampaign, AdCopy } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateContentIdeas = async (topic: string): Promise<string[]> => {
  try {
    const prompt = `Act as a digital marketing expert. Generate 5 creative and engaging content ideas for a blog and social media about the following topic: "${topic}". The ideas should be distinct and appeal to a wide audience. Provide the output as a JSON array of strings.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    // FIX: Trim whitespace from the response before parsing JSON.
    const jsonString = response.text.trim();
    const ideas = JSON.parse(jsonString);
    return ideas as string[];

  } catch (error) {
    console.error("Error generating content ideas:", error);
    return ["An error occurred while generating ideas. Please try again."];
  }
};

export const generateSocialMediaPost = async (idea: string, platform: string, tone: string, audience: string): Promise<string> => {
  try {
    const platformSpecifics = platform === 'Twitter'
      ? 'Keep it concise (under 280 characters) and include 2-3 relevant hashtags.'
      : 'Structure it for readability with short paragraphs or bullet points and include 3-5 relevant hashtags.';
    
    const audiencePrompt = audience ? `The target audience is "${audience}".` : '';

    const prompt = `Act as a savvy social media manager. Write a compelling ${platform} post based on this topic: "${idea}". The tone should be ${tone}. ${audiencePrompt} ${platformSpecifics}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating social media post:", error);
    return "An error occurred while generating the post. Please try again.";
  }
};


export const generateEmailCampaign = async (product: string, audience: string): Promise<EmailCampaign> => {
  try {
    const prompt = `You are an expert email marketer. Generate a complete email campaign for a product described as: "${product}". The target audience is: "${audience}".`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: {
              type: Type.STRING,
              description: "A compelling, short subject line for the email."
            },
            body: {
              type: Type.STRING,
              description: "The full email body, written in a persuasive and friendly tone, with a clear call to action and placeholders like [Customer Name] and [Your Company]."
            }
          },
          required: ["subject", "body"]
        }
      }
    });

    // FIX: Trim whitespace from the response before parsing JSON.
    const jsonString = response.text.trim();
    const campaign = JSON.parse(jsonString);
    return campaign as EmailCampaign;
  } catch (error) {
    console.error("Error generating email campaign:", error);
    return {
      subject: "Error",
      body: "An error occurred while generating the email campaign. Please try again."
    };
  }
};

export const generateAdCopy = async (product: string, platform: string): Promise<AdCopy> => {
  try {
    const prompt = `You are a professional copywriter specializing in high-converting ads. Generate ad copy for a product described as: "${product}". The ad will be for the ${platform} platform.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: {
              type: Type.STRING,
              description: `A short, attention-grabbing headline for a ${platform} ad.`
            },
            description: {
              type: Type.STRING,
              description: `A concise and persuasive description for the ${platform} ad.`
            }
          },
          required: ["headline", "description"]
        }
      }
    });

    // FIX: Trim whitespace from the response before parsing JSON.
    const jsonString = response.text.trim();
    const adCopy = JSON.parse(jsonString);
    return adCopy as AdCopy;
  } catch (error) {
    console.error("Error generating ad copy:", error);
    return {
      headline: "Error",
      description: "An error occurred while generating the ad copy. Please try again."
    };
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return "An error occurred while generating the image. Please try again.";
  }
};