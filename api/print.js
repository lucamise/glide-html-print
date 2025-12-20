export default function handler(req, res) {
  try {
    const { body, comp, date, user } = req.query;
    if (!body) return res.status(400).send("Errore: Manca il contenuto.");

    const decodeSafe = (str) => {
        try { return decodeURIComponent(str || ""); } 
        catch (e) { return str || ""; }
    };

    const cleanBody = decodeSafe(body);
    const cleanComp = decodeSafe(comp);
    const cleanDate = decodeSafe(date);
    const cleanUser = decodeSafe(user);

    res.setHeader('Content-Type', 'text/html');

    res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
          <meta charset="UTF-8">
          <style>
              /* 1. RESET TOTALE PER LA STAMPA */
              html, body {
                  width: 100%;
                  height: auto !important;
                  margin: 0;
                  padding: 0;
                  background-color: white !important;
                  color: black !important;
                  font-family: sans-serif;
              }

              /* Margini gestiti dal browser per evitare URL tagliati o posizionamenti strani */
              @media print {
                  @page { 
                      margin: 1.5cm; 
                  }
                  .no-print { display: none !important; }
              }

              body {
                  padding: 1cm;
              }

              /* 2. LA TABELLA: PROPRIETÀ NATIVE PER EVITARE DISALLINEAMENTI */
              table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                  table-layout: auto !important; /* Le colonne si adattano al contenuto */
                  margin-top: 20px;
                  border: none !important; /* Rimuove il bordo esterno del tag table */
                  page-break-inside: auto;
              }

              thead {
                  display: table-header-group; /* Ripete l'intestazione su ogni pagina */
              }

              tr {
                  page-break-inside: avoid;
                  page-break-after: auto;
              }

              /* 3. LE CELLE: ALLINEAMENTO PERFETTO */
              th, td {
                  border: 1px solid black !important; /* Bordo interno della griglia */
                  padding: 8px;
                  text-align: left;
                  vertical-align: top !important; /* Tutte le celle partono dall'alto */
                  
                  /* GESTIONE TESTO: PAROLE INTERE */
                  white-space: normal !important;
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
                  font-size: 10pt;
              }

              th {
                  background-color: #eeeeee !important;
                  font-weight: bold;
              }

              /* 4. CONTENITORE PRINCIPALE (rimuove ogni limite di altezza) */
              #content-area, #content-area * {
                  max-height: none !important;
                  height: auto !important;
                  overflow: visible !important;
              }

              .header-container {
                  border-bottom: 2px solid black;
                  margin-bottom: 20px;
                  padding-bottom: 10px;
              }
          </style>
      </head>
      <body>
          <div class="header-container">
              <h1 style="margin:0; font-size: 18pt;">FlipJudge AI Check</h1>
              <p style="margin:5px 0; font-size: 11pt;">Competition: <strong>${cleanComp}</strong></p>
          </div>

          <div id="content-area">
              ${cleanBody}
          </div>

          <div style="margin-top: 30px; font-size: 8pt; text-align: center; border-top: 1px solid black; padding-top: 10px;">
              FlipJudge AI Check | Printed on: ${cleanDate} | User: ${cleanUser}
          </div>

          <script>
              window.onload = function() {
                  setTimeout(() => { window.print(); }, 500);
              };
          </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}
