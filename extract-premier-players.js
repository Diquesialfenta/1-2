const fs = require("fs");

// Leer el archivo gameData.ts
const gameDataContent = fs.readFileSync("client/lib/gameData.ts", "utf8");

// Buscar la definición del objeto teams
const teamsMatch = gameDataContent.match(
  /export const teams: Record<string, Team> = \{([\s\S]*)\};$/,
);

if (!teamsMatch) {
  console.log("No se pudo encontrar la definición de teams");
  process.exit(1);
}

// Evaluar el contenido para extraer los datos
const teamsContent = teamsMatch[1];

// Buscar todos los equipos de Premier League
const premierLeagueTeams = [];
const teamMatches = teamsContent.matchAll(
  /"([^"]+)":\s*\{[\s\S]*?league:\s*"premier-league"[\s\S]*?\n\s*\},?\n/g,
);

for (const match of teamMatches) {
  const teamId = match[1];
  const teamContent = match[0];

  // Extraer el nombre del equipo
  const nameMatch = teamContent.match(/name:\s*"([^"]+)"/);
  const teamName = nameMatch ? nameMatch[1] : teamId;

  // Extraer jugadores
  const playersMatch = teamContent.match(/players:\s*\[([\s\S]*?)\]/);
  if (playersMatch) {
    const playersContent = playersMatch[1];
    const players = [];

    // Buscar cada jugador individual
    const playerMatches = playersContent.matchAll(/\{[\s\S]*?\}/g);

    for (const playerMatch of playerMatches) {
      const playerContent = playerMatch[0];

      // Extraer propiedades del jugador
      const nameMatch = playerContent.match(/name:\s*"([^"]+)"/);
      const positionMatch = playerContent.match(/position:\s*"([^"]+)"/);
      const valueMatch = playerContent.match(/value:\s*(\d+)/);
      const shirtMatch = playerContent.match(/shirt:\s*(\d+)/);
      const ageMatch = playerContent.match(/age:\s*(\d+)/);
      const nationalityMatch = playerContent.match(/nationality:\s*"([^"]+)"/);
      const isStarterMatch = playerContent.match(/isStarter:\s*(true|false)/);
      const avatarMatch = playerContent.match(/avatarUrl:\s*"([^"]+)"/);

      if (nameMatch && positionMatch) {
        players.push({
          name: nameMatch[1],
          position: positionMatch[1],
          value: valueMatch ? parseInt(valueMatch[1]) : 0,
          shirt: shirtMatch ? parseInt(shirtMatch[1]) : 0,
          age: ageMatch ? parseInt(ageMatch[1]) : 0,
          nationality: nationalityMatch ? nationalityMatch[1] : "Unknown",
          isStarter: isStarterMatch ? isStarterMatch[1] === "true" : false,
          avatarUrl: avatarMatch ? avatarMatch[1] : null,
        });
      }
    }

    premierLeagueTeams.push({
      id: teamId,
      name: teamName,
      players: players,
    });
  }
}

// Mostrar todos los equipos y jugadores de Premier League
console.log("=".repeat(80));
console.log("TODOS LOS JUGADORES DE LA PREMIER LEAGUE");
console.log("=".repeat(80));

premierLeagueTeams.forEach((team) => {
  console.log(
    `\n🏆 ${team.name.toUpperCase()} (${team.players.length} jugadores):`,
  );
  console.log("─".repeat(60));

  team.players.forEach((player) => {
    const starterMark = player.isStarter ? "⭐" : "  ";
    const value = player.value
      ? `€${(player.value / 1000000).toFixed(1)}M`
      : "N/A";
    console.log(
      `${starterMark} #${player.shirt.toString().padStart(2)} ${player.name.padEnd(25)} | ${player.position} | ${player.age}y | ${player.nationality.padEnd(12)} | ${value}`,
    );
  });
});

console.log(`\n�� RESUMEN:`);
console.log(`Total de equipos de Premier League: ${premierLeagueTeams.length}`);
console.log(
  `Total de jugadores: ${premierLeagueTeams.reduce((total, team) => total + team.players.length, 0)}`,
);

// Crear archivo JSON con todos los datos
const outputData = {
  league: "Premier League",
  teams: premierLeagueTeams,
  totalTeams: premierLeagueTeams.length,
  totalPlayers: premierLeagueTeams.reduce(
    (total, team) => total + team.players.length,
    0,
  ),
};

fs.writeFileSync(
  "premier-league-players.json",
  JSON.stringify(outputData, null, 2),
);
console.log("\n✅ Datos guardados en premier-league-players.json");
