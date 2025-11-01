import React, { useRef, useState, useEffect, useCallback } from "react";

export interface VerticalSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number; // controlled value
  defaultValue?: number; // uncontrolled
  onChange?: (v: number) => void;
  height?: number | string; // px or any css value
  trackClassName?: string;
  thumbClassName?: string;
  showValue?: boolean;
  ariaLabel?: string;
}

export default function VerticalSlider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue,
  onChange,
  height = 240,
  trackClassName = "w-4 rounded-full bg-gray-200/60",
  thumbClassName = "w-6 h-6 rounded-full shadow-md bg-white border",
  showValue = true,
  ariaLabel = "Vertical slider",
}: VerticalSliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [internalValue, setInternalValue] = useState<number>(
    controlledValue ?? defaultValue ?? min
  );

  // derive whether controlled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? (controlledValue as number) : internalValue;

  // clamp utility
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  // convert value -> position (px from top)
  const valueToPercent = (v: number) => ((v - min) / (max - min)) * 100;
  const percentToValue = (p: number) => {
    const raw = min + ((max - min) * p) / 100;
    // snap to step
    const stepped = Math.round(raw / step) * step;
    return clamp(stepped);
  };

  const setValue = (v: number) => {
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  };

  // pointer handling
  const handlePointer = useCallback((clientY: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    // position from top -> percent (0% = top -> max value)
    const offset = clientY - rect.top;
    const percentFromTop = (offset / rect.height) * 100;
    // convert so that top = max and bottom = min (invert)
    const percent = 100 - percentFromTop;
    const v = percentToValue(percent);
    setValue(v);
  }, [percentToValue, setValue]);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      e.preventDefault();
      handlePointer(e.clientY);
    };
    const onPointerUp = () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, [handlePointer]);

  const onTrackPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    handlePointer(e.clientY);

    const onPointerMove = (evt: PointerEvent) => {
      evt.preventDefault();
      handlePointer(evt.clientY);
    };
    const onPointerUp = (evt: PointerEvent) => {
      evt.preventDefault();
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const onThumbPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);

    const onPointerMove = (evt: PointerEvent) => {
      evt.preventDefault();
      handlePointer(evt.clientY);
    };
    const onPointerUp = (evt: PointerEvent) => {
      evt.preventDefault();
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  // keyboard accessibility
  const onKeyDown = (e: React.KeyboardEvent) => {
    let stepCount = 1;
    if (e.key === "PageUp") stepCount = 10;
    if (e.key === "PageDown") stepCount = 10;

    if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      setValue(clamp(value + step * stepCount));
    } else if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      setValue(clamp(value - step * stepCount));
    } else if (e.key === "Home") {
      e.preventDefault();
      setValue(min);
    } else if (e.key === "End") {
      e.preventDefault();
      setValue(max);
    }
  };

  const percent = valueToPercent(value);
  const thumbStyle: React.CSSProperties = {
    // position thumb center horizontally, position from top inverted
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, -50%)",
    top: `${100 - percent}%`,
  };

  const wrapperStyle: React.CSSProperties = {
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div className="flex items-center gap-3" style={wrapperStyle}>
      <div
        ref={trackRef}
        role="slider"
        aria-orientation="vertical"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onTrackPointerDown}
        className={`relative flex items-center justify-center ${trackClassName}`}
        style={{ height: wrapperStyle.height }}
      >
        {/* Fill (from bottom to current value) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${percent}%`,
            borderRadius: "inherit",
            background: "linear-gradient(180deg, rgba(99,102,241,0.25), rgba(99,102,241,0.45))",
          }}
        />

        {/* Thumb */}
        <div
          onPointerDown={onThumbPointerDown}
          className={"relative z-10 " + thumbClassName}
          style={thumbStyle}
        />
      </div>

      {showValue && (
        <div className="select-none text-sm min-w-[40px] text-right">{value}</div>
      )}
    </div>
  );
}
