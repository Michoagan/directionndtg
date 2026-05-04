import React, { useState } from 'react';
import {
    TrendingUp,
    Users,
    CreditCard,
    ArrowRight,
    Activity,
    Calendar,
    Wallet,
    Bell,
    ChevronRight,
    GraduationCap,
    BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Placeholder Data for Charts ---
const revenueData = [
    { name: 'Lun', total: 120000 },
    { name: 'Mar', total: 250000 },
    { name: 'Mer', total: 180000 },
    { name: 'Jeu', total: 420000 },
    { name: 'Ven', total: 310000 },
    { name: 'Sam', total: 80000 },
    { name: 'Dim', total: 0 },
];

const StatCard = ({ title, value, change, icon: Icon, color, gradient }) => (
    <div className="relative group overflow-hidden bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500 blur-2xl ${color}`}></div>
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase mb-1">{title}</p>
                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">{value}</h3>
            </div>
            <div className={`p-4 rounded-2xl ${gradient} shadow-lg shadow-${color.split('-')[1]}-500/30`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        <div className="relative z-10 mt-6 flex items-center text-sm">
            <div className="px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-700 font-bold flex items-center shadow-sm">
                <TrendingUp className="w-4 h-4 mr-1.5" />
                {change}
            </div>
            <span className="text-slate-400 font-medium ml-3">vs mois dernier</span>
        </div>
    </div>
);

const QuickAction = ({ title, description, to, icon: Icon, colorTheme }) => (
    <Link
        to={to}
        className={`group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br ${colorTheme} text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/20`}
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-32 h-32" />
        </div>
        <div className="relative z-10">
            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-md shadow-inner group-hover:bg-white/30 transition-colors">
                <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">{title}</h3>
            <p className="text-white/80 text-sm mb-6 leading-relaxed font-medium">{description}</p>
            <div className="flex items-center text-sm font-bold bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm group-hover:bg-white/20 transition-all">
                Accéder au module <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </Link>
);

const ActivityItem = ({ user, action, time, type }) => {
    const getInitials = (name) => name.substring(0, 2).toUpperCase();
    const colors = {
        payment: 'bg-emerald-100 text-emerald-700',
        system: 'bg-blue-100 text-blue-700',
        alert: 'bg-amber-100 text-amber-700'
    };
    
    return (
        <div className="group flex items-start space-x-4 p-4 hover:bg-slate-50/80 rounded-xl transition-all border border-transparent hover:border-slate-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-sm ${colors[type] || colors.system}`}>
                {getInitials(user)}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-bold text-slate-800 truncate">
                    {user}
                </p>
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                    {action}
                </p>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap group-hover:bg-slate-200 transition-colors">{time}</span>
        </div>
    );
};

const Home = () => {
    const currentDate = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            
            {/* Premium Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#1E3A8A] via-[#1e40af] to-[#312e81] rounded-3xl p-8 md:p-10 shadow-2xl border border-blue-800/50">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <svg className="absolute right-0 transform translate-x-1/3 -translate-y-1/4" width="404" height="384" fill="none" viewBox="0 0 404 384"><defs><pattern id="d3eb07ae-5182-43e6-857d-35c643af9034" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" fill="currentColor"></rect></pattern></defs><rect width="404" height="384" fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"></rect></svg>
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
                            <Calendar className="w-3.5 h-3.5 mr-2" />
                            {currentDate}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
                            Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">Direction</span> 👋
                        </h1>
                        <p className="text-blue-100 text-lg font-medium max-w-xl leading-relaxed">
                            Aperçu en temps réel des activités et des finances du Complexe Scolaire Notre Dame de Toutes Grâces.
                        </p>
                    </div>
                    <div className="flex-shrink-0 flex gap-3">
                        <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-bold backdrop-blur-md transition-all flex items-center shadow-lg">
                            <Bell className="w-5 h-5 mr-2" />
                            Notifications (3)
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Trésorerie Totale"
                    value="12.45M FCFA"
                    change="+12.5%"
                    icon={Wallet}
                    color="bg-blue-500"
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                    title="Élèves Inscrits"
                    value="1,234"
                    change="+4.2%"
                    icon={Users}
                    color="bg-[#D97706]"
                    gradient="bg-gradient-to-br from-amber-500 to-amber-600"
                />
                <StatCard
                    title="Taux de Recouvrement"
                    value="84.5%"
                    change="+2.1%"
                    icon={TrendingUp}
                    color="bg-emerald-500"
                    gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area: Chart & Actions */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Revenue Chart */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-800">Flux Financiers</h2>
                                <p className="text-sm text-slate-500 font-medium">Recettes de la semaine en cours</p>
                            </div>
                            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-bold outline-none">
                                <option>Cette Semaine</option>
                                <option>Ce Mois</option>
                            </select>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#1E3A8A', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#1E3A8A" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800 mb-5 flex items-center">
                            Accès Rapide
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <QuickAction
                                title="Comptabilité"
                                description="Gestion détaillée des frais, paiements, factures et salaires"
                                to="/comptabilite"
                                icon={CreditCard}
                                colorTheme="from-[#1E3A8A] to-blue-700"
                            />
                            <QuickAction
                                title="Scolarité"
                                description="Suivi des élèves, inscriptions et gestion des classes"
                                to="/scolarite"
                                icon={GraduationCap}
                                colorTheme="from-[#D97706] to-amber-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Recent Activity */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6 h-fit">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-extrabold text-slate-800">Activité Récente</h2>
                        <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-9 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                        
                        <div className="space-y-4 relative z-10">
                            <ActivityItem
                                user="Caisse Principale"
                                action="Paiement de scolarité validé (150,000 FCFA)"
                                time="À l'instant"
                                type="payment"
                            />
                            <ActivityItem
                                user="Secrétariat"
                                action="Nouvelle inscription : Classe 6ème B"
                                time="il y a 2h"
                                type="system"
                            />
                            <ActivityItem
                                user="Système"
                                action="Sauvegarde journalière terminée avec succès"
                                time="il y a 4h"
                                type="alert"
                            />
                            <ActivityItem
                                user="Comptabilité"
                                action="Génération des fiches de paie (Mars)"
                                time="il y a 5h"
                                type="system"
                            />
                            <ActivityItem
                                user="Caisse Principale"
                                action="Paiement de scolarité validé (75,000 FCFA)"
                                time="Hier"
                                type="payment"
                            />
                        </div>
                    </div>
                    
                    <button className="w-full mt-6 py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 hover:text-[#1E3A8A] hover:border-[#1E3A8A]/20 transition-all">
                        Voir tout l'historique
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
