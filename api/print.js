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
              /* 1. RESET TOTALE AGGRESSIVO */
              * {
                  background: white !important;
                  background-color: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  box-shadow: none !important;
                  border: none !important; /* Rimuove bordi da TUTTO */
              }

              html, body {
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow: visible !important;
                  -webkit-print-color-adjust: exact;
              }

              body {
                  padding: 10mm !important;
              }

              /* 2. TABELLA SENZA BORDI E SENZA PADDING */
              table {
                  width: 100% !important;
                  border: none !important;         /* Rimuove bordo esterno */
                  border-collapse: collapse !important;
                  padding: 0 !important;          /* Rimuove padding tabella */
                  margin: 0 !important;
                  table-layout: fixed !important;
                  overflow: visible !important;
              }

              th, td {
                  border: none !important;         /* Rimuove bordi celle */
                  padding: 0 !important;          /* Rimuove padding celle */
                  margin: 0 !important;
                  white-space: normal !important;
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
                  word-break: break-all !important;
                  vertical-align: top !important;
                  font-size: 10pt !important;
              }

              /* 3. CONTENITORE CONTENT-AREA */
              #content-area {
                  width: 100% !important;
                  overflow: visible !important;
                  border: none !important;
                  padding: 0 !important;
              }

              /* Rimuove scrollbar residue */
              ::-webkit-scrollbar { display: none !important; }

              @media print {
                  @page { margin: 0; size: portrait; }
                  .no-print { display: none !important; }
              }

              .header-container {
                  border-bottom: 1px solid #000 !important; /* L'unica linea che lasciamo */
                  margin-bottom: 10px;
                  padding-bottom: 5px;
              }
          </style>
      </head>
      <body>
          <div class="header-container">
              <h1 style="margin:0; font-size: 18pt;">FlipJudge AI Check</h1>
              <p style="margin:2px 0; font-size: 11pt;">Competition: ${cleanComp}</p>
          </div>

          <div id="content-area">
              ${cleanBody}
          </div>

          <div style="margin-top: 20px; font-size: 8pt; text-align: center; border-top: 0.5px solid #eee !important;">
              FlipJudge AI Check | ${cleanDate} | ${cleanUser}
          </div>

          <script>
              window.onload = function() {
                  setTimeout(() => { window.print(); }, 400);
              };
          </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}
