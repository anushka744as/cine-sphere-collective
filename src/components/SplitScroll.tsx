
import React, { useRef } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Assuming button exists, purely for demo content
import { ArrowRight } from 'lucide-react';

interface SplitScrollProps {
    leftContent: React.ReactNode[];
    rightContent: React.ReactNode[];
    className?: string;
}

export const SplitScroll: React.FC<SplitScrollProps> = ({
    leftContent,
    rightContent,
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    // Calculate the height of the scroll content to determine translation
    // If we have N items, and each is 100vh by default for this effect, 
    // we want to translate such that they slide past each other.

    // Strategy:
    // The container will be of height (N * 100vh).
    // The viewport is sticky 100vh.
    // Left side: Starts at 0, translates to -((N-1) * 100vh) over scroll.
    // Right side: Starts at -((N-1) * 100vh), translates to 0 over scroll.

    const n = leftContent.length; // Assuming balanced length for now

    // We need to shift by (n-1) viewports
    // Since we are using percentages in translate, 
    // we want to move from 0% to -(100 * (n-1))% for left
    // and from -(100 * (n-1))% to 0% for right

    // Wait, framer motion y values are usually pixels or strings.
    // Let's use % strings.

    const finalY = -100 * (n - 1);

    const leftY = useTransform(scrollYProgress, [0, 1], ['0%', `${finalY}%`]);
    const rightY = useTransform(scrollYProgress, [0, 1], [`${finalY}%`, '0%']);

    return (
        <div
            ref={containerRef}
            className={cn("relative z-10", className)}
            style={{ height: `${n * 100}vh` }}
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex">
                {/* Left Side - Text */}
                <div className="w-1/2 h-full bg-background relative overflow-hidden flex items-center justify-center border-r border-border/20">
                    <motion.div
                        style={{ y: leftY }}
                        className="w-full h-full"
                    >
                        {leftContent.map((content, i) => (
                            <div key={i} className="h-screen w-full flex flex-col justify-center px-12 md:px-24">
                                {content}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Right Side - Images/Visuals */}
                <div className="w-1/2 h-full bg-muted/20 relative overflow-hidden flex items-center justify-center">
                    <motion.div
                        style={{ y: rightY }}
                        className="w-full h-full flex flex-col"
                    >
                        {rightContent.map((content, i) => (
                            <div key={i} className="h-screen w-full flex items-center justify-center p-0 overflow-hidden">
                                {content}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// Example Usage Component wrapper to easily drop into App
export const SplitScrollDemo = () => {
    const items = [
        {
            title: "Vogue Beyond Paris",
            subtitle: "EXPLORE THE UNSEEN",
            desc: "Discover the hidden gems of fashion that exist beyond the traditional capitals.",
            img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2788&auto=format&fit=crop",
            color: "text-rose-500"
        },
        {
            title: "Versace Fragrance",
            subtitle: "SCENT OF LUXURY",
            desc: "An olfactory journey through the essence of Italian elegance and boldness.",
            img: "https://images.unsplash.com/photo-1615887023516-9b6c50058b88?q=80&w=2693&auto=format&fit=crop",
            color: "text-amber-500"
        },
        {
            title: "Hermès Ski",
            subtitle: "WINTER ELEGANCE",
            desc: "Where performance meets unparalleled craftsmanship on the slopes.",
            img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2787&auto=format&fit=crop",
            color: "text-sky-500"
        },
        {
            title: "Dior Rouge",
            subtitle: "ICONIC RED",
            desc: "The definition of classic beauty, reinvented for the modern era.",
            img: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2787&auto=format&fit=crop",
            color: "text-red-600"
        },
        {
            title: "Louis Vuitton Cruise",
            subtitle: "VOYAGE COLLECTION",
            desc: "Setting sail towards new horizons with a collection inspired by the sea.",
            img: "https://images.unsplash.com/photo-1548625361-9872e45da798?q=80&w=2942&auto=format&fit=crop",
            color: "text-blue-700"
        }
    ];

    const leftItems = items.map((item, i) => (
        <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-4 text-sm font-medium tracking-widest text-muted-foreground uppercase">
                <span>0{i + 1}</span>
                <span className="w-12 h-[1px] bg-border"></span>
                <span>{item.subtitle}</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-medium tracking-tight leading-[0.9] text-foreground">
                {item.title.split(' ').map((word, wI) => (
                    <span key={wI} className="block">{word}</span>
                ))}
            </h2>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                {item.desc}
            </p>
            <div className="pt-4">
                <Button variant="outline" className="rounded-full px-6 group hover:bg-foreground hover:text-background transition-all duration-300">
                    Discover More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    ));

    const rightItems = items.map((item, i) => (
        <div className="w-full h-full relative group overflow-hidden">

            <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
        </div>
    ));

    return (
        <div className="bg-background">
            <div className="h-[50vh] flex items-center justify-center border-b border-border">
                <h1 className="text-4xl font-light tracking-widest uppercase">Scroll Down</h1>
            </div>

            <SplitScroll leftContent={leftItems} rightContent={rightItems} />

            <div className="h-[50vh] flex items-center justify-center border-t border-border">
                <h1 className="text-4xl font-light tracking-widest uppercase">Fin.</h1>
            </div>
        </div>
    );
}
