export default function handler(req, res) {
  // 1. Leggiamo il parametro 'html' dall'URL
  const { html } = req.query;

  if (!html) {
    return res.status(400).send("Errore: Manca il codice HTML nell'URL.");
  }

  // 2. Decodifica l'HTML
  const cleanHtml = decodeURIComponent(html);

  // 3. Impostiamo l'header
  res.setHeader('Content-Type', 'text/html');

  // 4. Costruiamo la pagina includendo mini.css nella <head>
  res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <title>FlipJudge Print</title>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css">

        <style>
            /* Override minimi per la stampa */
            body {
                /* Mini.css gestisce già i font, aggiungiamo solo un po' di margine */
                padding: 20px; 
            }

            /* Questo serve per assicurarci che il footer sia sempre in basso quando si stampa */
            @media print {
                @page { margin: 1cm; }
                .no-print { display: none; }
                
                /* Classe di utilità per forzare il footer in basso */
                .print-footer-fix {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background: white;
                }
            }
        </style>
    </head>
    <body>
        ${cleanHtml}

        <script>
            window.onload = function() {
                window.print();
            };
        </script>
    </body>
    </html>
  `);
}
