import React, { useRef, useEffect } from 'react';

interface ParticleBackgroundProps {
  showLights?: boolean;
  showAurora?: boolean;
  showWaves?: boolean;
  waveBrightness?: number;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  showLights = true, 
  showAurora = false, 
  showWaves = true,
  waveBrightness = 0.5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    // --- Pre-rendering Canvases for Optimization ---
    
    // 1. Pre-render Particles (Small and Large)
    const createParticleCanvas = (size: number, blur: number, color: string, shadowColor: string) => {
      const pCanvas = document.createElement('canvas');
      const pCtx = pCanvas.getContext('2d');
      const totalSize = size * 2 + blur * 2;
      pCanvas.width = totalSize;
      pCanvas.height = totalSize;
      if (pCtx) {
        const center = totalSize / 2;
        pCtx.beginPath();
        pCtx.arc(center, center, size, 0, Math.PI * 2);
        pCtx.fillStyle = color;
        pCtx.shadowBlur = blur;
        pCtx.shadowColor = shadowColor;
        pCtx.fill();
      }
      return { canvas: pCanvas, offset: totalSize / 2 };
    };

    // We'll create a few variations of particles to avoid drawing them with shadowBlur every frame
    const smallParticle = createParticleCanvas(1.5, 10, 'rgba(255, 220, 100, 1)', 'rgba(255, 215, 0, 0.8)');
    const largeParticle = createParticleCanvas(5, 20, 'rgba(255, 220, 100, 1)', 'rgba(255, 215, 0, 0.8)');

    // 2. Pre-render Background Gradient
    const bgCanvas = document.createElement('canvas');
    const updateBgCanvas = () => {
      bgCanvas.width = width;
      bgCanvas.height = height;
      const bgCtx = bgCanvas.getContext('2d');
      if (bgCtx) {
        const bgGradient = bgCtx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width * 0.8);
        bgGradient.addColorStop(0, '#1a1200');
        bgGradient.addColorStop(1, '#050300');
        bgCtx.fillStyle = bgGradient;
        bgCtx.fillRect(0, 0, width, height);
      }
    };

    // 3. Pre-render Aurora Ray (to avoid ctx.filter = 'blur(40px)')
    const auroraRayCanvas = document.createElement('canvas');
    const updateAuroraRayCanvas = () => {
      // Create a soft vertical ray that we can stretch and draw
      const rayW = 200;
      const rayH = 800;
      auroraRayCanvas.width = rayW;
      auroraRayCanvas.height = rayH;
      const rCtx = auroraRayCanvas.getContext('2d');
      if (rCtx) {
        rCtx.filter = 'blur(30px)'; // Apply blur ONCE here
        const grad = rCtx.createLinearGradient(0, 0, 0, rayH);
        grad.addColorStop(0, `rgba(255, 200, 80, 1)`);
        grad.addColorStop(1, 'rgba(255, 200, 80, 0)');
        rCtx.fillStyle = grad;
        // Draw a rect in the middle so the edges are blurred
        rCtx.fillRect(rayW * 0.2, 0, rayW * 0.6, rayH);
      }
    };
    updateAuroraRayCanvas(); // Only needs to be done once

    // 4. Pre-render Beam (to avoid ctx.filter = 'blur(40px)')
    const beamCanvas = document.createElement('canvas');
    const updateBeamCanvas = () => {
      const bW = 800;
      const bH = 1200;
      beamCanvas.width = bW;
      beamCanvas.height = bH;
      const bCtx = beamCanvas.getContext('2d');
      if (bCtx) {
        bCtx.filter = 'blur(40px)'; // Apply blur ONCE here
        const grad = bCtx.createLinearGradient(0, 0, 0, bH);
        grad.addColorStop(0, `rgba(255, 220, 140, 1)`);
        grad.addColorStop(0.5, `rgba(255, 180, 80, 0.4)`);
        grad.addColorStop(1, 'rgba(255, 150, 50, 0)');
        
        bCtx.fillStyle = grad;
        bCtx.beginPath();
        bCtx.moveTo(bW / 2, 0);
        bCtx.lineTo(bW * 0.1, bH);
        bCtx.lineTo(bW * 0.9, bH);
        bCtx.fill();
      }
    };
    updateBeamCanvas();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      updateBgCanvas();
      initParticles();
    };

    window.addEventListener('resize', resize);

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((width * height) / 8000);
      for (let i = 0; i < numParticles; i++) {
        const isLarge = Math.random() > 0.9; // 10% are large out-of-focus particles
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: isLarge ? Math.random() * 4 + 3 : Math.random() * 2 + 0.5,
          dx: (Math.random() - 0.5) * 0.3,
          dy: (Math.random() - 0.5) * 0.3 - 0.2, // Drift upwards slightly
          opacity: isLarge ? Math.random() * 0.3 + 0.1 : Math.random() * 0.8 + 0.2,
          blinkSpeed: Math.random() * 0.02 + 0.005,
          blinkDir: Math.random() > 0.5 ? 1 : -1,
          isLarge
        });
      }
    };

    const drawAurora = (time: number) => {
      if (!showAurora) return;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      const numRays = 25;
      for (let i = 0; i < numRays; i++) {
        const rand1 = Math.sin(i * 12.9898) * 43758.5453 - Math.floor(Math.sin(i * 12.9898) * 43758.5453);
        const rand2 = Math.sin(i * 78.233) * 43758.5453 - Math.floor(Math.sin(i * 78.233) * 43758.5453);
        
        const xBase = width * (i / numRays);
        const sway = Math.sin(time * 0.0001 + rand1 * Math.PI * 2) * (width * 0.1);
        const x = xBase + sway;
        
        const rayWidth = 80 + rand2 * 180; // 폭을 더 넓게
        const heightMultiplier = 0.4 + rand1 * 0.6;
        const rayHeight = height * heightMultiplier;
        
        const baseOpacity = 0.015 + rand1 * 0.035; // 더 투명하게
        const pulse = Math.sin(time * 0.0003 + rand2 * Math.PI * 2) * 0.015;
        const opacity = Math.max(0, baseOpacity + pulse);
        
        ctx.globalAlpha = opacity;
        // Draw the pre-rendered blurry ray stretched to the needed dimensions
        ctx.drawImage(auroraRayCanvas, x - rayWidth/2, 0, rayWidth, rayHeight);
      }
      ctx.restore();
    };

    const drawWaves = (time: number) => {
      if (!showWaves) return;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      const numLines = 18; // Depth lines
      for (let i = 0; i < numLines; i++) {
        const progress = i / numLines; // 0 to 1
        const baseY = height * 0.65 + progress * height * 0.35;
        const amplitude = 15 + progress * 60;
        const frequency = 0.002 + progress * 0.0015;
        const speed = 0.0003 + progress * 0.0004;
        const phase = i * 0.6;
        
        // Opacity fades out in the distance and very close
        const opacity = Math.sin(progress * Math.PI) * waveBrightness; 
        
        ctx.fillStyle = `rgba(255, 190, 80, ${opacity})`;
        
        const drawLines = progress > 0.3;
        if (drawLines) {
          ctx.beginPath();
        }

        for (let x = 0; x <= width; x += 15) {
          const y = baseY + Math.sin(x * frequency + time * speed + phase) * amplitude;
          const dotSize = 0.5 + progress * 1.5;
          ctx.fillRect(x - dotSize, y - dotSize, dotSize * 2, dotSize * 2);
          
          if (drawLines) {
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
        }

        // Connecting glowing line for the brighter front waves
        if (drawLines) {
          // Simulate glow with a thicker, lower-opacity stroke instead of expensive shadowBlur
          if (progress > 0.5) {
            ctx.lineWidth = progress * 1.5 + 4;
            ctx.strokeStyle = `rgba(255, 200, 100, ${opacity * 0.15})`;
            ctx.stroke();
          }
          ctx.lineWidth = progress * 1.5;
          ctx.strokeStyle = `rgba(255, 200, 100, ${opacity * 0.4})`;
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    const drawBeams = (time: number) => {
      if (!showLights) return;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      const swayLeft = Math.sin(time * 0.00025) * 0.12;
      const swayRight = Math.cos(time * 0.0002) * 0.12;

      const drawBeam = (x: number, y: number, angle: number, spread: number, opacity: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.globalAlpha = opacity;
        
        const length = height * 1.5;
        // Draw the pre-rendered blurry beam
        ctx.drawImage(beamCanvas, -spread, 0, spread * 2, length);
        
        ctx.restore();
      };

      const targetX = width / 2;
      const targetY = height;
      
      const getAngle = (x: number, y: number) => {
        const dx = targetX - x;
        const dy = targetY - y;
        return Math.atan2(-dx, dy);
      };

      // Left light source
      const leftX = width * 0.05;
      const leftY = -50;
      const leftAngle = getAngle(leftX, leftY) + swayLeft;
      drawBeam(leftX, leftY, leftAngle, width * 0.35, 0.2); 
      drawBeam(leftX, leftY, leftAngle, width * 0.15, 0.45); 
      
      // Right light source
      const rightX = width * 0.95;
      const rightY = -50;
      const rightAngle = getAngle(rightX, rightY) + swayRight;
      drawBeam(rightX, rightY, rightAngle, width * 0.35, 0.2); 
      drawBeam(rightX, rightY, rightAngle, width * 0.15, 0.45); 
      
      // Center stage glow
      const glowSway = Math.sin(time * 0.0004) * width * 0.02;
      const centerGlow = ctx.createRadialGradient(width/2 + glowSway, height, 0, width/2 + glowSway, height, height * 0.8);
      centerGlow.addColorStop(0, 'rgba(255, 160, 50, 0.15)');
      centerGlow.addColorStop(0.5, 'rgba(200, 100, 20, 0.04)');
      centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw pre-rendered background
      ctx.drawImage(bgCanvas, 0, 0);

      drawAurora(time);
      drawWaves(time);
      drawBeams(time);

      // Draw particles using pre-rendered canvases
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      particles.forEach((p) => {
        ctx.globalAlpha = p.opacity;
        const pData = p.isLarge ? largeParticle : smallParticle;
        
        // Use the pre-rendered canvas instead of drawing arcs with shadowBlur
        ctx.drawImage(
          pData.canvas, 
          p.x - pData.offset, 
          p.y - pData.offset
        );

        p.x += p.dx;
        p.y += p.dy;
        
        // Blinking effect
        p.opacity += p.blinkSpeed * p.blinkDir;
        if (p.opacity >= 1) {
          p.opacity = 1;
          p.blinkDir = -1;
        } else if (p.opacity <= 0.1) {
          p.opacity = 0.1;
          p.blinkDir = 1;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showLights, showAurora, showWaves, waveBrightness]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default ParticleBackground;
