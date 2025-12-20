export default function handler(req, res) {
  try {
    // Leggiamo i parametri separati
    const { body, comp, date, user } = req.query;

    if (!body) {
      return res.status(400).send("Errore: Manca il contenuto (body).");
    }

    // Decodifica "soft" per sicurezza
    const decodeSafe = (str) => {
        try { return decodeURIComponent(str || ""); } 
        catch (e) { return str || ""; }
    };

    const cleanBody = decodeSafe(body);
    const cleanComp = decodeSafe(comp);
    const cleanDate = decodeSafe(date);
    const cleanUser = decodeSafe(user);

    res.setHeader('Content-Type', 'text/html');

    // Costruiamo la pagina
    res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>FlipJudge Print</title>
          
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css">
          
          <style>
              body { padding: 20px; padding-bottom: 50px; }
              
              /* STILE HEADER AGGIORNATO */
              .header-container { 
                  border-bottom: 1px solid #000; 
                  padding-bottom: 8px; 
                  margin-bottom: 20px; 
                  text-align: left; /* Allineato a SINISTRA */
              }

              /* Stile per la stampa */
              @media print {
                  @page { margin: 1cm; }
                  .no-print { display: none; }
                  
                  .print-footer-fix { 
                      position: fixed; 
                      bottom: 0; 
                      left: 0; 
                      width: 100%; 
                      background: white; 
                      border-top: 1px solid #ccc; 
                      padding-top: 5px; 
                      text-align: center; 
                      font-size: 9px; /* Footer piccolo */
                      color: #555; 
                  }
              }
              
              /* Footer per anteprima a video */
              .print-footer-fix { 
                  margin-top: 30px; 
                  border-top: 1px solid #ccc; 
                  padding-top: 5px; 
                  text-align: center; 
                  font-size: 9px; 
                  color: #555; 
              }
          </style>
      </head>
      <body>

          <div class="header-container">
              <h1 style="margin: 0; font-size: 1.2rem; text-transform: uppercase;">FlipJudge AI Check</h1>
              
              <h3 style="margin: 2px 0 0; font-size: 0.9rem; font-weight: normal; color: #555;">Competition: ${cleanComp}</h3>
          </div>

          <div>
              ${cleanBody}
          </div>

          <div class="print-footer-fix">
              FlipJudge AI Check | https://flipjudge.glide.page | Printed on ${cleanDate} | ${cleanUser}
          </div>

          <script>
              window.onload = function() { window.print(); };
          </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
}
