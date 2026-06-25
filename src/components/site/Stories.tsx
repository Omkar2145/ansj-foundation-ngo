import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import s1 from "@/assets/story-1.jpg";
import s2 from "@/assets/story-2.jpg";
import s3 from "@/assets/story-3.jpg";

const stories = [
  {
    img: s1,
    name: "Priya, 12",
    role: "Beneficiary · Education Program",
    quote:
      "Before Hearts United, I had to drop out of school. Now I'm in 7th grade and dream of becoming a doctor to help my village.",
  },
  {
    img: s2,
    name: "Sushila Devi, 68",
    role: "Beneficiary · Medical Aid",
    quote:
      "They covered my cataract surgery when no one else would. Today I can see my grandchildren again. There are no words for this gift.",
  },
  {
    img: s3,
    name: "Arjun Mehta",
    role: "Volunteer · 3 years",
    quote:
      "Volunteering with Hearts United changed me more than anyone I've helped. This is a family, not just an NGO.",
  },
];

export function Stories() {
  const [i, setI] = useState(0);
  const s = stories[i];
  return (
    <section id="stories" className="py-20 lg:py-28 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Success Stories</span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Voices of <span className="gradient-text">transformation</span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto bg-card border rounded-3xl overflow-hidden shadow-[var(--shadow-card)]">
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-2 aspect-square md:aspect-auto relative">
              <img src={s.img} alt={s.name} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent md:hidden" />
            </div>
            <div className="md:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
              <Quote className="size-10 text-accent mb-4" />
              <p className="font-heading text-xl lg:text-2xl leading-snug mb-6">"{s.quote}"</p>
              <div>
                <div className="font-semibold text-lg">{s.name}</div>
                <div className="text-sm text-muted-foreground">{s.role}</div>
              </div>
              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={() => setI((i - 1 + stories.length) % stories.length)}
                  aria-label="Previous story"
                  className="size-10 rounded-full border grid place-items-center hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <div className="flex gap-1.5">
                  {stories.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setI(idx)}
                      aria-label={`Go to story ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-2 bg-border"}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setI((i + 1) % stories.length)}
                  aria-label="Next story"
                  className="size-10 rounded-full border grid place-items-center hover:bg-muted transition-colors"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
