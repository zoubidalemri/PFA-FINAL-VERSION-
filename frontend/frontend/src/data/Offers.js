
export const FAKE_OFFERS = [
  {
    id: 1,
    title: "Développeur Backend Java",
    company: "TechCorp",
    type: "CDI",
    location: "Casablanca",
    experience: "Junior",
    salaryMin: 10000,
    salaryMax: 20000,
    currency: "€",
    applicationsCount: 1,
    status: "ACTIVE",
    description:
      "Nous recherchons un Développeur Backend Java passionné pour rejoindre notre équipe technique et participer au développement d’applications performantes.",
    responsibilities: [
      "Concevoir et développer des APIs REST (Spring Boot)",
      "Écrire des tests unitaires et d’intégration",
      "Optimiser les performances et la qualité du code",
      "Participer aux revues de code et aux rituels Agile",
    ],
    requirements: [
      "Java / Spring Boot",
      "SQL (PostgreSQL)",
      "Git, bonnes pratiques",
      "Notions Docker (bonus)",
    ],
    benefits: ["Télétravail partiel", "Assurance", "Budget formation"],
    tags: ["Java", "Spring Boot", "PostgreSQL"],
    postedAt: "2025-11-10",
    externalLinks: {
      linkedin: "https://linkedin.com",
      indeed: "https://indeed.com",
    },
  },

  {
    id: 2,
    title: "Data Analyst junior",
    company: "BankData",
    type: "Stage",
    location: "Rabat",
    experience: "Junior",
    salaryMin: 5000,
    salaryMax: 8000,
    currency: "€",
    applicationsCount: 1,
    status: "ACTIVE",
    description:
      "Stage Data Analyst : analyse de données, reporting, dashboards et collaboration avec les équipes métier.",
    responsibilities: [
      "Nettoyer et analyser des datasets",
      "Créer des dashboards (Power BI / équivalent)",
      "Rédiger des rapports de synthèse",
    ],
    requirements: ["SQL", "Excel/BI", "Esprit analytique"],
    benefits: ["Encadrement", "Possibilité d’embauche"],
    tags: ["SQL", "BI", "Data"],
    postedAt: "2025-11-12",
    externalLinks: {
      linkedin: "https://linkedin.com",
      indeed: "https://indeed.com",
    },
  },

  {
    id: 3,
    title: "Full-stack React / Node",
    company: "StartupX",
    type: "CDD",
    location: "Remote",
    experience: "Junior",
    salaryMin: 9000,
    salaryMax: 15000,
    currency: "€",
    applicationsCount: 0,
    status: "ACTIVE",
    description:
      "Développement d’une app web : React côté front, Node.js côté backend, livraison rapide et itérations fréquentes.",
    responsibilities: [
      "Développer des features front React",
      "Créer des endpoints Node/Express",
      "Intégrer APIs et auth",
    ],
    requirements: ["React", "Node.js", "REST", "Git"],
    benefits: ["Remote", "Horaires flexibles"],
    tags: ["React", "Node", "Full-stack"],
    postedAt: "2025-11-15",
    externalLinks: {
      linkedin: "https://linkedin.com",
      indeed: "https://indeed.com",
    },
  },
];

export const getOfferById = (id) =>
  FAKE_OFFERS.find((o) => o.id === Number(id));
