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

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let t = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Number of oscillating ribbon lines
    const lineCount = 12;

    const render = () => {
      t += 0.008;
      ctx.clearRect(0, 0, width, height);

      // 1. Perspective Background Technical Grid Lines (Pleasant, dark, muted)
      ctx.lineWidth = 1;
      const gridStep = 48;
      const gridOffset = (t * 12) % gridStep;

      // Vertical grid lines
      ctx.strokeStyle = 'rgba(11, 40, 24, 0.35)';
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal subtle moving grid lines
      ctx.strokeStyle = 'rgba(11, 40, 24, 0.25)';
      for (let y = gridOffset; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Multi-layered oscillating dark-green & black wave lines
      // Carefully tuned line styles: NO glow, NO bloom, strictly muted emerald & dark forest tones
      const step = 6;
      for (let i = 0; i < lineCount; i++) {
        const progress = i / lineCount;
        const baseY = height * 0.45 + (i - lineCount / 2) * 22;

        // Gradient line tones between dark forest obsidian and calm technical green
        const alpha = 0.12 + Math.sin(t + i) * 0.05 + progress * 0.15;
        const greenTone = Math.floor(130 + progress * 70);
        ctx.strokeStyle = `rgba(0, ${greenTone}, ${Math.floor(greenTone * 0.65)}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = i % 3 === 0 ? 1.5 : 1;

        ctx.beginPath();
        for (let x = 0; x <= width; x += step) {
          // Combination of 3 harmonized sinusoids creates fluid, organic motion
          const wave1 = Math.sin(x * 0.004 + t * 1.2 + i * 0.35) * 45;
          const wave2 = Math.cos(x * 0.008 - t * 0.8 + i * 0.2) * 24;
          const wave3 = Math.sin((x + i * 50) * 0.002 + t * 0.5) * 15;
          const y = baseY + wave1 + wave2 + wave3;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // 3. Diagonal intersection scan lines (subtle tech telemetry aesthetic)
      ctx.strokeStyle = 'rgba(0, 208, 132, 0.06)';
      ctx.lineWidth = 1;
      const diagCount = 6;
      for (let d = 0; d < diagCount; d++) {
        const diagX = ((d * (width / diagCount) + t * 25) % (width * 1.5)) - width * 0.25;
        ctx.beginPath();
        ctx.moveTo(diagX, 0);
        ctx.lineTo(diagX + height * 0.8, height);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity: 0.95 }}
    />
  );
};
