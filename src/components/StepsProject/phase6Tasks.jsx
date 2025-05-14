// src/data/phase6Tasks.js
export const phase6Tasks = [
  {
    id: 1,
    title: "Comunicazione di Fine Lavori",
    steps: [
      {
        label: "Notifica ufficiale di fine lavori al Comune",
        type: ["file"],
        accept: ".pdf",
      },
      {
        label: "Deposito della documentazione finale",
        type: ["file"],
        accept: ".pdf,.zip",
      },
    ],
  },
  {
    id: 2,
    title: "Aggiornamento Catastale e Richiesta di Agibilità",
    steps: [
      {
        label: "Documento di aggiornamento catastale",
        type: ["file"],
        accept: ".pdf,.xml",
      },
      {
        label: "Richiesta di certificazione di agibilità",
        type: ["file"],
        accept: ".pdf",
      },
    ],
  },
  {
    id: 3,
    title: "Consegna del Progetto al Cliente",
    steps: [
      {
        label: "Documentazione tecnica e legale",
        type: ["file"],
        accept: ".pdf,.zip",
      },
      {
        label: "Manuali d’uso, manutenzione e garanzie",
        type: ["file"],
        accept: ".pdf,.zip",
      },
    ],
  },
];
