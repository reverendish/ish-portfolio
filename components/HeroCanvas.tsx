'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ── Palettes ─────────────────────────────────────────────── */
const DARK = {
  stemDeep: 0x312e81,
  stemMid:  0x3730a3,
  stemTip:  0x4f46e5,
  node:     0xa5b4fc,
  spore:    0xe0e7ff,
};
const LIGHT = {
  stemDeep: 0xc7d2fe,
  stemMid:  0xa5b4fc,
  stemTip:  0x818cf8,
  node:     0x6366f1,
  spore:    0x4338ca,
};
type Pal = typeof DARK;

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/* ── Branch ───────────────────────────────────────────────── */
interface Branch {
  pts:             THREE.Vector3[];
  geo:             THREE.BufferGeometry;
  mat:             THREE.LineBasicMaterial;
  line:            THREE.Line;
  drawn:           number;   // float, points drawn so far
  rate:            number;   // points per frame
  spawnAt:         number;   // trigger children at this drawn value
  depth:           number;
  children:        Branch[];
  childrenSpawned: boolean;
  nodeMesh:        THREE.Mesh | null;
  nodeMat:         THREE.MeshBasicMaterial | null;
}

/** Organic curved points from origin in dirAngle (XZ plane) */
function makePts(origin: THREE.Vector3, dirAngle: number, length: number): THREE.Vector3[] {
  const N    = 24;
  const bend = rnd(-0.42, 0.42);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= N; i++) {
    const t       = i / N;
    const lateral = bend * Math.sin(t * Math.PI) * length;
    const x = origin.x + Math.cos(dirAngle) * length * t - Math.sin(dirAngle) * lateral;
    const z = origin.z + Math.sin(dirAngle) * length * t + Math.cos(dirAngle) * lateral;
    const y = rnd(-0.05, 0.05);
    pts.push(new THREE.Vector3(x, y, z));
  }
  return pts;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const cont   = canvas.parentElement!;
    let W = cont.clientWidth, H = cont.clientHeight;

    const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    /* ── Scene / Camera ── */
    const scene = new THREE.Scene();
    let C: Pal  = isDark() ? DARK : LIGHT;

    const cam = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
    cam.position.set(0, 16, 14);
    cam.lookAt(0, 0, -3);

    /* ── Shared geometry ── */
    const nodeGeo  = new THREE.SphereGeometry(0.10, 8, 8);
    const sporeGeo = new THREE.SphereGeometry(0.045, 6, 6);

    /* ── Tracked materials for theme updates / disposal ── */
    const stemMats:  THREE.LineBasicMaterial[]  = [];
    const nodeMats:  THREE.MeshBasicMaterial[]  = [];
    const sporeMats: THREE.MeshBasicMaterial[]  = [];

    const allBranches: Branch[] = [];

    function stemColor(depth: number): number {
      return depth === 0 ? C.stemDeep : depth <= 2 ? C.stemMid : C.stemTip;
    }
    function stemOpacity(depth: number): number {
      return Math.max(0.20, 0.80 - depth * 0.10);
    }

    /* ── Branch factory ── */
    function spawnBranch(
      origin: THREE.Vector3,
      angle:  number,
      len:    number,
      depth:  number,
    ): Branch {
      const pts = makePts(origin, angle, len);

      const positions = new Float32Array(pts.length * 3);
      pts.forEach((p, i) => {
        positions[i * 3]     = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      });

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setDrawRange(0, 2);

      const mat = new THREE.LineBasicMaterial({
        color:       stemColor(depth),
        transparent: true,
        opacity:     stemOpacity(depth),
      });
      stemMats.push(mat);

      const line = new THREE.Line(geo, mat);
      scene.add(line);

      const b: Branch = {
        pts, geo, mat, line,
        drawn:           2,
        rate:            rnd(0.12, 0.26) * Math.pow(0.87, depth),
        spawnAt:         pts.length * 0.70,
        depth,
        children:        [],
        childrenSpawned: false,
        nodeMesh:        null,
        nodeMat:         null,
      };
      allBranches.push(b);
      return b;
    }

    function spawnChildren(parent: Branch) {
      if (parent.depth >= 5) return;
      const tip         = parent.pts[parent.pts.length - 1];
      const parentAngle = Math.atan2(
        tip.z - parent.pts[0].z,
        tip.x - parent.pts[0].x,
      );
      const parentLen = parent.pts[0].distanceTo(tip);
      const n = parent.depth < 2 ? (rnd(2, 4) | 0) : (rnd(1, 3) | 0);
      for (let i = 0; i < n; i++) {
        const spread = rnd(0.3, 0.9) * (Math.random() < 0.5 ? 1 : -1);
        spawnBranch(tip, parentAngle + spread, parentLen * rnd(0.50, 0.75), parent.depth + 1);
      }
    }

    /* ── Seed the network ── */
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + rnd(-0.25, 0.25);
      spawnBranch(
        new THREE.Vector3(rnd(-1, 1), 0, rnd(-1, 1)),
        angle,
        rnd(3.5, 5.5),
        0,
      );
    }

    /* ── Spore particles ── */
    interface Spore {
      mesh:  THREE.Mesh;
      mat:   THREE.MeshBasicMaterial;
      t:     number;
      speed: number;
      bi:    number;    // branch index
    }
    const spores: Spore[] = [];
    for (let i = 0; i < 22; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: C.spore, transparent: true, opacity: 0.80 });
      sporeMats.push(mat);
      const mesh = new THREE.Mesh(sporeGeo, mat);
      mesh.visible = false;
      scene.add(mesh);
      spores.push({
        mesh, mat,
        t:     Math.random(),
        speed: rnd(0.003, 0.009),
        bi:    Math.floor(Math.random() * 4),
      });
    }

    /* ── Theme switching ── */
    function applyTheme() {
      C = isDark() ? DARK : LIGHT;
      allBranches.forEach(b => b.mat.color.setHex(stemColor(b.depth)));
      nodeMats.forEach(m  => m.color.setHex(C.node));
      sporeMats.forEach(m => m.color.setHex(C.spore));
    }
    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes:      true,
      attributeFilter: ['data-theme'],
    });

    /* ── Animation ── */
    const tmp = new THREE.Vector3();
    let clock  = 0;
    let animId = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      clock += 0.006;

      // Slow camera drift
      cam.position.x = Math.sin(clock * 0.22) * 1.8;
      cam.position.y = 16 + Math.sin(clock * 0.16) * 0.6;
      cam.lookAt(0, 0, -3);

      // Grow branches
      for (const b of allBranches) {
        if (b.drawn < b.pts.length) {
          b.drawn = Math.min(b.drawn + b.rate, b.pts.length);
          b.geo.setDrawRange(0, Math.floor(b.drawn));
        }

        if (!b.childrenSpawned && b.drawn >= b.spawnAt) {
          b.childrenSpawned = true;
          spawnChildren(b);
        }

        // Tip node when fully grown (deeper branches only)
        if (!b.nodeMesh && b.drawn >= b.pts.length && b.depth >= 3) {
          const nm = new THREE.MeshBasicMaterial({ color: C.node, transparent: true, opacity: 0.60 });
          nodeMats.push(nm);
          const mesh = new THREE.Mesh(nodeGeo, nm);
          mesh.position.copy(b.pts[b.pts.length - 1]);
          scene.add(mesh);
          b.nodeMesh = mesh;
          b.nodeMat  = nm;
        }
      }

      // Move spores along branches
      for (const s of spores) {
        const b    = allBranches[s.bi % allBranches.length];
        const maxT = Math.min(b.drawn / b.pts.length, 1);
        if (maxT < 0.05) { s.mesh.visible = false; continue; }

        s.t += s.speed;
        if (s.t > maxT) {
          s.t  = 0;
          s.bi = Math.floor(Math.random() * allBranches.length);
        }

        const fi = s.t * (b.pts.length - 1);
        const i0 = Math.floor(fi);
        const i1 = Math.min(i0 + 1, b.pts.length - 1);
        tmp.lerpVectors(b.pts[i0], b.pts[i1], fi - i0);
        s.mesh.position.copy(tmp);
        s.mesh.visible = true;
      }

      renderer.render(scene, cam);
    }
    animate();

    /* ── Resize ── */
    const onResize = () => {
      W = cont.clientWidth; H = cont.clientHeight;
      cam.aspect = W / H;
      cam.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      allBranches.forEach(b => { b.geo.dispose(); b.mat.dispose(); });
      nodeMats.forEach(m  => m.dispose());
      sporeMats.forEach(m => m.dispose());
      nodeGeo.dispose();
      sporeGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
