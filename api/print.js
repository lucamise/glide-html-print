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
              /* 1. RESET COLORI E VISIBILITÀ */
              * {
                  background: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  max-height: none !important;
                  overflow: visible !important;
              }

              /* 2. MARGINI STANDARD */
              @media print {
                  @page { 
                      margin: 1.5cm; 
                      size: auto; 
                  }
                  body { 
                      margin: 0 !important; 
                      padding: 0 !important; 
                      width: 100% !important;
                  }
                  .no-print { display: none !important; }
              }

              html, body { 
                  width: 100% !important; 
                  height: auto !important;
                  margin: 0; 
                  padding: 0; 
              }

              body { 
                  padding: 1cm; 
                  font-family: sans-serif;
              }

              /* 3. TABELLA ADATTIVA */
              table {
                  display: table !important;
                  width: 100% !important;
                  border-collapse: collapse !important;
                  table-layout: auto !important; 
                  margin: 20px 0 !important;
                  border: none !important; /* Rimosso bordo esterno della tabella */
                  page-break-inside: auto !important;
              }

              tr {
                  page-break-inside: avoid !important;
                  page-break-after: auto !important;
              }

              th, td {
                  border: 1px solid black !important; /* Griglia interna */
                  padding: 8px !important;
                  vertical-align: top !important;
                  text-align: left !important;
                  
                  /* ANDATA A CAPO SULLE PAROLE INTERE */
                  white-space: normal !important;
                  word-break: normal !important; 
                  overflow-wrap: break-word !important; 
                  font-size: 10pt !important; /* FONT FISSO */
              }

              th { 
                  background-color: #f2f2f2 !important; 
                  font-weight: bold !important; 
              }

              .header-container {
                  border-bottom: 2px solid black !important;
                  margin-bottom: 20px;
                  padding-bottom: 10px;
              }
          </style>
      </head>
      <body>
          <div class="header-container">
              <h1 style="margin:0; font-size: 18pt;">FlipJudge AI Check</h1>
              <p style="margin:5px 0; font-size: 11pt;">Competition: <strong>${cleanComp}</strong></p>
          </div>

          <div id="content-area">
              ${cleanBody}
          </div>

          <div style="margin-top: 30px; font-size: 8pt; text-align: center; border-top: 1px solid black !important; padding-top: 10px;">
              FlipJudge AI Check | ${cleanDate} | ${cleanUser}
          </div>

          <script>
              window.onload = function() {
                  // Lancio della stampa immediato senza calcoli sul font
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
