export default function handler(req, res) {
  try {
    // Leggiamo i parametri separati
    const { body, comp, date, user } = req.query;

    if (!body) {
      return res.status(400).send("Errore: Manca il contenuto (body).");
    }

    // Decodifica "soft" per sicurezza
    const decodeSafe = (str) => {
        try { return decodeURIComponent(str || ""); } 
        catch (e) { return str || ""; }
    };

    const cleanBody = decodeSafe(body);
    const cleanComp = decodeSafe(comp);
    const cleanDate = decodeSafe(date);
    const cleanUser = decodeSafe(user);

    res.setHeader('Content-Type', 'text/html');

    // Costruiamo la pagina
    res.send(`
      <!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <style>
        /* --- STILE PER LA VISUALIZZAZIONE A SCHERMO --- */
        body {
            font-family: sans-serif;
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
        }
        th { background-color: #f4f4f4; }

        /* --- STILE SPECIFICO PER LA STAMPA --- */
        @media print {
            /* 1. Forza la pagina a usare tutta la larghezza e rimuove margini inutili */
            html, body {
                width: 100%;
                margin: 0;
                padding: 0;
                overflow: visible !important; /* Rimuove qualsiasi scrollbar */
            }

            /* 2. La tabella deve occupare il 100% del foglio */
            table {
                width: 100% !important;
                table-layout: auto; /* 'auto' permette alle celle di adattarsi al contenuto */
                page-break-inside: auto;
            }

            /* 3. Gestione dei testi lunghi */
            td, th {
                word-wrap: break-word;      /* Spezza le parole lunghe */
                overflow-wrap: break-word; /* Standard moderno per andare a capo */
                white-space: normal;       /* Forza il testo a non stare su una riga sola */
                border: 1px solid #000;    /* Rende i bordi più scuri per la stampa */
            }

            tr {
                page-break-inside: avoid; /* Evita che una riga venga tagliata a metà tra due pagine */
                page-break-after: auto;
            }

            /* 4. Nascondi bottoni o elementi che non vuoi nel PDF */
            .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body>

    <div id="content">
        <table id="myTable">
            <thead>
                <tr>
                    <th>Colonna 1</th>
                    <th>Descrizione Lunga</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Dato breve</td>
                    <td>Questo è un esempio di testo molto lungo che deve andare a capo automaticamente quando stampiamo il foglio, occupando tutta la larghezza disponibile senza creare barre di scorrimento orizzontali.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <button class="no-print" onclick="window.print()">Stampa PDF</button>

    <script>
        // Logica per ricevere dati da Glide (se lo stai usando come colonna)
        window.addEventListener("message", (event) => {
            if (event.data && event.data.params) {
                const p = event.data.params;
                // Qui inserisci la logica per popolare la tabella con p.input1, ecc.
                // Esempio: document.getElementById('dato').innerText = p.input1;
                
                // Opzionale: rimanda un feedback a Glide
                window.parent.postMessage({ result: "Tabella Pronta" }, "*");
            }
        });
    </script>
</body>
</html>
    `);
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
}
