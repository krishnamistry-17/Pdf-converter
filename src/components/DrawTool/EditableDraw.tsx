import { useEffect, useRef } from "react";

interface Props {
  imgRef: React.RefObject<HTMLImageElement | null>;
}

const EditableDraw = ({ imgRef }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  console.log(drawing);
  useEffect(() => {
    if (!imgRef.current || !canvasRef.current) return;

    const img = imgRef.current;
    const canvas = canvasRef.current;

    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;

    canvas.style.width = `${img.clientWidth}px`;
    canvas.style.height = `${img.clientHeight}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
  }, []);

  const start = (e: React.MouseEvent) => {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const rect = canvasRef.current!.getBoundingClientRect();

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  // const startPath = (x: number, y: number) => {
  //   setCurrentPath([{ x, y }]);
  // };

  // const endPath = () => {
  //   addDraw(pageIndex, currentPath, color, width);
  // };

  const move = (e: React.MouseEvent) => {
    if (!drawing.current) return;

    const ctx = canvasRef.current!.getContext("2d")!;
    const rect = canvasRef.current!.getBoundingClientRect();

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stop = () => {
    drawing.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-2 cursor-crosshair"
      onMouseDown={start}
      onMouseMove={move}
      onMouseUp={stop}
      onMouseLeave={stop}
    />
  );
};

export default EditableDraw;
