//import gemini ai 
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
// import dot env for secreacy and fs for management file system
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

// get gemini model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});



// Generate a prompt based on file type
//add another token prev gemini get expire
const getPromptForFileType = () => {
  return `
    You are provided with an uploaded file. Your task is to:
    1. Answer the specific user question below based strictly on the file content.
    2. Do not provide a general summary of the file unless explicitly asked.
    3. If the answer to the question is not found in the file, respond:
       "Sorry, the information you are looking for is not available in the uploaded file. Do you want to connect with a live agent?"
    4. Keep your response concise and focused on the user’s query.
  `;
};

  let lastpathUri = '';

// Upload and process the file
export const uploadFile = async (req, res) => {
  let localFilePath = ""; 
  // Declare localFilePath
  console.log("LastpathUrui-1 : ",lastpathUri);
  try {
    
    console.log("Received file:", req.file);
    console.log("Message:", req.body.message);

    if (lastpathUri.length == 0) {
      localFilePath = req.file.path;
    }

    if (lastpathUri.length == 0) {
      lastpathUri = localFilePath;
    }

    // get user questions
    const userQuestion = req.body.message; 

    console.log("User question", userQuestion);

    // Upload the file to Google Generative AI File Manager
    const uploadResponse = await fileManager.uploadFile(lastpathUri, {
      mimeType: 'application/pdf',
      displayName: "Uploaded File",
    });

    console.log(
      `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
    );

    

    console.log("LastpathUrui-2 : ",lastpathUri);
    
    // update the prompt
    const prompt = getPromptForFileType() + `\n\nUser Question: "${userQuestion}"`;

    console.log("Prompt is: ", prompt);

    // Generate content using the uploaded file and prompt
    if (uploadResponse) {
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: 'application/pdf',
            fileUri: uploadResponse.file.uri,
          },
        },
        { text: prompt },
      ]);

      const generatedContent = result.response.text();

      console.log("Response: ", generatedContent);

      res.json({ extractedData: generatedContent });
    }

    
  } catch (err) {
    console.error("Upload Failed with error:", err);
    res.status(500).json({ error: "File upload or processing failed" });
  }
};
