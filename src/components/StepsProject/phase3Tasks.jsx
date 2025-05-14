// src/data/phase3Tasks.js
export const phase3Tasks = [
  {
    id: 1,
    title: "Elaborazione degli Elaborati Tecnici",
    steps: [
      {
        label: "Carica piante, prospetti, sezioni e dettagli costruttivi",
        type: ["file"],
        accept: ".pdf,.dwg",
      },
      {
        label: "Carica il computo metrico estimativo",
        type: ["file"],
        accept: ".xls,.xlsx,.pdf",
      },
      {
        label: "Carica il capitolato tecnico con materiali e lavorazioni",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
  {
    id: 2,
    title: "Pratiche Burocratiche e Permessi",
    steps: [
      {
        label: "Documentazione per Permesso di Costruire o SCIA",
        type: ["file"],
        accept: ".pdf",
      },
      {
        label: "Conferma invio pratiche agli enti (Comune, ASL, etc.)",
        type: ["boolean"],
      },
    ],
  },
  {
    id: 3,
    title: "Coordinamento Interdisciplinare",
    description: "Collaborazione con ingegneri strutturali, impiantisti e geologi",
    steps: [
      {
        label: "Allega relazioni strutturali, geologiche o impiantistiche",
        type: ["file"],
        accept: ".pdf,.docx",
      },
      {
        label: "Note sugli aggiornamenti urbanistici e catastali",
        type: ["textarea", "file"],
        accept: ".pdf",
        placeholder: "Inserisci note o aggiornamenti recenti…",
      },
      {
        label: "Gestione sanatorie per abusi edilizi pregressi",
        type: ["textarea", "file"],
        placeholder: "Descrizione della sanatoria e documenti allegati…",
        accept: ".pdf, .dwg",
      },
    ],
  },
];
