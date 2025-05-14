// src/data/phase5Tasks.js

export const phase5Tasks = [
  {
    id: 1,
    title: "Apertura del Cantiere",
    steps: [
      {
        label: "Comunicazione dell’inizio dei lavori al Comune (CILA/SCIA)",
        type: "file",
        accept: ".pdf",
      },
      {
        label: "Nomina del Direttore dei Lavori",
        type: "file",
        accept: ".pdf",
      },
    ],
  },
  {
    id: 2,
    title: "Supervisione e Controllo dei Lavori",
    steps: [
      {
        label: "Report di monitoraggio lavori in corso",
        type: ["textarea", "file"],
        accept: ".pdf,.docx",
        placeholder: "Descrivi lo stato di avanzamento dei lavori...",
      },
      {
        label: "Aggiornamento computo metrico (SAL)",
        type: "file",
        accept: ".xls,.xlsx,.pdf",
      },
    ],
  },
  {
    id: 3,
    title: "Sicurezza in Cantiere",
    steps: [
      {
        label: "Verifica utilizzo DPI e misure di sicurezza",
        type: "boolean",
      },
      {
        label: "Documentazione sul rispetto normative sicurezza (D.Lgs. 81/08)",
        type: "file",
        accept: ".pdf",
      },
    ],
  },
  {
    id: 4,
    title: "Certificazioni e Collaudi",
    steps: [
      {
        label: "Collaudo strutturale e impiantistico",
        type: "file",
        accept: ".pdf",
      },
      {
        label: "Attestato di Prestazione Energetica (APE) e certificazioni varie",
        type: "file",
        accept: ".pdf",
      },
    ],
  },
];
