const partners = [
  "TATA Trusts", "Infosys Foundation", "Reliance Foundation", "Wipro Cares",
  "HDFC Parivartan", "Mahindra Rise", "Bajaj CSR", "Axis Bank Foundation",
  "L&T Public Charitable Trust", "ITC Mission Sunehra Kal",
];

export function CSRPartners() {
  return (
    <section className="py-16 border-y bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Trusted by Corporate Partners</span>
          <h2 className="font-heading text-3xl font-bold mt-2">Our CSR partners drive change with us</h2>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-12 animate-[shimmer_30s_linear_infinite] whitespace-nowrap" style={{ animation: "scroll-x 35s linear infinite" }}>
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="font-heading font-bold text-xl text-muted-foreground hover:text-primary transition-colors shrink-0">
                {p}
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes scroll-x {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </section>
  );
}
