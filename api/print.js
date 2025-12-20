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
          <title>FlipJudge Print</title>
          
          <link rel="stylesheet" href="https://unpkg.com/gutenberg-css@0.7/dist/gutenberg.min.css" media="all">
          <link rel="stylesheet" href="https://unpkg.com/gutenberg-css@0.7/dist/themes/oldstyle.min.css" media="all">

          <style>
              /* 1. RESET E FONT ARIAL */
              * {
                  font-family: Arial, Helvetica, sans-serif !important;
                  background: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
              }

              html, body {
                  width: 100% !important;
                  overflow: visible !important;
              }

              /* 2. TITOLI RIDOTTI E ALLINEATI A SINISTRA */
              h1, h2, h3, h4, h5, h6 {
                  text-align: left !important;
                  font-weight: bold !important;
                  margin-top: 0.4rem !important;
                  margin-bottom: 0.4rem !important;
              }
              h1 { font-size: 1.3rem !important; }
              h2 { font-size: 1.1rem !important; }
              h3 { font-size: 1rem !important; }

              /* 3. TABELLA DINAMICA E INTELLIGENTE */
              table {
                  width: 100% !important;
                  max-width: 100% !important;
                  margin: 1rem 0 !important;
                  table-layout: auto !important; 
                  border-collapse: collapse !important;
              }

              th, td {
                  vertical-align: top !important;
                  text-align: left !important;
                  padding: 6px 8px !important;
                  font-size: 9pt !important;
                  white-space: normal !important;
                  word-break: keep-all !important; 
                  overflow-wrap: break-word !important;
                  border: 1px solid black !important;
              }

              th {
                  white-space: nowrap !important;
                  background-color: #f2f2f2 !important;
              }

              /* 4. LAYOUT INTESTAZIONE */
              .header-container {
                  border-bottom: 1.5px solid #000;
                  margin-bottom: 1rem;
                  padding-bottom: 0.5rem;
              }

              /* 5. FOOTER RIPETUTO IN OGNI PAGINA */
              .print-footer {
                  display: none; /* Nascosto a video */
              }

              @media print {
                  @page {
                      margin: 1.5cm;
                      size: A4 portrait;
                  }

                  body {
                      padding: 0 !important;
                      /* Riserva spazio in fondo a ogni pagina per il footer fisso */
                      margin-bottom: 1.5cm !important;
                  }

                  .print-footer {
                      display: block !important;
                      position: fixed;
                      bottom: 0;
                      left: 0;
                      width: 100%;
                      height: 1cm;
                      text-align: left;
                      font-size: 8pt;
                      border-top: 1px solid #ccc;
                      padding-top: 4px;
                      background: white;
                  }

                  .no-print { display: none !important; }
              }

              /* Visualizzazione a video (fallback) */
              body { padding: 1cm; }
          </style>
      </head>
      <body>
          <div class="header-container">
              <h1 style="margin:0;">FlipJudge AI Check</h1>
              <h3 style="margin:5px 0; font-weight: normal !important;">Competition: <strong>${cleanComp}</strong></h3>
          </div>

          <div id="content-area">
              ${cleanBody}
          </div>

          <div class="print-footer">
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
