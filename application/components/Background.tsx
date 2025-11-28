"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Background() {
    const [mounted, setMounted] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({
                x: event.clientX,
                y: event.clientY,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const calculateTransform = (factor: number) => {
        if (!mounted) return "translate(0px, 0px)";
        const x = (mousePosition.x - window.innerWidth / 2) * factor;
        const y = (mousePosition.y - window.innerHeight / 2) * factor;
        return `translate(${x}px, ${y}px)`;
    };

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#252525]">
            {/* Dot Pattern */}
            <div
                className="absolute -inset-[10%]"
                style={{
                    backgroundImage:
                        "radial-gradient(#505050 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                    transform: calculateTransform(-0.005),
                }}
            />

            {/* Floating Images */}
            <div
                className="absolute top-[15%] right-[15%] opacity-60 rounded-2xl overflow-hidden"
                style={{ transform: calculateTransform(-0.05) }}
            >
                <Image
                    src="/bed.png"
                    alt="Bed"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-20 md:w-32 lg:w-48 h-auto"
                />
            </div>
            <div
                className="absolute bottom-[50%] left-[25%] opacity-60 rounded-2xl overflow-hidden"
                style={{ transform: calculateTransform(-0.04) }}
            >
                <Image
                    src="/candle_light.png"
                    alt="Candle Light"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-48 md:w-80 lg:w-96 h-auto"
                />
            </div>
            <div
                className="absolute bottom-[20%] left-[10%] opacity-60 rounded-2xl overflow-hidden"
                style={{ transform: calculateTransform(-0.03) }}
            >
                <Image
                    src="/couch.png"
                    alt="Couch"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-24 md:w-40 lg:w-60 h-auto"
                />
            </div>
            <div
                className="absolute bottom-[30%] left-[80%] opacity-60 rounded-2xl overflow-hidden"
                style={{ transform: calculateTransform(-0.03) }}
            >
                <Image
                    src="/fabric.png"
                    alt="Fabric"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-20 md:w-32 lg:w-48 h-auto"
                />
            </div>
            <div
                className="absolute top-[70%] right-[30%] opacity-60 rounded-2xl overflow-hidden"
                style={{ transform: calculateTransform(-0.06) }}
            >
                <Image
                    src="/interior_couch.png"
                    alt="Interior Couch"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-24 md:w-40 lg:w-60 h-auto"
                />
            </div>
            <div
                className="absolute top-[20%] left-[5%] opacity-60 rounded-2xl overflow-hidden"
                style={{ transform: calculateTransform(-0.02) }}
            >
                <Image
                    src="/winter_fluff.png"
                    alt="Winter Fluff"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-24 md:w-40 lg:w-60 h-auto"
                />
            </div>
        </div>
    );
}
