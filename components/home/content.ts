export const navItems = [
  { label: "Accueil", href: "#hero" },
  { label: "La résidence", href: "#features" },
  { label: "Galerie", href: "#gallery" },
  { label: "Appartements", href: "#inventaire" },
  { label: "Témoignages", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export const stats = [
  { value: "20", label: "Unités haut standing" },
  { value: "S+3 & S+4", label: "Typologies disponibles" },
  { value: "8", label: "Duplex" },
];

export const features = [
  {
    icon: "fa-map-marked-alt",
    title: "Emplacement exclusif",
    text: "Au cœur des Jardins de Carthage, 10 minutes de l’aéroport, 5 minutes de Tunisia Mall, proche universités, écoles, banques et assurances.",
  },
  {
    icon: "fa-crown",
    title: "Luxe & bien-être",
    text: "Aux étages, des piscines privatives offrent un havre de tranquillité, un cadre intime et exclusif.",
  },
  {
    icon: "fa-chess-knight",
    title: "Élégance & confort",
    text: "Chaque détail crée une atmosphère d’élégance subtile et de luxe raffiné.",
  },
];

export const inventory = {
  duplex: {
    label: "Duplex",
    rows: [
      { reference: "D01", surface: "146 m²", bedrooms: "3 + 1", pool: "Oui", plan: "Voir plan", planHref: "/docs/plans%20interactifs/3eme%20etage/appart3_1.html" },
      { reference: "D02", surface: "152 m²", bedrooms: "3 + 1", pool: "Oui", plan: "Voir plan", planHref: "/docs/plans%20interactifs/3eme%20etage/appart3_2.html" },
      { reference: "D03", surface: "158 m²", bedrooms: "4", pool: "Oui", plan: "Voir plan", planHref: "/docs/plans%20interactifs/3eme%20etage/appart3_3.html" },
    ],
  },
  s3: {
    label: "Appartements S+3",
    rows: [
      { reference: "S3-01", surface: "98 m²", bedrooms: "3", pool: "Non", plan: "Voir plan", planHref: "/docs/plans%20interactifs/1ere%20etage/appart1_1.html" },
      { reference: "S3-02", surface: "102 m²", bedrooms: "3", pool: "Oui", plan: "Voir plan", planHref: "/docs/plans%20interactifs/1ere%20etage/appart1_2.html" },
      { reference: "S3-03", surface: "110 m²", bedrooms: "3", pool: "Oui", plan: "Voir plan", planHref: "/docs/plans%20interactifs/1ere%20etage/appart1_3.html" },
    ],
  },
  s45: {
    label: "Appartements S+4.5",
    rows: [
      { reference: "S45-01", surface: "118 m²", bedrooms: "4", pool: "Oui", plan: "Voir plan", planHref: "/docs/plans%20interactifs/2eme%20etage/appart2_1.html" },
      { reference: "S45-02", surface: "124 m²", bedrooms: "4", pool: "Oui", plan: "Voir plan", planHref: "/docs/plans%20interactifs/2eme%20etage/appart2_2.html" },
      { reference: "S45-03", surface: "132 m²", bedrooms: "4 + 1", pool: "Oui", plan: "Voir plan", planHref: "/docs/plans%20interactifs/2eme%20etage/appart2_3.html" },
    ],
  },
} as const;

export type InventoryKey = keyof typeof inventory;

export const testimonials = [
  {
    quote: "PROMED GROUP a su allier modernité et confort. L’accompagnement et la qualité de construction sont irréprochables.",
    author: "M. Fares",
    role: "Résident PROMED GROUP",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote: "La qualité des finitions et l’attention aux détails offrent un cadre de vie exceptionnel — un véritable havre de paix.",
    author: "Mme Amel",
    role: "Résidente PROMED GROUP",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  },
];
