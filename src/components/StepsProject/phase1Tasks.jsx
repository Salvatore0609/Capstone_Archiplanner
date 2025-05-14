// src/data/phase1Tasks.js
export const phase1Tasks = [
  {
    id: 1,
    title: "Incontro con il cliente",
    steps: [
      {
        label: "Definisci esigenze e obiettivi",
        type: ["textarea"],
        placeholder: "Scrivi qui le esigenze e gli obiettivi…",
      },
      {
        label: "Carica una prima analisi del budget",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
  {
    id: 2,
    title: "Analisi normativa e vincoli",
    steps: [
      {
        label: "Scegli l’area di interesse (collegamento al PRG)",
        type: ["dropdown"],
        options: [
          { label: "Sassari", value: "sassari" },
          { label: "Cagliari", value: "cagliari" },
          // …altre opzioni
        ],
      },
      {
        label: "Verifica vincoli paesaggistici, ambientali, storici",
        type: ["static"],
      },
      {
        label: "Conformità alle Normative Edilizie e Antisismiche",
        type: ["static"],
      },
    ],
  },
  {
    id: 3,
    title: "Studio fattibilità tecnica ed economica",
    steps: [
      {
        label: "Analisi del lotto o dell’edificio esistente",
        type: ["file"],
        accept: ".pdf,.dwg",
      },
      {
        label: "Verifica conformità catastale",
        type: ["link"],
        modalTitle: "Portale SISTER",
        modalSrc: "https://iampe.agenziaentrate.gov.it/sam/UI/Login?realm=/agenziaentrate",
      },
      {
        label: "Carica un primo preventivo",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
  {
    id: 4,
    title: "Rilievo e documentazione",
    steps: [
      {
        label: "Rilievo metrico dell’area o edificio",
        type: ["file"],
        accept: ".pdf,.dwg",
      },
      {
        label: "Fotografie stato di fatto",
        type: ["file"],
        accept: ".jpg,.png",
      },
      {
        label: "Acquisizione di visure catastali e planimetrie",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
];
