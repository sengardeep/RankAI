import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function Pricing() {
    return (
        <section className="relative md:min-h-screen flex flex-col justify-center items-center max-lg:py-24">
            <div className="bg-dot-pattern absolute inset-0 -z-1 opacity-10"></div>
            <div className="max-w-5xl w-full mx-auto px-4 ">
                <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-foreground">
                        Simple <span className="gradient-text">Pricing</span>
                    </h2>
                    <p className="text-muted-foreground">Start free. Upgrade when you need more.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Free */}
                    <div className="bg-card border border-border rounded-2xl p-8 flex flex-col">
                        <h3 className="text-xl font-semibold mb-1 text-foreground">Free</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-foreground">$0</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {["5 analyses per day", "Full SEO report", "Keyword analysis", "Issue detection", "Export results"].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle size={16} className="text-accent shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link to="/register" className="block w-full py-3 rounded-xl bg-accent-soft text-accent text-center text-sm font-medium hover:opacity-90 transition-colors">
                            Get Started Free
                        </Link>
                    </div>

                    {/* Pro */}
                    <div className="relative rounded-2xl p-8 flex flex-col bg-card border border-accent/30 overflow-hidden">
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full cta-gradient text-xs font-medium">
                            Popular
                        </div>
                        <h3 className="text-xl font-semibold mb-1 text-foreground">Pro</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-accent">$19</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            {["Unlimited analyses", "Priority processing", "Competitor analysis", "Historical tracking", "API access", "Email reports"].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle size={16} className="text-accent shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-xl cta-gradient text-center text-sm font-medium">
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
