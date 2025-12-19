window.addEventListener('message', async function (event) {
  // 1. Leggiamo i dati in arrivo da Glide
  const { key, params } = event.data;

  // Se manca la chiave, ignoriamo il messaggio
  if (!key) return;

  // 2. Prepariamo la risposta
  let result;
  try {
    // Eseguiamo la funzione definita in function.js
    // Usiamo 'await' nel caso la funzione sia asincrona
    result = await window.function(...params);
  } catch (e) {
    // Se c'è un errore, lo salviamo come risultato per vederlo in Glide
    result = "Error in function: " + e.message;
  }

  // 3. SPEDIAMO LA RISPOSTA A GLIDE (Fondamentale!)
  // Senza questa riga, la rotellina gira all'infinito.
  event.source.postMessage({ key: key, result: result }, '*');
});
