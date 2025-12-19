window.function = function (htmlVal) {
    if (htmlVal.value === undefined) return undefined;

    // --- DA MODIFICARE DOPO IL DEPLOY SU VERCEL ---
    // Inseriremo qui l'URL che Vercel ci darà.
    const baseUrl = "https://INSERISCI-QUI-IL-TUO-SITO.vercel.app/api/print"; 
    // ----------------------------------------------

    // Codifica l'HTML per farlo viaggiare sicuro nell'URL
    const encoded = encodeURIComponent(htmlVal.value);

    // Restituisce il link completo
    return `${baseUrl}?data=${encoded}`;
}
