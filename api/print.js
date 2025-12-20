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
              /* 1. FONT E STILE BASE */
              * {
                  font-family: Arial, Helvetica, sans-serif !important;
                  background-color: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
              }

              html, body {
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
              }

              /* 2. TITOLI SINISTRA E COMPATTI */
              h1, h2, h3, h4, h5, h6 {
                  text-align: left !important;
                  font-weight: bold !important;
                  margin: 0.2rem 0 !important;
              }
              h1 { font-size: 1.3rem !important; }
              h3 { font-size: 1rem !important; }

              /* 3. TABELLA: DEFAULT GUTENBERG + MAX WIDTH 100% */
              table {
                  width: 100% !important;
                  max-width: 100% !important;
                  border-collapse: collapse !important;
                  margin: 1rem 0 !important;
                  table-layout: auto !important;
              }

              td, th {
                  border: 1px solid black !important;
                  padding: 6px 8px !important;
                  font-size: 9pt !important;
                  vertical-align: top !important;
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
              }

              th {
                  background-color: #f2f2f2 !important;
                  font-weight: bold !important;
              }

              /* 4. HEADER CONTAINER */
              .header-container {
                  border-bottom: 1.5px solid #000;
                  margin-bottom: 1rem;
                  padding-bottom: 0.3rem;
              }

              /* 5. FOOTER: ULTIMA RIGA PRIMA DEL MARGINE */
              .print-footer {
                  position: fixed;
                  bottom: 0; /* Si attacca al limite inferiore dell'area stampabile */
                  left: 0;
                  right: 0;
                  background: white;
                  border-top: 1px solid #ddd;
                  padding-top: 5px;
                  font-size: 8pt;
                  text-align: left;
                  z-index: 9999;
              }

              @media print {
                  @page {
                      /* Margini bilanciati per dare spazio all'URL del browser senza coprire il footer */
                      margin: 1.5cm 1.5cm 1.5cm 1.5cm;
                      size: A4 portrait;
                  }
                  
                  body {
                      margin: 0 !important;
                      padding: 0 !important;
                      /* Evita che il contenuto vada a finire sotto l'ultima riga del footer */
                      padding-bottom: 1cm !important; 
                  }

                  .print-footer {
                      position: fixed;
                      bottom: 0;
                  }

                  tr { page-break-inside: avoid !important; }
              }

              /* Visualizzazione a video */
              body {
                  padding: 1.5cm;
              }
          </style>
      </head>
      <body>
          <div class="header-container">
              <h1 style="margin:0;">FlipJudge AI Check</h1>
              <h3 style="margin:2px 0; font-weight: normal !important;">Competition: <strong>${cleanComp}</strong></h3>
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
