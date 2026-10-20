"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The kiosk screen's stage. Like the deck's 1920 by 1080 stage, sizes in the kiosk
 * screens are real pixels on a fixed canvas that scales to fit: at least 1400 by 1024
 * in landscape and 1024 by 1400 in portrait. The canvas stretches along whichever side
 * has room to spare, so it fills any iPad without bars.
 */

export type Orientation = "landscape" | "portrait";

const SHORT_SIDE = 1024;
const LONG_SIDE = 1400;

const OrientationContext = createContext<Orientation>("landscape");
export const useOrientation = () => useContext(OrientationContext);

type Box = { width: number; height: number };

function useBoxSize(): [React.RefObject<HTMLDivElement | null>, Box | null] {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setBox({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, box];
}

function fit(box: Box) {
  const orientation: Orientation = box.width >= box.height ? "landscape" : "portrait";
  const [minWidth, minHeight] = orientation === "landscape" ? [LONG_SIDE, SHORT_SIDE] : [SHORT_SIDE, LONG_SIDE];
  const scale = Math.min(box.width / minWidth, box.height / minHeight);
  return { orientation, scale, width: box.width / scale, height: box.height / scale };
}

export function KioskCanvas({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [ref, box] = useBoxSize();
  const layout = box ? fit(box) : null;
  return (
    <div ref={ref} className={`relative h-full w-full overflow-hidden bg-paper ${className}`}>
      {layout ? (
        <OrientationContext.Provider value={layout.orientation}>
          <div
            className="absolute left-0 top-0"
            data-orientation={layout.orientation}
            style={{ width: layout.width, height: layout.height, transform: `scale(${layout.scale})`, transformOrigin: "0 0" }}
          >
            {children}
          </div>
        </OrientationContext.Provider>
      ) : null}
    </div>
  );
}
