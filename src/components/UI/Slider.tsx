
"use client";

import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SliderProps {
    value: number[];
    onValueChange: (value: number[]) => void;
    min: number;
    max: number;
    step?: number;
    className?: string;
}

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    SliderProps
>(({ className, value, onValueChange, min, max, step = 1, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex w-full select-none items-center",
            className
        )}
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        {...props}
    >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary/20 bg-gray-200 dark:bg-gray-700">
            <SliderPrimitive.Range className="absolute h-full bg-primary bg-blue-600 dark:bg-blue-500" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-blue-600 bg-white hover:bg-gray-50 focus:ring-blue-400 dark:border-blue-500 dark:bg-gray-950" />
    </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
