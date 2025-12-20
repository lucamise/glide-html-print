export default function handler(req, res) {
  try {
    // Leggiamo i parametri separati
    const { body, comp, date, user } = req.query;

    if (!body) {
      return res.status(400).send("Errore: Manca il contenuto (body).");
    }

    // Decodifica "soft": se un pezzo è rotto, non rompe tutto il sito
    const decodeSafe = (str) => {
        try { return decodeURIComponent(str || ""); } 
        catch (e) { return str || ""; }
    };

    const cleanBody = decodeSafe(body);
    const cleanComp = decodeSafe(comp);
    const cleanDate = decodeSafe(date);
    const cleanUser = decodeSafe(user);

    res.setHeader('Content-Type', 'text/html');

    // Costruiamo la pagina QUI
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
              .header-container { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; text-align: center; }
              @media print {
                  @page { margin: 1cm; }
                  .no-print { display: none; }
                  .print-footer-fix { position: fixed; bottom: 0; left: 0; width: 100%; background: white; border-top: 1px solid #ccc; padding-top: 10px; text-align: center; font-size: 10px; color: #777; }
              }
              .print-footer-fix { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; text-align: center; font-size: 10px; color: #777; }
          </style>
      </head>
      <body>
          <div class="header-container">
              <h1 style="margin: 0; text-transform: uppercase;">FlipJudge AI Check</h1>
              <h3 style="margin: 5px 0 0; font-weight: normal; color: #555;">Competition: ${cleanComp}</h3>
          </div>
          <div>${cleanBody}</div>
          <div class="print-footer-fix">FlipJudge AI Check | Printed on ${cleanDate} | ${cleanUser}</div>
          <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
}
