import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

interface ConfettiAnimationProps {
  isActive?: boolean;
  pieceCount?: number;
}

export function ConfettiAnimation({ isActive = true, pieceCount = 50 }: ConfettiAnimationProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: pieceCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isActive, pieceCount]);

  if (!isActive || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" data-testid="confetti-container">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: -20,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: '110vh',
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'linear',
          }}
          className="absolute"
          style={{
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.id % 2 === 0 ? '#000' : '#666',
          }}
        />
      ))}
    </div>
  );
}
