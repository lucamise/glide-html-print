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
              /* 1. RESET E FONT */
              * {
                  font-family: Arial, Helvetica, sans-serif !important;
                  background: white !important;
                  color: black !important;
                  /* Box-sizing è fondamentale per non far sbordare i padding */
                  box-sizing: border-box !important;
              }

              html, body {
                  width: 100% !important;
                  margin: 0;
                  padding: 0;
                  /* Evita scroll orizzontali fantasma */
                  overflow-x: hidden !important; 
              }

              /* 2. TITOLI RIDOTTI */
              h1, h2, h3, h4, h5, h6 {
                  text-align: left !important;
                  font-weight: bold !important;
                  margin-top: 0.3rem !important;
                  margin-bottom: 0.3rem !important;
              }
              h1 { font-size: 1.3rem !important; }
              h3 { font-size: 1rem !important; }

              /* 3. TABELLA: FIX PER L'OVERFLOW */
              table {
                  width: 100% !important;
                  /* Cruciale: impedisce alla tabella di ignorare il 100% */
                  max-width: 100% !important; 
                  margin: 1rem 0 !important;
                  /* Usiamo auto per flessibilità, ma con vincoli sulle celle */
                  table-layout: auto !important; 
                  border-collapse: collapse !important;
              }

              th, td {
                  vertical-align: top !important;
                  border: 1px solid black !important;
                  padding: 6px 8px !important;
                  font-size: 9pt !important;
                  
                  /* Permette il wrapping se lo spazio finisce */
                  white-space: normal !important; 
                  /* Spezza le parole solo se sono più lunghe della cella stessa */
                  overflow-wrap: break-word !important;
                  word-wrap: break-word !important;
                  word-break: normal !important;
              }

              th {
                  background-color: #f2f2f2 !important;
                  /* Rimosso nowrap per evitare che colonne troppe larghe spingano la tabella fuori */
                  font-weight: bold !important;
              }

              /* 4. LAYOUT FISSO E MARGINI */
              body {
                  /* Padding ridotto come richiesto (0.5cm sopra/sotto) */
                  padding: 0.5cm 1.5cm 1.5cm 1.5cm !important; 
              }

              .header-container {
                  border-bottom: 1.5px solid #000;
                  margin-bottom: 1rem;
                  padding-bottom: 0.5rem;
              }

              /* Footer fisso */
              .print-footer {
                  position: fixed;
                  bottom: 0;
                  left: 0;
                  width: 100%;
                  background: white;
                  border-top: 1px solid #ccc;
                  padding: 10px 1.5cm;
                  font-size: 8pt;
                  text-align: left;
                  z-index: 9999;
              }

              @media print {
                  @page {
                      margin: 0;
                      size: A4 portrait;
                  }

                  body {
                      /* Margini ridotti in stampa */
                      padding: 0.5cm 1.5cm 1.5cm 1.5cm !important;
                      margin: 0 !important;
                  }

                  .print-footer {
                      position: fixed;
                      bottom: 0;
                      /* Assicura che sia visibile in stampa */
                      padding: 0.3cm 1.5cm !important;
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
