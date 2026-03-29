import React, { useEffect, useRef } from 'react';

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
  element?: HTMLDivElement;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const idCounter = useRef(0);
  const lastTimeRef = useRef<number>(0);
  const textBagRef = useRef<string[]>([]);
  const lastSpawnedTextRef = useRef<string>('');
  const activeTextsRef = useRef<ActiveText[]>([]);

  useEffect(() => {
    const validTexts = texts.filter(t => t.trim() !== '');
    if (validTexts.length === 0 || maxCount <= 0) {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      activeTextsRef.current = [];
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

      const id = idCounter.current++;
      
      // Create DOM element
      const el = document.createElement('div');
      el.className = "absolute whitespace-nowrap text-yellow-600 tracking-widest uppercase";
      el.style.fontSize = `${size}vw`;
      el.style.opacity = `${opacity}`;
      el.style.fontFamily = fontFamily;
      el.style.fontWeight = isBold ? 'bold' : 'normal';
      el.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.3)';
      // Use will-change for performance
      el.style.willChange = 'transform';
      el.innerText = text;
      
      if (containerRef.current) {
        containerRef.current.appendChild(el);
      }

      return {
        id,
        text,
        x,
        y,
        speed,
        size,
        opacity,
        element: el
      };
    };

    const updateTexts = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;
      
      // Adjust speed based on delta time to ensure smooth movement regardless of framerate
      const timeScale = deltaTime / 16.66;

      let currentTexts = activeTextsRef.current;
      const nextTexts: ActiveText[] = [];

      for (let i = 0; i < currentTexts.length; i++) {
        const t = currentTexts[i];
        t.x -= t.speed * timeScale;
        
        if (t.x > -200) {
          if (t.element) {
            // Use translate3d for hardware acceleration
            t.element.style.transform = `translate3d(${t.x}vw, ${t.y}vh, 0) translateY(-50%)`;
          }
          nextTexts.push(t);
        } else {
          // Remove element from DOM
          if (t.element && t.element.parentNode) {
            t.element.parentNode.removeChild(t.element);
          }
        }
      }

      // Ensure up to maxCount
      while (nextTexts.length < maxCount) {
        nextTexts.push(spawnText(undefined, nextTexts));
      }
      
      // If maxCount was reduced, trim the array
      while (nextTexts.length > maxCount) {
        const t = nextTexts.pop();
        if (t && t.element && t.element.parentNode) {
          t.element.parentNode.removeChild(t.element);
        }
      }
      
      activeTextsRef.current = nextTexts;
      requestRef.current = requestAnimationFrame(updateTexts);
    };

    // Clear existing elements
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Always respawn all texts when settings change
    const initial: ActiveText[] = [];
    for (let i = 0; i < maxCount; i++) {
      initial.push(spawnText(Math.random() * 100, initial));
    }
    
    // Initial position set
    initial.forEach(t => {
      if (t.element) {
        t.element.style.transform = `translate3d(${t.x}vw, ${t.y}vh, 0) translateY(-50%)`;
      }
    });
    
    activeTextsRef.current = initial;

    requestRef.current = requestAnimationFrame(updateTexts);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      // Cleanup DOM
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts.join('|'), baseSize, fontFamily, isBold, speedMultiplier, maxCount, opacityMultiplier]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10 overflow-hidden" />
  );
};

export default FlyingTextManager;

