const fs = require('fs');
const path = require('path');

// URLs exactas proporcionadas por el usuario
const updatedBournemouthAvatars = {
  "bournemouth_gk1": "https://img.a.transfermarkt.technology/portrait/header/111819-1725051877.jpg?lm=1", // Neto Beraldo
  "bournemouth_df1": "https://img.a.transfermarkt.technology/portrait/header/61841-1737920848.jpg?lm=1", // Adam Smith
  "bournemouth_df2": "https://img.a.transfermarkt.technology/portrait/header/659089-1715881375.jpg?lm=1", // Illia Zabarnyi
  "bournemouth_df3": "https://img.a.transfermarkt.technology/portrait/header/480116-1739281396.jpg?lm=1", // Lloyd Kelly
  "bournemouth_df4": "https://img.a.transfermarkt.technology/portrait/header/730861-1660762995.jpg?lm=1", // Milos Kerkez
  "bournemouth_mf1": "https://img.a.transfermarkt.technology/portrait/header/249089-1700671190.jpg?lm=1", // Lewis Cook
  "bournemouth_mf2": "https://img.a.transfermarkt.technology/portrait/header/188077-1697450633.jpg?lm=1", // Ryan Christie
  "bournemouth_mf3": "https://img.a.transfermarkt.technology/portrait/header/399434-1700650360.jpg?lm=1", // Marcus Tavernier
  "bournemouth_fw1": "https://img.a.transfermarkt.technology/portrait/header/258889-1708340487.jpg?lm=1", // Dominic Solanke
  "bournemouth_fw2": "https://img.a.transfermarkt.technology/portrait/header/583255-1737452028.jpg?lm=1", // Antoine Semenyo
  "bournemouth_fw3": "https://img.a.transfermarkt.technology/portrait/header/512385-1674557520.jpg?lm=1", // Luis Sinisterra
  "bournemouth_gk2": "https://img.a.transfermarkt.technology/portrait/header/357658-1702296610.jpg?lm=1", // Mark Travers
  "bournemouth_df5": "https://img.a.transfermarkt.technology/portrait/header/471690-1736520346.jpg?lm=1", // Max Aarons
  "bournemouth_df6": "https://img.a.transfermarkt.technology/portrait/header/480987-1700737712.jpg?lm=1", // Chris Mepham
  "bournemouth_mf4": "https://img.a.transfermarkt.technology/portrait/header/332705-1666472142.jpg?lm=1", // Tyler Adams
  "bournemouth_mf5": "https://img.a.transfermarkt.technology/portrait/header/320411-1674468252.jpg?lm=1", // Philip Billing
  "bournemouth_fw4": "https://img.a.transfermarkt.technology/portrait/header/251106-1669365680.jpg?lm=1", // Enes Ünal
  "bournemouth_fw5": "https://img.a.transfermarkt.technology/portrait/header/823231-1737452292.jpg?lm=1"  // Dango Ouattara
};

// Read the current gameData.ts file
const gameDataPath = path.join(__dirname, 'lib', 'gameData.ts');
let content = fs.readFileSync(gameDataPath, 'utf8');

let updatedCount = 0;

// Apply avatar updates for each player
Object.entries(updatedBournemouthAvatars).forEach(([playerId, newAvatarUrl]) => {
  // Find existing avatarUrl for this player and replace it
  const avatarUrlRegex = new RegExp(
    `(id: "${playerId}",[\\s\\S]*?avatarUrl: ")(https://img\\.a\\.transfermarkt\\.technology/portrait/header/[^"]+)(")`
  );
  
  if (avatarUrlRegex.test(content)) {
    const oldMatch = content.match(avatarUrlRegex);
    if (oldMatch && oldMatch[2] !== newAvatarUrl) {
      content = content.replace(avatarUrlRegex, `$1${newAvatarUrl}$3`);
      console.log(`✅ Updated ${playerId}: ${oldMatch[2]} -> ${newAvatarUrl}`);
      updatedCount++;
    } else if (oldMatch && oldMatch[2] === newAvatarUrl) {
      console.log(`✓ ${playerId}: Already has correct URL`);
    }
  } else {
    console.log(`❌ Could not find avatarUrl for ${playerId}`);
  }
});

// Write the updated content back
fs.writeFileSync(gameDataPath, content, 'utf8');
console.log(`🎯 Bournemouth avatars update complete! Updated ${updatedCount} players.`);
