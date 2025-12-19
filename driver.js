window.addEventListener('message', async function (event) {
  const { key, params } = event.data;
  
  // Se non c'è una chiave, non è un messaggio per noi
  if (!key) return;

  try {
    // Chiama la tua funzione definita in function.js
    const result = await window.function(...params);
    
    // Invia il risultato a Glide
    event.source.postMessage({ key, result }, '*');
  } catch (e) {
    // Invia l'errore a Glide
    event.source.postMessage({ key, error: e.message }, '*');
  }
});
