import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  pdfContent: string;
  pdfImages: string[];
}

export const AIChatPanel = ({ pdfContent, pdfImages }: AIChatPanelProps) => {
  const [summary, setSummary] = useState<string>("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (pdfContent && !summary) {
      generateSummary();
    }
  }, [pdfContent]);

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pdf-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: "Please provide a comprehensive summary of this PDF including key topics, concepts, and generate 3-4 relevant questions a student might ask about this content.",
              },
            ],
            pdfContent,
            pdfImages,
          }),
        }
      );

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices?.[0]?.delta?.content;
                if (content) {
                  result += content;
                  setSummary(result);
                }
              } catch (e) {
                console.error("Error parsing JSON:", e);
              }
            }
          }
        }
      }

      // Extract suggested questions from the summary
      const questionPattern = /(?:Question|Q\d+|•|\d+\.)\s*(.+?\?)/gi;
      const matches = result.match(questionPattern);
      if (matches) {
        const questions = matches
          .map((q) => q.replace(/^(?:Question|Q\d+|•|\d+\.)\s*/i, "").trim())
          .slice(0, 4);
        setSuggestedQuestions(questions);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pdf-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            pdfContent,
            pdfImages,
          }),
        }
      );

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices?.[0]?.delta?.content;
                if (content) {
                  assistantMessage += content;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    if (newMessages[newMessages.length - 1]?.role === "assistant") {
                      newMessages[newMessages.length - 1].content = assistantMessage;
                    } else {
                      newMessages.push({ role: "assistant", content: assistantMessage });
                    }
                    return newMessages;
                  });
                }
              } catch (e) {
                console.error("Error parsing JSON:", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-shrink-0 p-4 border-b border-border">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-4">
          {isGeneratingSummary ? (
            <Card className="bg-muted/30">
              <CardContent className="p-6 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Generating summary...</span>
              </CardContent>
            </Card>
          ) : summary ? (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {summary}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {suggestedQuestions.length > 0 && (
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Suggested questions:
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="w-full justify-between h-auto py-3 px-4 text-left hover:bg-background"
                    onClick={() => handleQuestionClick(question)}
                  >
                    <span className="text-sm flex-1">{question}</span>
                    <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {messages.length > 0 && (
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-sm">Conversation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary/10 ml-8"
                        : "bg-muted/50 mr-8"
                    }`}
                  >
                    <p className="text-xs font-medium mb-1 text-muted-foreground">
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hey! Ask me anything about your PDF."
            className="min-h-[50px] max-h-[120px] resize-none"
            disabled={isLoading || isGeneratingSummary}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || isGeneratingSummary}
            size="icon"
            className="h-[50px] w-[50px]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
