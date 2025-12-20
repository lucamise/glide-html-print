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
              /* 1. RESET TOTALE DEI VINCOLI E COLORI */
              *, html, body, div, section, main, article, table, tr, td {
                  background: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  max-height: none !important; /* Rimosso ogni limite di altezza */
                  height: auto !important;
                  overflow: visible !important; /* Forza la visibilità totale (no scroll) */
              }

              html, body {
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
              }

              body {
                  padding: 10mm !important;
                  display: block !important;
              }

              /* 2. TABELLA: RIMOSSO IL BORDO ESTERNO */
              table {
                  display: table !important;
                  width: 100% !important;
                  border-collapse: collapse !important;
                  table-layout: auto !important;
                  margin: 20px 0 !important;
                  border: none !important; /* <--- BORDO TAG TABLE RIMOSSO */
                  page-break-inside: auto !important;
              }

              tr {
                  page-break-inside: avoid !important;
                  page-break-after: auto !important;
              }

              /* 3. BORDI SOLO SULLE CELLE */
              th, td {
                  border: 1px solid black !important; /* Manteniamo la griglia interna */
                  padding: 8px !important;
                  vertical-align: top !important;
                  font-size: 10pt !important;
                  text-align: left !important;

                  /* ANDATA A CAPO PULITA (PAROLE INTERE) */
                  white-space: normal !important;
                  word-break: normal !important; 
                  overflow-wrap: break-word !important; 
              }

              th { 
                  background-color: #f2f2f2 !important; 
                  font-weight: bold !important; 
              }

              /* 4. FIX STAMPA */
              @media print {
                  @page { margin: 1cm; size: auto; }
                  body { padding: 0 !important; }
                  .no-print { display: none !important; }
                  ::-webkit-scrollbar { display: none !important; }
              }

              .header-container {
                  border-bottom: 2px solid black !important;
                  margin-bottom: 15px;
                  padding-bottom: 5px;
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

          <div style="margin-top: 30px; font-size: 8pt; text-align: center; border-top: 1px solid black !important; padding-top: 5px;">
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
