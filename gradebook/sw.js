/* Keeps the gradebook working offline. App files are cached on install; libraries and fonts are cached the first time they load. */
const CACHE="gradebook-v23";
const SHELL=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/favicon-32.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:r.mode==="navigate"});
    const net=fetch(r).then(res=>{ if(res&&(res.ok||res.type==="opaque")) c.put(r,res.clone()); return res; }).catch(()=>hit);
    return hit||net;
  }));
});
