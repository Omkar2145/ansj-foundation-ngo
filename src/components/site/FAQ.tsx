import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How are my donations used?", a: "70% of every donation goes directly to programs (education, healthcare, relief). 15% supports operations, 10% community outreach, and 5% administration. Full audited reports are published annually." },
  { q: "Is my donation secure?", a: "Yes. All payments are processed through PCI-DSS compliant gateways with 256-bit SSL encryption. You'll receive an instant 80G tax-exemption receipt by email." },
  { q: "How can I volunteer?", a: "Fill the volunteer form above with your interests and availability. Our coordinator will reach out within 48 hours to match you to a program in your city or online." },
  { q: "Can I start my own fundraiser?", a: "Absolutely. Reach out via the contact form with your campaign idea — we'll help you set up a dedicated page, payment processing, and marketing support." },
  { q: "Do you provide tax exemption?", a: "Yes — Hearts United is registered under Sections 80G and 12A of the Indian Income Tax Act. Donations are tax-deductible for Indian taxpayers." },
  { q: "Can I sponsor a specific child or family?", a: "Yes. Our sponsorship programs let you support a specific beneficiary with monthly updates, photos and yearly visits if you wish." },
];

export function FAQ() {
  return (
    <section className="py-20 lg:py-28 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">FAQ</span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Frequently <span className="gradient-text">asked questions</span>
          </h2>
        </div>
        <Accordion type="single" collapsible className="bg-card border rounded-2xl px-2 shadow-[var(--shadow-soft)]">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`i-${i}`} className="px-4">
              <AccordionTrigger className="font-heading font-semibold text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
