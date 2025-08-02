import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Check,
  X,
  Calculator,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import BottomNavigation from "@/components/BottomNavigation";
import { teams, formatCurrency } from "@/lib/gameData";
import { gameState } from "@/lib/gameState";

export default function TeamSetup() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [budget, setBudget] = useState(100000000);
  const [useDefaultValues, setUseDefaultValues] = useState(true);
  const [useCustomValues, setUseCustomValues] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  const team = teams[teamId!];

  const budgetPresets = [
    {
      label: "Modo Fácil",
      value: 500000000,
      emoji: "🌟",
      description: "500M - Sin limitaciones",
    },
    {
      label: "Modo Normal",
      value: 200000000,
      emoji: "⚽",
      description: "200M - Equilibrado",
    },
    {
      label: "Modo Difícil",
      value: 100000000,
      emoji: "🔥",
      description: "100M - Desafiante",
    },
    {
      label: "Modo Experto",
      value: 50000000,
      emoji: "💀",
      description: "50M - Solo para expertos",
    },
  ];

  const handleStartEdit = () => {
    setIsEditingBudget(true);
    setBudgetInput((budget / 1000000).toString());
  };

  const handleSaveEdit = () => {
    const newBudget = parseFloat(budgetInput) * 1000000;
    if (!isNaN(newBudget) && newBudget > 0) {
      setBudget(newBudget);
    }
    setIsEditingBudget(false);
  };

  const handleCancelEdit = () => {
    setIsEditingBudget(false);
    setBudgetInput("");
  };

  const handlePresetSelect = (value: number) => {
    setBudget(value);
    setIsEditingBudget(false);
  };

  const handleStart = () => {
    if (team) {
      gameState.selectTeam(team.id);
      gameState.setBudget(budget);
      navigate(`/squad-management/${team.id}`);
    }
  };

  if (!team) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Team not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 flex flex-col relative overflow-hidden">
      {/* Fondo futbolístico para móvil */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-8 left-8 w-20 h-20 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-32 right-8 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-12 bg-white"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-12 bg-white"></div>
      </div>

      <div className="flex-1 p-4 w-full relative z-10">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/choose-team")}
            className="mr-3 p-3 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{team.name}</h1>
            <p className="text-sm text-white/80">Selecciona tus Opciones</p>
          </div>
        </div>

        <div className="mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg border-2 border-white/30"
            style={{ backgroundColor: team.colors?.primary || "#1f2937" }}
          >
            <span className="text-2xl">{team.logo || "⚽"}</span>
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-8 drop-shadow-lg">
            {team.name}
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-4">
                <Calculator size={20} className="text-white/80 mr-2" />
                <label className="text-base text-white/90 font-semibold">
                  Configura tu Presupuesto de Fichajes
                </label>
              </div>

              {!isEditingBudget ? (
                <div className="space-y-4">
                  {/* Current budget display */}
                  <div
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-xl border border-white/25 rounded-2xl shadow-2xl cursor-pointer hover:from-white/20 hover:to-white/15 transition-all duration-300"
                    onClick={handleStartEdit}
                  >
                    <div className="flex items-center">
                      <div className="p-3 bg-emerald-500/20 rounded-xl mr-4">
                        <TrendingUp size={24} className="text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-white/80 text-sm block">
                          Presupuesto Actual
                        </span>
                        <span className="text-2xl font-bold text-white">
                          {formatCurrency(budget)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-white/60 hover:text-white/80 transition-colors">
                      <Edit3 size={20} />
                    </div>
                  </div>

                  {/* Budget presets */}
                  <div>
                    <p className="text-white/70 text-sm mb-3 font-medium">
                      Presets recomendados:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {budgetPresets.map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() => handlePresetSelect(preset.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            budget === preset.value
                              ? "bg-emerald-500/20 border-emerald-400/50 shadow-lg shadow-emerald-500/20"
                              : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">{preset.emoji}</div>
                            <div className="text-white text-sm font-semibold">
                              {preset.label}
                            </div>
                            <div className="text-white/60 text-xs mt-1">
                              {preset.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 bg-slate-800/50 backdrop-blur-xl border border-slate-600/50 rounded-2xl">
                    <label className="block text-white/80 text-sm mb-3 font-medium">
                      Presupuesto personalizado (en millones €)
                    </label>
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <Input
                          type="number"
                          value={budgetInput}
                          onChange={(e) => setBudgetInput(e.target.value)}
                          placeholder="Ej: 150"
                          className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-white/40 rounded-xl"
                          autoFocus
                        />
                      </div>
                      <Button
                        onClick={handleSaveEdit}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-xl"
                      >
                        <Check size={16} />
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        size="sm"
                        variant="outline"
                        className="border-slate-600/50 text-white/80 hover:bg-slate-700/50 px-4 rounded-xl"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    {budgetInput && !isNaN(parseFloat(budgetInput)) && (
                      <p className="text-emerald-400 text-sm mt-2 font-medium">
                        Nuevo presupuesto:{" "}
                        {formatCurrency(parseFloat(budgetInput) * 1000000)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                <Checkbox
                  id="default-values"
                  checked={useDefaultValues}
                  onCheckedChange={(checked) =>
                    setUseDefaultValues(checked as boolean)
                  }
                  className="border-white/30"
                />
                <label
                  htmlFor="default-values"
                  className="text-base text-white font-medium"
                >
                  Usar Valores de Mercado por Defecto
                </label>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                <Checkbox
                  id="custom-values"
                  checked={useCustomValues}
                  onCheckedChange={(checked) =>
                    setUseCustomValues(checked as boolean)
                  }
                  className="border-white/30"
                />
                <label
                  htmlFor="custom-values"
                  className="text-base text-white font-medium"
                >
                  Usar Valores de Mercado Personalizados
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between space-x-4 mb-24">
          <Button
            variant="outline"
            onClick={() => navigate("/choose-team")}
            className="flex-1 py-4 text-lg bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl"
          >
            Volver
          </Button>
          <Button
            onClick={handleStart}
            className="flex-1 py-4 text-lg bg-green-600 text-white hover:bg-green-700 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🚀 Continuar
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
