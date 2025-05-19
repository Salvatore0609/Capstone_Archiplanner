// src/data/phase6Tasks.js
export const phase6Tasks = [
  {
    id: 19,
    title: "Comunicazione di Fine Lavori",
    steps: [
      {
        id: 42,
        label: "Notifica ufficiale di fine lavori al Comune",
        type: ["file"],
        accept: ".pdf",
      },
      {
        id: 43,
        label: "Deposito della documentazione finale",
        type: ["file"],
        accept: ".pdf,.zip",
      },
    ],
  },
  {
    id: 20,
    title: "Aggiornamento Catastale e Richiesta di Agibilità",
    steps: [
      {
        id: 44,
        label: "Documento di aggiornamento catastale",
        type: ["file"],
        accept: ".pdf,.xml",
      },
      {
        id: 45,
        label: "Richiesta di certificazione di agibilità",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
  {
    id: 21,
    title: "Consegna del Progetto al Cliente",
    steps: [
      {
        id: 46,
        label: "Documentazione tecnica e legale",
        type: ["file"],
        accept: ".pdf,.zip",
      },
      {
        id: 47,
        label: "Manuali d’uso, manutenzione e garanzie",
        type: ["file"],
        accept: ".pdf,.zip",
      },
    ],
  },
];
