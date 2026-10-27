const TAU=Math.PI*2;
const PAL={
 Pecorine:{hair:'#fdcb6e',shade:'#e6a93d',skin:'#ffe0bd',eye:'#2877c7',body:'#2879c9',trim:'#eef7ff',accent:'#ffd166'},
 Karyl:{hair:'#282536',shade:'#15131f',skin:'#f7d8c3',eye:'#9b59b6',body:'#654a91',trim:'#eadfff',accent:'#d15b92'},
 Kokkoro:{hair:'#88dfbd',shade:'#54b994',skin:'#f6dcc8',eye:'#3e9f80',body:'#f5efe3',trim:'#74c8ab',accent:'#e3c56b'},
 Yuuki:{hair:'#8d6548',shade:'#60432f',skin:'#f5d4bc',eye:'#4776a8',body:'#496da8',trim:'#e3e9f5',accent:'#bdc7d9'},
 Mimi:{hair:'#f3a6c8',shade:'#cc729e',skin:'#f7dac7',eye:'#b85f91',body:'#ef8ebd',trim:'#fff2fa',accent:'#f4dc77'}
};
const ellipse=(c,x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();};
const limb=(c,x1,y1,x2,y2,color,w=6)=>{c.strokeStyle=color;c.lineWidth=w;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();};
export const ANIMATION_STATES=['idle','run','carry','serve','attack','cheer','eat','hurt'];
export class SpriteAnimator{
 draw(c,name,x,y,time,options={}){
  const p=PAL[name]||PAL.Yuuki,state=options.state||'idle',facing=options.facing||1,scale=options.scale||1,phase=options.phase||0;
  const speed=state==='run'?11:state==='attack'?14:state==='cheer'?8:state==='eat'?7:3;
  const q=time*speed+phase,cycle=Math.sin(q),pulse=Math.sin(q*.5),blink=Math.floor(time*2.4+phase)%15===0;
  let bob=state==='run'?Math.abs(cycle)*3:pulse*.7,lean=0,armL=0,armR=0,legL=0,legR=0,face='smile';
  if(state==='run'){lean=cycle*.04;armL=-cycle*9;armR=cycle*9;legL=cycle*9;legR=-cycle*9;}
  if(state==='carry'){bob=Math.abs(cycle)*1.2;armL=armR=-9;}
  if(state==='serve'){lean=-.16;armR=-16;armL=-5;}
  if(state==='attack'){lean=.18;armR=-18+cycle*4;legL=-4;legR=4;}
  if(state==='cheer'){bob=Math.abs(cycle)*5;armL=armR=-22;face='joy';}
  if(state==='eat'){bob=Math.abs(cycle);armR=-15;face='joy';}
  if(state==='hurt'){lean=-.22;armL=-12;armR=12;face='hurt';}
  c.save();c.translate(x,y-bob);c.scale(facing*scale,scale);c.rotate(lean);c.lineCap='round';c.lineJoin='round';
  c.globalAlpha=.18;c.fillStyle='#15334a';c.beginPath();c.ellipse(0,25,22,7,0,0,TAU);c.fill();c.globalAlpha=1;
  if(name==='Pecorine'){ellipse(c,-19,-35,10,23,p.shade);ellipse(c,19,-35,10,23,p.shade);}
  if(name==='Karyl'){ellipse(c,-20,-35,8,20,p.shade);ellipse(c,20,-35,8,20,p.shade);c.fillStyle=p.hair;c.beginPath();c.moveTo(-16,-55);c.lineTo(-7,-76);c.lineTo(0,-54);c.moveTo(16,-55);c.lineTo(7,-76);c.lineTo(0,-54);c.fill();}
  limb(c,-7,7,-9-legL,25,'#34495e');limb(c,7,7,9-legR,25,'#34495e');
  limb(c,-12,-7,-22-armL,7,p.skin);limb(c,12,-7,22-armR,7,p.skin);
  c.fillStyle=p.body;c.beginPath();c.roundRect(-16,-25,32,36,9);c.fill();c.fillStyle=p.trim;c.beginPath();c.roundRect(-11,-17,22,25,5);c.fill();
  if(name==='Kokkoro'){limb(c,19,-38,25,24,'#78664c',3);c.fillStyle='#c7a965';c.beginPath();c.moveTo(18,-41);c.lineTo(25,-54);c.lineTo(29,-39);c.fill();}
  ellipse(c,0,-44,21,20,p.skin);c.fillStyle=p.hair;c.beginPath();c.arc(0,-48,22,Math.PI,TAU);c.lineTo(20,-39);c.arc(0,-43,21,0,Math.PI,true);c.fill();ellipse(c,-19,-40,5,15,p.hair);ellipse(c,19,-40,5,15,p.hair);
  if(blink||face==='hurt'){limb(c,-10,-44,-4,-44,p.eye,2);limb(c,4,-44,10,-44,p.eye,2);}else{ellipse(c,-7,-44,2.7,4.2,p.eye);ellipse(c,7,-44,2.7,4.2,p.eye);ellipse(c,-8,-46,1,1,'#fff');ellipse(c,6,-46,1,1,'#fff');}
  c.strokeStyle='#b85f68';c.lineWidth=1.8;c.beginPath();if(face==='joy')c.arc(0,-36,6,0,Math.PI);else if(face==='hurt'){c.moveTo(-5,-34);c.quadraticCurveTo(0,-39,5,-34);}else c.arc(0,-36,5,.15,Math.PI-.15);c.stroke();
  if(name==='Pecorine'){c.fillStyle=p.accent;c.beginPath();c.moveTo(-12,-64);c.lineTo(-6,-74);c.lineTo(0,-65);c.lineTo(6,-75);c.lineTo(12,-64);c.closePath();c.fill();ellipse(c,0,-66,3,3,'#4cc9f0');}
  if(name==='Kokkoro')ellipse(c,0,-63,4,4,p.accent);
  if(name==='Mimi'){c.fillStyle='#f8c5db';c.beginPath();c.moveTo(-15,-57);c.lineTo(-8,-74);c.lineTo(-2,-58);c.moveTo(15,-57);c.lineTo(8,-74);c.lineTo(2,-58);c.fill();}
  if(state==='carry'||options.carry){c.font='21px serif';c.textAlign='center';c.fillText('🍱',0,-80);}
  if(state==='eat'){c.font='18px serif';c.fillText('🍙',15,-25);}
  if(state==='attack'){c.strokeStyle='rgba(255,246,176,.9)';c.lineWidth=5;c.beginPath();c.arc(23,-5,28,-1.25,1.1);c.stroke();}
  if(state==='cheer'){c.fillStyle='#ffd166';c.font='15px serif';c.fillText('★',-29,-55);c.fillText('★',25,-48);}
  c.restore();
 }
}
