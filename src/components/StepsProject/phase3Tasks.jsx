export const phase3Tasks = [
  {
    id: 8,
    title: "Elaborazione degli Elaborati Tecnici",
    steps: [
      {
        id: 18,
        label: "Carica piante, prospetti, sezioni e dettagli costruttivi",
        type: ["file"],
        accept: ".pdf,.dwg",
      },
      {
        id: 19,
        label: "Carica il computo metrico estimativo",
        type: ["file"],
        accept: ".xls,.xlsx,.pdf",
      },
      {
        id: 20,
        label: "Carica il capitolato tecnico con materiali e lavorazioni",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
  {
    id: 9,
    title: "Pratiche Burocratiche e Permessi",
    steps: [
      {
        id: 21,
        label: "Documentazione per Permesso di Costruire o SCIA",
        type: ["file"],
        accept: ".pdf",
      },
      {
        id: 22,
        label: "Conferma invio pratiche agli enti (Comune, ASL, etc.)",
        type: ["boolean"],
      },
    ],
  },
  {
    id: 10,
    title: "Coordinamento Interdisciplinare",
    description: "Collaborazione con ingegneri strutturali, impiantisti e geologi",
    steps: [
      {
        id: 23,
        label: "Allega relazioni strutturali, geologiche o impiantistiche",
        type: ["file"],
        accept: ".pdf,.docx",
      },
      {
        id: 24,
        label: "Note sugli aggiornamenti urbanistici e catastali",
        type: ["textarea", "file"],
        accept: ".pdf",
        placeholder: "Inserisci note o aggiornamenti recenti…",
      },
      {
        id: 25,
        label: "Gestione sanatorie per abusi edilizi pregressi",
        type: ["textarea", "file"],
        placeholder: "Descrizione della sanatoria e documenti allegati…",
        accept: ".pdf,.dwg",
      },
    ],
  },
];
