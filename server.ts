import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // API Endpoints
  app.post("/api/analyze-incident", async (req, res) => {
    try {
      const { image, notes } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is not defined in environment variables.");
      }

      const contents: any[] = [];

      if (image) {
        // expect image to be a base64 data URL, e.g. "data:image/png;base64,iVBORw0KG..."
        const match = image.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          const mimeType = match[1];
          const data = match[2];
          contents.push({
            inlineData: {
              mimeType,
              data
            }
          });
        }
      }

      let textPrompt = "Analyze this cat rescue incident based on the provided evidence.";
      if (notes) {
        textPrompt += `\nReporter Notes:\n"""\n${notes}\n"""`;
      }
      contents.push({ text: textPrompt });

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          incidentType: {
            type: Type.STRING,
            description: "Likely incident type. Must be one of: 'MISSING', 'SIGHTING', 'FOUND', 'INJURED', 'TRAPPED', 'COLONY_RISK'."
          },
          catDescription: {
            type: Type.OBJECT,
            properties: {
              primaryColor: { type: Type.STRING, description: "Primary coat color (e.g., Orange, White, Black, Grey)" },
              secondaryColor: { type: Type.STRING, description: "Secondary coat color, or empty string if none" },
              coatPattern: { type: Type.STRING, description: "Pattern like Tabby, Solid, Tuxedo, Calico, Tortoiseshell" },
              estimatedLifeStage: { type: Type.STRING, description: "Kitten, Adolescent, Adult, Senior, or Unknown" },
              distinctiveFeatures: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of visual hallmarks, collars, distinct ear notches, etc."
              }
            },
            required: ["primaryColor", "secondaryColor", "coatPattern", "estimatedLifeStage", "distinctiveFeatures"]
          },
          observations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Objective physical and situational observations of the cat and environment."
          },
          urgency: {
            type: Type.STRING,
            description: "Urgency evaluation. Must be one of: 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'."
          },
          urgencyReasons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific factors justifying the selected urgency level (e.g., trapped, injured, weather)."
          },
          uncertainties: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Uncertainty notes. Must state clearly that visual observation only is used, visual ID is never certain, and do not diagnose medical conditions."
          },
          recommendedAction: {
            type: Type.STRING,
            description: "Suggested next operational rescue step. Mention human verification is required."
          },
          confidence: {
            type: Type.NUMBER,
            description: "AI confidence score between 0 and 100."
          }
        },
        required: [
          "incidentType",
          "catDescription",
          "observations",
          "urgency",
          "urgencyReasons",
          "uncertainties",
          "recommendedAction",
          "confidence"
        ]
      };

      const systemInstruction = `You are assisting with animal rescue incident coordination.
Your role is to structure visual and narrative observations and help prioritize reports.

SAFETY COMPLIANCE REQUIREMENTS:
1. You are NOT a veterinarian. Never diagnose disease, injury severity, or prognosis.
2. Never claim visual identification is certain. Never state that two cats are definitely identical based only on images.
3. Explicitly describe uncertainty using language like "may indicate", "possible", "needs human verification", "visual observation only".
4. Recommend human verification for all safety-critical or operational decisions.
5. For immediate physical danger, recommend contacting appropriate local emergency or animal rescue services.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: contents },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema
        }
      });

      const text = response.text || "{}";
      const data = JSON.parse(text.trim());
      res.json(data);
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      res.status(500).json({ error: error.message || "Failed to analyze incident with Gemini" });
    }
  });

  // Serve Frontend
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
