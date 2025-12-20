export default function handler(req, res) {
  try {
    const { body, comp, date, user } = req.query;
    if (!body) return res.status(400).send("Errore: Manca il contenuto.");

    const decodeSafe = (str) => {
        try { return decodeURIComponent(str || ""); } 
        catch (e) { return str || ""; }
    };

    // Formattazione data elegante senza "pallini"
    const formatElegantDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            
            const options = { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            };
            // Formato standard elegante: 20 Dec 2025, 21:01
            return d.toLocaleDateString('en-GB', options);
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

              /* 2. GERARCHIA TITOLI */
              h1, h2, h3, h4, h5, h6 {
                  text-align: left !important;
                  font-weight: bold !important;
                  margin: 0.5rem 0 0.2rem 0 !important;
              }
              h1 { font-size: 1.4rem !important; letter-spacing: -0.5px; }
              h2 { font-size: 1.15rem !important; }
              h3 { font-size: 1.0rem !important; }

              /* 3. INTESTAZIONE RAFFINATA */
              .header-container {
                  border-bottom: 2px solid #000;
                  margin-bottom: 1.2rem;
                  padding-bottom: 0.5rem;
                  width: 100%;
              }

              .header-meta-row {
                  display: flex;
                  justify-content: space-between;
                  align-items: baseline;
                  width: 100%;
                  margin-top: 4px;
              }

              .comp-name { 
                  font-size: 10pt; 
                  color: #000;
              }

              .print-meta { 
                  font-size: 8.5pt; 
                  text-align: right; 
                  color: #444;
              }

              .meta-label {
                  text-transform: uppercase;
                  font-size: 7pt;
                  font-weight: bold;
                  color: #777;
                  margin-right: 4px;
              }

              .separator {
                  margin: 0 10px;
                  color: #ccc;
                  font-weight: normal;
              }

              /* 4. TABELLA: DEFAULT GUTENBERG + MAX WIDTH 100% */
              table {
                  width: 100% !important;
                  max-width: 100% !important;
                  border-collapse: collapse !important;
                  margin: 1.5rem 0 !important;
                  table-layout: auto !important;
              }

              td, th {
                  border: 1px solid #000 !important;
                  padding: 8px 10px !important;
                  font-size: 9pt !important;
                  vertical-align: top !important;
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
              }
              th { background-color: #f8f8f8 !important; font-weight: bold !important; }

              /* --- LAYOUT SCHERMO VS STAMPA --- */
              @media screen {
                  body {
                      background-color: #e8e8e8 !important;
                      display: flex;
                      justify-content: center;
                      padding: 3rem 0;
                  }
                  #page-container {
                      background-color: white !important;
                      width: 210mm;
                      min-height: 297mm;
                      padding: 1.5cm 2cm !important;
                      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                  }
              }

              @media print {
                  @page {
                      margin: 1.5cm;
                      size: A4 portrait;
                  }
                  body { background-color: white !important; padding: 0 !important; margin: 0 !important; }
                  #page-container { width: 100% !important; padding: 0 !important; box-shadow: none !important; }
                  tr { page-break-inside: avoid !important; }
              }
          </style>
      </head>
      <body>
          <div id="page-container">
              <div class="header-container">
                  <h1>FlipJudge AI Check</h1>
                  <div class="header-meta-row">
                      <div class="comp-name">
                          <span class="meta-label">Competition:</span><strong>${cleanComp}</strong>
                      </div>
                      <div class="print-meta">
                          <span class="meta-label">Date:</span><span>${elegantDate}</span>
                          <span class="separator">|</span>
                          <span class="meta-label">User:</span><span>${cleanUser}</span>
                      </div>
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
