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
              /* --- 1. KILL DEFINITIVO DI OGNI SCROLLBAR --- */
              /* Applichiamo overflow visible a TUTTI gli elementi per evitare contenitori nascosti */
              *, html, body, div, section, main, article {
                  overflow: visible !important;
                  overflow-x: visible !important;
                  overflow-y: visible !important;
                  height: auto !important;
                  max-height: none !important;
              }

              body { 
                  margin: 0; 
                  padding: 20px; 
                  width: 100% !important; 
                  display: block !important;
              }

              /* --- 2. LARGHEZZA FISSA E WRAP TESTO --- */
              table {
                  width: 100% !important;
                  max-width: 100% !important;
                  table-layout: fixed !important; /* Fondamentale: le colonne non possono uscire dal bordo */
                  border-collapse: collapse !important;
                  margin-bottom: 50px !important;
              }

              th, td {
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
                  word-break: break-all !important; /* Spezza codici o testi lunghi senza spazi */
                  white-space: normal !important;   /* Impedisce al testo di stare su una riga sola */
                  border: 1px solid #ccc !important;
                  padding: 8px !important;
                  vertical-align: top !important;
              }

              /* Fix per le immagini o icone che potrebbero allargare la tabella */
              img { max-width: 100% !important; height: auto !important; }

              /* --- 3. STILE HEADER E FOOTER --- */
              .header-container { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
              
              @media print {
                  @page { margin: 1cm; size: portrait; }
                  .no-print { display: none !important; }
                  .print-footer-fix { 
                      position: fixed; 
                      bottom: 0; 
                      left: 0;
                      width: 100%; 
                      font-size: 10px; 
                      text-align: center;
                      background: white;
                      border-top: 1px solid #ccc;
                  }
              }
          </style>
      </head>
      <body>
          <div class="header-container">
              <h1 style="margin:0; font-size: 24px;">FlipJudge AI Check</h1>
              <p style="margin:5px 0;">Competition: <strong>${cleanComp}</strong></p>
          </div>

          <div id="content-area">
              ${cleanBody}
          </div>

          <div class="print-footer-fix">
              FlipJudge AI Check | Printed: ${cleanDate} | User: ${cleanUser}
          </div>

          <script>
              window.onload = function() { 
                  // Piccolo delay per calcolare il layout prima di lanciare la stampa
                  setTimeout(() => { window.print(); }, 300); 
              };
          </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}
