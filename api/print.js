export default function handler(req, res) {
  try {
    const { body, comp, date, user } = req.query;
    if (!body) return res.status(400).send("Errore: Manca il contenuto.");

    const decodeSafe = (str) => {
        try { return decodeURIComponent(str || ""); } 
        catch (e) { return str || ""; }
    };

    const formatElegantDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            const pad = (n) => n.toString().padStart(2, '0');
            return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        } catch (e) {
            return dateStr;
        }
    };

    const cleanBody = decodeSafe(body);
    const cleanComp = decodeSafe(comp);
    const elegantDate = formatElegantDate(decodeSafe(date));
    const cleanUser = decodeSafe(user);

    res.setHeader('Content-Type', 'text/html');

    res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
          <meta charset="UTF-8">
          <title>FlipJudge Print Preview</title>
          
          <link rel="stylesheet" href="https://unpkg.com/gutenberg-css@0.7/dist/gutenberg.min.css" media="all">
          <link rel="stylesheet" href="https://unpkg.com/gutenberg-css@0.7/dist/themes/oldstyle.min.css" media="all">

          <style>
              /* 1. RESET E FONT */
              * {
                  font-family: Arial, Helvetica, sans-serif !important;
                  background-color: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
              }

              html, body {
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
              }

              /* 2. LAYOUT HEADER (IL CUORE DELLA TUA RICHIESTA) */
              .header-container {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-end; /* Allinea le ultime righe in basso */
                  border-bottom: 1.5px solid #000;
                  padding-bottom: 0.5rem;
                  margin-bottom: 1rem;
                  width: 100%;
              }

              /* Blocco Sinistra */
              .left-block {
                  text-align: left;
              }
              .left-block h1 {
                  font-size: 1.3rem !important;
                  font-weight: bold !important;
                  margin: 0 !important;
                  line-height: 1.2;
              }
              .left-block .comp-info {
                  font-size: 10pt;
                  margin-top: 2px;
              }

              /* Blocco Destra */
              .right-block {
                  text-align: right;
                  font-size: 8pt;
                  color: #444;
              }
              .right-block .meta-info {
                  margin-bottom: 2px;
              }
              .right-block .app-info a {
                  color: #444 !important;
                  text-decoration: none !important;
              }

              /* 3. TABELLA */
              table {
                  width: 100% !important;
                  max-width: 100% !important;
                  border-collapse: collapse !important;
                  margin: 1rem 0 !important;
                  table-layout: auto !important;
              }

              td, th {
                  border: 1px solid black !important;
                  padding: 6px 8px !important;
                  font-size: 9pt !important;
                  vertical-align: top !important;
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
              }
              th { background-color: #f2f2f2 !important; }

              /* --- LAYOUT SCHERMO VS STAMPA --- */
              @media screen {
                  body {
                      background-color: #f0f0f0 !important;
                      display: flex;
                      justify-content: center;
                      padding: 2rem 0;
                  }
                  #page-container {
                      background-color: white !important;
                      width: 210mm;
                      min-height: 297mm;
                      padding: 1.5cm !important;
                      box-shadow: 0 0 10px rgba(0,0,0,0.1);
                  }
              }

              @media print {
                  @page { margin: 1.5cm; size: A4 portrait; }
                  body { background-color: white !important; padding: 0 !important; margin: 0 !important; }
                  #page-container { width: 100% !important; padding: 0 !important; box-shadow: none !important; }
                  tr { page-break-inside: avoid !important; }
              }
          </style>
      </head>
      <body>
          <div id="page-container">
              <div class="header-container">
                  <div class="left-block">
                      <h1>FlipJudge AI Check</h1>
                      <div class="comp-info">Competition: <strong>${cleanComp}</strong></div>
                  </div>

                  <div class="right-block">
                      <div class="meta-info">Printed on: ${elegantDate} | User: ${cleanUser}</div>
                      <div class="app-info">App: <a href="https://flipjudge.glide.page/">https://flipjudge.glide.page/</a></div>
                  </div>
              </div>

              <div id="content-area">
                  ${cleanBody}
              </div>
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
