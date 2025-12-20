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

              /* 2. TITOLI E INTESTAZIONE */
              h1 { 
                  text-align: left !important;
                  font-weight: bold !important;
                  font-size: 1.3rem !important;
                  margin: 0 0 0.2rem 0 !important;
              }

              .header-container {
                  border-bottom: 1.5px solid #000;
                  margin-bottom: 1rem;
                  padding-bottom: 0.4rem;
                  width: 100%;
              }

              /* Riga sotto il titolo: Flexbox per allineare sinistra/destra */
              .header-meta-row {
                  display: flex;
                  justify-content: space-between;
                  align-items: baseline;
                  width: 100%;
              }

              .comp-name {
                  font-size: 10pt;
                  text-align: left;
              }

              .print-meta {
                  font-size: 8pt;
                  color: #444;
                  text-align: right;
              }

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

              /* 4. MARGINI DI STAMPA */
              @media print {
                  @page {
                      margin: 1.5cm;
                      size: A4 portrait;
                  }
                  
                  body {
                      margin: 0 !important;
                      padding: 0 !important;
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
              <h1>FlipJudge AI Check</h1>
              <div class="header-meta-row">
                  <div class="comp-name">
                      Competition: <strong>${cleanComp}</strong>
                  </div>
                  <div class="print-meta">
                      Printed on: ${cleanDate} | User: ${cleanUser}
                  </div>
              </div>
          </div>

          <div id="content-area">
              ${cleanBody}
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
