import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioContext: AudioContext;
  analyzerNode: AnalyserNode;
  color?: string;
  height?: number;
}

export function AudioVisualizer({ 
  audioContext, 
  analyzerNode,
  color = 'rgba(168, 85, 247, 0.4)',
  height = 180
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Reduce the number of bars by sampling fewer frequency bins
    analyzerNode.fftSize = 512; // This will give us 256 data points
    const bufferLength = analyzerNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      analyzerNode.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, width, height);
      
      // Increase bar width and add more spacing
      const barWidth = (width / bufferLength) * 6;
      let barHeight;
      let x = width / 2;
      
      // Set up glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      
      // Draw from center, making the visualization taller
      for (let i = 0; i < bufferLength; i += 2) { // Skip every other data point
        barHeight = (dataArray[i] / 255) * height * 0.9;
        
        // Create gradient using theme color
        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color.replace(/[\d.]+\)$/, '0.2)'));
        
        ctx.fillStyle = gradient;
        
        // Adjust glow intensity based on bar height
        ctx.shadowBlur = Math.min(25, (barHeight / height) * 30);
        
        // Draw mirrored bars with increased spacing
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        ctx.fillRect(width - x - barWidth, height - barHeight, barWidth, barHeight);
        
        x += barWidth + 4; // Increased spacing between bars
      }
      
      // Reset shadow effect
      ctx.shadowBlur = 0;
      
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyzerNode, audioContext, color, height]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed bottom-0 left-0 w-full pointer-events-none"
      style={{ 
        height: `${height}px`,
        zIndex: 10
      }}
    />
  );
}