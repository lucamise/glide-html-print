export default function handler(req, res) {
  try {
    const { body, comp, date, user } = req.query;

    if (!body) {
      return res.status(400).send("Errore: Manca il contenuto (body).");
    }

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
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>FlipJudge Print</title>
          
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css">
          
          <style>
              /* --- RESET PER STAMPA PULITA --- */
              html, body { 
                  margin: 0; 
                  padding: 0; 
                  width: 100% !important; 
                  overflow: visible !important; /* Rimuove lo scroll */
              }

              body { padding: 20px; font-family: sans-serif; }
              
              /* --- FIX TOTALE PER LE TABELLE --- */
              table {
                  width: 100% !important;
                  max-width: 100% !important;
                  table-layout: auto !important; /* Permette alla tabella di adattarsi ma stare nei bordi */
                  border-collapse: collapse !important;
                  margin: 20px 0 !important;
                  overflow: visible !important;
              }

              /* Rimuove eventuali contenitori con scrollbar che Glide o mini.css potrebbero inserire */
              div { 
                  overflow: visible !important; 
                  max-width: 100% !important; 
              }

              table th, table td {
                  border: 1px solid #ddd !important;
                  padding: 8px !important;
                  text-align: left !important;
                  
                  /* Forza l'andata a capo */
                  white-space: normal !important; 
                  word-break: break-word !important;
                  overflow-wrap: break-word !important;
                  
                  /* Impedisce al contenuto di allargare la cella oltre il foglio */
                  max-width: 0; /* Trucco CSS: in combinazione con width 100% forza il wrap */
                  width: auto;
              }

              th { background-color: #f8f8f8 !important; }

              /* HEADER */
              .header-container { 
                  border-bottom: 2px solid #000; 
                  padding-bottom: 10px; 
                  margin-bottom: 20px; 
              }

              /* --- STILE SPECIFICO PER STAMPA --- */
              @media print {
                  @page { margin: 1cm; size: auto; }
                  body { padding: 0; }
                  .no-print { display: none !important; }
                  
                  table { 
                      page-break-inside: auto; 
                  }
                  tr { 
                      page-break-inside: avoid; 
                      page-break-after: auto; 
                  }

                  .print-footer-fix { 
                      position: fixed; 
                      bottom: 0; 
                      width: 100%; 
                      text-align: center;
                      font-size: 8pt;
                      border-top: 1px solid #eee;
                      padding-top: 5px;
                      background: white;
                  }
              }

              /* Footer anteprima */
              .print-footer-fix { 
                  margin-top: 50px; 
                  border-top: 1px solid #ccc; 
                  padding: 10px; 
                  text-align: center; 
                  font-size: 10px; 
                  color: #666; 
              }
          </style>
      </head>
      <body>

          <div class="header-container">
              <h1 style="margin: 0; font-size: 1.4rem; text-transform: uppercase;">FlipJudge AI Check</h1>
              <h3 style="margin: 5px 0 0; font-size: 1rem; font-weight: normal; color: #333;">Competition: <strong>${cleanComp}</strong></h3>
          </div>

          <div id="main-content">
              ${cleanBody}
          </div>

          <div class="print-footer-fix">
              FlipJudge AI Check | https://flipjudge.glide.page | Printed on ${cleanDate} | User: ${cleanUser}
          </div>

          <script>
              window.onload = function() { 
                  // Piccolo delay per assicurarsi che i CSS siano caricati prima della stampa
                  setTimeout(() => { window.print(); }, 500); 
              };
          </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
}
