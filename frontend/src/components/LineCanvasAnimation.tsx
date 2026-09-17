import React, { useEffect, useRef } from 'react';

interface LineCanvasAnimationProps {
  className?: string;
}

export const LineCanvasAnimation: React.FC<LineCanvasAnimationProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animFrameId: number;
    let progress = 0;
    const DURATION = 900;
    let startTime: number | null = null;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const draw = (p: number) => {
      ctx.clearRect(0, 0, width, height);

      // 6x broadness: 1 green, 1 black of equal height alternating
      // Stripe thickness ~20px green, ~20px black gap
      const stripeHeight = 20;
      const gapHeight = 20;
      const totalBlock = stripeHeight + gapHeight;
      const stripeCount = Math.floor(height / totalBlock) + 1;
      const rightStart = width * 0.38;

      for (let i = 0; i < stripeCount; i++) {
        const y = i * totalBlock + stripeHeight / 2;

        const fullLength = width * (0.45 + 0.35 * Math.sin((i / stripeCount) * Math.PI));
        const delay = (i / stripeCount) * 0.35;
        const localP = Math.max(0, Math.min(1, (p - delay) / (1 - delay)));
        const stripeLength = fullLength * easeOut(localP);

        const x1 = rightStart;
        const x2 = Math.min(width, rightStart + stripeLength);

        ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
        ctx.lineWidth = stripeHeight;
        ctx.lineCap = 'butt';
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      progress = Math.min(elapsed / DURATION, 1);
      draw(progress);
      if (progress < 1) {
        animFrameId = requestAnimationFrame(animate);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};
