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
              /* 1. RESET TOTALE COLORI E SFONDI (PER RISPARMIARE INCHIOSTRO E PULIZIA) */
              * {
                  background-color: white !important;
                  background-image: none !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  box-shadow: none !important;
                  text-shadow: none !important;
              }

              /* 2. KILL DEFINITIVO DELLE BARRE DI SCORRIMENTO */
              /* Applichiamo overflow visible a qualsiasi cosa, anche ai div annidati nel body di Glide */
              html, body, div, table, tr, td, th, section, main {
                  overflow: visible !important;
                  overflow-x: visible !important;
                  overflow-y: visible !important;
                  height: auto !important;
                  max-height: none !important;
                  min-height: 0 !important;
              }

              body {
                  margin: 0;
                  padding: 10mm; /* Margine standard per stampanti */
                  width: 100% !important;
                  display: block !important;
              }

              /* 3. FIX TABELLA: NIENTE SCROLLBAR, TUTTA LARGHEZZA */
              table {
                  width: 100% !important;
                  max-width: 100% !important;
                  min-width: 100% !important;
                  table-layout: fixed !important; /* Forza il wrap del testo */
                  border-collapse: collapse !important;
                  border: 1px solid #000 !important;
                  margin-bottom: 20px !important;
              }

              th, td {
                  border: 1px solid #000 !important;
                  padding: 6px !important;
                  white-space: normal !important;   /* Fondamentale per andare a capo */
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
                  word-break: break-all !important; /* Spezza codici lunghi */
                  vertical-align: top !important;
                  font-size: 10pt !important;
              }

              /* Rimuove eventuali barre di scorrimento webkit nascoste */
              ::-webkit-scrollbar {
                  display: none !important;
              }

              /* 4. REGOLE SPECIFICHE PER IL MOMENTO DELLA STAMPA */
              @media print {
                  @page {
                      margin: 0; /* Gestiamo i margini tramite il body */
                      size: portrait;
                  }
                  body {
                      padding: 1cm;
                  }
                  .no-print {
                      display: none !important;
                  }
                  /* Forza la visibilità del testo nero su bianco */
                  * {
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                  }
              }

              .header-container {
                  border-bottom: 2px solid #000;
                  margin-bottom: 20px;
                  padding-bottom: 10px;
              }
          </style>
      </head>
      <body>
          <div class="header-container">
              <h1 style="margin:0; font-size: 20pt;">FlipJudge AI Check</h1>
              <p style="margin:5px 0; font-size: 12pt;">Competition: <strong>${cleanComp}</strong></p>
          </div>

          <div id="content-area">
              ${cleanBody}
          </div>

          <div style="margin-top: 30px; border-top: 1px solid #000; padding-top: 10px; text-align: center; font-size: 8pt;">
              FlipJudge AI Check | Data: ${cleanDate} | Utente: ${cleanUser}
          </div>

          <script>
              window.onload = function() {
                  // Aspettiamo un attimo per assicurarci che i CSS abbiano "piallato" gli stili di Glide
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
