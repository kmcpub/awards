import React, { useEffect, useState, useRef } from 'react';

interface FlyingTextProps {
  texts: string[];
  baseSize: number;
  fontFamily: string;
  isBold: boolean;
  speedMultiplier: number;
  maxCount: number;
  opacityMultiplier: number;
}

interface ActiveText {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
}

const FlyingTextManager: React.FC<FlyingTextProps> = ({ 
  texts, 
  baseSize, 
  fontFamily, 
  isBold,
  speedMultiplier, 
  maxCount, 
  opacityMultiplier 
}) => {
  const [renderTrigger, setRenderTrigger] = useState(0);
  const activeTextsRef = useRef<ActiveText[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const idCounter = useRef(0);
  const lastTimeRef = useRef<number>(0);
  const textBagRef = useRef<string[]>([]);
  const lastSpawnedTextRef = useRef<string>('');

  useEffect(() => {
    const validTexts = texts.filter(t => t.trim() !== '');
    if (validTexts.length === 0 || maxCount <= 0) {
      activeTextsRef.current = [];
      setRenderTrigger(v => v + 1);
      return;
    }

    textBagRef.current = [];

    const spawnText = (startX?: number, currentTexts: ActiveText[] = []): ActiveText => {
      if (textBagRef.current.length === 0) {
        const newBag = [...validTexts].sort(() => Math.random() - 0.5);
        if (newBag.length > 1 && lastSpawnedTextRef.current === newBag[newBag.length - 1]) {
          const temp = newBag[newBag.length - 1];
          newBag[newBag.length - 1] = newBag[0];
          newBag[0] = temp;
        }
        textBagRef.current = newBag;
      }
      const text = textBagRef.current.pop() || validTexts[0];
      lastSpawnedTextRef.current = text;

      const size = (Math.random() * 4 + 2) * baseSize; // 2 to 6 * baseSize relative to vw
      const speed = (Math.random() * 0.05 + 0.02) * speedMultiplier; // vw per frame (approx 60fps)
      const opacity = (Math.random() * 0.1 + 0.05) * opacityMultiplier; // 0.05 to 0.15 base
      const x = startX !== undefined ? startX : 100 + Math.random() * 20;

      let y = Math.random() * 80 + 10; // 10vh to 90vh
      let attempts = 0;
      while (attempts < 10) {
        // Check for overlap with existing texts
        const overlap = currentTexts.some(t => {
          const yDiff = Math.abs(t.y - y);
          // Estimate height in vh based on vw size (rough approximation)
          const isCloseY = yDiff < (size + t.size) * 0.8 + 5; 
          // Only care about overlap if they are both on the right side of the screen
          const isCloseX = Math.abs(t.x - x) < 40; 
          return isCloseY && isCloseX;
        });
        if (!overlap) break;
        y = Math.random() * 80 + 10;
        attempts++;
      }

      return {
        id: idCounter.current++,
        text,
        x,
        y,
        speed,
        size,
        opacity,
      };
    };

    const updateTexts = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;
      
      // Adjust speed based on delta time to ensure smooth movement regardless of framerate
      const timeScale = deltaTime / 16.66;

      let next = activeTextsRef.current;
      let needsRender = false;

      // Update positions
      for (let i = 0; i < next.length; i++) {
        next[i].x -= next[i].speed * timeScale;
      }

      // Remove off-screen
      const originalLength = next.length;
      next = next.filter((t) => t.x > -200);
      if (next.length !== originalLength) needsRender = true;

      // Ensure up to maxCount
      while (next.length < maxCount) {
        next.push(spawnText(undefined, next));
        needsRender = true;
      }
      
      // If maxCount was reduced, trim the array
      if (next.length > maxCount) {
        next = next.slice(0, maxCount);
        needsRender = true;
      }
      
      activeTextsRef.current = next;

      // Direct DOM update for positions to bypass React render cycle
      if (containerRef.current) {
        const children = containerRef.current.children;
        for (let i = 0; i < children.length; i++) {
          const child = children[i] as HTMLElement;
          const textData = next[i];
          if (textData) {
            child.style.transform = `translate3d(${textData.x}vw, -50%, 0)`;
          }
        }
      }

      if (needsRender) {
        setRenderTrigger(v => v + 1);
      }

      requestRef.current = requestAnimationFrame(updateTexts);
    };

    // Always respawn all texts when settings change
    const initial: ActiveText[] = [];
    for (let i = 0; i < maxCount; i++) {
      initial.push(spawnText(Math.random() * 100, initial));
    }
    activeTextsRef.current = initial;
    setRenderTrigger(v => v + 1);

    requestRef.current = requestAnimationFrame(updateTexts);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts.join('|'), baseSize, fontFamily, isBold, speedMultiplier, maxCount, opacityMultiplier]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {activeTextsRef.current.map((t) => (
        <div
          key={t.id}
          className="absolute whitespace-nowrap text-yellow-600 tracking-widest uppercase"
          style={{
            left: 0,
            top: `${t.y}vh`,
            fontSize: `${t.size}vw`,
            opacity: t.opacity,
            fontFamily: fontFamily,
            fontWeight: isBold ? 'bold' : 'normal',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
            transform: `translate3d(${t.x}vw, -50%, 0)`,
            willChange: 'transform',
          }}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
};

export default FlyingTextManager;
