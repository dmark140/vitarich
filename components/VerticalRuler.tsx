"use client"
import React, { useEffect, useRef, useState } from "react"

const ITEM_H = 40;

export function VerticalRuler({ label, min, max, value, onChange }: any) {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    const [visibleCount, setVisibleCount] = useState(5)
    // Center the initial value on mount
    useEffect(() => {
        if (!ref.current) return

        const index = value - min
        ref.current.scrollTop = index * ITEM_H
    }, [value, min])

    const handleScroll = () => {
        if (!ref.current || isDragging) return;
        const index = Math.round(ref.current.scrollTop / ITEM_H);
        if (numbers[index] !== value) onChange(numbers[index]);
    };

    const onPointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !ref.current) return;
        ref.current.scrollTop -= e.movementY; // Direct movement tracking for smoothness
    };

    const onPointerUp = () => {
        setIsDragging(false);
        // Snap to the closest number after drag ends
        if (ref.current) {
            const index = Math.round(ref.current.scrollTop / ITEM_H);
            ref.current.scrollTo({ top: index * ITEM_H, behavior: 'smooth' });
            onChange(numbers[index]);
        }
    };

    return (
        <div className="flex flex-col items-center select-none touch-none">
            <span className="text-[10px] font-bold uppercase text-gray-400 mb-2">{label}</span>
            {/* <div className="relative h-[200px] w-12 flex items-center justify-center"> */}
            <div
                className="relative w-12 flex items-center justify-center"
                style={{ height: ITEM_H * visibleCount }}
            >
                <div className="absolute inset-x-0 h-10 border-y border-gray-200 pointer-events-none" />

                <div
                    ref={ref}
                    onScroll={handleScroll}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    className={`h-full w-full overflow-y-auto scrollbar-hide ${isDragging ? '' : 'snap-y snap-mandatory'}`}
                    style={{ scrollbarWidth: 'none' }}
                >
                    <div className="h-20" /> {/* Top Spacer */}
                    {numbers.map((n) => (
                        <div key={n} className="h-10 flex items-center justify-center snap-center text-lg">
                            <span className={value === n ? "text-blue-600 font-bold" : "text-gray-300"}>{n}</span>
                        </div>
                    ))}
                    <div className="h-20" /> {/* Bottom Spacer */}
                </div>
            </div>
        </div>
    );
}