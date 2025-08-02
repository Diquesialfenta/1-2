const fs = require('fs');
const path = require('path');

const bournemouthAvatars = {
  "bournemouth_mf1": "https://img.a.transfermarkt.technology/portrait/header/258842-1725051877.jpg?lm=1", // Lewis Cook
  "bournemouth_mf2": "https://img.a.transfermarkt.technology/portrait/header/234073-1725051877.jpg?lm=1", // Ryan Christie
  "bournemouth_mf3": "https://img.a.transfermarkt.technology/portrait/header/386766-1725051877.jpg?lm=1", // Marcus Tavernier
  "bournemouth_fw1": "https://img.a.transfermarkt.technology/portrait/header/284735-1725051877.jpg?lm=1", // Dominic Solanke
  "bournemouth_fw2": "https://img.a.transfermarkt.technology/portrait/header/510584-1725051877.jpg?lm=1", // Antoine Semenyo
  "bournemouth_fw3": "https://img.a.transfermarkt.technology/portrait/header/378947-1725051877.jpg?lm=1", // Luis Sinisterra
  "bournemouth_gk2": "https://img.a.transfermarkt.technology/portrait/header/279993-1725051877.jpg?lm=1", // Mark Travers
  "bournemouth_df5": "https://img.a.transfermarkt.technology/portrait/header/273493-1725051877.jpg?lm=1", // Max Aarons
  "bournemouth_df6": "https://img.a.transfermarkt.technology/portrait/header/232985-1725051877.jpg?lm=1", // Chris Mepham
  "bournemouth_mf4": "https://img.a.transfermarkt.technology/portrait/header/194595-1725051877.jpg?lm=1", // Tyler Adams
  "bournemouth_mf5": "https://img.a.transfermarkt.technology/portrait/header/244938-1725051877.jpg?lm=1", // Philip Billing
  "bournemouth_fw4": "https://img.a.transfermarkt.technology/portrait/header/269168-1725051877.jpg?lm=1", // Enes Ünal
  "bournemouth_fw5": "https://img.a.transfermarkt.technology/portrait/header/524075-1725051877.jpg?lm=1"  // Dango Ouattara
};

// Read the current gameData.ts file
const gameDataPath = path.join(__dirname, 'lib', 'gameData.ts');
let content = fs.readFileSync(gameDataPath, 'utf8');

// Apply avatar updates for each player
Object.entries(bournemouthAvatars).forEach(([playerId, avatarUrl]) => {
  // Find pattern for this specific player
  const playerRegex = new RegExp(
    `(\\s+{\\s+id: "${playerId}",[\\s\\S]*?isStarter: (?:true|false),)\\s+}`,
    'g'
  );
  
  const replacement = `$1\n        avatarUrl: "${avatarUrl}"\n      }`;
  
  if (playerRegex.test(content)) {
    content = content.replace(playerRegex, replacement);
    console.log(`✅ Applied avatar for ${playerId}`);
  } else {
    console.log(`❌ Could not find player ${playerId}`);
  }
});

// Write the updated content back
fs.writeFileSync(gameDataPath, content, 'utf8');
console.log('🎯 Bournemouth avatars applied successfully!');
