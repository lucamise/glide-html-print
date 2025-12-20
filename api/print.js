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
                  overflow: visible !important;
                  max-height: none !important;
              }

              /* 2. RIDUZIONE E ALLINEAMENTO TITOLI */
              h1, h2, h3, h4, h5, h6 {
                  text-align: left !important;
                  font-weight: bold !important;
                  margin-top: 0.5rem !important;
                  margin-bottom: 0.5rem !important;
              }

              h1 { font-size: 1.4rem !important; } /* Dimensione ridotta */
              h2 { font-size: 1.2rem !important; }
              h3 { font-size: 1.1rem !important; }
              h4, h5, h6 { font-size: 1rem !important; }

              body {
                  padding: 1cm !important;
                  width: 100% !important;
              }

              /* 3. TABELLE: DEFAULT GUTENBERG */
              /* Rimuoviamo i nostri bordi custom per lasciare quelli di Gutenberg */
              table {
                  width: 100% !important;
                  margin: 1rem 0 !important;
                  /* Gutenberg gestisce bordi e spaziature internamente */
              }

              th, td {
                  vertical-align: top !important;
                  text-align: left !important;
                  padding: 0.5rem !important;
                  font-size: 10pt !important;
              }

              /* 4. LAYOUT INTESTAZIONE E FOOTER */
              .header-container {
                  border-bottom: 1.5px solid #000;
                  margin-bottom: 1.5rem;
                  padding-bottom: 0.5rem;
                  text-align: left;
              }

              .print-footer {
                  margin-top: 2rem;
                  border-top: 1px solid #ddd;
                  padding-top: 0.5rem;
                  font-size: 8pt;
                  text-align: left;
                  color: #444;
              }

              @media print {
                  @page {
                      margin: 1.5cm;
                  }
                  body {
                      padding: 0 !important;
                  }
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
              FlipJudge AI Check | Stampato il: ${cleanDate} | Utente: ${cleanUser}
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
