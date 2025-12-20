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
              /* 1. RESET, FONT ARIAL E ALLINEAMENTO */
              * {
                  font-family: Arial, Helvetica, sans-serif !important;
                  background: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  overflow: visible !important;
                  max-height: none !important;
              }

              /* Allineamento a sinistra per tutti i titoli */
              h1, h2, h3, h4, h5, h6 {
                  text-align: left !important;
                  font-weight: bold !important;
                  margin-top: 0.4rem !important;
                  margin-bottom: 0.4rem !important;
              }

              /* Dimensioni titoli ridotte */
              h1 { font-size: 1.3rem !important; }
              h2 { font-size: 1.1rem !important; }
              h3 { font-size: 1rem !important; }
              h4, h5, h6 { font-size: 0.9rem !important; }

              body {
                  padding: 1cm !important;
                  width: 100% !important;
              }

              /* 2. TABELLA INTELLIGENTE DINAMICA */
              table {
                  width: 100% !important;
                  max-width: 100% !important;
                  margin: 1rem 0 !important;
                  table-layout: auto !important; /* Permette larghezze variabili basate sul contenuto */
                  border-collapse: collapse !important;
              }

              th, td {
                  vertical-align: top !important;
                  text-align: left !important;
                  padding: 6px 8px !important;
                  font-size: 9pt !important; /* Font leggermente più piccolo per far stare più dati */
                  
                  /* LOGICA INTELLIGENTE: 
                     - white-space: normal permette di andare a capo
                     - word-break: keep-all evita di spezzare nomi a metà (es. "Luca" non diventerà mai "Lu-ca")
                     - overflow-wrap: break-word spezza solo se una stringa è più lunga dell'intera colonna
                  */
                  white-space: normal !important;
                  word-break: keep-all !important; 
                  overflow-wrap: break-word !important;
              }

              /* Gli header delle colonne non devono MAI andare a capo per risparmiare spazio verticale */
              th {
                  white-space: nowrap !important;
                  background-color: #f2f2f2 !important;
                  font-weight: bold !important;
              }

              /* 3. LAYOUT INTESTAZIONE E FOOTER AGGIORNATO */
              .header-container {
                  border-bottom: 1.5px solid #000;
                  margin-bottom: 1rem;
                  padding-bottom: 0.5rem;
                  text-align: left;
              }

              .print-footer {
                  margin-top: 2rem;
                  border-top: 1px solid #ddd;
                  padding-top: 0.5rem;
                  font-size: 8pt;
                  text-align: left; /* Allineato a sinistra */
                  color: #444;
              }

              @media print {
                  @page {
                      margin: 1.5cm;
                      size: A4 portrait;
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
