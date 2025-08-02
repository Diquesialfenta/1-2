import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { leagues } from "@/lib/gameData";

export default function ChooseRegion() {
  const navigate = useNavigate();
  const { continentId } = useParams();

  const continentLeagues = leagues.filter(
    (league) => league.continent === continentId,
  );

  const handleLeagueSelect = (leagueId: string) => {
    navigate(`/choose-league/${leagueId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-6 max-w-sm mx-auto w-full">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/choose-team")}
            className="mr-4 p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">
            {continentId === "europe" ? "Europe" : "Region"}
          </h1>
        </div>

        <div className="space-y-3 mb-8">
          {continentLeagues.map((league) => (
            <button
              key={league.id}
              onClick={() => handleLeagueSelect(league.id)}
              className="w-full p-4 bg-card border border-border rounded-lg text-left hover:bg-accent transition-colors"
            >
              <span className="text-foreground font-medium">{league.name}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/choose-team")}
            className="px-8"
          >
            Volver
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
