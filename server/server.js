import express from 'express';
import { OpenAI, ChatOpenAI } from "@langchain/openai";
import { JsonOutputParser, StringOutputParser, StructuredOutputParser  } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts"
import { config } from 'dotenv';
import cors from 'cors';
config();

const app = express();
const port = process.env.SERVER_PORT || 3001;

app.use(express.json(), cors());

const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o",
  format: "json",
});

const promptTemplate = new PromptTemplate({
  template: `You are an AI travel assistant. Generate a day-by-day itinerary for a {numberOfDays}-day trip to {city}.
  Use the startdate: {startDate} to find more relevant activities based on the weather pattern, and time of the day and any big events that could be happening in the trip.
   Return the itinerary in JSON format with the following structure:
   {{
    \"itinerary\": [
      {{
        \"day\": \"1\", ,
        \"plan\": \"Visit the Eiffel Tower in the morning, Louvre in the afternoon...\"}},
      {{
        \"day\": \"2\",
        \"plan\": \"Explore Montmartre...\"
}},
      // ... more days
    ]
  }}. Return only the json without the \`\`\`json brackets\`\`\` and nothing else in the output. Also, if the itinerary is cannot be generated as the city, startdate or number of days is invalid, return an empty json object.`,
  inputVariables: ['city', 'numberOfDays', 'startDate'],
});

app.post('/api/planTrip', async (req, res) => {
  const { city, startDate, numberOfDays } = req.body;

  // Check if city is provided and is a string
  if (!city || typeof city !== "string") {
    return res.status(400).json({ error: "Missing city or city is not a string" });
  }

  // Check if startDate is provided and is a valid date
  if (!startDate || isNaN(Date.parse(startDate))) {
    return res.status(400).json({ error: "Missing startDate or startDate is not a valid date" });
  }

  // Check if numberOfDays is provided and is a positive integer
  if (!numberOfDays || typeof numberOfDays !== "number" || !Number.isInteger(numberOfDays) || numberOfDays <= 0) {
    return res.status(400).json({ error: "Missing numberOfDays or numberOfDays is not a positive integer" });
  }

  try {
    const prompt = await promptTemplate.format({ city, numberOfDays, startDate });
    console.log("Prompt:", prompt);

    const llmResult = await chatModel.invoke(prompt);

    try {
      if (llmResult["content"]) {
        const itineraryJson = JSON.parse(llmResult["content"]);
        console.log("Itinerary JSON:", itineraryJson);
        return res.json(itineraryJson);
      } else {
        throw new Error("Missing content in LLM response");
      }
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError);
      console.error("Raw LLM Response:", llmResult);
      return res.status(500).json({
        error: "Failed to generate a valid itinerary.",
        details: "Possibly due to malformed JSON response from LLM.",
        rawResponse: llmResult
      });
    }
  } catch (error) {
    console.error("LLM call error:", error);

    if (error.message.includes("network")) {
      return res.status(503).json({ error: "Service unavailable, please try again later." });
    }

    return res.status(500).json({ error: "Failed to generate a travel plan. An internal error occurred." });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});