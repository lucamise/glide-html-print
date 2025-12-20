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
              /* 1. RESET GLOBALE E COLORE */
              * {
                  background: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  box-shadow: none !important;
              }

              html, body {
                  width: 100% !important;
                  height: auto !important; /* Permette alla pagina di crescere in altezza */
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow: visible !important; /* Indispensabile per non troncare il contenuto */
              }

              body {
                  padding: 15mm !important;
                  display: block !important;
              }

              /* 2. GESTIONE CONTENITORE */
              #content-area {
                  width: 100% !important;
                  height: auto !important;
                  overflow: visible !important;
                  display: block !important;
              }

              /* 3. TABELLA: ADATTAMENTO E ANDATA A CAPO PULITA */
              table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                  table-layout: auto !important; /* Permette alle colonne di gestire bene le parole */
                  margin-top: 20px !important;
                  page-break-inside: auto !important; /* Permette alla tabella di dividersi tra le pagine */
              }

              tr {
                  page-break-inside: avoid !important; /* Evita di tagliare una riga a metà tra due pagine */
                  page-break-after: auto !important;
              }

              th, td {
                  border: 1px solid black !important;
                  padding: 8px !important;
                  vertical-align: top !important;
                  font-size: 10pt !important;
                  text-align: left !important;

                  /* --- FIX ANDATA A CAPO: INTERE PAROLE --- */
                  white-space: normal !important;      /* Permette il wrap */
                  word-break: normal !important;      /* NON spezza le parole a metà */
                  overflow-wrap: break-word !important; /* Va a capo tra parole, spezza solo se una parola è infinita */
                  hyphens: auto !important;            /* Se supportato, usa la sillabazione corretta */
              }

              th {
                  background-color: #f2f2f2 !important;
                  font-weight: bold !important;
              }

              /* 4. REGOLE STAMPA */
              @media print {
                  @page { 
                      margin: 0; 
                      size: auto; 
                  }
                  body { padding: 1cm !important; }
                  .no-print { display: none !important; }
                  
                  /* Assicura che non ci siano scrollbar stampate */
                  ::-webkit-scrollbar { display: none !important; }
              }

              .header-container {
                  border-bottom: 2px solid black !important;
                  margin-bottom: 15px;
                  padding-bottom: 5px;
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

          <div style="margin-top: 30px; font-size: 8pt; text-align: center; border-top: 1px solid black !important; padding-top: 5px;">
              FlipJudge AI Check | ${cleanDate} | ${cleanUser}
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
