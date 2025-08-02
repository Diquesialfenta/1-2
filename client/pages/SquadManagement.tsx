import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, Settings, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import BottomNavigation from "@/components/BottomNavigation";
import {
  Player,
  teams,
  formatCurrency,
  searchPlayersByName,
  leagues,
} from "@/lib/gameData";
import { gameState, GameState } from "@/lib/gameState";

export default function SquadManagement() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [state, setState] = useState<GameState>(gameState.getState());
  const [mode, setMode] = useState<"default" | "custom">("default");
  const [discardMode, setDiscardMode] = useState(false);
  const [discardedPlayers, setDiscardedPlayers] = useState<Player[]>([]);
  const [searchMode, setSearchMode] = useState<"team" | "name" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [selectedTeamForSearch, setSelectedTeamForSearch] = useState<
    string | null
  >(null);

  useEffect(() => {
    const unsubscribe = gameState.subscribe(setState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (searchMode === "name" && searchQuery.length > 2) {
      const results = searchPlayersByName(searchQuery);
      setSearchResults(results.slice(0, 20));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchMode]);

  const team = teams[teamId!];

  const handlePlayerAction = (
    player: Player,
    action: "sell" | "buy" | "discard",
  ) => {
    if (action === "sell") {
      gameState.sellPlayer(player.id, player.value);
    } else if (action === "buy") {
      gameState.buyPlayer(player, player.value);
    } else if (action === "discard") {
      if (discardedPlayers.find((p) => p.id === player.id)) {
        setDiscardedPlayers(discardedPlayers.filter((p) => p.id !== player.id));
      } else {
        setDiscardedPlayers([...discardedPlayers, player]);
      }
    }
  };

  const confirmDiscards = () => {
    const totalRecovered = discardedPlayers.reduce(
      (sum, player) => sum + player.value,
      0,
    );
    discardedPlayers.forEach((player) => {
      gameState.sellPlayer(player.id, player.value);
    });
    setDiscardedPlayers([]);
    setDiscardMode(false);
  };

  const getFilteredSquad = () => {
    return state.squad.filter((player) => player.position === "GK");
  };

  const getDefenders = () => {
    return state.squad.filter((player) => player.position === "DF");
  };

  const getMidfielders = () => {
    return state.squad.filter((player) => player.position === "MF");
  };

  const getForwards = () => {
    return state.squad.filter((player) => player.position === "FW");
  };

  const totalDiscardValue = discardedPlayers.reduce(
    (sum, player) => sum + player.value,
    0,
  );

  if (!team) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Equipo no encontrado</p>
      </div>
    );
  }

  // Modo búsqueda por nombre
  if (searchMode === "name") {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Fondo profesional */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 35%, rgba(51, 65, 85, 0.9) 100%),
              radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(34, 197, 94, 0.06) 0%, transparent 50%)
            `,
          }}
        />

        <div className="flex-1 p-6 max-w-md mx-auto w-full relative z-10">
          <div className="flex items-center mb-8">
            <button
              onClick={() => setSearchMode(null)}
              className="mr-4 p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/10"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Buscar Jugadores
              </h1>
              <p className="text-sm text-white/70 mt-1">
                Encuentra tu próxima estrella
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <Input
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 rounded-2xl backdrop-blur-xl focus:bg-slate-700/60 focus:border-slate-600/60 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4 mb-20 max-h-[60vh] overflow-y-auto">
            {searchResults.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-5 bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center flex-1">
                  {player.avatarUrl ? (
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      className="w-12 h-12 rounded-2xl mr-4 object-cover border-2 border-white/20"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-2xl mr-4 flex items-center justify-center text-sm font-bold border-2 border-white/20"
                      style={{
                        backgroundColor:
                          teams[player.team]?.colors.primary || "#1f2937",
                        color: teams[player.team]?.colors.secondary || "#ffffff",
                      }}
                    >
                      {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-white text-lg">
                      {player.name}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {teams[player.team]?.name} • #{player.shirt} •{" "}
                      {player.age} años
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="font-bold text-emerald-400 text-lg">
                    {formatCurrency(player.value)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handlePlayerAction(player, "buy")}
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 rounded-xl px-4 py-2 font-semibold transition-all duration-300"
                    disabled={state.budget < player.value}
                  >
                    Fichar
                  </Button>
                </div>
              </div>
            ))}
            {searchQuery.length > 2 && searchResults.length === 0 && (
              <div className="text-center text-white/60 py-8">
                No se encontraron jugadores
              </div>
            )}
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Modo búsqueda por equipo
  if (searchMode === "team") {
    if (!selectedTeamForSearch) {
      // Mostrar lista de equipos para elegir
      const availableTeams = Object.values(teams).filter(
        (t) => t.id !== teamId,
      );

      return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 35%, rgba(51, 65, 85, 0.9) 100%),
                radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(34, 197, 94, 0.06) 0%, transparent 50%)
              `,
            }}
          />

          <div className="flex-1 p-6 max-w-md mx-auto w-full relative z-10">
            <div className="flex items-center mb-8">
              <button
                onClick={() => setSearchMode(null)}
                className="mr-4 p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/10"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Buscar por Equipo
                </h1>
                <p className="text-white/70 text-base mt-1">
                  Selecciona un equipo para fichar jugadores
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-20 max-h-[70vh] overflow-y-auto">
              {availableTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeamForSearch(team.id)}
                  className="w-full p-5 bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300 shadow-lg text-left"
                >
                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-2xl mr-4 flex items-center justify-center text-lg font-bold border-2 border-white/20"
                      style={{
                        backgroundColor: team.colors.primary,
                        color: team.colors.secondary,
                      }}
                    >
                      {team.logo || "⚽"}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-lg">
                        {team.name}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        {team.players.length} jugadores disponibles
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <BottomNavigation />
        </div>
      );
    } else {
      // Mostrar jugadores del equipo seleccionado
      const selectedTeam = teams[selectedTeamForSearch];
      const availablePlayers = selectedTeam?.players || [];

      return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 35%, rgba(51, 65, 85, 0.9) 100%),
                radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(34, 197, 94, 0.06) 0%, transparent 50%)
              `,
            }}
          />

          <div className="flex-1 p-6 max-w-md mx-auto w-full relative z-10">
            <div className="flex items-center mb-8">
              <button
                onClick={() => setSelectedTeamForSearch(null)}
                className="mr-4 p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/10"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {selectedTeam?.name}
                </h1>
                <p className="text-white/70 text-base mt-1">
                  Selecciona jugadores para fichar
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-20 max-h-[60vh] overflow-y-auto">
              {availablePlayers.map((player) => {
                const isAlreadyInSquad = state.squad.some(
                  (p) => p.id === player.id,
                );

                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 shadow-lg ${
                      isAlreadyInSquad
                        ? "bg-slate-600/40 border-slate-500/40 opacity-60"
                        : "bg-slate-800/40 border-slate-700/40 hover:bg-slate-700/50 hover:border-slate-600/50"
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      {player.avatarUrl ? (
                        <img
                          src={player.avatarUrl}
                          alt={player.name}
                          className="w-12 h-12 rounded-2xl mr-4 object-cover border-2 border-white/20"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-2xl mr-4 flex items-center justify-center text-sm font-bold border-2 border-white/20"
                          style={{
                            backgroundColor: selectedTeam?.colors.primary,
                            color: selectedTeam?.colors.secondary,
                          }}
                        >
                          {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-white text-lg">
                          {player.name}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          #{player.shirt} • {player.age} años •{" "}
                          {player.nationality}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="font-bold text-emerald-400 text-lg">
                        {formatCurrency(player.value)}
                      </span>
                      {isAlreadyInSquad ? (
                        <span className="text-xs text-slate-400 bg-slate-600/40 px-3 py-1 rounded-lg">
                          Ya fichado
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handlePlayerAction(player, "buy")}
                          className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 rounded-xl px-4 py-2 font-semibold transition-all duration-300"
                          disabled={state.budget < player.value}
                        >
                          Fichar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <BottomNavigation />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-green-800 flex flex-col">
      <div className="flex-1 p-6 max-w-sm mx-auto w-full">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">{team.name}</h1>
            <p className="text-sm text-white/80">
              Presupuesto: {formatCurrency(state.budget)}
            </p>
          </div>
          <button
            onClick={() => setMode(mode === "default" ? "custom" : "default")}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Settings size={20} className="text-white" />
          </button>
        </div>

        {/* Controles de modo */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setDiscardMode(!discardMode)}
              variant={discardMode ? "default" : "outline"}
              size="sm"
              className={
                discardMode
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-white/10 border-white/30 text-white hover:bg-white/20"
              }
            >
              <Trash2 size={16} className="mr-2" />
              {discardMode ? "Cancelar" : "Descartar"}
            </Button>
            <Button
              onClick={() => setSearchMode("name")}
              size="sm"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Search size={16} className="mr-2" />
              Por Nombre
            </Button>
            <Button
              onClick={() => setSearchMode("team")}
              size="sm"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Plus size={16} className="mr-2" />
              Por Equipo
            </Button>
          </div>
        </div>

        {/* Resumen de descartes */}
        {discardMode && discardedPlayers.length > 0 && (
          <div className="bg-red-600/20 backdrop-blur border border-red-400/30 rounded-lg p-4 mb-6">
            <div className="text-white font-medium mb-2">
              Jugadores a descartar: {discardedPlayers.length}
            </div>
            <div className="text-white/80 text-sm mb-3">
              Vas a recuperar: {formatCurrency(totalDiscardValue)}
            </div>
            <Button
              onClick={confirmDiscards}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirmar Descartes
            </Button>
          </div>
        )}

        {/* Lista de jugadores por posición */}
        <div className="space-y-6 mb-20">
          {/* Porteros */}
          <div>
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm font-medium text-white">
                Porteros ({getFilteredSquad().length})
              </span>
            </div>
            <div className="space-y-3">
              {getFilteredSquad().map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 backdrop-blur border rounded-lg transition-colors ${
                    discardedPlayers.find((p) => p.id === player.id)
                      ? "bg-red-600/20 border-red-400/30"
                      : "bg-white/10 border-white/20"
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <Avatar
                      src={player.avatarUrl}
                      alt={player.name}
                      fallback={player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      className="w-10 h-10 rounded-full mr-3 border-2 border-green-500"
                      fallbackClassName="bg-green-500 text-white"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-white">{player.name}</p>
                      <p className="text-xs text-white/70">
                        #{player.shirt} - {player.age} años -{" "}
                        {player.nationality}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-white text-sm">
                      {formatCurrency(player.value)}
                    </span>
                    {discardMode ? (
                      <button
                        onClick={() => handlePlayerAction(player, "discard")}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          discardedPlayers.find((p) => p.id === player.id)
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        {discardedPlayers.find((p) => p.id === player.id)
                          ? "Cancelar"
                          : "Descartar"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePlayerAction(player, "sell")}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Vender
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Defensas */}
          <div>
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm font-medium text-white">
                Defensas ({getDefenders().length})
              </span>
            </div>
            <div className="space-y-3">
              {getDefenders().map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 backdrop-blur border rounded-lg transition-colors ${
                    discardedPlayers.find((p) => p.id === player.id)
                      ? "bg-red-600/20 border-red-400/30"
                      : "bg-white/10 border-white/20"
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <Avatar
                      src={player.avatarUrl}
                      alt={player.name}
                      fallback={player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500"
                      fallbackClassName="bg-blue-500 text-white"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-white">{player.name}</p>
                      <p className="text-xs text-white/70">
                        #{player.shirt} - {player.age} años -{" "}
                        {player.nationality}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-white text-sm">
                      {formatCurrency(player.value)}
                    </span>
                    {discardMode ? (
                      <button
                        onClick={() => handlePlayerAction(player, "discard")}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          discardedPlayers.find((p) => p.id === player.id)
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        {discardedPlayers.find((p) => p.id === player.id)
                          ? "Cancelar"
                          : "Descartar"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePlayerAction(player, "sell")}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Vender
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Centrocampistas */}
          <div>
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm font-medium text-white">
                Centrocampistas ({getMidfielders().length})
              </span>
            </div>
            <div className="space-y-3">
              {getMidfielders().map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 backdrop-blur border rounded-lg transition-colors ${
                    discardedPlayers.find((p) => p.id === player.id)
                      ? "bg-red-600/20 border-red-400/30"
                      : "bg-white/10 border-white/20"
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <Avatar
                      src={player.avatarUrl}
                      alt={player.name}
                      fallback={player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      className="w-10 h-10 rounded-full mr-3 border-2 border-yellow-500"
                      fallbackClassName="bg-yellow-500 text-black"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-white">{player.name}</p>
                      <p className="text-xs text-white/70">
                        #{player.shirt} - {player.age} años -{" "}
                        {player.nationality}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-white text-sm">
                      {formatCurrency(player.value)}
                    </span>
                    {discardMode ? (
                      <button
                        onClick={() => handlePlayerAction(player, "discard")}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          discardedPlayers.find((p) => p.id === player.id)
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        {discardedPlayers.find((p) => p.id === player.id)
                          ? "Cancelar"
                          : "Descartar"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePlayerAction(player, "sell")}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Vender
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delanteros */}
          <div>
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm font-medium text-white">
                Delanteros ({getForwards().length})
              </span>
            </div>
            <div className="space-y-3">
              {getForwards().map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 backdrop-blur border rounded-lg transition-colors ${
                    discardedPlayers.find((p) => p.id === player.id)
                      ? "bg-red-600/20 border-red-400/30"
                      : "bg-white/10 border-white/20"
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <Avatar
                      src={player.avatarUrl}
                      alt={player.name}
                      fallback={player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      className="w-10 h-10 rounded-full mr-3 border-2 border-red-500"
                      fallbackClassName="bg-red-500 text-white"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-white">{player.name}</p>
                      <p className="text-xs text-white/70">
                        #{player.shirt} - {player.age} años -{" "}
                        {player.nationality}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-white text-sm">
                      {formatCurrency(player.value)}
                    </span>
                    {discardMode ? (
                      <button
                        onClick={() => handlePlayerAction(player, "discard")}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          discardedPlayers.find((p) => p.id === player.id)
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        {discardedPlayers.find((p) => p.id === player.id)
                          ? "Cancelar"
                          : "Descartar"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePlayerAction(player, "sell")}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Vender
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mb-20">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            Volver
          </Button>
          <Button
            onClick={() => navigate("/formation")}
            className="px-8 bg-green-600 text-white hover:bg-green-700"
          >
            Formación
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
