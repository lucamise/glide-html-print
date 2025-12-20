export default function handler(req, res) {
  // Leggiamo il parametro 'html' dall'URL
  const { html } = req.query;

  if (!html) {
    return res.status(400).send("Errore: Manca il codice HTML nell'URL.");
  }

  // Decodifica l'HTML
  const cleanHtml = decodeURIComponent(html);

  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <title>Stampa</title>
        <style>
            body { font-family: sans-serif; padding: 20px; }
            @media print { .no-print { display: none; } }
        </style>
    </head>
    <body>
        ${cleanHtml}
        <script>
            // Lancia la stampa e, opzionalmente, chiude la scheda dopo
            window.onload = function() {
                window.print();
            };
        </script>
    </body>
    </html>
  `);
}
