import { useEffect, useRef, useState } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialHeight?: number; // vh
  snapPoints?: number[]; // vh values
}

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  initialHeight = 85,
  snapPoints = [40, 85],
}: BottomSheetProps) => {
  const [height, setHeight] = useState(initialHeight);
  const startY = useRef<number | null>(null);
  const startHeight = useRef<number>(initialHeight);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setHeight(initialHeight);
  }, [isOpen, initialHeight]);

  const handleDragStart = (clientY: number) => {
    startY.current = clientY;
    startHeight.current = height;
  };

  const handleDragMove = (clientY: number) => {
    if (startY.current === null) return;

    const delta = startY.current - clientY;
    const newHeight = startHeight.current + (delta / window.innerHeight) * 100;

    const clamped = Math.min(95, Math.max(30, newHeight));
    setHeight(clamped);
  };

  const handleDragEnd = () => {
    if (height < 35) {
      onClose();
      return;
    }

    // Snap to nearest snap point
    const closestSnap = snapPoints.reduce((prev, curr) =>
      Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
    );

    setHeight(closestSnap);
    startY.current = null;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const onTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientY);

    const onEnd = () => handleDragEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative bg-white w-full rounded-t-2xl shadow-xl flex flex-col transition-all duration-200 ease-out"
        style={{ height: `${height}vh` }}
      >
        {/* Drag Handle */}
        <div
          className="flex items-center justify-center py-4 cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => handleDragStart(e.clientY)}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">{children}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
