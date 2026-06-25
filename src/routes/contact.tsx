import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/site/Contact";
import { FAQ } from "@/components/site/FAQ";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact ANSJ Foundation" },
      { name: "description", content: "Get in touch with ANSJ Foundation. Donor support, partnerships, CSR enquiries and general questions." },
      { property: "og:title", content: "Contact ANSJ Foundation" },
      { property: "og:description", content: "We'd love to hear from you." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title="Talk to us"
        subtitle="Donor support, CSR partnerships, media enquiries — we usually reply within 24 hours."
      />
      <Contact />
      <FAQ />
    </main>
  );
}
