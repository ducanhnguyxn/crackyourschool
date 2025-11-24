import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/ai-tutor/ChatMessage";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ActionButton {
  label: string;
  prompt: string;
}

interface AIChatPanelProps {
  pdfContent: string;
}

export const AIChatPanel = ({ pdfContent }: AIChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionButtons, setActionButtons] = useState<ActionButton[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (pdfContent) {
      generateActionButtons();
    }
  }, [pdfContent]);

  const generateActionButtons = async () => {
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
            messages: [{ role: "user", content: "Analyze and suggest actions" }],
            pdfContent,
            action: "suggest_actions",
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
                if (content) result += content;
              } catch (e) {
                console.error("Error parsing JSON:", e);
              }
            }
          }
        }
      }

      try {
        const actions = JSON.parse(result);
        if (Array.isArray(actions)) {
          setActionButtons(actions);
        }
      } catch (e) {
        console.error("Error parsing action buttons:", e);
      }
    } catch (error) {
      console.error("Error generating action buttons:", error);
    }
  };

  const streamChat = async (userMessages: Message[], action?: string) => {
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
            messages: userMessages,
            pdfContent,
            action,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to get AI response",
          variant: "destructive",
        });
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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
                    newMessages[newMessages.length - 1].content = assistantMessage;
                    return newMessages;
                  });
                }
              } catch (e) {
                console.error("Error parsing streaming data:", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast({
        title: "Error",
        description: "Failed to communicate with AI",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    await streamChat([...messages, userMessage]);
    setIsLoading(false);
  };

  const handleActionClick = async (action: ActionButton) => {
    if (isLoading) return;

    const userMessage: Message = { role: "user", content: action.prompt };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    if (action.label === "Summarize") {
      await streamChat([...messages, userMessage], "summarize");
    } else {
      await streamChat([...messages, userMessage]);
    }
    
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Assistant
        </h2>
      </div>

      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Ready to help!</h3>
          <p className="text-muted-foreground text-center mb-6">
            Choose an action below or ask me anything about your PDF
          </p>
          <div className="grid grid-cols-2 gap-2 w-full max-w-md">
            <Button
              variant="outline"
              onClick={() => handleActionClick({ label: "Summarize", prompt: "Please summarize this PDF" })}
              disabled={isLoading}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Summarize
            </Button>
            <Button
              variant="outline"
              onClick={() => handleActionClick({ label: "Ask a Question", prompt: "I have a question about this PDF" })}
              disabled={isLoading}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask Question
            </Button>
            {actionButtons.map((action, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => handleActionClick(action)}
                disabled={isLoading}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <>
          <div className="flex-1 overflow-y-auto">
            {messages.map((message, index) => (
              <ChatMessage key={index} role={message.role} content={message.content} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2 mb-2 flex-wrap">
              {actionButtons.slice(0, 4).map((action, idx) => (
                <Button
                  key={idx}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleActionClick(action)}
                  disabled={isLoading}
                >
                  {action.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the PDF..."
                className="min-h-[60px]"
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
