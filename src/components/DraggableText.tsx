import React, { useState, useRef, useEffect } from 'react';

interface DraggableTextProps {
  initialText: string;
  fontSize: number;
  fontFamily: string;
  isBold: boolean;
  initialPos: { x: number; y: number };
  onTextChange: (text: string) => void;
  className?: string;
}

const DraggableText: React.FC<DraggableTextProps> = ({
  initialText,
  fontSize,
  fontFamily,
  isBold,
  initialPos,
  onTextChange,
  className = '',
}) => {
  const [pos, setPos] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isEditing) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: pos.x,
      posY: pos.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    const vw = (dx / window.innerWidth) * 100;
    const vh = (dy / window.innerHeight) * 100;

    setPos({
      x: dragStart.current.posX + vw,
      y: dragStart.current.posY + vh,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const dx = Math.abs(e.clientX - dragStart.current.x);
    const dy = Math.abs(e.clientY - dragStart.current.y);
    if (dx < 5 && dy < 5) {
      setIsEditing(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onTextChange(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div
      className={`absolute cursor-move select-none z-20 hover:ring-2 hover:ring-yellow-500/30 rounded px-4 py-2 transition-shadow ${className}`}
      style={{
        left: `${pos.x}vw`,
        top: `${pos.y}vh`,
        transform: 'translate(-50%, -50%)',
        fontSize: `${fontSize}vw`,
        fontFamily: fontFamily,
        fontWeight: isBold ? 'bold' : 'normal',
        textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(255,215,0,0.6)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-b-2 border-yellow-500 outline-none text-center min-w-[20vw] select-auto"
          style={{ fontSize: 'inherit', color: 'inherit', fontFamily: 'inherit', fontWeight: 'inherit' }}
        />
      ) : (
        <div className="whitespace-nowrap">{text}</div>
      )}
    </div>
  );
};

export default DraggableText;
