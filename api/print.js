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
              /* 1. RESET TOTALE DELLE DIMENSIONI */
              * { 
                  box-sizing: border-box !important; /* Impedisce al padding di allargare i div */
                  -webkit-print-color-adjust: exact;
              }

              html, body {
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow-x: hidden !important; /* Nasconde lo sforamento orizzontale */
              }

              body {
                  padding: 15px !important; /* Unico margine interno ammesso */
                  display: block !important;
              }

              /* 2. FIX PER IL DIV CONTENT-AREA */
              #content-area {
                  width: 100% !important;
                  max-width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  display: block !important;
                  overflow: visible !important;
              }

              /* 3. TRATTAMENTO D'URTO PER LE TABELLE */
              table {
                  width: 100% !important;
                  max-width: 100% !important;
                  table-layout: fixed !important; /* OBBLIGA le colonne a stare nel foglio */
                  border-collapse: collapse !important;
                  margin: 20px 0 !important;
              }

              th, td {
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
                  word-break: break-all !important; /* Spezza parole lunghe se necessario */
                  white-space: normal !important;   /* Forza l'andata a capo */
                  border: 1px solid #ddd !important;
                  padding: 8px !important;
                  font-size: 11px !important;      /* Riduce leggermente il font per sicurezza */
              }

              /* 4. REGOLE SPECIFICHE PER LA STAMPA */
              @media print {
                  @page { 
                      margin: 1cm; 
                      size: portrait; 
                  }
                  
                  body { padding: 0 !important; }
                  
                  .no-print { display: none !important; }

                  .print-footer-fix { 
                      position: fixed; 
                      bottom: 0; 
                      width: 100%; 
                      font-size: 9px; 
                      text-align: center;
                      border-top: 1px solid #eee;
                      padding-top: 5px;
                  }
              }

              .header-container { 
                  border-bottom: 2px solid #000; 
                  margin-bottom: 15px; 
                  width: 100%; 
              }
          </style>
      </head>
      <body>
          <div class="header-container">
              <h1 style="margin:0; font-size: 20px;">FlipJudge AI Check</h1>
              <p style="margin:5px 0; font-size: 14px;">Competition: <strong>${cleanComp}</strong></p>
          </div>

          <div id="content-area">
              ${cleanBody}
          </div>

          <div class="print-footer-fix">
              FlipJudge AI Check | Printed: ${cleanDate} | User: ${cleanUser}
          </div>

          <script>
              window.onload = function() { 
                  setTimeout(() => { window.print(); }, 400); 
              };
          </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}
