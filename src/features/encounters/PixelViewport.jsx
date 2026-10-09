import { useLayoutEffect, useRef, useState } from "react";

export function PixelViewport({ width, height, children, className = "" }) {
  const host = useRef(null);
  const [size, setSize] = useState(width);
  useLayoutEffect(() => {
    const fit = () => {
      const box = host.current;
      if (!box) return;
      const ratio = Math.min(
        (box.clientWidth - 8) / width,
        (box.clientHeight - 8) / height,
        3,
      );
      setSize(Math.max(48, Math.floor(width * Math.max(0, ratio))));
    };
    const observer = new ResizeObserver(fit);
    observer.observe(host.current);
    fit();
    return () => observer.disconnect();
  }, [width, height]);
  return (
    <div
      ref={host}
      className={`pixel-viewport ${className}`}
      style={{ "--pixel-width": `${size}px` }}
    >
      {children}
    </div>
  );
}
