import BottomNavigation from "@/components/BottomNavigation";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Profile</h1>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
