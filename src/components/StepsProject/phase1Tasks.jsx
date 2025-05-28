export const phase1Tasks = [
  {
    id: 1,
    title: "Incontro con il cliente",
    steps: [
      {
        id: 1,
        label: "Definisci esigenze e obiettivi",
        type: ["textarea"],
        placeholder: "Scrivi qui le esigenze e gli obiettivi…",
      },
      {
        id: 2,
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
        id: 3,
        label: "Scegli l’area di interesse",
        type: ["dropdown"],
        options: [
          { label: "Sassari", value: "sassari" },
          { label: "Cagliari", value: "cagliari" },
          // …altre opzioni
        ],
      },
      {
        id: 4, // nuovo id step, deve essere unico
        label: "Seleziona la zona di interesse  (collegamento al PUC di rifermento)",
        type: ["dropdown"],
      },
      {
        id: 5,
        label: "Verifica vincoli paesaggistici, ambientali, storici",
        type: ["static"],
      },
      {
        id: 6,
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
        id: 7,
        label: "Analisi del lotto o dell’edificio esistente",
        type: ["file"],
        accept: ".pdf,.dwg",
      },
      {
        id: 8,
        label: "Verifica conformità catastale",
        type: ["link"],
        modalTitle: "Portale SISTER",
        modalSrc: "https://iampe.agenziaentrate.gov.it/sam/UI/Login?realm=/agenziaentrate",
      },
      {
        id: 9,
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
        id: 10,
        label: "Rilievo metrico dell’area o edificio",
        type: ["file"],
        accept: ".pdf,.dwg",
      },
      {
        id: 11,
        label: "Fotografie stato di fatto",
        type: ["file"],
        accept: ".jpg,.png",
      },
      {
        id: 12,
        label: "Acquisizione di visure catastali e planimetrie",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
];
