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
              /* 1. RESET OVERRIDE PER GLIDE */
              /* Gutenberg è ottimo, ma forziamo la visibilità per evitare ogni scrollbar */
              html, body, #content-area, table {
                  overflow: visible !important;
                  height: auto !important;
                  max-height: none !important;
                  background: white !important;
              }

              body {
                  padding: 1.5cm !important; /* Margine interno al foglio */
              }

              /* 2. TABELLA: PULIZIA E ALLINEAMENTO */
              table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                  table-layout: auto !important; /* Le colonne si adattano al testo */
                  margin: 20px 0 !important;
                  border: none !important; /* Rimuove bordo esterno al tag table */
              }

              th, td {
                  border: 1px solid #333 !important; /* Bordo griglia interna */
                  padding: 8px !important;
                  vertical-align: top !important; /* Allineamento dritto in alto */
                  text-align: left !important;
                  
                  /* Andata a capo pulita (parole intere) */
                  white-space: normal !important;
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
                  font-size: 10pt !important;
              }

              th {
                  background-color: #f5f5f5 !important;
                  font-weight: bold !important;
              }

              /* 3. INTESTAZIONE E PIÈ DI PAGINA */
              .header-container {
                  border-bottom: 2px solid #000;
                  margin-bottom: 20px;
                  padding-bottom: 10px;
              }

              .print-footer {
                  margin-top: 30px;
                  border-top: 1px solid #ccc;
                  padding-top: 10px;
                  font-size: 9pt;
                  text-align: center;
                  color: #666;
              }

              @media print {
                  @page {
                      margin: 1.5cm; /* Lascia spazio per URL/Data del browser se attivo */
                  }
                  body {
                      padding: 0 !important; /* Usa il margine della @page */
                  }
              }
          </style>
      </head>
      <body>
          <div class="header-container">
              <h1 style="margin:0; font-size: 20pt;">FlipJudge AI Check</h1>
              <p style="margin:5px 0; font-size: 12pt;">Competition: <strong>${cleanComp}</strong></p>
          </div>

          <div id="content-area">
              ${cleanBody}
          </div>

          <div class="print-footer">
              FlipJudge AI Check | Stampato il: ${cleanDate} | Utente: ${cleanUser}
          </div>

          <script>
              window.onload = function() {
                  // Aspettiamo che Gutenberg applichi i suoi stili prima di stampare
                  setTimeout(() => { window.print(); }, 600);
              };
          </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}
