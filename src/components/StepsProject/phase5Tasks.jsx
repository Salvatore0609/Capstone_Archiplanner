// src/data/phase5Tasks.js

export const phase5Tasks = [
  {
    id: 15,
    title: "Apertura del Cantiere",
    steps: [
      {
        id: 34,
        label: "Comunicazione dell’inizio dei lavori al Comune (CILA/SCIA)",
        type: ["file"],
        accept: ".pdf",
      },
      {
        id: 35,
        label: "Nomina del Direttore dei Lavori",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
  {
    id: 16,
    title: "Supervisione e Controllo dei Lavori",
    steps: [
      {
        id: 36,
        label: "Report di monitoraggio lavori in corso",
        type: ["textarea", "file"],
        accept: ".pdf,.docx",
        placeholder: "Descrivi lo stato di avanzamento dei lavori...",
      },
      {
        id: 37,
        label: "Aggiornamento computo metrico (SAL)",
        type: ["file"],
        accept: ".xls,.xlsx,.pdf",
      },
    ],
  },
  {
    id: 17,
    title: "Sicurezza in Cantiere",
    steps: [
      {
        id: 38,
        label: "Verifica utilizzo DPI e misure di sicurezza",
        type: "boolean",
      },
      {
        id: 39,
        label: "Documentazione sul rispetto normative sicurezza (D.Lgs. 81/08)",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
  {
    id: 18,
    title: "Certificazioni e Collaudi",
    steps: [
      {
        id: 40,
        label: "Collaudo strutturale e impiantistico",
        type: ["file"],
        accept: ".pdf",
      },
      {
        id: 41,
        label: "Attestato di Prestazione Energetica (APE) e certificazioni varie",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
];
