export const phase4Tasks = [
  {
    id: 1,
    title: "Progettazione Esecutiva",
    steps: [
      {
        label: "Carica disegni esecutivi con misurazioni e dettagli",
        type: ["file"],
        accept: ".pdf,.dwg",
      },
      {
        label: "Definisci gli schemi per impianti e strutture",
        type: ["file"],
        accept: ".pdf,.dwg",
      },
    ],
  },
  {
    id: 2,
    title: "Preparazione del Computo Metrico Definitivo",
    steps: [
      {
        label: "Carica computo metrico definitivo",
        type: ["file"],
        accept: ".xls,.xlsx,.pdf",
      },
      {
        label: "Note sui preventivi ricevuti dalle imprese",
        type: ["textarea", "file"],
        placeholder: "Inserisci considerazioni o allega documenti…",
        accept: ".pdf",
      },
    ],
  },
  {
    id: 3,
    title: "Scelta dell’Impresa Esecutrice",
    steps: [
      {
        label: "Carica valutazione e schede imprese selezionate",
        type: ["file"],
        accept: ".pdf,.docx",
      },
      {
        label: "Stipula del contratto d’appalto",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
  {
    id: 4,
    title: "Piano di Sicurezza e Coordinamento (PSC)",
    steps: [
      {
        label: "Carica documento PSC per il cantiere",
        type: ["file"],
        accept: ".pdf",
      },
      {
        label: "Nomina del Coordinatore per la Sicurezza",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
];
