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
              /* 1. RESET GLOBALE E COLORI */
              *, html, body, div, section, main, article, table, tr, td {
                  background: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  max-height: none !important;
                  height: auto !important;
                  overflow: visible !important;
              }

              /* 2. GESTIONE MARGINI E TRUCCO ANTI-URL */
              @media print {
                  @page { 
                      margin: 0; /* Prova a rimuovere header/footer del browser */
                      size: auto; 
                  }
                  
                  body { 
                      margin: 0 !important;
                      /* RIMETTIAMO I MARGINI INTERNI (sopra, lati, sotto) */
                      padding: 20mm 15mm 15mm 15mm !important; 
                      width: 100% !important;
                  }

                  .no-print { display: none !important; }
                  ::-webkit-scrollbar { display: none !important; }
              }

              html, body { 
                  width: 100% !important; 
                  margin: 0 !important; 
                  padding: 0 !important; 
              }

              /* Visualizzazione a video */
              body { padding: 20mm 15mm; display: block !important; }

              /* 3. TABELLA ADATTIVA */
              table {
                  display: table !important;
                  width: 100% !important;
                  border-collapse: collapse !important;
                  table-layout: auto !important; 
                  margin: 20px 0 !important;
                  border: none !important;
                  page-break-inside: auto !important;
              }

              tr {
                  page-break-inside: avoid !important;
                  page-break-after: auto !important;
              }

              th, td {
                  border: 1px solid black !important;
                  padding: 8px !important;
                  vertical-align: top !important;
                  text-align: left !important;
                  white-space: normal !important;
                  word-break: normal !important; 
                  overflow-wrap: break-word !important; 
                  font-size: 10pt; /* Punto di partenza */
              }

              th { background-color: #f2f2f2 !important; font-weight: bold !important; }

              .header-container {
                  border-bottom: 2px solid black !important;
                  margin-bottom: 20px;
                  padding-bottom: 10px;
                  width: 100%;
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
              FlipJudge AI Check | Printed: ${cleanDate} | User: ${cleanUser}
          </div>

          <script>
              window.onload = function() {
                  const tables = document.querySelectorAll('table');
                  const container = document.getElementById('content-area');
                  const maxWidth = container.offsetWidth;

                  // Riduzione font se la tabella sfora lateralmente
                  tables.forEach(table => {
                      let fontSize = 10;
                      const minFontSize = 7; 
                      while (table.offsetWidth > maxWidth && fontSize > minFontSize) {
                          fontSize -= 0.5;
                          table.querySelectorAll('td, th').forEach(cell => {
                              cell.style.fontSize = fontSize + 'pt';
                          });
                      }
                  });

                  setTimeout(() => { window.print(); }, 600);
              };
          </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}
