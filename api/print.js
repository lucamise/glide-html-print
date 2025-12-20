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
                  background-color: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
              }

              html, body {
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
              }

              /* 2. MARGINI PAGINA AUMENTATI (Sopra e Sotto) */
              body {
                  /* 1.5cm sopra/sotto, 1.5cm ai lati */
                  padding: 1.5cm 1.5cm 2.5cm 1.5cm !important; 
              }

              /* 3. TITOLI ALLINEATI A SINISTRA E COMPATTI */
              h1, h2, h3, h4, h5, h6 {
                  text-align: left !important;
                  font-weight: bold !important;
                  margin-top: 0.3rem !important;
                  margin-bottom: 0.3rem !important;
              }
              h1 { font-size: 1.3rem !important; }
              h3 { font-size: 1rem !important; }

              /* 4. TABELLA: DEFAULT GUTENBERG CON LIMITE LARGHEZZA */
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
                  /* Sicurezza per contenuti lunghi */
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
              }

              th {
                  background-color: #f2f2f2 !important;
                  font-weight: bold !important;
              }

              /* 5. INTESTAZIONE */
              .header-container {
                  border-bottom: 1.5px solid #000;
                  margin-bottom: 1rem;
                  padding-bottom: 0.3rem;
              }

              /* 6. FOOTER FISSO "SOPRA" IL MARGINE */
              .print-footer {
                  position: fixed;
                  /* Alzato dal bordo: 1cm dal fondo del foglio */
                  bottom: 0.8cm; 
                  left: 1.5cm;
                  right: 1.5cm;
                  background: white;
                  border-top: 1px solid #ddd;
                  padding-top: 5px;
                  font-size: 8pt;
                  text-align: left;
                  z-index: 9999;
              }

              @media print {
                  @page {
                      margin: 0; /* Gestito dal padding del body */
                      size: A4 portrait;
                  }
                  body {
                      /* Margine di sicurezza per non sovrapporsi al footer fisso */
                      padding: 1.5cm 1.5cm 2.5cm 1.5cm !important;
                  }
                  tr { page-break-inside: avoid !important; }
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
