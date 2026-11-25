import { Header } from "../shared/Header";
import { Footer } from "../shared/Footer";
import { Reveal, SplitReveal, Marquee, accentAt } from "../shared/Motion";

// ── Icons ──────────────────────────────────────────────────────────────────────

const MapIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);

const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);

const SendIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

// ── Contact info items ─────────────────────────────────────────────────────────

const INFO = [
    { icon: <MapIcon />, label: "Location", value: "Phu Yen, Vietnam" },
    { icon: <PhoneIcon />, label: "Phone", value: "+84 123 456 789" },
    { icon: <MailIcon />, label: "Email", value: "support@shofipy.com" },
];

// ── Field component ────────────────────────────────────────────────────────────

const Field = ({ label, id, children }) => (
    <div>
        <label htmlFor={id} className="block label-mono text-slate-600 mb-2">
            {label}
        </label>
        {children}
    </div>
);

const inputCls = "w-full h-12 border border-slate-900 rounded-md px-3.5 text-[15px] text-slate-900 placeholder-slate-400 outline-none bg-white focus:ring-2 focus:ring-blue-600 focus:ring-offset-1";

// ── Main ───────────────────────────────────────────────────────────────────────

export const Contact = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <Header />

            <main className="pt-16">
                <section className="border-b border-slate-900">
                    <div className="max-w-7xl mx-auto px-5 md:px-6 pt-16 pb-12">
                        <p className="label-mono text-slate-500 mb-5">Support</p>
                        <SplitReveal lines={["Talk to us."]} className="display text-6xl sm:text-7xl lg:text-8xl text-slate-900" />
                        <p className="mt-6 max-w-lg text-lg text-slate-600 leading-relaxed">
                            Key not working, payment stuck, or just a question? Send it over — we usually reply within a day.
                        </p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-5 md:px-6 py-16 grid lg:grid-cols-[1fr_1.4fr] gap-12">
                    <div>
                        <h2 className="label-mono text-slate-500 mb-5">Direct lines</h2>
                        <dl className="border-t border-slate-900">
                            {INFO.map((item) => (
                                <div key={item.label} className="flex items-start gap-4 py-5 border-b border-slate-300">
                                    <span className="grid place-items-center w-9 h-9 rounded-md border border-slate-900 text-slate-900 transition-transform duration-300 hover:rotate-12" style={{ background: accentAt(INFO.indexOf(item) + 1).soft }} aria-hidden="true">{item.icon}</span>
                                    <div>
                                        <dt className="label-mono text-slate-500 mb-1">{item.label}</dt>
                                        <dd className="text-lg font-semibold text-slate-900">{item.value}</dd>
                                    </div>
                                </div>
                            ))}
                        </dl>
                        <p className="mt-6 text-sm text-slate-600 leading-relaxed">
                            For order issues, include your order number from <span className="font-semibold text-slate-900">My Orders</span> so we can find it fast.
                        </p>
                    </div>

                    <Reveal className="bg-white rounded-lg border border-slate-900 p-6 md:p-8" style={{ boxShadow: "8px 8px 0 0 var(--color-cobalt)" }}>
                        <h2 className="text-3xl font-extrabold text-slate-900">Send a message</h2>
                        <p className="mt-1 mb-8 text-slate-500">All fields are required.</p>

                        <form className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <Field label="Your name" id="c-name">
                                    <input id="c-name" type="text" autoComplete="name" placeholder="Jane Doe" className={inputCls} />
                                </Field>
                                <Field label="Email" id="c-email">
                                    <input id="c-email" type="email" autoComplete="email" placeholder="jane@example.com" className={inputCls} />
                                </Field>
                            </div>
                            <Field label="Subject" id="c-subject">
                                <input id="c-subject" type="text" placeholder="Order #1042 — key already used" className={inputCls} />
                            </Field>
                            <Field label="Message" id="c-message">
                                <textarea id="c-message" rows={6} placeholder="Tell us what happened…" className={`${inputCls} h-auto py-3 resize-y`} />
                            </Field>
                            <button type="submit" className="btn-accent !px-7 !py-3.5 text-[15px]">
                                <SendIcon /> Send message
                            </button>
                        </form>
                    </Reveal>
                </section>
            </main>

            <Footer />
        </div>
    );
};
