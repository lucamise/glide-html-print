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
          <title>Print</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css">
          <style>
              /* 1. ELIMINA OGNI SCROLLBAR (Orizzontale e Verticale) */
              html, body, div, section, main {
                  overflow: visible !important;
                  height: auto !important;
                  max-height: none !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  margin: 0;
                  padding: 0;
              }

              body { padding: 20px; }

              /* 2. FORZA LA TABELLA A OCCUPARE SOLO LA LARGHEZZA DEL FOGLIO */
              table {
                  width: 100% !important;
                  table-layout: fixed !important; /* Obbliga le colonne a stare nel 100% */
                  border-collapse: collapse !important;
                  margin-top: 20px;
              }

              /* 3. VA A CAPO AUTOMATICAMENTE E NON SCROLLA */
              th, td {
                  white-space: normal !important;   /* Forza il testo ad andare a capo */
                  word-break: break-all !important;  /* Spezza le parole lunghissime */
                  overflow-wrap: break-word !important;
                  border: 1px solid #ccc !important;
                  padding: 8px !important;
                  vertical-align: top;
              }

              .header-container { border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
              
              @media print {
                  @page { margin: 1cm; }
                  .no-print { display: none; }
                  .print-footer-fix { position: fixed; bottom: 0; width: 100%; font-size: 9px; text-align: center; }
              }
          </style>
      </head>
      <body>
          <div class="header-container">
              <h1 style="margin:0;">FlipJudge AI Check</h1>
              <p>Competition: ${cleanComp}</p>
          </div>

          <div id="content">
              ${cleanBody}
          </div>

          <div class="print-footer-fix">
              Printed on ${cleanDate} | User: ${cleanUser}
          </div>

          <script>
              window.onload = function() { window.print(); };
          </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}
