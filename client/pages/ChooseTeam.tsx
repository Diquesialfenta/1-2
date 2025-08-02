import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { continents } from "@/lib/gameData";

export default function ChooseTeam() {
  const navigate = useNavigate();

  const handleContinentSelect = (continentId: string) => {
    navigate(`/choose-region/${continentId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-6 max-w-sm mx-auto w-full">
        <div className="mb-8">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-6 mx-auto">
            <span className="text-sm font-medium text-muted-foreground">
              Logo
            </span>
          </div>

          <h1 className="text-3xl font-bold text-center text-foreground mb-2">
            Choose your team
          </h1>
        </div>

        <div className="space-y-3 mb-8">
          {continents.map((continent) => (
            <button
              key={continent.id}
              onClick={() => handleContinentSelect(continent.id)}
              className="w-full p-4 bg-card border border-border rounded-lg text-left hover:bg-accent transition-colors"
            >
              <span className="text-foreground font-medium">
                {continent.name}
              </span>
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="px-8"
          >
            <ArrowLeft size={16} className="mr-2" />
            Volver
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
