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
              /* 1. CARATTERE E ALLINEAMENTO GLOBALE */
              * {
                  font-family: Arial, Helvetica, sans-serif !important;
                  background: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  overflow: visible !important;
                  max-height: none !important;
              }

              h1, h2, h3, h4, h5, h6 {
                  text-align: left !important;
                  margin-bottom: 0.5rem;
                  font-weight: bold;
              }

              body {
                  padding: 1.5cm !important;
                  width: 100% !important;
              }

              /* 2. TABELLA: ALLINEAMENTO COLONNE E GRIGLIA */
              table {
                  display: table !important;
                  width: 100% !important;
                  border-collapse: collapse !important;
                  table-layout: auto !important; /* Le colonne si allargano in base al contenuto */
                  margin: 20px 0 !important;
                  border: none !important; /* Nessun bordo esterno al tag table */
              }

              tr {
                  page-break-inside: avoid !important;
              }

              th, td {
                  border: 1px solid #000 !important; /* Griglia interna nera decisa */
                  padding: 8px !important;
                  vertical-align: top !important;
                  text-align: left !important;
                  font-size: 10pt !important;
                  
                  /* Andata a capo pulita (parole intere) */
                  white-space: normal !important;
                  word-break: normal !important;
                  overflow-wrap: break-word !important;
              }

              th {
                  background-color: #f0f0f0 !important;
                  font-size: 10pt !important;
              }

              /* 3. LAYOUT INTESTAZIONE */
              .header-container {
                  border-bottom: 2px solid #000;
                  margin-bottom: 25px;
                  padding-bottom: 10px;
                  text-align: left;
              }

              .print-footer {
                  margin-top: 40px;
                  border-top: 1px solid #000;
                  padding-top: 10px;
                  font-size: 9pt;
                  text-align: left; /* Coerenza con il resto del documento */
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
              <h1 style="margin:0; font-size: 22pt;">FlipJudge AI Check</h1>
              <h3 style="margin:5px 0; font-size: 12pt; font-weight: normal;">Competition: <strong>${cleanComp}</strong></h3>
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
