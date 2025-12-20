export default function handler(req, res) {
  try {
    // 1. Leggiamo il parametro 'html' dall'URL
    const { html } = req.query;

    if (!html) {
      return res.status(400).send("Errore: Parametro 'html' mancante nell'URL.");
    }

    // 2. Proviamo a decodificare. Se l'URL è rotto, qui darà errore.
    let cleanHtml = "";
    try {
      cleanHtml = decodeURIComponent(html);
    } catch (e) {
      // Se fallisce la decodifica, probabilmente l'URL è stato tagliato
      throw new Error("Impossibile decodificare l'HTML. Il testo potrebbe essere troppo lungo per un link (Max ~4000 caratteri). Errore: " + e.message);
    }

    // 3. Impostiamo l'header
    res.setHeader('Content-Type', 'text/html');

    // 4. Costruiamo la pagina
    res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>FlipJudge Print</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css">
          <style>
              body { padding: 20px; }
              @media print {
                  @page { margin: 1cm; }
                  .no-print { display: none; }
                  .print-footer-fix {
                      position: fixed; bottom: 0; left: 0; width: 100%; background: white;
                  }
              }
          </style>
      </head>
      <body>
          ${cleanHtml}
          <script>
              window.onload = function() { window.print(); };
          </script>
      </body>
      </html>
    `);

  } catch (error) {
    // In caso di qualsiasi altro errore, lo stampiamo a video invece di crashare
    console.error(error);
    res.status(500).send(`
      <h1>Si è verificato un errore</h1>
      <p>${error.message}</p>
      <hr>
      <p><strong>Suggerimento:</strong> Se l'errore riguarda la decodifica o la lunghezza, il contenuto HTML che stai provando a stampare è troppo grande per passare attraverso un semplice Link.</p>
    `);
  }
}
