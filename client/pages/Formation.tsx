import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share,
  Users,
  Trophy,
  Settings,
  RefreshCw,
  X,
  ChevronDown,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import BottomNavigation from "@/components/BottomNavigation";
import { formations, Player } from "@/lib/gameData";
import { gameState, GameState } from "@/lib/gameState";
import { toast } from "sonner";

// Funciones auxiliares
function getPlayerForPosition(
  lineup: Record<string, Player | null>,
  positionId: string,
): Player | null {
  return lineup[positionId] || null;
}

function getAvailablePlayersForPosition(
  squad: Player[],
  lineup: Record<string, Player | null>,
  positionType: string,
): Player[] {
  const lineupPlayerIds = Object.values(lineup)
    .filter(Boolean)
    .map((p) => p!.id);

  return squad.filter((player) => {
    if (lineupPlayerIds.includes(player.id)) return false;
    if (player.position !== positionType) return false;
    return true;
  });
}

export default function Formation() {
  const navigate = useNavigate();
  const [state, setState] = useState<GameState>(gameState.getState());
  const [showFinalLineup, setShowFinalLineup] = useState(false);
  const [currentFormation, setCurrentFormation] = useState(
    state.formation || "4-3-3",
  );
  const [showFormationSelector, setShowFormationSelector] = useState(false);
  const [showSubstitutions, setShowSubstitutions] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedPlayerInfo, setSelectedPlayerInfo] = useState<Player | null>(
    null,
  );

  // Verificar que hay un equipo seleccionado y auto-asignar si es necesario
  useEffect(() => {
    const currentState = gameState.getState();
    if (!currentState.selectedTeam) {
      navigate("/choose-team");
      return;
    }

    // Auto-asignar jugadores si no hay lineup configurado para el equipo actual
    const hasLineup = Object.keys(currentState.lineup).length > 0;
    if (!hasLineup && currentState.squad.length > 0) {
      console.log(
        `🔧 Auto-asignando formación para ${currentState.selectedTeam.name}`,
      );
      gameState.autoAssignPlayersToFormation(currentState.formation || "4-3-3");
    }
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = gameState.subscribe((newState) => {
      const previousTeamId = state.selectedTeam?.id;
      setState(newState);

      // Sincronizar formación local con el estado global
      if (newState.formation && newState.formation !== currentFormation) {
        setCurrentFormation(newState.formation);
      }

      // Detectar cambio de equipo y auto-asignar nueva formación
      if (
        newState.selectedTeam?.id !== previousTeamId &&
        newState.selectedTeam?.id
      ) {
        console.log(
          `🔄 Cambio de equipo detectado: ${newState.selectedTeam.name}`,
        );
        // Auto-asignar jugadores después de un breve delay para asegurar que el estado se haya actualizado
        setTimeout(() => {
          gameState.autoAssignPlayersToFormation(newState.formation || "4-3-3");
        }, 100);
      }
    });

    // Auto-asignar jugadores si no hay lineup configurado
    const hasLineup = Object.keys(state.lineup).length > 0;
    if (!hasLineup && state.squad.length > 0) {
      gameState.autoAssignPlayersToFormation(currentFormation);
    }

    return unsubscribe;
  }, []);

  // Keyboard escape functionality for modals
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selectedPlayerInfo) {
          setSelectedPlayerInfo(null);
        }
        if (showSubstitutions) {
          setShowSubstitutions(false);
          setSelectedPosition(null);
        }
        if (showFormationSelector) {
          setShowFormationSelector(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showSubstitutions, showFormationSelector]);

  const formation = formations[currentFormation as keyof typeof formations];

  const getStartingXI = () => {
    const usedPlayerIds = new Set<string>();

    // Get goalkeeper (prioritize starter or first available)
    const gk = state.squad.find(
      (p) => p.position === "GK" && (p.isStarter || !usedPlayerIds.has(p.id)),
    );
    if (gk) usedPlayerIds.add(gk.id);

    // Get defenders (prioritize starters, avoid duplicates)
    const defenders = state.squad
      .filter((p) => p.position === "DF" && !usedPlayerIds.has(p.id))
      .sort((a, b) => (b.isStarter ? 1 : 0) - (a.isStarter ? 1 : 0))
      .slice(0, 4);
    defenders.forEach((p) => usedPlayerIds.add(p.id));

    // Get midfielders (prioritize starters, avoid duplicates)
    const midfielders = state.squad
      .filter((p) => p.position === "MF" && !usedPlayerIds.has(p.id))
      .sort((a, b) => (b.isStarter ? 1 : 0) - (a.isStarter ? 1 : 0))
      .slice(0, 3);
    midfielders.forEach((p) => usedPlayerIds.add(p.id));

    // Get forwards (prioritize starters, avoid duplicates)
    const forwards = state.squad
      .filter((p) => p.position === "FW" && !usedPlayerIds.has(p.id))
      .sort((a, b) => (b.isStarter ? 1 : 0) - (a.isStarter ? 1 : 0))
      .slice(0, 3);
    forwards.forEach((p) => usedPlayerIds.add(p.id));

    return {
      gk,
      defenders,
      midfielders,
      forwards,
    };
  };

  const getSubstitutes = () => {
    const startingXI = getStartingXI();
    const startingPlayerIds = [
      startingXI.gk?.id,
      ...startingXI.defenders.map((p) => p.id),
      ...startingXI.midfielders.map((p) => p.id),
      ...startingXI.forwards.map((p) => p.id),
    ].filter(Boolean);

    return state.squad
      .filter((p) => !startingPlayerIds.includes(p.id))
      .slice(0, 7);
  };

  const shareLineup = () => {
    if (navigator.share) {
      navigator.share({
        title: `${state.selectedTeam?.name} - Alineación`,
        text: `¡Mira mi nueva alineación del ${state.selectedTeam?.name}! 🏆⚽`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `¡Mira mi nueva alineación del ${state.selectedTeam?.name}! 🏆⚽ ${window.location.href}`,
      );
      alert("¡Enlace copiado al portapapeles!");
    }
  };

  if (showFinalLineup) {
    // Usar el lineup actual del usuario en lugar de getStartingXI
    const currentLineup = state.lineup;

    // Obtener lista de jugadores que están en el lineup para mostrar como suplentes
    const lineupPlayerIds = Object.values(currentLineup)
      .filter(Boolean)
      .map((p) => p!.id);
    const finalSubstitutes = state.squad
      .filter((p) => !lineupPlayerIds.includes(p.id))
      .slice(0, 7);

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex flex-col relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%),
              linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.03) 49%, rgba(255,255,255,0.03) 51%, transparent 51%)
            `,
            backgroundSize: "100px 100px, 100px 100px, 20px 20px",
          }}
        />

        <div className="flex-1 p-3 max-w-sm mx-auto w-full relative z-10">
          {/* Header mejorado */}
          <div className="flex items-center mb-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <button
              onClick={() => setShowFinalLineup(false)}
              className="mr-4 p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">
                {state.selectedTeam?.name}
              </h1>
              <div className="flex items-center text-sm text-white/80 space-x-2">
                <div className="flex items-center">
                  <Trophy size={14} className="mr-1" />
                  <span>Alineación Final</span>
                </div>
                <div className="bg-emerald-500/30 px-2 py-0.5 rounded-full text-xs">
                  {formation.name}
                </div>
                <div className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {state.squad.length} jugadores
                </div>
              </div>
            </div>
          </div>

          {/* Campo de fútbol premium final */}
          <div
            className="relative rounded-3xl mb-6 shadow-2xl mx-auto overflow-hidden border-4 border-white/30"
            style={{
              width: "100%",
              maxWidth: "380px",
              height: "640px",
              background: `
                radial-gradient(ellipse at center top, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.95) 40%, rgba(6, 78, 59, 0.98) 100%),
                linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(22, 163, 74, 0.85) 50%, rgba(21, 128, 61, 0.9) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255, 255, 255, 0.03) 8px, rgba(255, 255, 255, 0.03) 9px),
                repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255, 255, 255, 0.02) 8px, rgba(255, 255, 255, 0.02) 9px)
              `,
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                inset 0 2px 4px rgba(255, 255, 255, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.1)
              `,
            }}
          >
            {/* Líneas del campo profesionales - FONDO */}
            <div
              className="absolute inset-0 rounded-xl overflow-hidden"
              style={{ zIndex: 1 }}
            >
              {/* L���nea central */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/70 transform -translate-y-1/2"></div>
              {/* Círculo central */}
              <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-white/70 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              {/* Punto central */}
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/70 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              {/* Área grande */}
              <div className="absolute bottom-0 left-1/4 right-1/4 h-16 border border-white/70 border-b-0 rounded-t-xl"></div>
              {/* Área pequeña */}
              <div className="absolute bottom-0 left-1/3 right-1/3 h-8 border border-white/70 border-b-0 rounded-t-lg"></div>
              {/* Semicírculo penal */}
              <div className="absolute bottom-8 left-1/2 w-12 h-6 border border-white/70 border-b-0 rounded-t-full transform -translate-x-1/2"></div>
            </div>

            {/* Contenedor de jugadores - PRIMER PLANO */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ zIndex: 10 }}
            >
              {formation.positions.map((pos, index) => {
                // USAR EL LINEUP ACTUAL DEL USUARIO en lugar de startingXI
                const player = getPlayerForPosition(currentLineup, pos.id);

                // Sistema de posicionamiento mejorado para evitar solapamientos
                const totalByPosition = formation.positions.filter(
                  (p) => p.position === pos.position,
                ).length;
                const currentIndex = formation.positions
                  .slice(0, index)
                  .filter((p) => p.position === pos.position).length;

                // Márgenes reducidos para usar más espacio del campo
                const MARGIN = 6; // Margen reducido desde los bordes
                const MIN_SPACING = 20; // Espaciado mínimo aumentado entre jugadores

                let adjustedX = pos.x;
                let adjustedY = pos.y;

                if (totalByPosition > 1) {
                  // Distribución equilibrada para múltiples jugadores en la misma posición
                  if (pos.position === "GK") {
                    // Portero siempre centrado y en la parte inferior
                    adjustedX = 50;
                    adjustedY = Math.max(85, Math.min(92, pos.y));
                  } else if (pos.position === "DF") {
                    // Defensas con distribución más amplia
                    if (totalByPosition === 2) {
                      adjustedX = currentIndex === 0 ? 20 : 80; // Más separados
                    } else if (totalByPosition === 3) {
                      adjustedX =
                        currentIndex === 0 ? 15 : currentIndex === 1 ? 50 : 85; // Extremos más amplios
                    } else if (totalByPosition === 4) {
                      adjustedX =
                        currentIndex === 0
                          ? 10
                          : currentIndex === 1
                            ? 35
                            : currentIndex === 2
                              ? 65
                              : 90; // Distribución completa
                    } else {
                      // Para 5 o más defensas
                      const spacing =
                        (100 - 2 * MARGIN) / (totalByPosition - 1);
                      adjustedX = MARGIN + currentIndex * spacing;
                    }
                    adjustedY = Math.max(MARGIN, Math.min(88 - MARGIN, pos.y));
                  } else if (pos.position === "MF") {
                    // Mediocampistas con distribución más amplia
                    if (totalByPosition === 1) {
                      adjustedX = 50;
                    } else if (totalByPosition === 2) {
                      adjustedX = currentIndex === 0 ? 25 : 75; // Más separados
                    } else if (totalByPosition === 3) {
                      adjustedX =
                        currentIndex === 0 ? 15 : currentIndex === 1 ? 50 : 85; // Distribución amplia
                    } else if (totalByPosition === 4) {
                      adjustedX =
                        currentIndex === 0
                          ? 12
                          : currentIndex === 1
                            ? 38
                            : currentIndex === 2
                              ? 62
                              : 88; // Muy amplio
                    } else if (totalByPosition === 5) {
                      adjustedX =
                        currentIndex === 0
                          ? 10
                          : currentIndex === 1
                            ? 30
                            : currentIndex === 2
                              ? 50
                              : currentIndex === 3
                                ? 70
                                : 90; // Distribución completa
                    } else {
                      const spacing =
                        (100 - 2 * MARGIN) / (totalByPosition - 1);
                      adjustedX = MARGIN + currentIndex * spacing;
                    }
                    adjustedY = Math.max(MARGIN, Math.min(88 - MARGIN, pos.y));
                  } else if (pos.position === "FW") {
                    // Delanteros con distribución más amplia
                    if (totalByPosition === 1) {
                      adjustedX = 50;
                    } else if (totalByPosition === 2) {
                      adjustedX = currentIndex === 0 ? 25 : 75; // Más separados
                    } else if (totalByPosition === 3) {
                      adjustedX =
                        currentIndex === 0 ? 15 : currentIndex === 1 ? 50 : 85; // Extremos amplios
                    } else if (totalByPosition === 4) {
                      adjustedX =
                        currentIndex === 0
                          ? 10
                          : currentIndex === 1
                            ? 35
                            : currentIndex === 2
                              ? 65
                              : 90; // Distribución completa
                    } else {
                      const spacing =
                        (100 - 2 * MARGIN) / (totalByPosition - 1);
                      adjustedX = MARGIN + currentIndex * spacing;
                    }
                    adjustedY = Math.max(MARGIN, Math.min(88 - MARGIN, pos.y));
                  }
                } else {
                  // Jugador ��nico en su posición
                  if (pos.position === "GK") {
                    adjustedX = 50;
                    adjustedY = Math.max(85, Math.min(92, pos.y));
                  } else {
                    adjustedX = Math.max(MARGIN, Math.min(100 - MARGIN, pos.x));
                    adjustedY = Math.max(MARGIN, Math.min(88 - MARGIN, pos.y));
                  }
                }

                // Asegurar que ningún jugador se salga de los límites del campo
                adjustedX = Math.max(MARGIN, Math.min(100 - MARGIN, adjustedX));
                adjustedY = Math.max(MARGIN, Math.min(88 - MARGIN, adjustedY));

                return (
                  <div
                    key={pos.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${adjustedX}%`,
                      top: `${adjustedY}%`,
                      zIndex:
                        pos.position === "GK"
                          ? 15
                          : pos.position === "DF"
                            ? 14
                            : pos.position === "MF"
                              ? 13
                              : 12,
                    }}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="relative">
                        {/* Avatar premium con efectos avanzados */}
                        <div
                          className="rounded-full border-3 shadow-2xl transform hover:scale-110 transition-all duration-500 overflow-hidden bg-gradient-to-br from-white to-gray-50 ring-2 ring-white/80 hover:ring-emerald-400/70 relative group cursor-pointer"
                          onClick={() => {
                            if (player) {
                              setSelectedPlayerInfo(player);
                            }
                          }}
                          style={{
                            borderColor:
                              state.selectedTeam?.colors.primary || "#10b981",
                            width: "60px",
                            height: "60px",
                            boxShadow: `0 12px 40px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)`,
                          }}
                        >
                          {/* Efectos de brillo premium */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-70"></div>
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/0 via-emerald-400/0 to-emerald-600/0 group-hover:from-emerald-400/25 group-hover:via-emerald-400/15 group-hover:to-emerald-600/25 transition-all duration-500"></div>
                          {player?.avatarUrl ? (
                            <img
                              src={player.avatarUrl}
                              alt={player.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const container =
                                  target.parentElement as HTMLElement;
                                container.innerHTML = `
                                  <div class="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center">
                                    <div class="rounded-full flex items-center justify-center shadow-inner" style="background-color: ${state.selectedTeam?.colors.primary || "#1f2937"}; width: 22px; height: 22px;">
                                      <span class="text-sm font-bold text-white">${player?.shirt || "?"}</span>
                                    </div>
                                  </div>
                                `;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center">
                              <div
                                className="rounded-full flex items-center justify-center shadow-inner"
                                style={{
                                  backgroundColor:
                                    state.selectedTeam?.colors.primary ||
                                    "#1f2937",
                                  width: "22px",
                                  height: "22px",
                                }}
                              >
                                <span className="text-sm font-bold text-white">
                                  {player?.shirt || "?"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Position indicator premium final view */}
                        <div
                          className="absolute bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-black rounded-full flex items-center justify-center border-2 border-white/90 shadow-xl backdrop-blur-sm"
                          style={{
                            top: "-5px",
                            right: "-5px",
                            width: "22px",
                            height: "22px",
                            fontSize: "8px",
                            zIndex: 25,
                            boxShadow: `0 6px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)`,
                          }}
                        >
                          <span className="text-shadow">{pos.position}</span>
                        </div>

                        {/* Número de camiseta donde estaba la estrella */}
                        {player && (
                          <div
                            className="absolute bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                            style={{
                              top: "-4px",
                              left: "-4px",
                              width: "20px",
                              height: "20px",
                              zIndex: 20,
                              fontSize: "11px",
                            }}
                          >
                            {player.shirt}
                          </div>
                        )}
                      </div>

                      <div className="text-center space-y-1">
                        <div
                          className="font-bold text-white bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-xl px-2 py-1.5 shadow-2xl border border-white/40 relative overflow-visible group"
                          style={{
                            fontSize: "8px",
                            lineHeight: "1.2",
                            minWidth: "70px",
                            maxWidth: "70px",
                            boxShadow: `0 10px 36px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15)`,
                          }}
                        >
                          {/* Efecto de brillo sutil en el texto */}
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/8 to-white/15 rounded-xl"></div>
                          {player?.name ? (
                            <div className="leading-tight text-center relative z-10">
                              {/* Nombre completo en múltiples líneas si es necesario */}
                              <div className="break-words">
                                {player.name.length > 12 ? (
                                  player.name.split(" ").map((word, idx) => (
                                    <div
                                      key={idx}
                                      className={
                                        idx === 0
                                          ? "text-white"
                                          : "text-white/80"
                                      }
                                    >
                                      {word}
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-white">
                                    {player.name}
                                  </div>
                                )}
                              </div>
                              {/* Tooltip con nombre completo al hacer hover */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                <div className="bg-slate-900/95 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-slate-700 whitespace-nowrap">
                                  <div className="font-semibold">
                                    {player.name}
                                  </div>
                                  <div className="text-slate-300 mt-1">
                                    #{player.shirt} �� {player.age}a •{" "}
                                    {player.position}
                                  </div>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-white/70 relative z-10">
                              {pos.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estadísticas del equipo */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 mb-6 border border-white/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">
                  {state.squad.length}
                </div>
                <div className="text-xs text-white/80">Jugadores</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  €{Math.round(state.budget / 1000000)}M
                </div>
                <div className="text-xs text-white/80">Presupuesto</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {state.transferHistory.length}
                </div>
                <div className="text-xs text-white/80">Fichajes</div>
              </div>
            </div>
          </div>

          {/* Suplentes mejorados */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 mb-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <div className="p-2 bg-blue-500/20 rounded-xl mr-3">
                <Users size={18} className="text-blue-400" />
              </div>
              Suplentes
              <span className="ml-2 text-sm text-white/60 bg-white/10 px-2 py-1 rounded-full">
                {finalSubstitutes.length}
              </span>
            </h3>
            <div className="space-y-3">
              {finalSubstitutes.map((player, index) => (
                <div
                  key={player.id}
                  className="bg-white/5 backdrop-blur border border-white/10 text-white px-4 py-3 rounded-xl text-sm hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div
                        className="rounded-full mr-3 border-2 border-white/30 overflow-hidden shadow-lg flex-shrink-0"
                        style={{
                          width: "42px",
                          height: "42px",
                        }}
                      >
                        {player.avatarUrl ? (
                          <img
                            src={player.avatarUrl}
                            alt={player.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const container =
                                target.parentElement as HTMLElement;
                              container.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center text-xs font-bold" style="background-color: ${state.selectedTeam?.colors.primary || "#1f2937"}; color: ${state.selectedTeam?.colors.secondary || "#ffffff"};">
                                    ${player.position}
                                  </div>
                                `;
                            }}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor:
                                state.selectedTeam?.colors.primary || "#1f2937",
                              color:
                                state.selectedTeam?.colors.secondary ||
                                "#ffffff",
                            }}
                          >
                            {player.position}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm">
                          {player.name}
                        </div>
                        <div className="text-xs text-white/70 mt-1">
                          #{player.shirt} • {player.age} años •{" "}
                          {player.position}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-lg ml-2 flex-shrink-0">
                      Sub {index + 1}
                    </div>
                  </div>
                </div>
              ))}
              {finalSubstitutes.length === 0 && (
                <div className="text-center text-white/60 py-4">
                  No hay suplentes disponibles
                </div>
              )}
            </div>
          </div>

          <div className="text-center mb-20">
            <Button
              onClick={shareLineup}
              className="flex items-center space-x-2 mx-auto bg-white text-green-700 hover:bg-gray-100 rounded-xl px-8 py-4 text-lg font-semibold shadow-xl"
            >
              <Share size={18} />
              <span>Compartir Alineación</span>
            </Button>
          </div>
        </div>

        {/* Modal de información del jugador */}
        {selectedPlayerInfo && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPlayerInfo(null)}
          >
            <div
              className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl max-w-sm w-full shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del modal */}
              <div
                className="relative p-6 text-center"
                style={{
                  background: `linear-gradient(135deg, ${state.selectedTeam?.colors.primary || "#10b981"}40, ${state.selectedTeam?.colors.primary || "#10b981"}20)`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20"></div>
                <button
                  onClick={() => setSelectedPlayerInfo(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-300 z-10"
                >
                  <X size={20} className="text-white" />
                </button>

                {/* Avatar grande */}
                <div className="relative mx-auto mb-4">
                  <div
                    className="w-24 h-24 rounded-full mx-auto border-4 border-white/30 overflow-hidden shadow-2xl relative"
                    style={{
                      boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)`,
                    }}
                  >
                    {selectedPlayerInfo.avatarUrl ? (
                      <img
                        src={selectedPlayerInfo.avatarUrl}
                        alt={selectedPlayerInfo.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const container = target.parentElement as HTMLElement;
                          container.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${state.selectedTeam?.colors.primary || "#1f2937"};">
                                ${selectedPlayerInfo.position}
                              </div>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{
                            backgroundColor:
                              state.selectedTeam?.colors.primary || "#1f2937",
                          }}
                        >
                          {selectedPlayerInfo.position}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Número de camiseta */}
                  <div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-slate-900 to-black text-white font-black rounded-full flex items-center justify-center border-3 border-white/80 shadow-xl"
                    style={{
                      width: "32px",
                      height: "32px",
                      fontSize: "14px",
                    }}
                  >
                    #{selectedPlayerInfo.shirt}
                  </div>
                </div>

                {/* Nombre y posición */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    {selectedPlayerInfo.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-4 text-white/80">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedPlayerInfo.position}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedPlayerInfo.age} años
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido del modal */}
              <div className="p-6">
                {/* Estadísticas principales */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">
                      {selectedPlayerInfo.value
                        ? `€${Math.round(selectedPlayerInfo.value / 1000000)}M`
                        : "N/A"}
                    </div>
                    <div className="text-white/70 text-sm">Valor</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {selectedPlayerInfo.isStarter ? "Titular" : "Suplente"}
                    </div>
                    <div className="text-white/70 text-sm">Estado</div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/70">Equipo</span>
                    <span className="text-white font-medium">
                      {state.selectedTeam?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/70">Liga</span>
                    <span className="text-white font-medium">
                      {state.selectedTeam?.league?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-white/70">Camiseta</span>
                    <span className="text-white font-medium">
                      #{selectedPlayerInfo.shirt}
                    </span>
                  </div>
                </div>

                {/* Botón de cerrar */}
                <button
                  onClick={() => setSelectedPlayerInfo(null)}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-xl"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        <BottomNavigation />
      </div>
    );
  }

  const startingXI = getStartingXI();
  const substitutes = getSubstitutes();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background pattern mejorado */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.5) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
            linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.02) 49%, rgba(255,255,255,0.02) 51%, transparent 51%)
          `,
          backgroundSize: "120px 120px, 80px 80px, 20px 20px",
        }}
      />

      <div className="flex-1 p-3 w-full relative z-10 max-w-sm mx-auto">
        {/* Header mejorado */}
        <div className="mb-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
          <div className="flex items-center mb-3">
            <button
              onClick={() =>
                navigate("/squad-management/" + state.selectedTeam?.id)
              }
              className="mr-3 p-2 hover:bg-white/20 rounded-xl transition-all duration-300 flex-shrink-0"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white tracking-tight truncate">
                {state.selectedTeam?.name}
              </h1>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => {
                  gameState.autoAssignPlayersToFormation(currentFormation);
                  toast.success("Jugadores reorganizados automáticamente", {
                    description:
                      "Se han asignado los mejores jugadores a cada posición",
                  });
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300"
                title="Auto-asignar jugadores"
              >
                <Settings size={18} className="text-white" />
              </button>
              <button
                onClick={() => setShowSubstitutions(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                <RefreshCw size={18} className="text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-white/70 space-x-2">
              <span className="bg-white/10 px-2 py-1 rounded-lg whitespace-nowrap">
                {state.squad.length} jugadores
              </span>
              <span className="bg-white/10 px-2 py-1 rounded-lg whitespace-nowrap">
                {state.selectedTeam?.league?.toUpperCase()}
              </span>
            </div>

            <button
              onClick={() => setShowFormationSelector(true)}
              className="flex items-center text-xs text-white/80 hover:text-white transition-colors bg-white/10 px-2 py-1.5 rounded-lg backdrop-blur-sm border border-white/20 ml-2"
            >
              <Users size={14} className="mr-1.5 flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">
                {formation.name}
              </span>
              <ChevronDown size={12} className="ml-1.5 flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Campo táctico premium con diseño ��nico */}
        <div
          className="relative rounded-3xl mb-6 shadow-2xl mx-auto overflow-hidden border-4 border-white/30"
          style={{
            width: "100%",
            maxWidth: "380px",
            height: "640px",
            background: `
              radial-gradient(ellipse at center top, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.95) 40%, rgba(6, 78, 59, 0.98) 100%),
              linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(22, 163, 74, 0.85) 50%, rgba(21, 128, 61, 0.9) 100%),
              repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255, 255, 255, 0.03) 8px, rgba(255, 255, 255, 0.03) 9px),
              repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255, 255, 255, 0.02) 8px, rgba(255, 255, 255, 0.02) 9px)
            `,
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.5),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              0 0 0 1px rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          {/* Líneas del campo profesionales - FONDO */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{ zIndex: 1 }}
          >
            {/* Línea central premium con efecto luminoso */}
            <div
              className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2"
              style={{
                height: "3px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.9) 15%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.9) 85%, transparent 100%)",
                filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))",
                borderRadius: "2px",
              }}
            ></div>
            {/* Círculo central con efectos especiales */}
            <div
              className="absolute top-1/2 left-1/2 w-20 h-20 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{
                border: "3px solid rgba(255, 255, 255, 0.95)",
                background:
                  "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 50%, transparent 80%)",
                filter: "drop-shadow(0 0 12px rgba(255, 255, 255, 0.4))",
                boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.1)",
              }}
            ></div>
            {/* Punto central diamante */}
            <div
              className="absolute top-1/2 left-1/2 w-3 h-3 transform -translate-x-1/2 -translate-y-1/2 rotate-45"
              style={{
                background:
                  "linear-gradient(45deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 100%)",
                filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))",
                borderRadius: "2px",
              }}
            ></div>
            {/* Área grande */}
            <div className="absolute bottom-0 left-1/4 right-1/4 h-16 border border-white/70 border-b-0 rounded-t-xl"></div>
            {/* ��rea pequeña */}
            <div className="absolute bottom-0 left-1/3 right-1/3 h-8 border border-white/70 border-b-0 rounded-t-lg"></div>
            {/* Semicírculo penal */}
            <div className="absolute bottom-8 left-1/2 w-12 h-6 border border-white/70 border-b-0 rounded-t-full transform -translate-x-1/2"></div>
          </div>

          {/* Contenedor de jugadores - PRIMER PLANO */}
          <div
            className="absolute inset-0 overflow-hidden sm:-top-12"
            style={{ zIndex: 10 }}
          >
            {formation.positions.map((pos, index) => {
              let player = getPlayerForPosition(state.lineup, pos.id);
              if (!player) {
                // Asignar automáticamente jugadores por posición basado en starting XI
                const startingXI = getStartingXI();
                if (pos.position === "GK") {
                  player = startingXI.gk || null;
                } else if (pos.position === "DF") {
                  const defIndex = formation.positions
                    .slice(0, index)
                    .filter((p) => p.position === "DF").length;
                  player = startingXI.defenders[defIndex] || null;
                } else if (pos.position === "MF") {
                  const midIndex = formation.positions
                    .slice(0, index)
                    .filter((p) => p.position === "MF").length;
                  player = startingXI.midfielders[midIndex] || null;
                } else if (pos.position === "FW") {
                  const fwIndex = formation.positions
                    .slice(0, index)
                    .filter((p) => p.position === "FW").length;
                  player = startingXI.forwards[fwIndex] || null;
                }
              }

              // Sistema de posicionamiento mejorado para evitar solapamientos
              const totalByPosition = formation.positions.filter(
                (p) => p.position === pos.position,
              ).length;
              const currentIndex = formation.positions
                .slice(0, index)
                .filter((p) => p.position === pos.position).length;

              // Márgenes reducidos para usar más espacio del campo
              const MARGIN = 6; // Margen reducido desde los bordes
              const MIN_SPACING = 20; // Espaciado mínimo aumentado entre jugadores

              let adjustedX = pos.x;
              let adjustedY = pos.y;

              if (totalByPosition > 1) {
                // Distribución equilibrada para múltiples jugadores en la misma posición
                if (pos.position === "GK") {
                  // Portero siempre centrado y en la parte inferior
                  adjustedX = 50;
                  adjustedY = Math.max(85, Math.min(92, pos.y));
                } else if (pos.position === "DF") {
                  // Defensas con distribución más amplia
                  if (totalByPosition === 2) {
                    adjustedX = currentIndex === 0 ? 20 : 80; // Más separados
                  } else if (totalByPosition === 3) {
                    adjustedX =
                      currentIndex === 0 ? 15 : currentIndex === 1 ? 50 : 85; // Extremos m��s amplios
                  } else if (totalByPosition === 4) {
                    adjustedX =
                      currentIndex === 0
                        ? 10
                        : currentIndex === 1
                          ? 35
                          : currentIndex === 2
                            ? 65
                            : 90; // Distribución completa
                  } else {
                    // Para 5 o más defensas
                    const spacing = (100 - 2 * MARGIN) / (totalByPosition - 1);
                    adjustedX = MARGIN + currentIndex * spacing;
                  }
                  adjustedY = Math.max(MARGIN, Math.min(88 - MARGIN, pos.y));
                } else if (pos.position === "MF") {
                  // Mediocampistas con distribución más amplia
                  if (totalByPosition === 1) {
                    adjustedX = 50;
                  } else if (totalByPosition === 2) {
                    adjustedX = currentIndex === 0 ? 25 : 75; // Más separados
                  } else if (totalByPosition === 3) {
                    adjustedX =
                      currentIndex === 0 ? 15 : currentIndex === 1 ? 50 : 85; // Distribución amplia
                  } else if (totalByPosition === 4) {
                    adjustedX =
                      currentIndex === 0
                        ? 12
                        : currentIndex === 1
                          ? 38
                          : currentIndex === 2
                            ? 62
                            : 88; // Muy amplio
                  } else if (totalByPosition === 5) {
                    adjustedX =
                      currentIndex === 0
                        ? 10
                        : currentIndex === 1
                          ? 30
                          : currentIndex === 2
                            ? 50
                            : currentIndex === 3
                              ? 70
                              : 90; // Distribución completa
                  } else {
                    const spacing = (100 - 2 * MARGIN) / (totalByPosition - 1);
                    adjustedX = MARGIN + currentIndex * spacing;
                  }
                  adjustedY = Math.max(MARGIN, Math.min(88 - MARGIN, pos.y));
                } else if (pos.position === "FW") {
                  // Delanteros con distribución más amplia
                  if (totalByPosition === 1) {
                    adjustedX = 50;
                  } else if (totalByPosition === 2) {
                    adjustedX = currentIndex === 0 ? 25 : 75; // Más separados
                  } else if (totalByPosition === 3) {
                    adjustedX =
                      currentIndex === 0 ? 15 : currentIndex === 1 ? 50 : 85; // Extremos amplios
                  } else if (totalByPosition === 4) {
                    adjustedX =
                      currentIndex === 0
                        ? 10
                        : currentIndex === 1
                          ? 35
                          : currentIndex === 2
                            ? 65
                            : 90; // Distribución completa
                  } else {
                    const spacing = (100 - 2 * MARGIN) / (totalByPosition - 1);
                    adjustedX = MARGIN + currentIndex * spacing;
                  }
                  adjustedY = Math.max(MARGIN, Math.min(88 - MARGIN, pos.y));
                }
              } else {
                // Jugador único en su posición
                if (pos.position === "GK") {
                  adjustedX = 50;
                  adjustedY = Math.max(85, Math.min(92, pos.y));
                } else {
                  adjustedX = Math.max(MARGIN, Math.min(100 - MARGIN, pos.x));
                  adjustedY = Math.max(MARGIN, Math.min(88 - MARGIN, pos.y));
                }
              }

              // Asegurar que ningún jugador se salga de los l��mites del campo
              adjustedX = Math.max(MARGIN, Math.min(100 - MARGIN, adjustedX));
              adjustedY = Math.max(MARGIN, Math.min(88 - MARGIN, adjustedY));

              return (
                <div
                  key={pos.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${adjustedX}%`,
                    top: `${adjustedY}%`,
                    zIndex:
                      pos.position === "GK"
                        ? 15
                        : pos.position === "DF"
                          ? 14
                          : pos.position === "MF"
                            ? 13
                            : 12,
                  }}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="relative group">
                      {/* Player avatar con diseño premium */}
                      <div
                        className="relative cursor-pointer group transform hover:scale-110 transition-all duration-700"
                        onClick={() => {
                          if (player) {
                            setSelectedPlayerInfo(player);
                          } else {
                            setSelectedPosition(pos.id);
                            setShowSubstitutions(true);
                          }
                        }}
                        style={{ width: "64px", height: "64px" }}
                      >
                        {/* Anillo exterior con pulso */}
                        <div
                          className="absolute inset-0 rounded-full animate-pulse"
                          style={{
                            background: `conic-gradient(from 0deg, ${state.selectedTeam?.colors.primary || "#10b981"}40, transparent, ${state.selectedTeam?.colors.primary || "#10b981"}40)`,
                            filter: "blur(2px)",
                          }}
                        ></div>

                        {/* Marco hexagonal principal */}
                        <div
                          className="absolute inset-1 transition-all duration-500 group-hover:inset-0"
                          style={{
                            background: `linear-gradient(135deg, ${state.selectedTeam?.colors.primary || "#10b981"}95, ${state.selectedTeam?.colors.primary || "#10b981"}70, ${state.selectedTeam?.colors.primary || "#10b981"}95)`,
                            clipPath:
                              "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                            filter:
                              "drop-shadow(0 8px 25px rgba(0, 0, 0, 0.4))",
                          }}
                        ></div>

                        {/* Marco interior brillante */}
                        <div
                          className="absolute inset-2 rounded-full overflow-hidden border-2 border-white/90 group-hover:border-white transition-all duration-500"
                          style={{
                            background:
                              "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
                            filter:
                              "drop-shadow(0 4px 15px rgba(255, 255, 255, 0.3))",
                            boxShadow:
                              "inset 0 2px 8px rgba(255, 255, 255, 0.4), inset 0 -2px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {/* Efecto de brillo premium */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-60"></div>
                          {/* Efecto de hover brillante */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/0 via-emerald-400/0 to-emerald-600/0 group-hover:from-emerald-400/20 group-hover:via-emerald-400/10 group-hover:to-emerald-600/20 transition-all duration-500"></div>
                          {player?.avatarUrl ? (
                            <img
                              src={player.avatarUrl}
                              alt={player.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const container =
                                  target.parentElement as HTMLElement;
                                container.innerHTML = `
                                <div class="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center">
                                  <div class="rounded-full shadow-inner flex items-center justify-center" style="background-color: ${state.selectedTeam?.colors.primary || "#1f2937"}; width: 22px; height: 22px;">
                                    <span class="text-xs font-bold text-white">${player?.shirt || "?"}</span>
                                  </div>
                                </div>
                              `;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center">
                              <div
                                className="rounded-full shadow-inner flex items-center justify-center"
                                style={{
                                  backgroundColor:
                                    state.selectedTeam?.colors.primary ||
                                    "#1f2937",
                                  width: "22px",
                                  height: "22px",
                                }}
                              >
                                <span className="text-xs font-bold text-white">
                                  {player?.shirt || "?"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Indicador de posición premium con diseño diamante */}
                      <div
                        className="absolute flex items-center justify-center transform rotate-45"
                        style={{
                          top: "-8px",
                          right: "-8px",
                          width: "24px",
                          height: "24px",
                          background: `linear-gradient(135deg, ${state.selectedTeam?.colors.primary || "#10b981"}, ${state.selectedTeam?.colors.secondary || "#064e3b"})`,
                          borderRadius: "4px",
                          zIndex: 25,
                          boxShadow: `0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.3)`,
                          border: "2px solid rgba(255, 255, 255, 0.9)",
                        }}
                      >
                        <span
                          className="font-black text-white transform -rotate-45"
                          style={{
                            fontSize: "9px",
                            textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                            filter:
                              "drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))",
                          }}
                        >
                          {pos.position}
                        </span>
                      </div>

                      {/* Número de camiseta donde estaba la estrella */}
                      {player && (
                        <div
                          className="absolute bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                          style={{
                            top: "-3px",
                            left: "-3px",
                            width: "18px",
                            height: "18px",
                            zIndex: 20,
                            fontSize: "10px",
                          }}
                        >
                          {player.shirt}
                        </div>
                      )}

                      {/* Tooltip compacto */}
                      <div
                        className="absolute left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                        style={{ top: "-65px" }}
                      >
                        <div className="bg-slate-900/95 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-slate-700 whitespace-nowrap min-w-[110px] max-w-[110px] text-center">
                          <div className="font-semibold text-xs truncate">
                            {player ? player.name : `${pos.name}`}
                          </div>
                          {player && (
                            <div className="text-slate-300 mt-1 text-xs">
                              #{player.shirt} • {player.age}a
                            </div>
                          )}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                    </div>

                    {/* Player name optimizado */}
                    <div
                      className="text-center space-y-1"
                      style={{ marginTop: "3px" }}
                    >
                      <div
                        className="text-xs font-bold text-white bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-xl px-2 py-1.5 shadow-2xl border border-white/40 relative overflow-visible group"
                        style={{
                          fontSize: "8px",
                          lineHeight: "1.2",
                          minWidth: "68px",
                          maxWidth: "68px",
                          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)`,
                        }}
                      >
                        {/* Efecto de brillo sutil en el texto */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 rounded-xl"></div>
                        {player?.name ? (
                          <div className="leading-tight text-center relative z-10">
                            {/* Nombre completo en múltiples líneas si es necesario */}
                            <div className="break-words">
                              {player.name.length > 12 ? (
                                player.name.split(" ").map((word, idx) => (
                                  <div
                                    key={idx}
                                    className={
                                      idx === 0 ? "text-white" : "text-white/80"
                                    }
                                  >
                                    {word}
                                  </div>
                                ))
                              ) : (
                                <div className="text-white">{player.name}</div>
                              )}
                            </div>
                            {/* Tooltip con nombre completo al hacer hover */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                              <div className="bg-slate-900/95 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-slate-700 whitespace-nowrap">
                                <div className="font-semibold">
                                  {player.name}
                                </div>
                                <div className="text-slate-300 mt-1">
                                  #{player.shirt} • {player.age}a •{" "}
                                  {player.position}
                                </div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 relative z-10">
                            {pos.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suplentes mejorados */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <div className="p-2 bg-blue-500/20 rounded-xl mr-3">
              <Users size={20} className="text-blue-400" />
            </div>
            Suplentes
            <span className="ml-3 text-base text-white/60 bg-white/10 px-3 py-1 rounded-full">
              {substitutes.length}
            </span>
          </h3>
          <div className="space-y-3">
            {substitutes.map((player) => (
              <div
                key={player.id}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 text-white px-4 py-4 rounded-2xl text-sm hover:bg-slate-700/60 hover:border-slate-600/60 transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div
                      className="rounded-full mr-3 border-3 border-white/30 overflow-hidden shadow-lg flex-shrink-0"
                      style={{
                        width: "42px",
                        height: "42px",
                      }}
                    >
                      {player.avatarUrl ? (
                        <img
                          src={player.avatarUrl}
                          alt={player.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const container =
                              target.parentElement as HTMLElement;
                            container.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center text-xs font-bold" style="background-color: ${state.selectedTeam?.colors.primary || "#1f2937"}; color: ${state.selectedTeam?.colors.secondary || "#ffffff"};">
                                ${player.position}
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor:
                              state.selectedTeam?.colors.primary || "#1f2937",
                            color:
                              state.selectedTeam?.colors.secondary || "#ffffff",
                          }}
                        >
                          {player.position}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white">
                        {player.name}
                      </div>
                      <div className="text-xs text-white/70 mt-1">
                        #{player.shirt} • {player.age} años • {player.position}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-lg ml-2 flex-shrink-0">
                    {player.age} años
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between space-x-4 mb-24">
          <Button
            variant="outline"
            onClick={() =>
              navigate("/squad-management/" + state.selectedTeam?.id)
            }
            className="flex-1 py-4 text-lg bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/60 hover:border-slate-600/60 rounded-2xl backdrop-blur-xl transition-all duration-300"
          >
            ← Volver
          </Button>
          <Button
            onClick={() => setShowFinalLineup(true)}
            className="flex-1 py-4 text-lg bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
          >
            🏆 Ver Final
          </Button>
        </div>

        {/* Modal de selección de formación mejorado */}
        {showFormationSelector && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setShowFormationSelector(false)}
          >
            <div
              className="w-full bg-white rounded-t-3xl max-h-[85vh] animate-in slide-in-from-bottom duration-300 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto"></div>
                  <button
                    onClick={() => setShowFormationSelector(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Selecciona Formación
                </h3>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                  {Object.entries(formations).map(([key, form]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentFormation(key);
                        // Auto-asignar jugadores a la nueva formación
                        gameState.autoAssignPlayersToFormation(key);
                        toast.success(
                          `Jugadores auto-asignados a ${form.name}`,
                          {
                            description:
                              "La formación se ha actualizado automáticamente",
                          },
                        );
                        setShowFormationSelector(false);
                      }}
                      className={`w-full p-5 rounded-xl text-left transition-colors shadow-sm border ${
                        currentFormation === key
                          ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
                          : "bg-gray-50 hover:bg-blue-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">
                            {form.name}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {form.description}
                          </div>
                        </div>
                        {currentFormation === key && (
                          <div className="text-blue-600 font-bold text-xl">
                            ✓
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => setShowFormationSelector(false)}
                  variant="outline"
                  className="w-full mt-8 py-4 text-lg rounded-xl"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de sustituciones mejorado */}
        {showSubstitutions && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
            onClick={() => {
              setShowSubstitutions(false);
              setSelectedPosition(null);
            }}
          >
            <div
              className="w-full bg-white rounded-t-3xl max-h-[85vh] animate-in slide-in-from-bottom duration-300 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto"></div>
                  <button
                    onClick={() => {
                      setShowSubstitutions(false);
                      setSelectedPosition(null);
                    }}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Hacer Sustituciones
                </h3>

                {!selectedPosition ? (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Selecciona una posición para sustituir:
                    </p>
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                      {formation.positions.map((pos) => {
                        const currentPlayer = getPlayerForPosition(
                          state.lineup,
                          pos.id,
                        );
                        return (
                          <button
                            key={pos.id}
                            onClick={() => setSelectedPosition(pos.id)}
                            className="w-full p-4 bg-gray-50 hover:bg-blue-50 rounded-xl text-left transition-colors border border-gray-200"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {pos.name} -{" "}
                                  {currentPlayer?.name || "Sin asignar"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {currentPlayer
                                    ? `#${currentPlayer.shirt} • ${currentPlayer.position}`
                                    : "Posición vacía"}
                                </div>
                              </div>
                              <div className="text-blue-600">→</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setSelectedPosition(null)}
                      className="flex items-center text-blue-600 mb-4"
                    >
                      <ArrowLeft size={16} className="mr-2" />
                      Volver a posiciones
                    </button>
                    <p className="text-gray-600 mb-4">
                      Selecciona un jugador para la posición{" "}
                      {
                        formation.positions.find(
                          (p) => p.id === selectedPosition,
                        )?.name
                      }
                      :
                    </p>
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                      {getAvailablePlayersForPosition(
                        state.squad,
                        state.lineup,
                        formation.positions.find(
                          (p) => p.id === selectedPosition,
                        )?.position || "",
                      ).map((player) => (
                        <button
                          key={player.id}
                          onClick={() => {
                            gameState.setLineupPlayer(selectedPosition, player);
                            setSelectedPosition(null);
                            setShowSubstitutions(false);
                          }}
                          className="w-full p-4 bg-gray-50 hover:bg-blue-50 rounded-xl text-left transition-colors border border-gray-200"
                        >
                          <div className="flex items-center">
                            <div
                              className="rounded-full mr-4 border-2 border-gray-200 overflow-hidden"
                              style={{
                                width: "48px",
                                height: "48px",
                              }}
                            >
                              {player.avatarUrl ? (
                                <img
                                  src={player.avatarUrl}
                                  alt={player.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    const container =
                                      target.parentElement as HTMLElement;
                                    container.innerHTML = `
                                      <div class="w-full h-full flex items-center justify-center text-lg font-bold text-white" style="background-color: ${state.selectedTeam?.colors.primary || "#1f2937"};">
                                        ${player.position}
                                      </div>
                                    `;
                                  }}
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex items-center justify-center text-lg font-bold text-white"
                                  style={{
                                    backgroundColor:
                                      state.selectedTeam?.colors.primary ||
                                      "#1f2937",
                                  }}
                                >
                                  {player.position}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {player.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                #{player.shirt} - {player.age} años -{" "}
                                {player.position}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => {
                    setShowSubstitutions(false);
                    setSelectedPosition(null);
                  }}
                  variant="outline"
                  className="w-full mt-8 py-4 text-lg rounded-xl"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de información del jugador */}
        {selectedPlayerInfo && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPlayerInfo(null)}
          >
            <div
              className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl max-w-sm w-full shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del modal */}
              <div
                className="relative p-6 text-center"
                style={{
                  background: `linear-gradient(135deg, ${state.selectedTeam?.colors.primary || "#10b981"}40, ${state.selectedTeam?.colors.primary || "#10b981"}20)`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20"></div>
                <button
                  onClick={() => setSelectedPlayerInfo(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-300 z-10"
                >
                  <X size={20} className="text-white" />
                </button>

                {/* Avatar grande */}
                <div className="relative mx-auto mb-4">
                  <div
                    className="w-24 h-24 rounded-full mx-auto border-4 border-white/30 overflow-hidden shadow-2xl relative"
                    style={{
                      boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)`,
                    }}
                  >
                    {selectedPlayerInfo.avatarUrl ? (
                      <img
                        src={selectedPlayerInfo.avatarUrl}
                        alt={selectedPlayerInfo.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const container = target.parentElement as HTMLElement;
                          container.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${state.selectedTeam?.colors.primary || "#1f2937"};">
                                ${selectedPlayerInfo.position}
                              </div>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{
                            backgroundColor:
                              state.selectedTeam?.colors.primary || "#1f2937",
                          }}
                        >
                          {selectedPlayerInfo.position}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Número de camiseta */}
                  <div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-slate-900 to-black text-white font-black rounded-full flex items-center justify-center border-3 border-white/80 shadow-xl"
                    style={{
                      width: "32px",
                      height: "32px",
                      fontSize: "14px",
                    }}
                  >
                    #{selectedPlayerInfo.shirt}
                  </div>
                </div>

                {/* Nombre y posición */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    {selectedPlayerInfo.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-4 text-white/80">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedPlayerInfo.position}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedPlayerInfo.age} años
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido del modal */}
              <div className="p-6">
                {/* Estadísticas principales */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">
                      {selectedPlayerInfo.value
                        ? `€${Math.round(selectedPlayerInfo.value / 1000000)}M`
                        : "N/A"}
                    </div>
                    <div className="text-white/70 text-sm">Valor</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {selectedPlayerInfo.isStarter ? "Titular" : "Suplente"}
                    </div>
                    <div className="text-white/70 text-sm">Estado</div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/70">Equipo</span>
                    <span className="text-white font-medium">
                      {state.selectedTeam?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/70">Liga</span>
                    <span className="text-white font-medium">
                      {state.selectedTeam?.league?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-white/70">Camiseta</span>
                    <span className="text-white font-medium">
                      #{selectedPlayerInfo.shirt}
                    </span>
                  </div>
                </div>

                {/* Botón de cerrar */}
                <button
                  onClick={() => setSelectedPlayerInfo(null)}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-xl"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
