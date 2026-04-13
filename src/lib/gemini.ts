import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateImage = async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") => {
  try {
    if (!prompt) throw new Error("Prompt is required");
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio,
        },
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini");
    }

    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

export const generateSocialContent = async (topic: string, style: string, platform: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a social media post for ${platform} about "${topic}" in a "${style}" style. 
      Return the response in JSON format with the following structure:
      {
        "caption": "string",
        "hashtags": ["string"],
        "imagePrompt": "string (a detailed prompt for an AI image generator to create the visual for this post)"
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            imagePrompt: { type: Type.STRING }
          },
          required: ["caption", "hashtags", "imagePrompt"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Social Content Generation Error:", error);
    throw error;
  }
};

export const generateProductShoot = async (productDescription: string, style: string) => {
  try {
    const prompt = `A professional product shoot of ${productDescription} in a ${style} setting. High quality, studio lighting, commercial photography.`;
    return await generateImage(prompt);
  } catch (error) {
    console.error("Product Shoot Error:", error);
    throw error;
  }
};

export const generateGamingThumbnail = async (gameName: string, titleText: string) => {
  try {
    const prompt = `A high-energy gaming thumbnail for ${gameName} with text "${titleText}". Vibrant colors, epic composition, gaming aesthetic.`;
    return await generateImage(prompt, "16:9");
  } catch (error) {
    console.error("Gaming Thumbnail Error:", error);
    throw error;
  }
};

export const generateAvatar = async (style: string, baseImage?: string) => {
  try {
    let prompt = `A high-quality ${style} style avatar profile picture.`;
    if (baseImage) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: baseImage.split(',')[1], mimeType: "image/png" } },
            { text: `Transform this person into a ${style} style avatar. Maintain recognizable features but apply the ${style} aesthetic.` }
          ],
        },
      });
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    } else {
      return await generateImage(prompt);
    }
    throw new Error("No avatar generated");
  } catch (error) {
    console.error("Avatar Generation Error:", error);
    throw error;
  }
};
