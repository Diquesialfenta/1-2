# Sistema Centralizado de Avatares de Jugadores

Este archivo documenta el nuevo sistema centralizado para la gestión de avatares de jugadores, que reemplaza los múltiples archivos dispersos que existían anteriormente.

## 📁 Estructura de Archivos

### `playerAvatars.ts` - Archivo Principal
Este es el archivo centralizado que contiene **todas** las URLs de avatares organizadas por equipos:

```typescript
import { getPlayerAvatar, getTeamAvatars, allPlayerAvatars } from './playerAvatars';
```

### `apply-centralized-avatars.js` - Script de Aplicación
Script que aplica todos los avatares del archivo centralizado al `gameData.ts`:

```bash
node client/apply-centralized-avatars.js
```

## 🔧 Cómo Usar el Sistema

### Para Agregar Nuevos Avatares

1. **Edita `client/lib/playerAvatars.ts`**:
   ```typescript
   // Agregar al equipo correspondiente
   export const manCityAvatars: PlayerAvatars = {
     "man-city-nuevo-jugador": "https://img.a.transfermarkt.technology/portrait/header/123456-1234567890.jpg?lm=1",
     // ... resto de jugadores
   };
   ```

2. **Ejecuta el script de aplicación**:
   ```bash
   node client/apply-centralized-avatars.js
   ```

3. **¡Listo!** Todos los avatares se aplicarán automáticamente.

### Para Agregar un Nuevo Equipo

1. **Crear la constante del equipo en `playerAvatars.ts`**:
   ```typescript
   export const newTeamAvatars: PlayerAvatars = {
     "new-team-player1": "https://url-del-avatar.jpg",
     "new-team-player2": "https://url-del-avatar.jpg",
   };
   ```

2. **Agregar al objeto `allPlayerAvatars`**:
   ```typescript
   export const allPlayerAvatars: PlayerAvatars = {
     ...manCityAvatars,
     ...realMadridAvatars,
     ...newTeamAvatars, // ← Agregar aquí
   };
   ```

3. **Actualizar la función `getTeamAvatars`**:
   ```typescript
   export const getTeamAvatars = (teamName: string): PlayerAvatars => {
     switch (teamName.toLowerCase().replace(/\s+/g, '-')) {
       // ... casos existentes
       case 'new-team':
         return newTeamAvatars;
       default:
         return {};
     }
   };
   ```

## 🎯 Funciones Utilitarias

### `getPlayerAvatar(playerId: string)`
Obtiene el avatar de un jugador específico:
```typescript
const avatarUrl = getPlayerAvatar("man-city-haaland");
```

### `getTeamAvatars(teamName: string)`
Obtiene todos los avatares de un equipo:
```typescript
const cityAvatars = getTeamAvatars("manchester-city");
```

### `allPlayerAvatars`
Objeto que contiene todos los avatares de todos los equipos:
```typescript
const totalAvatars = Object.keys(allPlayerAvatars).length; // Número total de avatares
```

## 📊 Equipos Incluidos Actualmente

- ✅ Manchester City (22 jugadores)
- ✅ Real Madrid (25 jugadores)
- ✅ Manchester United (23 jugadores)
- ✅ Aston Villa (19 jugadores)
- ✅ Brighton & Hove Albion (23 jugadores)
- ✅ Tottenham Hotspur (19 jugadores)
- ✅ Newcastle United (19 jugadores)
- ✅ West Ham United (23 jugadores)
- ✅ Crystal Palace (24 jugadores)
- ✅ Chelsea (20 jugadores)
- ✅ Wolverhampton Wanderers (23 jugadores)
- ✅ Fulham FC (24 jugadores)
- ✅ Everton FC (24 jugadores)
- ✅ Brentford FC (25 jugadores)

**Total: ~308+ avatares centralizados**

## 🚀 Ventajas del Sistema Centralizado

1. **Organización**: Todos los avatares en un solo lugar
2. **Mantenibilidad**: Fácil agregar/editar avatares
3. **Escalabilidad**: Simple agregar nuevos equipos
4. **Optimización**: Reduce el tamaño del código
5. **TypeScript**: Soporte completo de tipos
6. **Reutilización**: Funciones utilitarias para uso en componentes

## 🔄 Proceso de Migración

Se eliminaron estos archivos dispersos:
- ❌ `update-aston-villa-brighton-avatars.js`
- ❌ `update-man-city-avatars.js`
- ❌ `update-man-united-avatars.js`
- ❌ `update-real-madrid-avatars.js`
- ❌ `update-tottenham-newcastle-avatars.js`
- ❌ `update-westham-crystal-palace-avatars.js`
- ❌ `complete-remaining-avatars.js`
- ❌ `debug-teams.js`

Y se crearon:
- ✅ `client/lib/playerAvatars.ts` (archivo centralizado)
- ✅ `client/apply-centralized-avatars.js` (script de aplicación)

## 📝 Notas de Desarrollo

- Los URLs de avatares provienen de `transfermarkt.technology`
- El formato de ID de jugador sigue el patrón: `{equipo}-{apellido-o-nombre}`
- Los avatares se aplican al campo `avatarUrl` en `gameData.ts`
- El script respeta avatares existentes (no los sobrescribe)

---

**¡El sistema está listo para recibir nuevas URLs de avatares de forma organizada y eficiente!** 🎯
