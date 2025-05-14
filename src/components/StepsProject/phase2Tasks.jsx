// src/data/phase2Tasks.js
export const phase2Tasks = [
  {
    id: 1,
    title: "Sviluppo del Concept e Bozze",
    steps: [
      {
        label: "Realizzazione di schizzi e idee progettuali a mano libera o in digitale",
        type: ["file"],
        accept: ".jpg,.png,.pdf",
      },
      {
        label: "Elaborazione delle prime proposte planimetriche e volumetrie",
        type: ["file"],
        accept: ".pdf,.dwg",
      },
    ],
  },
  {
    id: 2,
    title: "Studio delle Alternative Progettuali",
    steps: [
      {
        label: "Valutazione dei diversi materiali e finiture",
        type: ["file", "textarea"],
        accept: ".pdf",
      },
      {
        label: "Analisi dell’efficienza energetica e delle soluzioni tecnologiche per gli impianti (elettrico, idraulico, HVAC)",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
  {
    id: 3,
    title: "Presentazione al Cliente",
    steps: [
      {
        label: "Raccogli feedback del cliente",
        type: ["textarea"],
        placeholder: "Annota qui i commenti del cliente…",
      },
      {
        label: "Adattamento e revisione delle idee progettuali in base alle osservazioni",
        type: ["file"],
        accept: ".pdf,.jpg,.png,.dwg",
      },
    ],
  },
];
