import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Stories } from "@/components/site/Stories";
import { Calendar, Newspaper, Video, FileText } from "lucide-react";
import story1 from "@/assets/story-1.jpg";
import story2 from "@/assets/story-2.jpg";
import story3 from "@/assets/story-3.jpg";
import camp1 from "@/assets/campaign-education.jpg";
import camp2 from "@/assets/campaign-medical.jpg";
import camp3 from "@/assets/campaign-rural.jpg";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media Center — ANSJ Foundation" },
      { name: "description", content: "Photo gallery, video stories, news, blogs, case studies and press releases from ANSJ Welfare & Education Foundation." },
      { property: "og:title", content: "Media Center — ANSJ Foundation" },
      { property: "og:description", content: "Photos, videos, news and case studies." },
      { property: "og:url", content: "/media" },
    ],
    links: [{ rel: "canonical", href: "/media" }],
  }),
  component: MediaPage,
});

const gallery = [story1, camp1, story2, camp2, story3, camp3];
const news = [
  { icon: Newspaper, date: "May 2026", title: "ANSJ Foundation reaches 4,000+ sponsored children milestone" },
  { icon: FileText, date: "Apr 2026", title: "Case Study: How AI-powered matching connected 800 donors to verified beneficiaries" },
  { icon: Video, date: "Mar 2026", title: "Documentary: A year in the life of an ANSJ field manager" },
  { icon: Calendar, date: "Feb 2026", title: "Annual Impact Report 2025 published — read full breakdown" },
];

function MediaPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Media Center"
        title="Stories, photos, films and press"
        subtitle="Witness the impact through the eyes of beneficiaries, volunteers and donors."
      />

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold mb-8">Photo gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {gallery.map((g, i) => (
              <div key={i} className={`relative overflow-hidden rounded-2xl card-hover ${i % 5 === 0 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-[4/3]"}`}>
                <img src={g} alt={`Gallery ${i + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Stories />

      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold mb-8">News & press</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
            {news.map((n) => (
              <a key={n.title} href="#" className="bg-card border rounded-2xl p-5 flex gap-4 card-hover">
                <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                  <n.icon className="size-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{n.date}</div>
                  <div className="font-heading font-semibold">{n.title}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
