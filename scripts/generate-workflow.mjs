import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const anatomyRoot = process.env.ANATOMY_ROOT ?? join(homedir(), '.agents/skills/anatomy');
const k = await import(pathToFileURL(join(anatomyRoot, 'kit/iso-kit.mjs')).href);
import { writeFileSync, readFileSync } from 'node:fs';
const dest = fileURLToPath(new URL('../src/', import.meta.url));
// Concept: a document-processing bench. A carriage visits input, review and output trays.
// Parts: base, four feet, four posts, two rails, two stops, three trays,
// nine tray walls, twelve sheets, three handles, carriage, scan head,
// four carriage fasteners, ruler, nameplate and twelve closed ventilation slots.
const base = {x:-136,y:-70,w:272,d:140,r:7};
const P = k.fitProjection([...k.boxCorners(base,-15,0),[-128,-56,117],[128,55,117]],600,410,{pad:50,azimuth:48,elevation:30});
const out=[];
const slab=(plan,z,h,tone='mid',lit=false)=>k.solidSvg(k.slabOf(plan,z,h,P,5,.7),{tone,lit});
const box=(x,y,w,d,z,h,tone='mid',lit=false)=>slab({x,y,w,d,r:1.5},z,h,tone,lit);
const dots=(pts,z)=>k.dotsSvg(pts.map(([x,y])=>k.iso([x,y,z],P)),{size:.65,tone:'hi'});
for(const [x,y] of k.corners(base,15))out.push(box(x-5,y-5,10,10,-15,5,'lo'));
out.push(`<path class="iso-halo" d="${k.haloOf(base,-15,10,P)}"/>`);
out.push(slab(base,-10,10));
out.push(k.lineSvg(k.planOutline(k.insetPlan(base,5),0,P),{tone:'lo'}));
out.push(dots(k.corners(base,10),0));
// Back structure is painted before the work surface and moving carriage.
for(const x of [-124,116])out.push(box(x,-52,8,8,0,107));
out.push(box(-124,-52,248,8,107,8));
for(const x of [-124,116])out.push(dots([[x+4,-48]],115));
const stations=[-86,0,86];
for(const [i,x] of stations.entries()){
 out.push(`<g data-station="${i}">`);
 out.push(box(x-35,-32,70,70,0,6,'hi'));
 out.push(box(x-35,-32,70,4,6,12));
 out.push(box(x-35,-28,4,66,6,12));
 out.push(box(x+31,-28,4,66,6,12));
 for(let j=0;j<4;j++)out.push(box(x-24+j%2,-20+j%2,48,43,6+j*1.6,1.6,'lo'));
 const sheet={x:x-24,y:-20,w:48,d:43,r:1};
 out.push(k.lineSvg(k.planOutline(k.insetPlan(sheet,4),12.4,P),{tone:'faint'}));
 out.push(box(x-9,38,18,4,1,3));
 out.push(dots([[x-30,31],[x+30,31]],6));
 out.push('</g>');
}
// Parallel rails and their stops hold the moving scan carriage.
out.push(box(-120,-46,240,5,100,5));
out.push(box(-120,-25,240,5,100,5));
for(const x of [-120,113])out.push(box(x,-46,7,26,105,6,'hi'));
const strip={x:-112,y:48,w:224,d:7,r:1};
out.push(slab(strip,0,.8,'lo'));
const ticks=k.topTicks(-108,108,4,5,48.4,.8,[2,4],P);
out.push(k.lineSvg(ticks.minor,{tone:'lo'}),k.lineSvg(ticks.major,{tone:'mid'}));
// Carriage moves along the x axis, with all geometry shared across stages.
const carriage=[];
carriage.push(box(-108,-49,44,33,105,8,'hi'));
carriage.push(box(-101,-44,30,23,113,7,'hi',true));
carriage.push(box(-98,-19,24,5,92,13,'hi'));
carriage.push(box(-100,-14,28,12,88,8,'hi',true));
carriage.push(box(-96,-12,20,7,86,2,'lo'));
for(let i=0;i<6;i++)carriage.push(box(-98+i*4,-40,1.2,13,120,.2,'lo'));
carriage.push(dots([[-104,-45],[-68,-45],[-104,-20],[-68,-20]],113));
out.push(`<g data-carriage="" style="--travel-x:${(k.iso([86,0,0],P)[0]-k.iso([0,0,0],P)[0]).toFixed(3)}px;--travel-y:${(k.iso([86,0,0],P)[1]-k.iso([0,0,0],P)[1]).toFixed(3)}px">${carriage.join('')}</g>`);
// Front pillars are physically in front of the moving head.
for(const x of [-124,116]){
 out.push(box(x,47,8,8,0,12));
 out.push(box(x+1,48,6,6,12,88));
 out.push(box(x,47,8,8,100,7));
 out.push(dots([[x+4,51]],107));
}
out.push(box(-124,47,248,8,107,8));
for(let i=0;i<12;i++)out.push(box(-88+i*15,48,7,1.5,115,.15,'lo'));
out.push(box(-20,57,40,8,0,.8,'lo'));
const svg=k.figureSvg({width:600,height:410,label:'Isometric document-processing machine. A scan carriage travels above three trays for collection, review and delivery.',body:out});
writeFileSync(dest+'workflow-art.svg',svg);
writeFileSync(dest+'anatomy.css','/* Anatomy kit styles. Copyright (c) 2026 Ryan. MIT license: anatomy-LICENSE.txt. */\n'+readFileSync(join(anatomyRoot, 'kit/iso.css'),'utf8'));
writeFileSync(dest+'anatomy-LICENSE.txt',readFileSync(join(anatomyRoot, 'LICENSE')));
console.log('Generated workflow-art.svg with '+(svg.match(/class="iso-solid/g)||[]).length+' solid parts.');
