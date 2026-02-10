import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || ""; 
if (!API_KEY) {
  console.error("API key missing");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeHeritageSite = async (imageUri: string) => {
  try {
    // Convert image to base64 as api cant directly handle images and text in single prompt. So this allows us to put them together in single prompt
    const response = await fetch(imageUri);
    //Convert to binary large object: which allows us to read the image data as binary string from the response
    const blob = await response.blob();
    //Convert to base64 data: which allows us to read the image data as base64 string from the response
    const base64Data = await new Promise<string>((resolve, reject) => {
      //File reader is a built in javascript object that allows us to read the file data as a string
      const reader = new FileReader();
      //readAsDataURL: reads the file data as a data url string
      reader.readAsDataURL(blob);
      //onloadend: is a event listener that is triggered when the file is loaded
      reader.onloadend = () => {
        //reader.result: is the result of the file read operation
        //split(',')[1]: splits the result into an array and returns the second element
        const base64data = reader.result as string;
        resolve(base64data.split(',')[1]); 
      };
      //onerror: is a event listener that is triggered when the file is not loaded
      reader.onerror = reject;
    });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Prompt for validation
    const prompt = `
      You are an strict archaeological verification AI. Analyze this image.
      
      Step 1: Determine if this image contains a heritage site, ruin, old temple, colonial structure, or historical monument.
      - If it is a person, animal, food, car, laptop, or modern furniture -> RETURN valid: false.
      - If it is a historical structure -> RETURN valid: true.

      Step 2: Return JSON ONLY:
      {
        "valid": true/false,
        "rejection_reason": "Only returned if valid is false (e.g. 'This is a cat, not a monument')",
        "name": "Creative Historical Name (if valid)",
        "era": "Time Period (if valid)",
        "narrative": "Story (if valid)"
      }
    `;

    //Generate content: which allows us to generate content from the prompt and the image
    const result = await model.generateContent([
      //prompt: the prompt to generate content from
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
    ]);

    const text = result.response.text();
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);

  } catch (error) {
    console.log("AI Error, returning fallback.");
    // If failed, set the validity to false and return rejection reason.
    return {
        valid: false, 
        rejection_reason: "AI connection failed. Unable to verify authenticity. Please check your internet or try again."
      };
  }
};