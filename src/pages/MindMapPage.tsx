import { Navigation } from "@/components/Navigation";
import { MindMap } from "@/components/mind-map/MindMap";

const MindMapPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 md:pt-24 pb-8 md:pb-16">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Mind Map</h1>
          <p className="text-sm md:text-base text-muted-foreground">Visualize your learning concepts and connections</p>
        </div>
        <MindMap />
      </main>
    </div>
  );
};

export default MindMapPage;
