import { Navigation } from "@/components/Navigation";
import { MindMap } from "@/components/mind-map/MindMap";

const MindMapPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mind Map</h1>
          <p className="text-muted-foreground">Visualize your learning concepts and connections</p>
        </div>
        <MindMap />
      </main>
    </div>
  );
};

export default MindMapPage;
