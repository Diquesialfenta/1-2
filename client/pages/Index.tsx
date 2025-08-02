import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { gameState } from "@/lib/gameState";

export default function Index() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es">("es");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
  ];

  const handleStart = () => {
    gameState.setLanguage(selectedLanguage);
    navigate("/choose-team");
  };

  const selectedLang = languages.find((l) => l.code === selectedLanguage);

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(6, 17, 44, 0.7) 0%, rgba(8, 23, 59, 0.65) 35%, rgba(10, 31, 83, 0.6) 100%),
          radial-gradient(circle at 20% 80%, rgba(34, 67, 120, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(20, 85, 48, 0.25) 0%, transparent 50%),
          url('https://images.pexels.com/photos/3459630/pexels-photo-3459630.jpeg')
        `,
      }}
    >
      {/* Overlay con efectos de partículas sutiles */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-blue-900/20 to-emerald-900/25 pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full relative z-10">
        <div className="text-center mb-16">
          {/* Logo nuevo con imagen personalizada */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-emerald-500/30 rounded-full blur-xl animate-pulse" />
            <div className="relative w-full h-full bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center shadow-2xl overflow-hidden">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F752c85e764b6466e8a4203f77965fa6c%2F8473e3573ee44e268d2bf8a55ee6e015?format=webp&width=800"
                alt="TransferFans FC Logo"
                className="w-full h-full object-contain p-2"
                style={{ filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))" }}
              />
            </div>
          </div>

          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent">
              TransferFans FC
            </span>
          </h1>

          <p className="text-white/80 text-xl font-medium tracking-wide">
            {selectedLanguage === "es"
              ? "Gestiona fichajes como un profesional"
              : "Manage transfers like a professional"}
          </p>
        </div>

        <div className="w-full max-w-sm mb-12 relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="w-full p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between text-left hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
          >
            <span className="text-white/90 font-semibold text-lg">
              {selectedLanguage === "es" ? "Idioma" : "Language"}
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-white font-semibold bg-white/10 px-3 py-1 rounded-lg">
                {selectedLang?.name}
              </span>
              <ChevronDown size={20} className="text-white/60" />
            </div>
          </button>

          {showLanguageMenu && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code as "en" | "es");
                    setShowLanguageMenu(false);
                  }}
                  className="w-full p-5 text-left hover:bg-white/5 transition-colors border-b border-white/10 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-lg">
                      {lang.name}
                    </span>
                    {selectedLanguage === lang.code && (
                      <span className="text-emerald-400 font-bold text-xl">
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleStart}
          size="lg"
          className="px-8 sm:px-12 py-6 text-xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 text-white hover:from-emerald-700 hover:via-emerald-600 hover:to-blue-700 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm"
        >
          <span className="flex items-center space-x-3">
            <DollarSign size={24} className="text-yellow-300" />
            <span>
              {selectedLanguage === "es"
                ? "Iniciar Mercado de Fichajes"
                : "Start Transfer Market"}
            </span>
          </span>
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
}
