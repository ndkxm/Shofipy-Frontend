import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Header } from "../shared/Header";
import { Footer } from "../shared/Footer";
import { Reveal, SplitReveal, Marquee, accentAt } from "../shared/Motion";

const PRINCIPLES = [
    {
        n: "01",
        title: "Keys, not boxes",
        body: "Everything we sell is digital. No shipping, no waiting room — the code is yours the moment payment clears.",
    },
    {
        n: "02",
        title: "Fair, visible prices",
        body: "Original price, discount and what you pay sit side by side. No surprise fees at checkout.",
    },
    {
        n: "03",
        title: "A library you keep",
        body: "Every purchase is stored in My Orders. Reveal a key when you’re ready to redeem it, not before.",
    },
];

export const About = () => (
    <div className="bg-slate-50 min-h-screen">
        <Header />

        <main className="pt-16">
            <section className="border-b border-slate-900">
                <div className="max-w-7xl mx-auto px-5 md:px-6 pt-16 pb-14 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-end">
                    <div>
                        <p className="label-mono text-slate-500 mb-5">About Shofipy</p>
<SplitReveal
                            lines={["A small shop", "for people", { text: "who play.", className: "text-blue-600" }]}
                            className="display text-6xl sm:text-7xl lg:text-8xl text-slate-900"
                        />
                    </div>
                    <p className="text-lg leading-relaxed text-slate-600 max-w-md">
                        Shofipy started as a simple idea: buying a game key should take less time than the download.
                        We keep the catalogue tidy, the prices honest and the checkout short.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-5 md:px-6 py-20">
                <h2 className="label-mono text-slate-500 mb-8">What we stick to</h2>
                <ol className="border-t border-slate-900">
                    {PRINCIPLES.map((p, i) => (
                        <Reveal as="li" key={p.n} delay={i * 0.1} className="group relative grid md:grid-cols-[6rem_1fr_1.3fr] gap-3 md:gap-8 py-8 border-b border-slate-300">
                            <span aria-hidden="true" className="absolute inset-0 -z-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" style={{ background: accentAt(i + 2).soft }} />
                            <span className="relative grid place-items-center w-12 h-12 rounded-full border border-slate-900 font-mono text-sm text-slate-900 transition-transform duration-500 group-hover:rotate-[360deg]" style={{ background: accentAt(i + 2).solid }}>{p.n}</span>
                            <h3 className="relative text-3xl md:text-4xl font-extrabold text-slate-900 transition-transform duration-300 group-hover:translate-x-2">{p.title}</h3>
                            <p className="relative text-slate-700 leading-relaxed md:pt-2 max-w-prose">{p.body}</p>
                        </Reveal>
                    ))}
                </ol>
            </section>

            <Marquee items={["Keys, not boxes", "Fair prices", "A library you keep", "Made for players"]} speed={30} className="mb-20 -rotate-1 border-y border-slate-900 py-3 display text-3xl md:text-4xl" />
            <section className="max-w-7xl mx-auto px-5 md:px-6">
                <div className="rounded-lg border border-slate-900 bg-slate-900 text-slate-50 px-6 md:px-12 py-14 grid md:grid-cols-[1fr_auto] items-end gap-8">
                    <div>
                        <p className="label-mono text-slate-400 mb-4">Questions first?</p>
                        <h2 className="display text-5xl md:text-6xl">We read<br />every message.</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/contact" className="inline-flex items-center gap-2 bg-slate-50 text-slate-900 rounded-md px-5 py-3 font-bold hover:bg-blue-600 hover:text-white transition-colors">
                            Contact us
                        </Link>
                        <Link to="/products" className="inline-flex items-center gap-2 border border-slate-50 rounded-md px-5 py-3 font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors">
                            Browse games <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>

        <Footer />
    </div>
);
