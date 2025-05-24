export const phase2Tasks = [
  {
    id: 5,
    title: "Sviluppo del Concept e Bozze",
    steps: [
      {
        id: 13,
        label: "Realizzazione di schizzi e idee progettuali a mano libera o in digitale",
        type: ["file"],
        accept: ".jpg,.png,.pdf",
      },
      {
        id: 14,
        label: "Elaborazione delle prime proposte planimetriche e volumetrie",
        type: ["file"],
        accept: ".pdf,.dwg",
      },
    ],
  },
  {
    id: 6,
    title: "Studio delle Alternative Progettuali",
    steps: [
      {
        id: 15,
        label: "Valutazione dei diversi materiali e finiture",
        type: ["file", "textarea"],
        accept: ".pdf",
      },
      {
        id: 16,
        label: "Analisi dell’efficienza energetica e delle soluzioni tecnologiche per gli impianti (elettrico, idraulico, HVAC)",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
  {
    id: 7,
    title: "Presentazione al Cliente",
    steps: [
      {
        id: 17,
        label: "Raccogli feedback del cliente",
        type: ["textarea"],
        placeholder: "Annota qui i commenti del cliente…",
      },
      {
        id: 18,
        label: "Adattamento e revisione delle idee progettuali in base alle osservazioni",
        type: ["file"],
        accept: ".pdf,.jpg,.png,.dwg",
      },
    ],
  },
];
