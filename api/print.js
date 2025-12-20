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
                  margin: 0 !important;
                  padding: 0 !important;
                  /* Impedisce lo scroll orizzontale che causa il taglio in stampa */
                  overflow-x: hidden !important; 
              }

              /* 2. TITOLI RIDOTTI E ALLINEATI A SINISTRA */
              h1, h2, h3, h4, h5, h6 {
                  text-align: left !important;
                  font-weight: bold !important;
                  margin-top: 0.5rem !important;
                  margin-bottom: 0.5rem !important;
              }
              h1 { font-size: 1.4rem !important; }
              h3 { font-size: 1.1rem !important; }

              body {
                  padding: 1cm !important;
              }

              /* 3. FIX DEFINITIVO LARGHEZZA TABELLA */
              table {
                  width: 100% !important;
                  max-width: 100% !important; /* Forza la tabella a non superare mai il foglio */
                  margin: 1rem 0 !important;
                  table-layout: auto !important;
                  border-collapse: collapse !important;
              }

              th, td {
                  vertical-align: top !important;
                  text-align: left !important;
                  padding: 6px !important;
                  font-size: 10pt !important;
                  
                  /* GESTIONE ANDATA A CAPO INTELLIGENTE */
                  white-space: normal !important;
                  word-break: normal !important; /* Non spezza le parole a caso */
                  overflow-wrap: anywhere !important; /* Spezza la parola SOLO se è l'unico modo per stare nel foglio */
              }

              /* 4. LAYOUT STAMPA */
              @media print {
                  @page {
                      margin: 1.5cm;
                      size: A4 portrait;
                  }
                  body {
                      padding: 0 !important;
                  }
                  /* Nasconde eventuali elementi che potrebbero causare overflow */
                  .no-print { display: none !important; }
              }

              .header-container {
                  border-bottom: 1.5px solid #000;
                  margin-bottom: 1.5rem;
                  padding-bottom: 0.5rem;
              }

              .print-footer {
                  margin-top: 2rem;
                  border-top: 1px solid #ddd;
                  padding-top: 0.5rem;
                  font-size: 8pt;
                  color: #444;
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
