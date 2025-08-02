import BottomNavigation from "@/components/BottomNavigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Apps() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Herramientas
          </h1>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>¡Jugadores Reales Integrados!</CardTitle>
                <CardDescription>
                  Los equipos ahora incluyen jugadores reales como Mbappé,
                  Haaland, Messi, Bellingham y muchas más estrellas del fútbol
                  mundial. Ve a "Elegir Equipo" para explorar los nuevos
                  planteles con jugadores auténticos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="opacity-50">
              <CardHeader>
                <CardTitle>Más herramientas próximamente...</CardTitle>
                <CardDescription>
                  Estamos trabajando en más funcionalidades
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
