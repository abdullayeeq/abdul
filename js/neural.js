/* neural.js — Animated neural network canvas background */
(function () {
  'use strict';

  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes = [], mouse = { x: -9999, y: -9999 };
  const NODE_COUNT = 90;
  const MAX_DIST = 160;
  const COLORS = ['#00d4ff', '#2563eb', '#7c3aed'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 2 + 1,
        color: randColor(),
        alpha: Math.random() * 0.5 + 0.3
      });
    }
  }

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move nodes
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      // Mouse attraction (subtle)
      const mdx = mouse.x - n.x, mdy = mouse.y - n.y;
      const md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 200) {
        n.vx += mdx / md * 0.03;
        n.vy += mdy / md * 0.03;
        // clamp speed
        const spd = Math.hypot(n.vx, n.vy);
        if (spd > 1.5) { n.vx = n.vx / spd * 1.5; n.vy = n.vy / spd * 1.5; }
      }
    }

    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = dist(nodes[i], nodes[j]);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const n of nodes) {
      ctx.beginPath();
      const hex = n.color;
      const r = parseInt(hex.slice(1,3),16);
      const g = parseInt(hex.slice(3,5),16);
      const b = parseInt(hex.slice(5,7),16);
      ctx.fillStyle = `rgba(${r},${g},${b},${n.alpha})`;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();

      // Glow on closest to mouse
      const mdx = mouse.x - n.x, mdy = mouse.y - n.y;
      const md = Math.sqrt(mdx*mdx + mdy*mdy);
      if (md < 100) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.1)`;
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initNodes(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  resize();
  initNodes();
  draw();
})();
