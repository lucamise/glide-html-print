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
              /* 1. RESET SFONDO E SCROLLBAR */
              * {
                  background: white !important;
                  background-color: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  box-shadow: none !important;
              }

              html, body {
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow: visible !important;
              }

              body {
                  padding: 10mm !important;
              }

              /* 2. KILL SCROLLBAR RESIDUE */
              div, section, main, #content-area {
                  overflow: visible !important;
                  border: none !important; /* Rimuove bordi dai div contenitori */
                  padding: 0 !important;
                  width: 100% !important;
                  max-width: 100% !important;
              }

              /* 3. TABELLA: LARGHEZZA PIENA E BORDI INTERNI */
              table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                  table-layout: fixed !important; /* Forza il wrap e il 100% */
                  margin-top: 20px !important;
                  border: none !important; /* Rimuove il bordo esterno doppio */
              }

              /* Qui rimettiamo i bordi che volevi solo per le celle */
              th, td {
                  border: 1px solid black !important; /* Bordo cella visibile */
                  padding: 6px !important;
                  white-space: normal !important;
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
                  word-break: break-all !important;
                  vertical-align: top !important;
                  font-size: 10pt !important;
                  text-align: left !important;
              }

              th {
                  background-color: #eee !important; /* Un minimo di grigio per le testate */
                  font-weight: bold !important;
              }

              /* Rimuove scrollbar grafiche */
              ::-webkit-scrollbar { display: none !important; }

              @media print {
                  @page { margin: 0; size: portrait; }
                  .no-print { display: none !important; }
                  body { padding: 1cm !important; }
              }

              .header-container {
                  border-bottom: 2px solid black !important;
                  margin-bottom: 10px;
                  padding-bottom: 5px;
              }
          </style>
      </head>
      <body>
          <div class="header-container">
              <h1 style="margin:0; font-size: 18pt; border:none !important;">FlipJudge AI Check</h1>
              <p style="margin:2px 0; font-size: 11pt; border:none !important;">Competition: <strong>${cleanComp}</strong></p>
          </div>

          <div id="content-area">
              ${cleanBody}
          </div>

          <div style="margin-top: 30px; font-size: 8pt; text-align: center; border-top: 1px solid black !important; padding-top: 5px;">
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
