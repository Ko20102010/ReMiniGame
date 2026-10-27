const KEY='gourmetGuildIdle.v2';
export function saveGame(world){try{localStorage.setItem(KEY,JSON.stringify(world.serialize()));return true;}catch(e){console.warn('Save failed',e);return false;}}
export function loadGame(){try{const raw=localStorage.getItem(KEY);if(!raw)return null;const data=JSON.parse(raw);return data&&data.version===2?data:null;}catch(e){console.warn('Save ignored',e);return null;}}
