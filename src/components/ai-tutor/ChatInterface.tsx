import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "./ChatMessage";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type Message = { role: "user" | "assistant"; content: string };

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Keep ref in sync with state
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save conversation when messages change (debounced)
  useEffect(() => {
    if (messages.length > 0 && messages.length % 2 === 0 && user) {
      // Only save when we have pairs of messages (user + assistant)
      const timeoutId = setTimeout(() => {
        saveConversation(messages);
      }, 1000); // Debounce by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [messages, user, saveConversation]); // Now safe to include saveConversation since it uses ref

  const streamChat = async (userMessages: Message[]) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`;
    
    // Get JWT token from session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }
    
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        toast({
          title: "Rate limit exceeded",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
      } else if (resp.status === 402) {
        toast({
          title: "Payment required",
          description: "Please add funds to your workspace.",
          variant: "destructive",
        });
      }
      throw new Error("Failed to start stream");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;
    let assistantContent = "";

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              let updated;
              if (last?.role === "assistant") {
                updated = prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              } else {
                updated = [...prev, { role: "assistant", content: assistantContent }];
              }
              return updated;
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const saveConversation = useCallback(async (updatedMessages: Message[]) => {
    if (!user) return;

    try {
      // Use ref to get the latest conversationId value, avoiding stale closure
      const currentConversationId = conversationIdRef.current;
      
      if (!currentConversationId) {
        // Create new conversation
        const { data, error } = await supabase
          .from('ai_tutor_conversations')
          .insert({
            user_id: user.id,
            title: updatedMessages[0]?.content?.substring(0, 50) || 'New Conversation',
            messages: updatedMessages,
          })
          .select()
          .single();

        if (error) throw error;
        setConversationId(data.id);
        conversationIdRef.current = data.id; // Update ref immediately
      } else {
        // Update existing conversation
        await supabase
          .from('ai_tutor_conversations')
          .update({
            messages: updatedMessages,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentConversationId);
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
      // Don't show error to user, just log it
    }
  }, [user]); // No longer depends on conversationId, uses ref instead

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check usage limits for free users before sending
    if (!profile?.is_pro) {
      const questionsUsed = profile?.questions_used_this_month || 0;
      if (questionsUsed >= 30) {
        toast({
          title: "Question limit reached",
          description: "You've used all 30 questions this month. Upgrade to Pro for unlimited questions!",
          variant: "destructive",
        });
        navigate("/pricing");
        return;
      }
    }

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(updatedMessages);
      
      // Increment question count for free users after successful message (atomic increment)
      if (!profile?.is_pro && user) {
        // Use RPC function for atomic increment, or fallback to direct update with current value
        const { data: currentProfile } = await supabase
          .from('user_profiles')
          .select('questions_used_this_month')
          .eq('id', user.id)
          .single();
        
        if (currentProfile) {
          await supabase
            .from('user_profiles')
            .update({ 
              questions_used_this_month: (currentProfile.questions_used_this_month || 0) + 1 
            })
            .eq('id', user.id);
        }
        
        // Refresh profile to update the count
        await refreshProfile();
      }
      
      // Conversation will be saved via useEffect when messages state updates
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
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
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4">
        <div className="max-w-4xl mx-auto py-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center p-8">
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold">AI Tutor</h2>
                <p className="text-sm md:text-base text-muted-foreground max-w-md">
                  Ask me anything! I'm here to help you understand concepts, solve problems, and learn effectively.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => <ChatMessage key={idx} role={msg.role} content={msg.content} />)}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-background p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className="min-h-[60px] max-h-[200px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
