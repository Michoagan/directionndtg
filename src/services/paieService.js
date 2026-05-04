import api from './api';

const paieService = {
    // Récupère les paramètres fixes
    getConfiguration: () => api.get('/direction/comptabilite/paie-professeurs/config'),

    // Sauvegarde les paramètres fixes
    saveConfiguration: (data) => api.post('/direction/comptabilite/paie-professeurs/config', data),

    // Récupère les primes d'un mois spécifique
    getPrimesMensuelles: (params) => api.get('/direction/comptabilite/paie-professeurs/primes', { params }),

    // Sauvegarde les primes d'un mois spécifique
    savePrimesMensuelles: (data) => api.post('/direction/comptabilite/paie-professeurs/primes', data),

    // Génère la fiche de paie pour un mois donné
    genererPaie: (data) => api.post('/direction/comptabilite/paie-professeurs/generer', data),
    // Valider et envoyer les fiches de paie
    validerPaies: (data) => api.post('/direction/comptabilite/paie-professeurs/valider', data),
};

export default paieService;
