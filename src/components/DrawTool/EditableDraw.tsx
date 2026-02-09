import { useEffect, useMemo, useRef } from "react";
import { useEditPdfStore } from "../../store/useEditPdfStore";

interface Props {
  imgRef: React.RefObject<HTMLImageElement | null>;
  pageIndex: number;
  color?: [number, number, number];
  width?: number;
}

const EditableDraw = ({
  imgRef,
  pageIndex,
  color = [0, 0, 0],
  width = 2,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const currentPathRef = useRef<{ x: number; y: number }[]>([]);

  const drawElements = useMemo(() => {
    return useEditPdfStore
      .getState()
      .drawElements.filter((d) => d.pageIndex === pageIndex);
  }, [pageIndex]);

  const addDraw = useEditPdfStore((state) => state.addDraw);

  // Draw all paths on canvas
  const redraw = () => {
    const canvas = canvasRef.current;

    const img = imgRef.current;
    if (!canvas || !img) return;

    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    canvas.style.width = `${img.clientWidth}px`;
    canvas.style.height = `${img.clientHeight}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";

    for (const draw of drawElements) {
      ctx.strokeStyle = `rgb(${draw.color[0]}, ${draw.color[1]}, ${draw.color[2]})`;
      ctx.lineWidth = draw.width;
      ctx.beginPath();
      draw.path.forEach((point, index) => {
        const px = point.x * canvas.width;
        const py = point.y * canvas.height;
        if (index === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
  };

  // Redraw whenever paths or page changes
  //dont want to remove first draw when goes to next page
  useEffect(() => {
    if (drawElements.length === 0) {
      addDraw(
        pageIndex,
        currentPathRef.current,
        [color[0], color[1], color[2]],
        width
      );
    }
  }, [drawElements, pageIndex]);

  useEffect(() => {
    redraw();
  }, [drawElements]);

  const getMousePos = (e: React.MouseEvent) => {
    if (!imgRef.current) return { x: 0, y: 0 };
    const rect = imgRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width, // ratio
      y: (e.clientY - rect.top) / rect.height, // ratio
    };
  };

  const start = (e: React.MouseEvent) => {
    drawingRef.current = true;
    currentPathRef.current = [getMousePos(e)];
  };

  const move = (e: React.MouseEvent) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pos = getMousePos(e);
    currentPathRef.current.push(pos);

    ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.lineWidth = width;

    const last = currentPathRef.current[currentPathRef.current.length - 2];
    if (!last) return;
    ctx.beginPath();
    ctx.moveTo(last.x * canvas.width, last.y * canvas.height);
    ctx.lineTo(pos.x * canvas.width, pos.y * canvas.height);
    ctx.stroke();
  };

  const stop = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    // Save path to store
    if (currentPathRef.current.length > 0) {
      addDraw(
        pageIndex,
        currentPathRef.current,
        [color[0], color[1], color[2]],
        width
      );
    }
    currentPathRef.current = [];
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 cursor-crosshair"
      onMouseDown={start}
      onMouseMove={move}
      onMouseUp={stop}
      onMouseLeave={stop}
    />
  );
};

export default EditableDraw;
