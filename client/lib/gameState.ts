import { Player, Team, teams, formations } from "./gameData";

export interface GameState {
  selectedTeam: Team | null;
  budget: number;
  squad: Player[];
  formation: string;
  lineup: Record<string, Player | null>;
  language: "en" | "es";
  transferHistory: TransferRecord[];
}

export interface TransferRecord {
  player: Player;
  type: "buy" | "sell";
  amount: number;
  from?: string;
  to?: string;
  timestamp: number;
}

class GameStateManager {
  private state: GameState = this.loadState();

  private listeners: ((state: GameState) => void)[] = [];

  private loadState(): GameState {
    try {
      const saved = localStorage.getItem("gameState");
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log(
          "🔄 Estado cargado desde localStorage:",
          parsed.selectedTeam?.name,
        );
        return {
          selectedTeam: parsed.selectedTeam || null,
          budget: parsed.budget || 100000000,
          squad: parsed.squad || [],
          formation: parsed.formation || "4-3-3",
          lineup: parsed.lineup || {},
          language: parsed.language || "en",
          transferHistory: parsed.transferHistory || [],
        };
      }
    } catch (error) {
      console.error("Error cargando estado:", error);
    }

    return {
      selectedTeam: null,
      budget: 100000000,
      squad: [],
      formation: "4-3-3",
      lineup: {},
      language: "en",
      transferHistory: [],
    };
  }

  private saveState() {
    try {
      localStorage.setItem("gameState", JSON.stringify(this.state));
      console.log("💾 Estado guardado:", this.state.selectedTeam?.name);
    } catch (error) {
      console.error("Error guardando estado:", error);
    }
  }

  getState(): GameState {
    return { ...this.state };
  }

  subscribe(listener: (state: GameState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.saveState();
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  setLanguage(language: "en" | "es") {
    this.state.language = language;
    this.notify();
  }

  selectTeam(teamId: string) {
    console.log(`🔥🔥🔥 SELECCIÓN DE EQUIPO: ${teamId} 🔥🔥🔥`);

    const team = teams[teamId];
    if (team) {
      // Limpiar estado previo cuando se cambia de equipo
      this.state.selectedTeam = team;
      this.state.squad = [...(team.players || [])];
      this.state.lineup = {}; // Limpiar formación anterior
      this.state.formation = "4-3-3"; // Resetear a formación por defecto

      console.log(`✅ Equipo seleccionado: ${team.name}`);
      console.log(`👥 Squad cargado con ${this.state.squad.length} jugadores`);
      console.log(
        `🎽 Primeros 3 jugadores: ${this.state.squad
          .slice(0, 3)
          .map((p) => `${p.name} (#${p.shirt})`)
          .join(", ")}`,
      );
      console.log("🔄 Lineup y formación reseteados para el nuevo equipo");
      this.notify();
    } else {
      console.error(`❌ Equipo NO encontrado: ${teamId}`);
      console.log("📋 Equipos disponibles:", Object.keys(teams));
    }
  }

  setBudget(budget: number) {
    this.state.budget = budget;
    this.notify();
  }

  buyPlayer(player: Player, price: number): boolean {
    if (this.state.budget >= price) {
      this.state.budget -= price;
      this.state.squad.push(player);
      this.state.transferHistory.push({
        player,
        type: "buy",
        amount: price,
        to: this.state.selectedTeam?.id,
        timestamp: Date.now(),
      });
      this.notify();
      return true;
    }
    return false;
  }

  sellPlayer(playerId: string, price: number): boolean {
    const playerIndex = this.state.squad.findIndex((p) => p.id === playerId);
    if (playerIndex !== -1) {
      const player = this.state.squad[playerIndex];
      this.state.squad.splice(playerIndex, 1);
      this.state.budget += price;
      this.state.transferHistory.push({
        player,
        type: "sell",
        amount: price,
        from: this.state.selectedTeam?.id,
        timestamp: Date.now(),
      });

      // Remove from lineup if present
      Object.keys(this.state.lineup).forEach((pos) => {
        if (this.state.lineup[pos]?.id === playerId) {
          this.state.lineup[pos] = null;
        }
      });

      this.notify();
      return true;
    }
    return false;
  }

  setLineupPlayer(position: string, player: Player | null) {
    this.state.lineup[position] = player;
    this.notify();
  }

  getAvailablePlayers(position?: string): Player[] {
    const lineupPlayerIds = Object.values(this.state.lineup)
      .filter(Boolean)
      .map((p) => p!.id);

    return this.state.squad.filter((player) => {
      if (lineupPlayerIds.includes(player.id)) return false;
      if (position && player.position !== position) return false;
      return true;
    });
  }

  autoAssignPlayersToFormation(formationName: string) {
    // Importar formaciones desde gameData
    try {
      const formation = formations[formationName];

      if (!formation || !formation.positions) {
        console.warn(`Formación ${formationName} no encontrada`);
        return;
      }

      console.log(
        `🔧 Auto-asignando ${formationName} para ${this.state.selectedTeam?.name || "equipo desconocido"}`,
      );
      console.log(`👥 Squad disponible: ${this.state.squad.length} jugadores`);

      // Limpiar lineup actual
      this.state.lineup = {};
      this.state.formation = formationName;

      // Separar jugadores por posición
      const gkPlayers = this.state.squad.filter((p) => p.position === "GK");
      const dfPlayers = this.state.squad.filter((p) => p.position === "DF");
      const mfPlayers = this.state.squad.filter((p) => p.position === "MF");
      const fwPlayers = this.state.squad.filter((p) => p.position === "FW");

      // Ordenar jugadores por prioridad (titulares primero, luego por valor)
      const sortPlayers = (players: Player[]) =>
        players.sort((a, b) => {
          if (a.isStarter && !b.isStarter) return -1;
          if (!a.isStarter && b.isStarter) return 1;
          return b.value - a.value;
        });

      const sortedGK = sortPlayers([...gkPlayers]);
      const sortedDF = sortPlayers([...dfPlayers]);
      const sortedMF = sortPlayers([...mfPlayers]);
      const sortedFW = sortPlayers([...fwPlayers]);

      // Contadores para asignación
      let gkIndex = 0;
      let dfIndex = 0;
      let mfIndex = 0;
      let fwIndex = 0;

      // Asignar jugadores a posiciones
      formation.positions.forEach((pos: any) => {
        let playerToAssign = null;

        switch (pos.position) {
          case "GK":
            if (gkIndex < sortedGK.length) {
              playerToAssign = sortedGK[gkIndex];
              gkIndex++;
            }
            break;
          case "DF":
            if (dfIndex < sortedDF.length) {
              playerToAssign = sortedDF[dfIndex];
              dfIndex++;
            } else if (mfIndex < sortedMF.length) {
              // Si no hay más defensas, usar un mediocampista
              playerToAssign = sortedMF[mfIndex];
              mfIndex++;
            }
            break;
          case "MF":
            if (mfIndex < sortedMF.length) {
              playerToAssign = sortedMF[mfIndex];
              mfIndex++;
            } else if (dfIndex < sortedDF.length) {
              // Si no hay más mediocampistas, usar un defensa
              playerToAssign = sortedDF[dfIndex];
              dfIndex++;
            } else if (fwIndex < sortedFW.length) {
              // Si no hay defensas, usar un delantero
              playerToAssign = sortedFW[fwIndex];
              fwIndex++;
            }
            break;
          case "FW":
            if (fwIndex < sortedFW.length) {
              playerToAssign = sortedFW[fwIndex];
              fwIndex++;
            } else if (mfIndex < sortedMF.length) {
              // Si no hay más delanteros, usar un mediocampista
              playerToAssign = sortedMF[mfIndex];
              mfIndex++;
            }
            break;
        }

        if (playerToAssign) {
          this.state.lineup[pos.id] = playerToAssign;
        }
      });

      console.log(
        `✅ Auto-asignación completada para formación ${formationName}`,
      );
      console.log(
        `📋 Jugadores asignados: ${Object.keys(this.state.lineup).length}/${formation.positions.length}`,
      );
      console.log(
        `🎽 Jugadores en lineup:`,
        Object.entries(this.state.lineup)
          .map(([pos, player]) => `${pos}: ${player?.name || "vacío"}`)
          .join(", "),
      );
      this.notify();
    } catch (error) {
      console.error("Error al auto-asignar jugadores:", error);
    }
  }

  reset() {
    this.state = {
      selectedTeam: null,
      budget: 100000000,
      squad: [],
      formation: "4-3-3",
      lineup: {},
      language: "en",
      transferHistory: [],
    };
    this.notify();
  }

  // Debug function
  debugCurrentState() {
    console.log("🔍 ESTADO ACTUAL DEL JUEGO:");
    console.log(
      `📋 Equipo seleccionado: ${this.state.selectedTeam?.name || "ninguno"}`,
    );
    console.log(`👥 Jugadores en squad: ${this.state.squad.length}`);
    console.log(
      `🏃 Jugadores en lineup: ${Object.keys(this.state.lineup).length}`,
    );
    console.log(`⚡ Formación actual: ${this.state.formation}`);
    console.log(`💰 Presupuesto: €${this.state.budget.toLocaleString()}`);
    if (this.state.squad.length > 0) {
      console.log(
        `🎽 Primeros 3 jugadores del squad:`,
        this.state.squad
          .slice(0, 3)
          .map((p) => `${p.name} (#${p.shirt})`)
          .join(", "),
      );
    }
    return this.state;
  }
}

export const gameState = new GameStateManager();
