# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

```javascript
Gestione Dati Progetto - Documentazione Tecnica Completa
1. Struttura Dati del Progetto
1.1 Schema Base del Progetto
{
  id: Number (Timestamp),
  nomeProgetto: String,
  progettista: String,
  impresaCostruttrice: String,
  indirizzo: String,
  lat: Number,
  lng: Number,
  tasks: {
    "fase-1": {
      "task-1": {
        // Dati specifici del task
      },
      // ... Altri task
    },
    // ... Altre fasi (fino a fase-6)
  }
}

1.2 Struttura Dettagliata delle Tasks
javascript
"fase-1": {
  "task-3": {
    "step-0": {
      file: {
        name: "relazione.pdf",
        size: 24576,
        type: "application/pdf"
      }
    },
    "step-1": {}, // Iframe (solo visualizzazione)
    "step-2": {
      file: {
        name: "preventivo.pdf",
        size: 15360,
        type: "application/pdf"
      }
    }
  }
}
2. Architettura Redux Store
2.1 State Shape
javascript
{
  projects: [
    // Array di progetti
  ],

}

2.2 Persistenza su localStorage
Salvataggio automatico su ogni modifica

Recupero iniziale: JSON.parse(localStorage.getItem('projects')) || []

3. Azioni Critiche
3.1 Aggiunta Progetto (ADD_PROJECT)
javascript
{
  ...projectData,
  id: Date.now(),
  lat: geocodeResult.lat,
  lng: geocodeResult.lng,
  tasks: {}
}
3.2 Aggiornamento Task (UPDATE_TASK_DATA)
javascript
{
  projectId: Number,
  phaseKey: String,
  taskId: String,
  data: {
    "step-0": { /* dati */ }
  }
}
4. Componenti Core
4.1 Sidebar.js
Creazione progetto con validazione in tempo reale

Navigazione con passaggio stato completo

Gestione lista progetti e fasi

4.2 Project.js
Recupero dati da:

State di navigazione

Redux store via ID

Visualizzazione mappa interattiva

Gestione errori di caricamento

4.3 FasePage.js
Routing dinamico per fasi

Caricamento tasks dalla configurazione

Gestione carousel multi-step

4.4 TaskCard.js
Gestione unificata input:

File upload con validazione

Iframe in modal dedicato

Textarea con toggle

Persistenza automatica su modifica

5. Diagramma di Flusso Dati
Diagram
Code
6. Sicurezza e Validazione
6.1 Validazioni Frontend
Campo indirizzo: verifica coordinate

Formati file: controllo estensioni

Campi obbligatori: highlight errori

6.2 Politiche Sicurezza
Iframe sandboxed: allow-scripts allow-forms

Whitelist domini esterni

Controllo HTTPS per risorse esterne

7. Gestione Errori
7.1 Tipologie Errori
Codice	Descrizione	Handling
GEO-001	Geocoding fallito	Blocco submit form
TASK-004	Formato file non valido	Messaggio contestuale
STORE-002	localStorage pieno	Alert utente + rollback
7.2 Logging Errori
javascript
const errorLogger = (error) => {
  console.error('Error:', {
    timestamp: new Date().toISOString(),
    errorDetails: error,
    user: currentUser.id
  })
  trackErrorToMonitoringService(error)
}
8. LocalStorage Management
8.1 Struttura Memorizzata
json
[
  {
    "id": 1719391102580,
    "nomeProgetto": "Villa Moderna",
    "tasks": {
      "fase-1": {
        "task-3": {
          "step-0": {
            "file": {
              "name": "planimetria.pdf",
              "size": 24576
            }
          }
        }
      }
    }
  }
]
```
