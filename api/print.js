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
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css">
          <style>
              /* 1. RESET TOTALE */
              * {
                  background: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  max-height: none !important;
              }

              /* 2. MARGINI DI STAMPA STANDARD */
              @media print {
                  @page { 
                      margin: 1.5cm; 
                      size: auto; 
                  }
                  body { 
                      margin: 0 !important; 
                      padding: 0 !important; 
                  }
                  .no-print { display: none !important; }
              }

              html, body { 
                  width: 100% !important; 
                  margin: 0; 
                  padding: 0; 
              }

              body { 
                  padding: 1cm; 
                  font-family: sans-serif;
              }

              /* 3. FIX TABELLA: ALLINEAMENTO E COERENZA COLONNE */
              table {
                  display: table !important; /* Forza il comportamento tabella */
                  width: 100% !important;
                  border-collapse: collapse !important;
                  /* 'auto' garantisce che se una cella si allarga, si allarga TUTTA la colonna */
                  table-layout: auto !important; 
                  margin: 20px 0 !important;
                  border: none !important;
                  page-break-inside: auto !important;
              }

              tr {
                  display: table-row !important;
                  page-break-inside: avoid !important;
                  vertical-align: top !important;
              }

              th, td {
                  /* FORZA IL COMPORTAMENTO DA CELLA (impedisce l'effetto 'storto') */
                  display: table-cell !important; 
                  border: 1px solid black !important;
                  padding: 8px !important;
                  
                  /* ALLINEAMENTO VERTICALE PERFETTO */
                  vertical-align: top !important; 
                  text-align: left !important;
                  
                  /* GESTIONE TESTO: PAROLE INTERE */
                  white-space: normal !important;
                  word-break: normal !important; 
                  overflow-wrap: break-word !important; 
                  font-size: 10pt !important;
              }

              /* Rimuove eventuali div interni alle celle che rompono l'allineamento */
              td > div, th > div {
                  display: inline !important;
                  overflow: visible !important;
              }

              th { 
                  background-color: #f2f2f2 !important; 
                  font-weight: bold !important; 
              }

              .header-container {
                  border-bottom: 2px solid black !important;
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

          <div style="margin-top: 30px; font-size: 8pt; text-align: center; border-top: 1px solid black !important; padding-top: 10px;">
              FlipJudge AI Check | ${cleanDate} | ${cleanUser}
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
