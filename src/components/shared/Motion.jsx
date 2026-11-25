import { useRef } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useReducedMotion,
} from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

// Accent cycle for cards/blocks so repeated items don't all look identical.
export const ACCENTS = [
    { solid: "var(--color-blue-600)", soft: "var(--color-blue-100)" },
    { solid: "var(--color-cobalt)", soft: "var(--color-cobalt-soft)" },
    { solid: "var(--color-mustard)", soft: "var(--color-mustard-soft)" },
    { solid: "var(--color-moss)", soft: "var(--color-moss-soft)" },
    { solid: "var(--color-lilac)", soft: "var(--color-lilac-soft)" },
];
export const accentAt = (i) => ACCENTS[i % ACCENTS.length];

/* Word-by-word masked rise. `lines` = array of strings or {text, className}. */
export const SplitReveal = ({ lines, className = "", delay = 0, as: Tag = "h1" }) => {
    const reduce = useReducedMotion();
    let w = 0;
    return (
        <Tag className={className} aria-label={lines.map((l) => (typeof l === "string" ? l : l.text)).join(" ")}>
            {lines.map((line, li) => {
                const text = typeof line === "string" ? line : line.text;
                const cls = typeof line === "string" ? "" : line.className || "";
                return (
                    <span key={li} className={`block ${cls}`} aria-hidden="true">
                        {text.split(" ").map((word, wi) => {
                            const i = w++;
                            return (
                                <span key={wi} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
                                    <motion.span
                                        className="inline-block"
                                        initial={reduce ? false : { y: "110%", rotate: 6 }}
                                        animate={{ y: 0, rotate: 0 }}
                                        transition={{ duration: 0.8, delay: delay + i * 0.07, ease: EASE }}
                                    >
                                        {word}
                                    </motion.span>
                                    {wi < text.split(" ").length - 1 && " "}
                                </span>
                            );
                        })}
                    </span>
                );
            })}
        </Tag>
    );
};

/* Fade/rise when scrolled into view. */
export const Reveal = ({ children, delay = 0, y = 28, className = "", as = "div", ...rest }) => {
    const reduce = useReducedMotion();
    const M = motion[as];
    return (
        <M
            className={className}
            initial={reduce ? false : { opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay, ease: EASE }}
            {...rest}
        >
            {children}
        </M>
    );
};

/* Infinite ticker. Duplicates content so the -50% loop is seamless; pauses on hover. */
export const Marquee = ({ items, className = "", speed = 28, reverse = false, separator = "✦" }) => {
    const row = (
        <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
            {items.map((t, i) => (
                <li key={i} className="flex items-center gap-8 whitespace-nowrap">
                    <span>{t}</span>
                    <span className="opacity-60">{separator}</span>
                </li>
            ))}
        </ul>
    );
    return (
        <div className={`group overflow-hidden ${className}`} role="marquee" aria-label={items.join(", ")}>
            <div
                className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
                style={{ "--marquee-duration": `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
            >
                {row}
                {row}
            </div>
        </div>
    );
};

/* 3D tilt toward the pointer, with a moving glare. */
export const Tilt = ({ children, className = "", max = 10, style }) => {
    const reduce = useReducedMotion();
    const ref = useRef(null);
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 18 });
    const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 18 });
    const glare = useTransform([px, py], ([x, y]) =>
        `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.35), transparent 55%)`
    );

    const onMove = (e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
    };
    const reset = () => { px.set(0.5); py.set(0.5); };

    return (
        <div style={{ perspective: 1000 }}>
            <motion.div
                ref={ref}
                onMouseMove={onMove}
                onMouseLeave={reset}
                style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", ...style }}
                className={`relative ${className}`}
            >
                {children}
                {!reduce && (
                    <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glare }} />
                )}
            </motion.div>
        </div>
    );
};

/* Element drifts toward the cursor while hovered. */
export const Magnetic = ({ children, strength = 0.35, className = "" }) => {
    const reduce = useReducedMotion();
    const ref = useRef(null);
    const x = useSpring(0, { stiffness: 220, damping: 15 });
    const y = useSpring(0, { stiffness: 220, damping: 15 });
    const onMove = (e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
    };
    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ x, y }}
            className={`inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
};

/* Rotating circular text sticker (e.g. a discount badge). */
export const Sticker = ({ text, center, className = "", color = "var(--color-mustard)" }) => (
    <div className={`relative grid place-items-center ${className}`} aria-hidden="true">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow motion-reduce:animate-none">
            <defs>
                <path id="sticker-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
            </defs>
            <circle cx="50" cy="50" r="49" fill={color} stroke="var(--color-slate-900)" strokeWidth="1.5" />
            <text className="font-mono" fontSize="9.5" fontWeight="600" letterSpacing="2.4" fill="var(--color-slate-900)">
                <textPath href="#sticker-circle">{text}</textPath>
            </text>
        </svg>
        <span className="relative font-extrabold text-slate-900 leading-none text-center" style={{ fontStretch: "125%" }}>{center}</span>
    </div>
);
