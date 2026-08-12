import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, options } = await req.json();
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: "No content provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { count = 10, type = "term-definition", difficulty = "mixed", focus = "all" } = options || {};

    console.log("Generating flashcards with options:", { count, type, difficulty, focus });

    const typeInstructions = {
      "term-definition": "Create flashcards with a term on the front and its definition on the back.",
      "question-answer": "Create flashcards with a question on the front and a concise answer on the back.",
      "concept-explanation": "Create flashcards with a concept/topic on the front and a brief explanation on the back.",
      "cloze": "Create fill-in-the-blank flashcards. Front shows a sentence with _____ for the blank (1-2 words missing). Back shows the missing word(s)."
    };

    const difficultyInstructions = {
      "easy": "Focus on basic, fundamental concepts that are easy to remember.",
      "medium": "Include moderately complex concepts requiring some understanding.",
      "hard": "Focus on complex, nuanced concepts that require deeper understanding.",
      "mixed": "Mix easy, medium, and hard cards for comprehensive coverage."
    };

    const focusInstructions = focus !== "all" 
      ? `Focus specifically on: ${focus}` 
      : "Cover all important topics from the document.";

    const systemPrompt = `You are an expert flashcard creator. Generate exactly ${count} flashcards based on the provided document content.

Requirements:
- Generate exactly ${count} flashcards
- ${typeInstructions[type as keyof typeof typeInstructions] || typeInstructions["term-definition"]}
- ${difficultyInstructions[difficulty as keyof typeof difficultyInstructions] || difficultyInstructions["mixed"]}
- ${focusInstructions}
- Keep content clear, concise, and easy to memorize
- Use short definitions (1-2 sentences max for backs)
- Only use information found in the uploaded document
- Select the most important concepts for effective studying
- Keep terminology accurate and aligned with the document
${type === "cloze" ? "- For cloze cards, blank out only 1-2 key words that are essential to understand" : ""}

You must respond using the generate_flashcards function with the exact structure specified.`;

    const body = {
      model: Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate ${count} flashcards based on this content:\n\n${content}` }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generate_flashcards",
            description: `Generate ${count} flashcards from document content`,
            parameters: {
              type: "object",
              properties: {
                flashcards: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      front: { type: "string", description: "The front of the flashcard (term, question, concept, or cloze sentence)" },
                      back: { type: "string", description: "The back of the flashcard (definition, answer, explanation, or missing word)" },
                      difficulty: { type: "string", enum: ["easy", "medium", "hard"] }
                    },
                    required: ["id", "front", "back", "difficulty"]
                  }
                }
              },
              required: ["flashcards"]
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "generate_flashcards" } },
      temperature: 0.7,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: "Invalid API key. Please check your OpenAI API configuration." }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your OpenAI account." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Try to parse error message from OpenAI
      let errorMessage = "Failed to generate flashcards";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: response.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log("AI response received");

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in response");
      return new Response(
        JSON.stringify({ error: "Invalid AI response format" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const flashcardData = JSON.parse(toolCall.function.arguments);
    console.log("Flashcards generated successfully with", flashcardData.flashcards.length, "cards");

    return new Response(
      JSON.stringify(flashcardData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in generate-flashcards function:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
