import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Node {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

const colors = [
  "bg-purple-500/20 border-purple-500",
  "bg-blue-500/20 border-blue-500",
  "bg-green-500/20 border-green-500",
  "bg-pink-500/20 border-pink-500",
  "bg-orange-500/20 border-orange-500",
];

export const MindMap = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", text: "Main Topic", x: 50, y: 50, color: colors[0] },
  ]);
  const [newNodeText, setNewNodeText] = useState("");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const addNode = () => {
    if (!newNodeText.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    const randomX = Math.random() * 60 + 20;
    const randomY = Math.random() * 60 + 20;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newNode: Node = {
      id: Date.now().toString(),
      text: newNodeText,
      x: randomX,
      y: randomY,
      color: randomColor,
    };

    setNodes([...nodes, newNode]);
    setNewNodeText("");
    toast.success("Node added!");
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter((node) => node.id !== id));
    if (selectedNode === id) setSelectedNode(null);
    toast.success("Node deleted");
  };

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes(
      nodes.map((node) => (node.id === id ? { ...node, x, y } : node))
    );
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row gap-2 md:gap-4">
        <Input
          placeholder="Enter a new topic..."
          value={newNodeText}
          onChange={(e) => setNewNodeText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addNode()}
          className="flex-1"
        />
        <Button onClick={addNode} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Node</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] border border-border rounded-lg bg-muted/20 overflow-hidden">
        {nodes.map((node) => (
          <div
            key={node.id}
            draggable
            onDragEnd={(e) => {
              const rect = e.currentTarget.parentElement?.getBoundingClientRect();
              if (rect) {
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                updateNodePosition(node.id, Math.max(0, Math.min(95, x)), Math.max(0, Math.min(95, y)));
              }
            }}
            style={{
              position: "absolute",
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            className={`${node.color} px-2 md:px-4 py-2 md:py-3 rounded-lg border-2 cursor-move hover:scale-105 transition-transform shadow-lg group max-w-[200px] md:max-w-none`}
            onClick={() => setSelectedNode(node.id)}
          >
            <div className="flex items-center gap-1 md:gap-2">
              <span className="font-medium text-xs md:text-sm break-words overflow-wrap-anywhere">{node.text}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              >
                <Trash2 className="w-3 h-3 md:w-4 md:h-4 text-destructive" />
              </button>
            </div>
          </div>
        ))}

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Add your first topic to start building your mind map
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        💡 Tip: Drag nodes to reposition them. Click to select, hover to delete.
      </p>
    </Card>
  );
};
