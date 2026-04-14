import React, { useEffect, useRef } from 'react';

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.3 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir: 1,
    }));

    // Floating platforms
    const platforms = [
      { x: -60, y: 120, w: 120, color: '#1a3a5c', speed: 0.3 },
      { x: window.innerWidth + 40, y: 250, w: 100, color: '#1a3a5c', speed: -0.2 },
      { x: 200, y: 400, w: 80, color: '#1a3a5c', speed: 0.15 },
    ];

    let animId: number;
    let lastTime = 0;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    // Cache background gradient (recreate only on resize)
    let bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#0d0d1a');
    bgGrad.addColorStop(0.5, '#0d1a2e');
    bgGrad.addColorStop(1, '#0d0d1a');

    const origResize = resize;
    const resizeWithGrad = () => {
      origResize();
      bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#0d0d1a');
      bgGrad.addColorStop(0.5, '#0d1a2e');
      bgGrad.addColorStop(1, '#0d0d1a');
    };
    window.removeEventListener('resize', resize);
    window.addEventListener('resize', resizeWithGrad);

    const draw = (timestamp: number) => {
      animId = requestAnimationFrame(draw);

      if (timestamp - lastTime < FRAME_INTERVAL) return;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cached gradient background
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach(s => {
        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha >= 1) s.twinkleDir = -1;
        if (s.alpha <= 0.1) s.twinkleDir = 1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      });

      // Floating platforms
      platforms.forEach(p => {
        p.x += p.speed;
        if (p.x > canvas.width + 100) p.x = -150;
        if (p.x < -150) p.x = canvas.width + 100;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.w, 18, 5);
        ctx.fill();
        // Grass top
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.w, 6, [5, 5, 0, 0]);
        ctx.fill();
      });
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeWithGrad);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
