// Aplicar avatares de Burnley uno por uno de forma segura
const fs = require('fs');
const path = require('path');

const gameDataPath = path.join(__dirname, 'lib', 'gameData.ts');
let content = fs.readFileSync(gameDataPath, 'utf8');

// Listado de todos los jugadores de Burnley con sus avatares
const burnleyUpdates = [
  { id: "burnley_df3", name: "Jordan Beyer", url: "https://img.a.transfermarkt.technology/portrait/header/403898-1685706514.jpg?lm=1" },
  { id: "burnley_df4", name: "Charlie Taylor", url: "https://img.a.transfermarkt.technology/portrait/header/195633-1700671881.jpg?lm=1" },
  { id: "burnley_mf1", name: "Josh Cullen", url: "https://img.a.transfermarkt.technology/portrait/header/242606-1626867228.jpg?lm=1" },
  { id: "burnley_mf2", name: "Sander Berge", url: "https://img.a.transfermarkt.technology/portrait/header/333014-1679676693.jpg?lm=1" },
  { id: "burnley_mf3", name: "Anass Zaroury", url: "https://img.a.transfermarkt.technology/portrait/header/491296-1626771045.jpg?lm=1" },
  { id: "burnley_fw1", name: "Zeki Amdouni", url: "https://img.a.transfermarkt.technology/portrait/header/548729-1715938870.jpg?lm=1" },
  { id: "burnley_fw2", name: "Lyle Foster", url: "https://img.a.transfermarkt.technology/portrait/header/467623-1663264611.jpg?lm=1" },
  { id: "burnley_fw3", name: "Wilson Odobert", url: "https://img.a.transfermarkt.technology/portrait/header/743498-1740605858.jpg?lm=1" },
  { id: "burnley_gk2", name: "Arijanet Muric", url: "https://img.a.transfermarkt.technology/portrait/header/371021-1685718424.jpg?lm=1" },
  { id: "burnley_df5", name: "Vítor Hugo", url: "https://img.a.transfermarkt.technology/portrait/header/620598-1626685322.jpg?lm=1" }, // Placeholder URL
  { id: "burnley_df6", name: "Ameen Al-Dakhil", url: "https://img.a.transfermarkt.technology/portrait/header/620598-1626685322.jpg?lm=1" },
  { id: "burnley_mf4", name: "Jack Cork", url: "https://img.a.transfermarkt.technology/portrait/header/40613-1700672826.jpg?lm=1" },
  { id: "burnley_mf5", name: "Hannes Delcroix", url: "https://img.a.transfermarkt.technology/portrait/header/338635-1660674722.jpg?lm=1" },
  { id: "burnley_fw4", name: "Nathan Redmond", url: "https://img.a.transfermarkt.technology/portrait/header/129078-1666280539.png?lm=1" }
];

burnleyUpdates.forEach(player => {
  // Buscar el patrón específico para este jugador
  const regex = new RegExp(
    `(\\s+{\\s+id: "${player.id}",\\s+name: "${player.name}",[\\s\\S]*?isStarter: (?:true|false),)\\s+}`,
    'g'
  );
  
  if (regex.test(content)) {
    const replacement = `$1\n        avatarUrl: "${player.url}"\n      }`;
    content = content.replace(regex, replacement);
    console.log(`✅ Applied avatar for ${player.id} (${player.name})`);
  } else {
    console.log(`❌ Could not find ${player.id} (${player.name})`);
  }
});

fs.writeFileSync(gameDataPath, content, 'utf8');
console.log('🎯 All Burnley avatars applied!');
