import type { GalleryProject } from "../types/gallery";

export const galleryProjects: GalleryProject[] = [
  {
    slug: "duplex-ava",
    title: "Duplex AVA",
    category: "Interiors",
    year: "2025",
    location: "Jardins de Carthage",
    area: "152 m²",
    summary: "Une double hauteur traversante où la lumière du nord sculpte chaque matière.",
    description:
      "Le duplex réorganise 152 mètres carrés sur deux niveaux autour d’un vide central qui laisse entrer la lumière toute la journée. Marbre travertin, chêne fumé et laiton patiné composent une palette sobre pensée pour vieillir.",
    cover: "/images/duplex.jpg",
    images: [
      "/images/duplex.jpg",
      "/images/SuitePanoramique.jpg",
      "/images/salonetsalleMange.jpg",
      "/images/cuisine.jpg",
      "/images/salleManger.jpg",
    ],
    meta: ["Interior", "Architecture", "Photography"],
    details: [
      { label: "Area", value: "152 m²" },
      { label: "Year", value: "2025" },
      { label: "Location", value: "Jardins de Carthage" },
    ],
    features: ["Double height", "Travertin", "Smoked oak", "Brushed brass"],
    theme: { bg: "#12100E", accent: "#C98A45", fg: "#F4F1EC", muted: "#9A9086", surface: "#1C1916" },
  },
  {
    slug: "suite-panoramique",
    title: "Suite Panoramique",
    category: "Interiors",
    year: "2025",
    location: "Jardins de Carthage",
    area: "146 m²",
    summary: "Une suite ouverte sur trois orientations, du matin au soir.",
    description:
      "La suite panoramique tire ses grandes dimensions d’une baie continue qui traverse la chambre, le salon et la salle de bains. Les volets motorisés alignent l’intérieur sur la lumière du jardin.",
    cover: "/images/SuitePanoramique.jpg",
    images: [
      "/images/SuitePanoramique.jpg",
      "/images/couloir.jpg",
      "/images/toilette.jpg",
      "/images/salonetsalleMange.jpg",
    ],
    meta: ["Interior", "Joinery", "Photography"],
    details: [
      { label: "Area", value: "146 m²" },
      { label: "Year", value: "2025" },
      { label: "Location", value: "Jardins de Carthage" },
    ],
    features: ["Motorised shutters", "Integrated joinery", "Rain shower", "Sea view"],
    theme: { bg: "#101418", accent: "#8FB3C4", fg: "#F2F5F7", muted: "#8B969E", surface: "#1A1F25" },
  },
  {
    slug: "piscine-privee",
    title: "Piscine Privée",
    category: "Landscape",
    year: "2024",
    location: "Jardins de Carthage",
    area: "28 m²",
    summary: "Un miroir d’eau au-dessus de la ville, adossé aux terrasses.",
    description:
      "La piscine privée overlooks les toits vers la mer. Le bassin à débordement supprime la ligne de coping et donne au jardin une profondeur continue jusqu’à la rambarde.",
    cover: "/images/piscine.jpg",
    images: [
      "/images/piscine.jpg",
      "/images/spa.jpg",
      "/images/Façade 03.png",
      "/images/FacadePrin.png",
    ],
    meta: ["Landscape", "Exterior", "Photography"],
    details: [
      { label: "Area", value: "28 m²" },
      { label: "Year", value: "2024" },
      { label: "Location", value: "Roof terrace" },
    ],
    features: ["Overflow edge", "Teak decking", "Salt treatment", "Sea horizon"],
    theme: { bg: "#0D1418", accent: "#5FA8A0", fg: "#EFF6F4", muted: "#869A98", surface: "#16211F" },
  },
  {
    slug: "cuisine-signature",
    title: "Cuisine Signature",
    category: "Interiors",
    year: "2025",
    location: "Jardins de Carthage",
    area: "22 m²",
    summary: "Une enfilade de pierre et de métal Asteroid, ouverte sur la table.",
    description:
      "La cuisine signature aligne les deux murs de pierre sur une seule ligne de travail. Le plan de travail en pierre, le four encastrable et la desserte roller disparaissent derrière des panneaux pleins.",
    cover: "/images/cuisine.jpg",
    images: [
      "/images/cuisine.jpg",
      "/images/salleManger.jpg",
      "/images/realisation1.jpg",
      "/images/toilette.jpg",
    ],
    meta: ["Interior", "Joinery", "Photography"],
    details: [
      { label: "Area", value: "22 m²" },
      { label: "Year", value: "2025" },
      { label: "Location", value: "Jardins de Carthage" },
    ],
    features: ["Stone island", "Brushed brass", "Integrated appliances", "Hidden pantry"],
    theme: { bg: "#14120F", accent: "#D2A05C", fg: "#F6F2EB", muted: "#A0968A", surface: "#1F1B17" },
  },
  {
    slug: "facade-principale",
    title: "Façade Principale",
    category: "Architecture",
    year: "2024",
    location: "Jardins de Carthage",
    area: "3 200 m²",
    summary: "Une façade retravaillée pour laisser entrer la brise marine.",
    description:
      "La façade principale a été redessinée autour de baies profondes et d’un brise-soleil en aluminium anodisé. Le rythme vertical retrouve désormais la travée structurelle de la résidence.",
    cover: "/images/Façade 03.png",
    images: [
      "/images/Façade 03.png",
      "/images/FacadePrin.png",
      "/images/FacadePrin1.png",
      "/images/FacadePrin2.png",
    ],
    meta: ["Exterior", "Architecture", "Photography"],
    details: [
      { label: "Area", value: "3 200 m²" },
      { label: "Year", value: "2024" },
      { label: "Location", value: "Jardins de Carthage" },
    ],
    features: ["Deep reveals", "Anodised aluminium", "Brise-soleil", "Structural bay"],
    theme: { bg: "#111316", accent: "#B4BCC4", fg: "#F1F3F5", muted: "#8A929A", surface: "#1B1E22" },
  },
  {
    slug: "spa-et-bien-etre",
    title: "Spa & Bien-être",
    category: "Wellness",
    year: "2024",
    location: "Jardins de Carthage",
    area: "64 m²",
    summary: "Hamam, sauna et salle de sport pensés dans la pénombre.",
    description:
      "Le spa se cache derrière un sas de pierre sombre qui étouffe le bruit. La lumière indirecte est reprise du hammam traditionnel, filtrée derrière un verre dépoli.",
    cover: "/images/spa.jpg",
    images: [
      "/images/spa.jpg",
      "/images/toilette.jpg",
      "/images/couloir.jpg",
      "/images/realisation1.jpg",
    ],
    meta: ["Wellness", "Interiors", "Photography"],
    details: [
      { label: "Area", value: "64 m²" },
      { label: "Year", value: "2024" },
      { label: "Location", value: "Lower ground" },
    ],
    features: ["Hammam", "Sauna", "Indirect light", "Stone vault"],
    theme: { bg: "#0F1211", accent: "#7FA893", fg: "#EDF3EF", muted: "#879890", surface: "#18201C" },
  },
];

export function getProject(slug: string): GalleryProject | undefined {
  return galleryProjects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): GalleryProject {
  const index = galleryProjects.findIndex((project) => project.slug === slug);
  return galleryProjects[(index + 1) % galleryProjects.length];
}