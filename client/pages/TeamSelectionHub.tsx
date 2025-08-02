import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Check,
  RotateCcw,
  Globe,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { continents, regions, leagues, teams } from "@/lib/gameData";

interface SelectionState {
  continent: string | null;
  region: string | null;
  league: string | null;
  team: string | null;
}

export default function TeamSelectionHub() {
  const navigate = useNavigate();
  const [selection, setSelection] = useState<SelectionState>({
    continent: null,
    region: null,
    league: null,
    team: null,
  });
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Keyboard escape functionality for modals
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && activeModal) {
        setActiveModal(null);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [activeModal]);

  const selectedContinent = continents.find(
    (c) => c.id === selection.continent,
  );
  const selectedRegion = regions.find((r) => r.id === selection.region);
  const selectedLeague = leagues.find((l) => l.id === selection.league);
  const selectedTeam = teams[selection.team || ""];

  const availableRegions = regions.filter((r) => {
    if (r.continent === selection.continent) {
      // For Europe, only show Western Europe
      if (selection.continent === "europe") {
        return r.id === "western-europe";
      }
      // For South America, exclude Colombia, Chile, and Other SA countries
      if (selection.continent === "south-america") {
        return !["colombia", "chile", "other-sa"].includes(r.id);
      }
      return true;
    }
    return false;
  });
  const availableLeagues = leagues.filter((l) => l.region === selection.region);
  const availableTeams =
    selectedLeague?.teams.map((teamId) => teams[teamId]).filter(Boolean) || [];

  const handleContinentSelect = (continentId: string) => {
    setSelection({
      continent: continentId,
      region: null,
      league: null,
      team: null,
    });
    setActiveModal(null);
  };

  const handleRegionSelect = (regionId: string) => {
    setSelection({
      ...selection,
      region: regionId,
      league: null,
      team: null,
    });
    setActiveModal(null);
  };

  const handleLeagueSelect = (leagueId: string) => {
    setSelection({
      ...selection,
      league: leagueId,
      team: null,
    });
    setActiveModal(null);
  };

  const handleTeamSelect = (teamId: string) => {
    setSelection({
      ...selection,
      team: teamId,
    });
    setActiveModal(null);
  };

  const resetSelection = () => {
    setSelection({
      continent: null,
      region: null,
      league: null,
      team: null,
    });
  };

  const handleContinue = () => {
    if (selection.team) {
      navigate(`/team-setup/${selection.team}`);
    }
  };

  const isStepEnabled = (step: string) => {
    switch (step) {
      case "continent":
        return true;
      case "region":
        return !!selection.continent;
      case "league":
        return !!selection.region;
      case "team":
        return !!selection.league;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Fondo profesional y elegante */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 35%, rgba(51, 65, 85, 0.9) 100%),
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.08) 0%, transparent 50%)
          `,
        }}
      />

      {/* Elementos decorativos sutiles */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-16 left-8 w-24 h-24 border border-white/20 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-40 right-8 w-20 h-20 border border-white/20 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/4 w-0.5 h-16 bg-white/20"></div>
        <div className="absolute top-1/2 right-1/4 w-0.5 h-16 bg-white/20"></div>
      </div>

      <div className="flex-1 p-6 w-full relative z-10">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="mr-4 p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/10"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Selecciona tu Equipo
            </h1>
            <p className="text-white/70 text-base mt-1">
              Construye tu camino al éxito
            </p>
          </div>
        </div>

        {/* Pasos de selección con diseño profesional */}
        <div className="space-y-4 mb-8">
          {/* Paso 1: Continente */}
          <div className="relative">
            <button
              onClick={() => setActiveModal("continent")}
              disabled={!isStepEnabled("continent")}
              className="w-full p-5 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl flex items-center justify-between text-left hover:bg-slate-700/60 hover:border-slate-600/60 transition-all duration-300 disabled:opacity-50 shadow-xl hover:shadow-2xl group"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-500/20 rounded-xl mr-4 group-hover:bg-blue-500/30 transition-colors">
                  <Globe size={24} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">
                    {selectedContinent
                      ? selectedContinent.name
                      : "Elige continente"}
                  </div>
                  {selectedContinent && (
                    <div className="text-emerald-400 text-sm font-medium">
                      ✓ Paso 1 completado
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {selectedContinent && (
                  <div className="p-1 bg-emerald-500/20 rounded-full mr-3">
                    <Check size={20} className="text-emerald-400" />
                  </div>
                )}
                <ChevronDown
                  size={20}
                  className="text-slate-400 group-hover:text-white transition-colors"
                />
              </div>
            </button>
          </div>

          {/* Paso 2: Región */}
          <div className="relative">
            <button
              onClick={() =>
                isStepEnabled("region") && setActiveModal("region")
              }
              disabled={!isStepEnabled("region")}
              className="w-full p-5 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl flex items-center justify-between text-left hover:bg-slate-700/60 hover:border-slate-600/60 transition-all duration-300 disabled:opacity-50 shadow-xl hover:shadow-2xl group"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-500/20 rounded-xl mr-4 group-hover:bg-purple-500/30 transition-colors">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <div className="w-4 h-4 bg-purple-400 rounded-md"></div>
                  </div>
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">
                    {selectedRegion ? selectedRegion.name : "Elige región"}
                  </div>
                  {selectedRegion && (
                    <div className="text-emerald-400 text-sm font-medium">
                      ✓ Paso 2 completado
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {selectedRegion && (
                  <Check size={20} className="text-green-400 mr-2" />
                )}
                <ChevronDown size={20} className="text-white/60" />
              </div>
            </button>
          </div>

          {/* Paso 3: Liga */}
          <div>
            <button
              onClick={() =>
                isStepEnabled("league") && setActiveModal("league")
              }
              disabled={!isStepEnabled("league")}
              className="w-full p-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl flex items-center justify-between text-left hover:bg-white/20 transition-colors disabled:opacity-50 shadow-lg"
            >
              <div className="flex items-center">
                <Trophy size={24} className="text-white mr-4" />
                <div>
                  <div className="text-white font-medium text-base">
                    {selectedLeague ? selectedLeague.name : "Elige liga"}
                  </div>
                  {selectedLeague && (
                    <div className="text-white/60 text-sm">
                      ✓ Paso 3 completado
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {selectedLeague && (
                  <Check size={20} className="text-green-400 mr-2" />
                )}
                <ChevronDown size={20} className="text-white/60" />
              </div>
            </button>
          </div>

          {/* Paso 4: Equipo */}
          <div>
            <button
              onClick={() => isStepEnabled("team") && setActiveModal("team")}
              disabled={!isStepEnabled("team")}
              className="w-full p-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl flex items-center justify-between text-left hover:bg-white/20 transition-colors disabled:opacity-50 shadow-lg"
            >
              <div className="flex items-center">
                <Users size={24} className="text-white mr-4" />
                <div>
                  <div className="text-white font-medium text-base">
                    {selectedTeam ? selectedTeam.name : "Elige equipo"}
                  </div>
                  {selectedTeam && (
                    <div className="text-white/60 text-sm">
                      ✓ Paso 4 completado
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {selectedTeam && (
                  <Check size={20} className="text-green-400 mr-2" />
                )}
                <ChevronDown size={20} className="text-white/60" />
              </div>
            </button>
          </div>
        </div>

        {/* Botones de acción optimizados para móvil */}
        <div className="space-y-4 mb-24">
          <Button
            onClick={resetSelection}
            variant="outline"
            className="w-full py-4 text-lg bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl shadow-lg"
          >
            <RotateCcw size={20} className="mr-3" />
            Reiniciar selección
          </Button>

          {selection.team && (
            <Button
              onClick={handleContinue}
              className="w-full py-4 text-lg bg-green-600 text-white hover:bg-green-700 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🚀 Continuar con {selectedTeam?.name}
            </Button>
          )}
        </div>
      </div>

      {/* Modales deslizantes optimizados para móvil */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full bg-white rounded-t-3xl max-h-[85vh] animate-in slide-in-from-bottom duration-300 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto"></div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {activeModal === "continent" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Selecciona Continente
                  </h3>
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                    {continents
                      .filter(
                        (continent) =>
                          !["africa", "oceania"].includes(continent.id),
                      )
                      .map((continent) => (
                        <button
                          key={continent.id}
                          onClick={() => handleContinentSelect(continent.id)}
                          className="w-full p-5 bg-gray-50 hover:bg-blue-50 rounded-xl text-left transition-colors shadow-sm border border-gray-200"
                        >
                          <div className="font-semibold text-gray-900 text-lg">
                            {continent.name}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {activeModal === "region" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Selecciona Región
                  </h3>
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                    {availableRegions.map((region) => (
                      <button
                        key={region.id}
                        onClick={() => handleRegionSelect(region.id)}
                        className="w-full p-5 bg-gray-50 hover:bg-blue-50 rounded-xl text-left transition-colors shadow-sm border border-gray-200"
                      >
                        <div className="font-semibold text-gray-900 text-lg">
                          {region.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === "league" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Selecciona Liga
                  </h3>
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                    {availableLeagues.map((league) => (
                      <button
                        key={league.id}
                        onClick={() => handleLeagueSelect(league.id)}
                        className="w-full p-5 bg-gray-50 hover:bg-blue-50 rounded-xl text-left transition-colors shadow-sm border border-gray-200"
                      >
                        <div className="font-semibold text-gray-900 text-lg">
                          {league.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {league.teams.length} equipos disponibles
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === "team" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Selecciona Equipo
                  </h3>
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                    {availableTeams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => handleTeamSelect(team.id)}
                        className="w-full p-5 bg-gray-50 hover:bg-blue-50 rounded-xl text-left transition-colors shadow-sm border border-gray-200"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-12 h-12 rounded-full mr-4 flex items-center justify-center text-lg font-bold text-white shadow-md"
                            style={{ backgroundColor: team.colors.primary }}
                          >
                            {team.logo || "⚽"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-lg">
                              {team.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {team.players.length} jugadores
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={() => setActiveModal(null)}
                variant="outline"
                className="w-full mt-8 py-4 text-lg rounded-xl"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
