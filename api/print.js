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
              /* 1. RESET TOTALE DEI VINCOLI DI ALTEZZA E SCROLL */
              *, html, body, div, section, main, article, table, tr, td {
                  background: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  /* Eliminiamo qualsiasi limite di altezza e forziamo la visibilità */
                  max-height: none !important;
                  height: auto !important;
                  overflow: visible !important;
                  overflow-x: visible !important;
                  overflow-y: visible !important;
              }

              html, body {
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
              }

              body {
                  padding: 15mm !important;
                  display: block !important;
              }

              /* 2. FORZIAMO LA TABELLA A COMPORTARSI DA TABELLA (E NON DA ELEMENTO BLOCK) */
              table {
                  display: table !important; /* mini.css a volte usa block per lo scroll */
                  width: 100% !important;
                  border-collapse: collapse !important;
                  table-layout: auto !important;
                  margin: 20px 0 !important;
                  page-break-inside: auto !important;
              }

              tr {
                  page-break-inside: avoid !important;
                  page-break-after: auto !important;
              }

              th, td {
                  border: 1px solid black !important;
                  padding: 8px !important;
                  vertical-align: top !important;
                  font-size: 10pt !important;
                  
                  /* --- WRAP PULITO DELLE PAROLE --- */
                  white-space: normal !important;
                  word-break: normal !important;      /* Non spezza le parole */
                  overflow-wrap: break-word !important; /* Va a capo solo se necessario */
                  text-align: left !important;
              }

              th { background-color: #f2f2f2 !important; font-weight: bold !important; }

              /* 3. PULIZIA EXTRA PER LA STAMPA */
              @media print {
                  @page { margin: 1cm; size: auto; }
                  body { padding: 0 !important; }
                  .no-print { display: none !important; }
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
