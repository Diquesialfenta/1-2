import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { leagues, teams } from "@/lib/gameData";

export default function ChooseLeague() {
  const navigate = useNavigate();
  const { leagueId } = useParams();

  const league = leagues.find((l) => l.id === leagueId);
  const leagueTeams =
    league?.teams.map((teamId) => teams[teamId]).filter(Boolean) || [];

  const handleTeamSelect = (teamId: string) => {
    navigate(`/team-setup/${teamId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-6 max-w-sm mx-auto w-full">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(`/choose-region/${league?.continent}`)}
            className="mr-4 p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">
            {league?.name || "League"}
          </h1>
        </div>

        <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto">
          {leagueTeams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleTeamSelect(team.id)}
              className="w-full p-4 bg-card border border-border rounded-lg text-left hover:bg-accent transition-colors"
            >
              <span className="text-foreground font-medium">{team.name}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(`/choose-region/${league?.continent}`)}
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
