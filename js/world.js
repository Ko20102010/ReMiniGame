import { Player } from './entities/player.js';
const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export class World{
 constructor(audio,saved=null){
  this.version=2;this.width=2400;this.height=680;this.top=220;this.audio=audio;this.player=new Player();this.player.herbs=0;
  this.cameraX=0;this.message='Collect food, then stand on the cashier ring';this.messageTime=5;this.time=0;this.particles=[];this.projectiles=[];this.slashes=[];
  this.foods=Array.from({length:24},(_,i)=>({x:105+(i%6)*34,y:325+Math.floor(i/6)*34,active:true,type:i%3,respawn:0}));
  this.patrons=['Karyl','Kokkoro','Yuuki'].map((name,i)=>({name,x:500+i*58,y:365,request:i%3,mood:0,served:0}));
  this.crystals=[];this.serveAcc=0;this.manaColumns=[{x:610,y:445},{x:650,y:445}];
  this.sockets=[{id:'table',x:790,y:390,cost:50,label:'Dine-In Table',progress:0,built:false},{id:'chef',x:1010,y:390,cost:150,label:'Sous-Chef Kokkoro',progress:0,built:false},{id:'gate',x:1190,y:390,cost:300,label:'Plains Gate',progress:0,built:false}];
  this.bushes=Array.from({length:10},(_,i)=>({x:1290+i*75,y:330+(i%3)*75,hp:3,alive:true,respawn:0}));
  this.boars=[{x:1500,y:430,hp:5,maxHp:5,vx:35},{x:1760,y:350,hp:5,maxHp:5,vx:-30},{x:2020,y:455,hp:6,maxHp:6,vx:25}];
  this.prisons=[{x:2180,y:370,cost:5,rescued:false,name:'Mimi'}];this.helpers=[];this.attackCd=0;this.harvestCd=0;this.manaSpendAcc=0;
  if(saved)this.restore(saved);
 }
 update(dt,input,viewW){
  this.time+=dt;this.messageTime-=dt;this.attackCd=Math.max(0,this.attackCd-dt);this.harvestCd=Math.max(0,this.harvestCd-dt);
  this.player.update(dt,input,this);const moving=Math.hypot(input.moveX,input.moveY)>.18;
  this.updateFood(dt);this.updateServing(dt);this.updateMana(dt);this.updateSockets(dt);this.updatePlains(dt,moving,input.consumeAction());this.updateHelpers(dt);this.updateFX(dt);
  this.cameraX=clamp(this.player.x-viewW*.38,0,Math.max(0,this.width-viewW));
 }
 updateFood(dt){for(const f of this.foods){if(!f.active){f.respawn-=dt;if(f.respawn<=0)f.active=true;}else if(this.player.food<30&&d(this.player,f)<44){f.active=false;f.respawn=12;this.player.food++;this.audio.food();this.pop(f.x,f.y,'+1 Food','#fff4a8');}}}
 updateServing(dt){const ring={x:410,y:390};if(d(this.player,ring)<60&&this.player.food>0){this.serveAcc+=dt*15;while(this.serveAcc>=1&&this.player.food>0){this.serveAcc--;this.player.food--;const p=this.patrons.reduce((a,b)=>a.served<=b.served?a:b);p.served++;p.mood=1.5;this.projectiles.push({kind:'food',x:this.player.x,y:this.player.y-45,sx:this.player.x,sy:this.player.y-45,tx:p.x,ty:p.y-35,t:0,dur:.38,type:p.request});this.spawnCrystal(p);}}else this.serveAcc=0;for(const p of this.patrons)p.mood=Math.max(0,p.mood-dt);}
 spawnCrystal(p){const col=this.crystals.length%2,stack=this.crystals.filter(c=>!c.collected&&c.col===col).length;this.crystals.push({x:this.manaColumns[col].x,y:this.manaColumns[col].y-stack*10,col,collected:false});this.pop(p.x,p.y-50,'😋','#fff');}
 updateMana(){for(const c of this.crystals)if(!c.collected&&d(this.player,c)<105){c.collected=true;this.player.mana++;this.audio.mana();this.projectiles.push({kind:'mana',x:c.x,y:c.y,sx:c.x,sy:c.y,tx:this.player.x,ty:this.player.y-30,t:0,dur:.28});}this.crystals=this.crystals.filter(c=>!c.collected);}
 updateSockets(dt){for(const s of this.sockets){if(s.built)continue;if(d(this.player,s)<57&&this.player.mana>0){this.manaSpendAcc+=dt*18;while(this.manaSpendAcc>=1&&this.player.mana>0&&s.progress<s.cost){this.manaSpendAcc--;this.player.mana--;s.progress++;}if(s.progress>=s.cost){s.built=true;this.audio.unlockFanfare();this.message=`${s.label} unlocked!`;this.messageTime=3;for(let i=0;i<28;i++)this.star(s.x,s.y);if(s.id==='chef')this.helpers.push({x:1010,y:430,state:'food',carry:0,name:'Kokkoro'});}}} }
 updatePlains(dt,moving,tapped){
  const gate=this.sockets.find(s=>s.id==='gate').built;
  for(const b of this.bushes){if(!b.alive){b.respawn-=dt;if(b.respawn<=0){b.alive=true;b.hp=3;}}else if(gate&&d(this.player,b)<70&&this.harvestCd<=0){this.harvestCd=.45;b.hp--;this.slash(b.x,b.y);if(b.hp<=0){b.alive=false;b.respawn=18;this.player.herbs++;this.player.food=Math.min(30,this.player.food+1);this.pop(b.x,b.y,'+1 Herb','#d5ff8a');}}}
  for(const b of this.boars){if(b.hp<=0)continue;b.x+=b.vx*dt;if(b.x<1260||b.x>2110)b.vx*=-1;const near=d(this.player,b)<92;if(gate&&near&&!moving&&this.attackCd<=0)this.hitBoar(b);}
  if(tapped&&this.attackCd<=0){const b=this.boars.find(x=>x.hp>0&&d(this.player,x)<115);if(b)this.hitBoar(b);else{this.attackCd=.25;this.slash(this.player.x+this.player.facing*45,this.player.y);}}
  for(const p of this.prisons)if(!p.rescued&&d(this.player,p)<75&&this.player.food>=p.cost){this.player.food-=p.cost;p.rescued=true;this.helpers.push({x:p.x,y:p.y,state:'food',carry:0,name:p.name});this.audio.unlockFanfare();this.message=`${p.name} rescued as a helper!`;this.messageTime=4;for(let i=0;i<24;i++)this.star(p.x,p.y);}
 }
 hitBoar(b){this.attackCd=.42;b.hp--;this.slash(b.x,b.y);if(b.hp<=0){this.player.meat+=3;this.player.food=Math.min(30,this.player.food+3);this.pop(b.x,b.y,'+3 Meat','#ff9f43');}}
 updateHelpers(dt){for(const h of this.helpers){const target=h.state==='food'?{x:170,y:380}:{x:410,y:390};let dx=target.x-h.x,dy=target.y-h.y,L=Math.hypot(dx,dy)||1;h.x+=dx/L*120*dt;h.y+=dy/L*120*dt;if(L<35){if(h.state==='food'){h.carry=1;h.state='cashier';}else{h.carry=0;h.state='food';const p=this.patrons[0];p.mood=1.2;this.spawnCrystal(p);}}}}
 updateFX(dt){for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.gravity*dt;p.life-=dt;}this.particles=this.particles.filter(p=>p.life>0);for(const q of this.projectiles){q.t+=dt/q.dur;const t=clamp(q.t,0,1);q.x=q.sx+(q.tx-q.sx)*t;q.y=q.sy+(q.ty-q.sy)*t-Math.sin(Math.PI*t)*80;}this.projectiles=this.projectiles.filter(q=>q.t<1);for(const s of this.slashes)s.life-=dt;this.slashes=this.slashes.filter(s=>s.life>0);}
 slash(x,y){this.audio.slash();this.slashes.push({x,y,life:.22});for(let i=0;i<7;i++)this.particles.push({x,y,vx:(Math.random()-.5)*180,vy:(Math.random()-.5)*180,gravity:0,life:.45,color:'#ffe66d'});}
 pop(x,y,text,color){this.particles.push({x,y,vx:0,vy:-45,gravity:0,life:1,text,color});} star(x,y){this.particles.push({x,y,vx:(Math.random()-.5)*260,vy:-70-Math.random()*210,gravity:260,life:1+Math.random()*.7,color:'#ffd166',star:true});}
 serialize(){return{version:2,player:{x:this.player.x,y:this.player.y,food:this.player.food,mana:this.player.mana,meat:this.player.meat,herbs:this.player.herbs},sockets:this.sockets.map(s=>({id:s.id,progress:s.progress,built:s.built})),prisons:this.prisons.map(p=>p.rescued),helpers:this.helpers.map(h=>({x:h.x,y:h.y,state:h.state,carry:h.carry,name:h.name}))};}
 restore(data){const p=data.player||{};for(const k of ['x','y','food','mana','meat','herbs'])if(Number.isFinite(p[k]))this.player[k]=p[k];if(Array.isArray(data.sockets))for(const s of this.sockets){const v=data.sockets.find(x=>x.id===s.id);if(v){s.progress=clamp(Number(v.progress)||0,0,s.cost);s.built=!!v.built;}}if(Array.isArray(data.prisons))this.prisons.forEach((p,i)=>p.rescued=!!data.prisons[i]);if(Array.isArray(data.helpers))this.helpers=data.helpers.filter(h=>Number.isFinite(h.x)&&Number.isFinite(h.y));}
}
