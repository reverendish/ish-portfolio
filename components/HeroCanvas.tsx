'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cont = canvas.parentElement!;
    let W = cont.clientWidth, H = cont.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x09090b, 26, 50);

    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 200);
    camera.position.set(0, 5, 16);
    camera.lookAt(0, -1, -4);

    // ── Floor grids ──────────────────────────────────────────
    function addGrid(divisions: number, size: number, color: number, opacity: number) {
      const g = new THREE.GridHelper(size, divisions, color, color);
      (g.material as THREE.Material).transparent = true;
      (g.material as THREE.Material).opacity = opacity;
      g.position.y = -2.2;
      scene.add(g);
    }
    addGrid(40, 60, 0x1e1e28, 0.60);
    addGrid(8,  60, 0x2e2e48, 0.50);

    // ── Wireframe browser frames ──────────────────────────────
    function addFrame(w: number, h: number, x: number, y: number, z: number, col: number, opacity = 0.55) {
      const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, 0.04));
      const mat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity });
      const m = new THREE.LineSegments(geo, mat);
      m.position.set(x, y, z);
      scene.add(m);
      return m;
    }

    const frames: THREE.LineSegments[] = [
      addFrame(5.2, 3.2,    0,    0.2,  -9,   0x3c3c72),
      addFrame(3.2, 2.0,  -5.2,  0.1,  -6,   0x2f2f5a, 0.45),
      addFrame(3.0, 1.9,   5.0,  0.1,  -6.5, 0x2f2f5a, 0.45),
      addFrame(2.0, 1.3,  -2.5,  0.8, -13,   0x252548, 0.35),
      addFrame(1.8, 1.2,   2.2,  0.6, -14,   0x252548, 0.35),
    ];

    // Thin title-bar lines on main frames
    addFrame(4.0, 0.28,   0,    1.26, -8.96, 0x4c4c90, 0.50);
    addFrame(2.3, 0.22,  -5.2,  0.8,  -5.96, 0x3c3c70, 0.40);
    addFrame(2.1, 0.22,   5.0,  0.75, -6.46, 0x3c3c70, 0.40);

    // ── Nodes ────────────────────────────────────────────────
    const nodePositions: [number, number, number][] = [
      [0,    0.6,  -9  ],
      [-5.2, 0.5,  -6  ],
      [5.0,  0.5,  -6.5],
      [-2.5, 1.2, -13  ],
      [2.2,  1.0, -14  ],
      [0,   -1.8,  -3  ],
      [-3,  -1.8,  -1  ],
      [3,   -1.8,  -1  ],
    ];

    const sphereGeo   = new THREE.SphereGeometry(0.10, 12, 12);
    const accentMat   = new THREE.MeshBasicMaterial({ color: 0xa5b4fc });
    const dimMat      = new THREE.MeshBasicMaterial({ color: 0x5c5caa });

    const nodeMeshes = nodePositions.map((p, i) => {
      const m = new THREE.Mesh(sphereGeo, i < 5 ? accentMat : dimMat);
      m.position.set(...p);
      scene.add(m);
      return m;
    });

    // ── Connection lines ─────────────────────────────────────
    const connPairs: [number, number][] = [
      [5, 0], [5, 1], [5, 2],
      [6, 1], [7, 2],
      [0, 3], [0, 4],
      [6, 5], [7, 5],
    ];

    const lineMat = new THREE.LineBasicMaterial({ color: 0x2c2c58, transparent: true, opacity: 0.65 });

    connPairs.forEach(([a, b]) => {
      const pts = [
        new THREE.Vector3(...nodePositions[a]),
        new THREE.Vector3(...nodePositions[b]),
      ];
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
    });

    // ── Particles along connections ───────────────────────────
    const pGeo = new THREE.SphereGeometry(0.055, 6, 6);
    const particles = connPairs.map(([a, b], i) => {
      const mat = new THREE.MeshBasicMaterial({ color: 0xa5b4fc, transparent: true, opacity: 0.85 });
      const mesh = new THREE.Mesh(pGeo, mat);
      scene.add(mesh);
      return {
        mesh,
        start: new THREE.Vector3(...nodePositions[a]),
        end:   new THREE.Vector3(...nodePositions[b]),
        t:     i / connPairs.length,
        speed: 0.0028 + Math.random() * 0.0018,
      };
    });

    // ── Animation ────────────────────────────────────────────
    const baseY    = nodePositions.map(p => p[1]);
    const frameBaseY = [0.2, 0.1, 0.1, 0.8, 0.6];
    const tmp      = new THREE.Vector3();
    let   clock    = 0;
    let   animId   = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      clock += 0.007;

      camera.position.x = Math.sin(clock * 0.18) * 1.3;
      camera.position.y = 5 + Math.sin(clock * 0.12) * 0.35;
      camera.lookAt(0, -1, -4);

      nodeMeshes.forEach((m, i) => {
        m.position.y = baseY[i] + Math.sin(clock * 0.9 + i * 1.4) * 0.11;
      });

      frames.forEach((f, i) => {
        f.position.y = frameBaseY[i] + Math.sin(clock * 0.65 + i * 2.0) * 0.06;
      });

      particles.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        tmp.lerpVectors(p.start, p.end, p.t);
        p.mesh.position.copy(tmp);
      });

      renderer.render(scene, camera);
    }
    animate();

    // ── Resize ───────────────────────────────────────────────
    const onResize = () => {
      W = cont.clientWidth;
      H = cont.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
