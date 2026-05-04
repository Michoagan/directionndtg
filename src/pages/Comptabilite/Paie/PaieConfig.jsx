import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Save, User, Settings2, Loader2, Calendar, BookOpen, Briefcase, Award } from 'lucide-react';
import paieService from '../../../services/paieService';

const MOIS = [
    { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' }, { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' }, { value: 5, label: 'Mai' }, { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' }, { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' }, { value: 11, label: 'Novembre' }, { value: 12, label: 'Décembre' }
];

const PaieConfig = () => {
    const [activeTab, setActiveTab] = useState('fixes'); // 'fixes' or 'primes'
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // Données Fixes
    const [classes, setClasses] = useState([]);
    const [personnel, setPersonnel] = useState([]);
    const [professeurs, setProfesseurs] = useState([]);

    // Données Primes
    const [selectedMois, setSelectedMois] = useState(new Date().getMonth() + 1);
    const [selectedAnnee, setSelectedAnnee] = useState(new Date().getFullYear());
    const [primes, setPrimes] = useState([]);

    useEffect(() => {
        loadConfiguration();
    }, []);

    useEffect(() => {
        if (activeTab === 'primes') {
            loadPrimes();
        }
    }, [activeTab, selectedMois, selectedAnnee]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const loadConfiguration = async () => {
        setLoading(true);
        try {
            const res = await paieService.getConfiguration();
            if (res.data.success) {
                setClasses(res.data.classes || []);
                setPersonnel(res.data.personnel || []);
                setProfesseurs(res.data.professeurs || []);
            }
        } catch (error) {
            console.error("Erreur chargement configuration:", error);
            showMessage('error', 'Erreur de chargement des paramètres fixes.');
        } finally {
            setLoading(false);
        }
    };

    const loadPrimes = async () => {
        setLoading(true);
        try {
            const res = await paieService.getPrimesMensuelles({ mois: selectedMois, annee: selectedAnnee });
            if (res.data.success) {
                setPrimes(res.data.primes || []);
            }
        } catch (error) {
            console.error("Erreur chargement primes:", error);
            showMessage('error', 'Erreur de chargement des primes.');
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLERS: Paramètres Fixes ---
    const handleClasseChange = (id, value) => {
        setClasses(classes.map(c => c.id === id ? { ...c, taux_horaire: value } : c));
    };

    const handlePersonnelChange = (id, value) => {
        setPersonnel(personnel.map(p => p.id === id ? { ...p, salaire_base: value } : p));
    };

    const saveConfiguration = async () => {
        setSaving(true);
        try {
            const res = await paieService.saveConfiguration({ classes, personnel });
            if (res.data.success) {
                showMessage('success', 'Paramètres annuels sauvegardés avec succès.');
            }
        } catch (error) {
            console.error(error);
            showMessage('error', 'Erreur lors de la sauvegarde des paramètres.');
        } finally {
            setSaving(false);
        }
    };

    // --- HANDLERS: Primes Mensuelles ---
    const addPrime = (type) => { // type: 'professeur' | 'personnel'
        setPrimes([...primes, {
            id: 'temp_' + Date.now(),
            professeur_id: '',
            direction_user_id: '',
            type_prime: '',
            montant: 0,
            motif: '',
            _target: type
        }]);
    };

    const updatePrime = (index, field, value) => {
        const newPrimes = [...primes];
        newPrimes[index][field] = value;
        setPrimes(newPrimes);
    };

    const removePrime = (index) => {
        const newPrimes = [...primes];
        newPrimes.splice(index, 1);
        setPrimes(newPrimes);
    };

    const savePrimes = async () => {
        setSaving(true);
        try {
            const validPrimes = primes.filter(p => (p.professeur_id || p.direction_user_id) && p.montant > 0);
            const res = await paieService.savePrimesMensuelles({
                mois: selectedMois,
                annee: selectedAnnee,
                primes: validPrimes
            });
            if (res.data.success) {
                showMessage('success', `Primes du mois de ${MOIS.find(m => m.value == selectedMois)?.label} sauvegardées.`);
                loadPrimes();
            }
        } catch (error) {
            console.error(error);
            showMessage('error', 'Erreur lors de la sauvegarde des primes.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-blue-600 pl-3">
                        Configuration de la Paie
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 pl-4">Gérez les taux, salaires de base et primes mensuelles.</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('fixes')}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'fixes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Settings2 size={16} />
                    <span>Paramètres Fixes (Année)</span>
                </button>
                <button
                    onClick={() => setActiveTab('primes')}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'primes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Award size={16} />
                    <span>Primes (Mensuelles)</span>
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-md text-sm font-medium flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            {/* TAB 1: PARAMETRES FIXES */}
            {activeTab === 'fixes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Taux Horaires des Classes */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="bg-slate-50 border-b pb-4 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                                    <BookOpen className="text-blue-600" size={20} />
                                    Taux Horaires par Classe
                                </CardTitle>
                                <CardDescription>Applicable à tous les enseignants de la classe</CardDescription>
                            </div>
                            <Button onClick={saveConfiguration} disabled={saving || loading} className="bg-blue-600 hover:bg-blue-700 text-white h-9">
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Enregistrer
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
                            ) : (
                                <div className="max-h-[500px] overflow-y-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-500 bg-slate-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3">Classe</th>
                                                <th className="px-4 py-3">Prof. Principal</th>
                                                <th className="px-4 py-3 w-48">Taux Horaire (FCFA)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {classes.map(c => (
                                                <tr key={c.id} className="hover:bg-slate-50">
                                                    <td className="px-4 py-3 font-medium text-slate-900">{c.nom}</td>
                                                    <td className="px-4 py-3 text-slate-500">
                                                        {c.professeur_principal ? `${c.professeur_principal.first_name} ${c.professeur_principal.last_name}` : '-'}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            value={c.taux_horaire || 0}
                                                            onChange={(e) => handleClasseChange(c.id, e.target.value)}
                                                            className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Salaires de base du Personnel */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="bg-slate-50 border-b pb-4 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                                    <Briefcase className="text-blue-600" size={20} />
                                    Salaires de Base (Personnel)
                                </CardTitle>
                                <CardDescription>Personnel administratif et direction</CardDescription>
                            </div>
                            <Button onClick={saveConfiguration} disabled={saving || loading} className="bg-blue-600 hover:bg-blue-700 text-white h-9">
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Enregistrer
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
                            ) : (
                                <div className="max-h-[500px] overflow-y-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-500 bg-slate-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3">Agent</th>
                                                <th className="px-4 py-3">Fonction</th>
                                                <th className="px-4 py-3 w-48">Salaire (FCFA)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {personnel.map(p => (
                                                <tr key={p.id} className="hover:bg-slate-50">
                                                    <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                                                            {p.first_name?.[0]}{p.last_name?.[0]}
                                                        </div>
                                                        {p.first_name} {p.last_name}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500 capitalize">{p.role}</td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            value={p.salaire_base || 0}
                                                            onChange={(e) => handlePersonnelChange(p.id, e.target.value)}
                                                            className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* TAB 2: PRIMES MENSUELLES */}
            {activeTab === 'primes' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="bg-slate-50 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <CardTitle>Primes du mois</CardTitle>
                                    <CardDescription>Sélectionnez la période pour configurer les primes variables.</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <select 
                                    className="p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                    value={selectedMois}
                                    onChange={(e) => setSelectedMois(parseInt(e.target.value))}
                                >
                                    {MOIS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </select>
                                <select 
                                    className="p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                    value={selectedAnnee}
                                    onChange={(e) => setSelectedAnnee(parseInt(e.target.value))}
                                >
                                    {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <Button onClick={savePrimes} disabled={saving || loading} className="bg-blue-600 hover:bg-blue-700 text-white ml-4">
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Enregistrer
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {loading ? (
                                <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
                            ) : (
                                <div className="space-y-8">
                                    
                                    {/* Section Professeurs */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-medium text-slate-800 flex items-center gap-2">
                                                <User size={18} className="text-slate-400" />
                                                Primes Enseignants (Prof Principal, Particulier, etc.)
                                            </h3>
                                            <Button size="sm" variant="outline" onClick={() => addPrime('professeur')}>
                                                + Ajouter une prime enseignant
                                            </Button>
                                        </div>
                                        
                                        {primes.filter(p => p.professeur_id || p._target === 'professeur').length === 0 ? (
                                            <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-400">
                                                Aucune prime configurée pour les enseignants ce mois-ci.
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {primes.map((prime, index) => (prime.professeur_id || prime._target === 'professeur') && (
                                                    <div key={prime.id} className="flex flex-col md:flex-row gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg items-center">
                                                        <div className="w-full md:w-1/3">
                                                            <select 
                                                                value={prime.professeur_id || ''} 
                                                                onChange={(e) => updatePrime(index, 'professeur_id', e.target.value)}
                                                                className="w-full p-2 border border-slate-300 rounded text-sm"
                                                            >
                                                                <option value="">-- Sélectionner l'enseignant --</option>
                                                                {professeurs.map(prof => (
                                                                    <option key={prof.id} value={prof.id}>{prof.first_name} {prof.last_name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="w-full md:w-1/4">
                                                            <input 
                                                                type="text" 
                                                                placeholder="Type (ex: Prof Principal)"
                                                                value={prime.type_prime}
                                                                onChange={(e) => updatePrime(index, 'type_prime', e.target.value)}
                                                                className="w-full p-2 border border-slate-300 rounded text-sm"
                                                            />
                                                        </div>
                                                        <div className="w-full md:w-1/4">
                                                            <div className="relative">
                                                                <input 
                                                                    type="number" 
                                                                    placeholder="Montant"
                                                                    value={prime.montant || ''}
                                                                    onChange={(e) => updatePrime(index, 'montant', e.target.value)}
                                                                    className="w-full p-2 pr-12 border border-slate-300 rounded text-sm"
                                                                />
                                                                <span className="absolute right-3 top-2 text-xs text-slate-400">FCFA</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-full md:w-auto">
                                                            <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removePrime(index)}>
                                                                Retirer
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <hr className="border-slate-100" />

                                    {/* Section Personnel */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-medium text-slate-800 flex items-center gap-2">
                                                <Briefcase size={18} className="text-slate-400" />
                                                Primes Personnel (Rendement, Assiduité, etc.)
                                            </h3>
                                            <Button size="sm" variant="outline" onClick={() => addPrime('personnel')}>
                                                + Ajouter une prime personnel
                                            </Button>
                                        </div>
                                        
                                        {primes.filter(p => p.direction_user_id || p._target === 'personnel').length === 0 ? (
                                            <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-400">
                                                Aucune prime configurée pour le personnel ce mois-ci.
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {primes.map((prime, index) => (prime.direction_user_id || prime._target === 'personnel') && (
                                                    <div key={prime.id} className="flex flex-col md:flex-row gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg items-center">
                                                        <div className="w-full md:w-1/3">
                                                            <select 
                                                                value={prime.direction_user_id || ''} 
                                                                onChange={(e) => updatePrime(index, 'direction_user_id', e.target.value)}
                                                                className="w-full p-2 border border-slate-300 rounded text-sm"
                                                            >
                                                                <option value="">-- Sélectionner l'agent --</option>
                                                                {personnel.map(agent => (
                                                                    <option key={agent.id} value={agent.id}>{agent.first_name} {agent.last_name} ({agent.role})</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="w-full md:w-1/4">
                                                            <input 
                                                                type="text" 
                                                                placeholder="Type (ex: Prime Rendement)"
                                                                value={prime.type_prime}
                                                                onChange={(e) => updatePrime(index, 'type_prime', e.target.value)}
                                                                className="w-full p-2 border border-slate-300 rounded text-sm"
                                                            />
                                                        </div>
                                                        <div className="w-full md:w-1/4">
                                                            <div className="relative">
                                                                <input 
                                                                    type="number" 
                                                                    placeholder="Montant"
                                                                    value={prime.montant || ''}
                                                                    onChange={(e) => updatePrime(index, 'montant', e.target.value)}
                                                                    className="w-full p-2 pr-12 border border-slate-300 rounded text-sm"
                                                                />
                                                                <span className="absolute right-3 top-2 text-xs text-slate-400">FCFA</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-full md:w-auto">
                                                            <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removePrime(index)}>
                                                                Retirer
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PaieConfig;
