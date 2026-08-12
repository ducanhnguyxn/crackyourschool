import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { messages, pdfContent, pdfImages, action } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    let systemPrompt = `You are an AI assistant helping users understand and analyze PDF documents. `;

    type ChatMessage = {
      role: string;
      content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
    };

    const contentMessages: ChatMessage[] = [];
    
    if (pdfContent) {
      systemPrompt += `Here is the extracted text from the PDF:\n\n${pdfContent.substring(0, 10000)}\n\n`;
    }
    
    if (pdfImages && pdfImages.length > 0) {
      systemPrompt += `I have also provided images of the PDF pages for visual context. Please analyze both the text and images to provide comprehensive answers.\n\n`;
      
      // Add images to the first user message
      contentMessages.push({
        role: 'user',
        content: [
          { type: 'text', text: 'Here are the PDF page images for context:' },
          ...pdfImages.slice(0, 5).map((img: string) => ({
            type: 'image_url',
            image_url: { url: img }
          }))
        ]
      });
    }

    if (action === 'summarize') {
      systemPrompt += `\n\nProvide a comprehensive summary of the PDF document, highlighting key points, main themes, and important details. Consider both text and visual elements.`;
    } else if (action === 'suggest_actions') {
      systemPrompt += `\n\nAnalyze this PDF (including any images) and suggest 4-6 useful action buttons the user might want (e.g., "Extract Dates", "Find Definitions", "List Key Topics", "Identify Main Arguments", "Extract Statistics", "Describe Images"). Return ONLY a JSON array of action objects with "label" and "prompt" fields, nothing else.`;
    }

    // Use vision model if images are present, otherwise use regular model
    const hasImages = pdfImages && pdfImages.length > 0;
    const model = hasImages 
      ? (Deno.env.get('OPENAI_VISION_MODEL') || 'gpt-4o')
      : (Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...contentMessages,
          ...messages
        ],
        stream: true,
        temperature: 0.7,
        ...(hasImages && { max_tokens: 4096 }), // Increase tokens for vision requests
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 401) {
        return new Response(JSON.stringify({ error: 'Invalid API key. Please check your OpenAI API configuration.' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to your OpenAI account.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Try to parse error message from OpenAI
      let errorMessage = 'AI service error';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error in pdf-chat function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
