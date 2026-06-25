import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

const posts = [
  { icon: Instagram, color: "from-pink-500 to-orange-500", handle: "@ansjfoundation", text: "Aarav got his new books today 📚 thanks to donor support from Bangalore!" },
  { icon: Facebook, color: "from-blue-600 to-blue-500", handle: "ANSJ Foundation", text: "Health camp in Lucknow served 320 elders. Thank you volunteers! 🙏" },
  { icon: Linkedin, color: "from-sky-700 to-sky-600", handle: "ANSJ Welfare & Education", text: "New partnership announced with TATA Trusts to scale our scholarship program." },
  { icon: Youtube, color: "from-red-600 to-red-500", handle: "ANSJ Foundation", text: "Watch Lakshmi Devi's vision-restoration story — sponsored by an anonymous donor." },
];

export function SocialWall() {
  return (
    <section className="py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">Social Wall</span>
          <h2 className="font-heading text-4xl font-bold mt-2 mb-3">Live from our community</h2>
          <p className="text-muted-foreground">Follow our journey across platforms.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {posts.map((p, i) => (
            <a key={i} href="#" className="bg-card border rounded-2xl p-5 card-hover block">
              <div className={`size-10 rounded-xl bg-gradient-to-br ${p.color} grid place-items-center text-white mb-3`}>
                <p.icon className="size-5" />
              </div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">{p.handle}</div>
              <p className="text-sm leading-relaxed">{p.text}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
