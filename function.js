// Rendiamo la funzione asincrona per sicurezza
window.function = async function (htmlVal) {
    // Controllo di sicurezza: se il valore è nullo, restituiamo una stringa vuota invece di bloccarci
    if (htmlVal === undefined) return undefined;
    if (htmlVal.value === undefined) return undefined;

    // INSERISCI QUI IL TUO DOMINIO VERCEL
    const apiEndpoint = "https://glide-html-print.vercel.app/api/print"; 

    try {
        const encodedHtml = encodeURIComponent(htmlVal.value);
        return `${apiEndpoint}?data=${encodedHtml}`;
    } catch (error) {
        // Se c'è un errore nella codifica, lo restituiamo come testo
        return "Errore nella generazione del link: " + error.message;
    }
}
