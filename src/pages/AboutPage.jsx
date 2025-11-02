import {Star, Zap, Heart, Rocket} from "lucide-react";
import {NavLink} from "react-router-dom";
import {useEffect, useRef} from "react";

function AboutPage() {
    const features = [
        {icon: Zap, title: "Quality Prints", desc: "We print what we'd be proud to own"},
        {icon: Heart, title: "Made With Care", desc: "Every order matters to us"},
        {icon: Star, title: "Custom Requests Welcome", desc: "Just ask—we'll figure it out"},
        {icon: Rocket, title: "Growing Every Day", desc: "Your support helps us expand"},
    ];

    const coming = [
        {title: "New Product Types", desc: "Expanding beyond our current lineup into new categories you've been asking for"},
        {title: "Faster Turnaround", desc: "Adding more printers so we can ship your orders even quicker"},
        {title: "Advent Specials", desc: "Special advent collections for christmas, holidays, and seasonal moments"},
    ];

    const containerRef = useRef(null);

    useEffect(() => {
        const elements = containerRef.current?.querySelectorAll("[data-animate]");

        const handleScroll = () => {
            elements?.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;

                if (isVisible) {
                    el.classList.add("fade-in");
                } else {
                    el.classList.remove("fade-in");
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-black/20 text-white overflow-x-hidden" ref={containerRef}>
            <style>{`
                [data-animate] {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.8s ease-out;
                }
                
                [data-animate].fade-in {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>

            {/* Hero */}
            <section className="pt-30 pb-20 px-4 md:px-8 text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-6" data-animate>
                    Hey, welcome.
                    <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent block">I'm MakeThePrint.</span>
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-20" data-animate>
                    My dad and I started this because we love beautiful prints. Now we're here to share that with you.
                </p>
                <NavLink
                    to="../products"
                    className="px-6 md:px-10 py-3 md:py-4 text-sm md:text-base bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold rounded-full shadow-lg transition-all transform hover:scale-105 inline-block"
                    data-animate
                >
                    Explore Our Products
                </NavLink>
            </section>

            {/* Story */}
            <section className="px-4 md:px-8 max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-8 text-center" data-animate>Our Story</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6" data-animate>
                    Honestly? My dad and I just really wanted to make cool printed stuff. We weren't trying to build some massive company—we just got tired of seeing mediocre prints out there. So we invested in some gear, learned the craft, and decided to do it our way.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed mb-6" data-animate>
                    Right now, we've got a collection we're genuinely proud of. These are designs we've chosen because we think they look incredible when printed. But here's the thing—if you've got something specific in mind, just reach out. We love a challenge, and we'll do our best to make it happen.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed" data-animate>
                    The plan? We want to keep growing. More printers, more products, a real online store. Every single person who orders from us is helping us get there. We're not some faceless company—it's literally my dad and me packing these boxes, making sure everything's perfect. When you support us, you're supporting two people who actually care about what they're doing.
                </p>
            </section>

            {/* Features */}
            <section className="py-20 px-4 md:px-8">
                <h2 className="text-4xl font-bold mb-16 text-center" data-animate>Why Work With Us</h2>
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                    {features.map(({icon: Icon, title, desc}, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-white/15 transition-all" data-animate>
                            <Icon className="w-12 h-12 text-yellow-500 mb-4"/>
                            <h3 className="text-2xl font-bold mb-2">{title}</h3>
                            <p className="text-gray-300">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Coming Soon */}
            <section className="py-20 px-4 md:px-8 bg-white/5 backdrop-blur-sm">
                <h2 className="text-4xl font-bold mb-8 text-center" data-animate>What's Coming Next</h2>
                <p className="text-gray-300 text-lg text-center mb-12 max-w-2xl mx-auto" data-animate>
                    We're just getting started. Here's what we're working on to make MakeThePrint even better for you:
                </p>
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mb-8">
                    {coming.map((item, i) => (
                        <div key={i} className="bg-white/10 border border-yellow-500/20 rounded-lg p-6" data-animate>
                            <h3 className="text-xl font-bold mb-3 text-yellow-400">{item.title}</h3>
                            <p className="text-gray-300">{item.desc}</p>
                        </div>
                    ))}
                </div>
                <p className="text-gray-300 text-center text-lg max-w-3xl mx-auto" data-animate>
                    Every order, every customer, every moment of support gets us closer to these goals. Thank you for being part of our journey.
                </p>
            </section>
        </div>
    );
}

export default AboutPage;