const fs = require('fs');
const path = require('path');

// URLs exactas de los jugadores restantes de Luton
const lutonAvatarsRemaining = {
  "luton_mf2": "https://img.a.transfermarkt.technology/portrait/header/131978-1662368517.jpg?lm=1", // Ross Barkley
  "luton_mf3": "https://img.a.transfermarkt.technology/portrait/header/344830-1616530468.jpg?lm=1", // Tahith Chong
  "luton_fw1": "https://img.a.transfermarkt.technology/portrait/header/246963-1678973609.jpg?lm=1", // Carlton Morris
  "luton_fw2": "https://img.a.transfermarkt.technology/portrait/header/319900-1708341657.jpg?lm=1", // Elijah Adebayo
  "luton_fw3": "https://img.a.transfermarkt.technology/portrait/header/469958-1700638599.jpg?lm=1", // Jacob Brown
  "luton_gk2": "https://img.a.transfermarkt.technology/portrait/header/33027-1700638443.jpg?lm=1", // Tim Krul
  "luton_df5": "https://img.a.transfermarkt.technology/portrait/header/264220-1700735651.jpg?lm=1", // Reece Burke
  "luton_df6": "https://img.a.transfermarkt.technology/portrait/header/407021-1612348755.jpg?lm=1", // Mads Andersen
  "luton_mf4": "https://img.a.transfermarkt.technology/portrait/header/184129-1684493830.jpg?lm=1", // Jordan Clark
  "luton_mf5": "https://img.a.transfermarkt.technology/portrait/header/244338-1651652676.jpg?lm=1", // Pelly Ruddock Mpanzu
  "luton_fw4": "https://img.a.transfermarkt.technology/portrait/header/169801-1700671423.jpg?lm=1", // Cauley Woodrow
  "luton_mf6": "https://img.a.transfermarkt.technology/portrait/header/381967-1678466372.jpg?lm=1", // Albert Sambi Lokonga
  "luton_fw5": "https://img.a.transfermarkt.technology/portrait/header/392591-1700737518.jpg?lm=1", // Chiedozie Ogbene
  "luton_df7": "https://img.a.transfermarkt.technology/portrait/header/548470-1681288000.jpg?lm=1"  // Teden Mengi
};

// Read the current gameData.ts file
const gameDataPath = path.join(__dirname, 'lib', 'gameData.ts');
let content = fs.readFileSync(gameDataPath, 'utf8');

let updatedCount = 0;

// Apply avatar updates for each remaining player
Object.entries(lutonAvatarsRemaining).forEach(([playerId, avatarUrl]) => {
  // Find pattern for this specific player and add avatarUrl if missing
  const playerRegex = new RegExp(
    `(\\s+{\\s+id: "${playerId}",[\\s\\S]*?isStarter: (?:true|false),)\\s+}`,
    'g'
  );
  
  // Check if player already has avatarUrl
  const hasAvatarRegex = new RegExp(
    `id: "${playerId}",[\\s\\S]*?avatarUrl:`,
    'g'
  );
  
  if (playerRegex.test(content) && !hasAvatarRegex.test(content)) {
    const replacement = `$1\n        avatarUrl: "${avatarUrl}"\n      }`;
    content = content.replace(playerRegex, replacement);
    console.log(`✅ Applied avatar for ${playerId}`);
    updatedCount++;
  } else if (hasAvatarRegex.test(content)) {
    console.log(`✓ ${playerId}: Already has avatar`);
  } else {
    console.log(`❌ Could not find player ${playerId}`);
  }
});

// Write the updated content back
fs.writeFileSync(gameDataPath, content, 'utf8');
console.log(`🎯 Luton remaining avatars applied! Updated ${updatedCount} players.`);
