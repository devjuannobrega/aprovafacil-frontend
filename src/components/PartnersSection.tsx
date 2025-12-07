const partners = [
  { name: "Serasa", logo: "SERASA" },
  { name: "SPC Brasil", logo: "SPC" },
  { name: "Boa Vista", logo: "BOA VISTA" },
  { name: "SCPC", logo: "SCPC" },
  { name: "CENPROT", logo: "CENPROT" },
  { name: "Bacen", logo: "BACEN" },
];

const PartnersSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container px-4 sm:px-6">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Atuamos junto aos principais órgãos de proteção ao crédito
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center px-4 py-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className="font-poppins font-bold text-lg sm:text-xl text-muted-foreground tracking-wider">
                {partner.logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
