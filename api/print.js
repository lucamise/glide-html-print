export default function handler(req, res) {
  // 1. Recupera l'HTML dall'URL
  const { data } = req.query;

  if (!data) {
    return res.status(400).send("Errore: Nessun contenuto HTML fornito.");
  }

  // 2. Decodifica l'HTML che arriva "sporco" dall'URL
  // (es. trasforma %20 in spazi, %3C in <, ecc.)
  const htmlContent = decodeURIComponent(data);

  // 3. Imposta l'header
  res.setHeader('Content-Type', 'text/html');

  // 4. Costruisce la pagina
  const page = `
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <title>Stampa Documento</title>
        <style>
            body { font-family: sans-serif; padding: 20px; }
            /* Nascondiamo tutto mentre carica */
            @media print {
                .no-print { display: none; }
            }
        </style>
    </head>
    <body>
        ${htmlContent}
        <script>
            window.onload = function() {
                // Lancia la stampa appena la pagina è pronta
                window.print();
            };
        </script>
    </body>
    </html>
  `;

  res.send(page);
}
