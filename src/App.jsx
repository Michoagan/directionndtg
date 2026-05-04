import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Landing from './pages/Landing';

import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import SecretariatDashboard from './pages/Secretariat/Dashboard';
import Eleves from './pages/Secretariat/Eleves';
import Bulletins from './pages/Secretariat/Bulletins';
import Professeurs from './pages/Secretariat/Professeurs';
import Classes from './pages/Secretariat/Classes';
import Communiques from './pages/Secretariat/Communiques';
import SecretariatEvents from './pages/Secretariat/Events';
import GestionEpreuves from './pages/Secretariat/GestionEpreuves';
import NotesExamens from './pages/Secretariat/NotesExamens';
import CenseurDashboard from './pages/Censeur/Dashboard';
import GestionCours from './pages/Censeur/GestionCours';
import ValidationNotes from './pages/Censeur/ValidationNotes';
import ModificationNotes from './pages/Censeur/ModificationNotes';
import SuiviPedagogique from './pages/Censeur/SuiviPedagogique';
import Programmation from './pages/Censeur/Programmation';
import Contacts from './pages/Censeur/Contacts';
import CahiersTexte from './pages/Censeur/CahiersTexte';
import SurveillantDashboard from './pages/Surveillant/Dashboard';
import Presence from './pages/Surveillant/Presence';
import Discipline from './pages/Surveillant/Discipline';
import DirecteurDashboard from './pages/Directeur/Dashboard';
import Personnel from './pages/Directeur/Personnel';
import TeacherPerformance from './pages/Directeur/TeacherPerformance';
import Rapports from './pages/Directeur/Rapports';
import ClotureAnnee from './pages/Directeur/ClotureAnnee';
import ComptabiliteDashboard from './pages/Comptabilite/Dashboard';
import Depenses from './pages/Comptabilite/Depenses';
import Inventaire from './pages/Comptabilite/Inventaire';
import PaieConfig from './pages/Comptabilite/Paie/PaieConfig';
import GenererPaie from './pages/Comptabilite/Paie/GenererPaie';
import Tranches from './pages/Comptabilite/Tranches';
import Settings from './pages/Directeur/Settings';
import CaisseDashboard from './pages/Caisse/Dashboard';
import CaissePaiements from './pages/Caisse/Paiements';
import CaisseVentes from './pages/Caisse/Ventes';

import { logout, getUser } from './services/auth';
import {
  LayoutDashboard, Receipt, LogOut, Users, FileText, School,
  BookOpen, Megaphone, ChevronDown, ChevronRight, ClipboardList,
  Shield, Calendar, Briefcase, TrendingDown, ShoppingBag, Box,
  Settings as SettingsIcon, UserCog, CheckCircle, Activity,
  Calculator, FileStack, Archive, Landmark, GraduationCap,
  BadgeCheck, Eye
} from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = getUser();
  const token = sessionStorage.getItem('token');
  if (!token || !user) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role))
    return <Navigate to="/dashboard" replace />;
  return children;
};

const ROLE_META = {
  directeur:   { label: 'Direction Générale', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', icon: GraduationCap },
  admin:       { label: 'Administrateur',      color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.25)',  icon: Shield },
  secretariat: { label: 'Secrétariat',         color: '#818cf8', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', icon: FileText },
  censeur:     { label: 'Censeur / Études',    color: '#34d399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', icon: BookOpen },
  surveillant: { label: 'Surveillant',         color: '#fb923c', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)', icon: Eye },
  comptable:   { label: 'Comptabilité',        color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', icon: Landmark },
  caisse:      { label: 'Caisse',              color: '#22d3ee', bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.25)',  icon: Receipt },
};

const MENU_CONFIGS = {
  admin:       { title: 'Administration',    accentColor: '#f43f5e', items: [
    { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/admin/dashboard' },
    { icon: UserCog, label: 'Utilisateurs', path: '/admin/users' },
  ]},
  directeur:   { title: 'Direction Générale', accentColor: '#10b981', items: [
    { icon: LayoutDashboard, label: 'Vue d\'ensemble', path: '/directeur/dashboard' },
    { icon: Users, label: 'Personnel', path: '/directeur/personnel' },
    { icon: Briefcase, label: 'Rapports & Stats', path: '/directeur/rapports' },
    { icon: FileStack, label: 'Anciennes Épreuves', path: '/directeur/epreuves' },
    { icon: Archive, label: 'Clôture Année', path: '/directeur/cloture-annee' },
    { icon: SettingsIcon, label: 'Paramètres', path: '/directeur/settings' },
    { icon: UserCog, label: 'Créer un Compte', path: '/register' },
  ]},
  secretariat: { title: 'Secrétariat', accentColor: '#818cf8', items: [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/secretariat/dashboard' },
    { icon: Users, label: 'Élèves', path: '/secretariat/eleves' },
    { icon: FileText, label: 'Bulletins', path: '/secretariat/bulletins' },
    { icon: FileStack, label: 'Anciennes Épreuves', path: '/secretariat/epreuves' },
    { icon: Calculator, label: 'Notes d\'Examens', path: '/secretariat/notes-examens' },
    { icon: School, label: 'Professeurs', path: '/secretariat/professeurs' },
    { icon: BookOpen, label: 'Classes & Matières', path: '/secretariat/classes' },
    { icon: Megaphone, label: 'Communiqués', path: '/secretariat/communiques' },
    { icon: Calendar, label: 'Événements', path: '/secretariat/events' },
  ]},
  censeur:     { title: 'Censeur / Études', accentColor: '#34d399', items: [
    { icon: LayoutDashboard, label: 'Vue d\'ensemble', path: '/censeur/dashboard' },
    { icon: SettingsIcon, label: 'Programmation', path: '/censeur/programmation' },
    { icon: BookOpen, label: 'Emploi du Temps', path: '/censeur/cours' },
    { icon: FileText, label: 'Cahiers de Texte', path: '/censeur/cahiers-texte' },
    { icon: CheckCircle, label: 'Validation Notes', path: '/censeur/validation' },
    { icon: SettingsIcon, label: 'Modification Notes', path: '/censeur/modification-notes' },
    { icon: FileStack, label: 'Anciennes Épreuves', path: '/censeur/epreuves' },
    { icon: Activity, label: 'Suivi Pédagogique', path: '/censeur/suivi' },
    { icon: Users, label: 'Annuaire', path: '/censeur/contacts' },
  ]},
  surveillant: { title: 'Surveillant', accentColor: '#fb923c', items: [
    { icon: LayoutDashboard, label: 'Vue d\'ensemble', path: '/surveillant/dashboard' },
    { icon: ClipboardList, label: 'Présences', path: '/surveillant/presences' },
    { icon: Shield, label: 'Discipline', path: '/surveillant/discipline' },
  ]},
  comptable:   { title: 'Comptabilité', accentColor: '#a78bfa', items: [
    { icon: LayoutDashboard, label: 'Vue d\'ensemble', path: '/comptabilite/dashboard' },
    { icon: Calendar, label: 'Délais Scolarité', path: '/comptabilite/tranches' },
    { icon: TrendingDown, label: 'Dépenses', path: '/comptabilite/depenses' },
    { icon: Calculator, label: 'Générer Paies', path: '/comptabilite/generer-paie' },
    { icon: SettingsIcon, label: 'Config. Paie', path: '/comptabilite/paie-config' },
    { icon: Box, label: 'Inventaire', path: '/comptabilite/inventaire' },
  ]},
  caisse:      { title: 'Caisse / Entrées', accentColor: '#22d3ee', items: [
    { icon: LayoutDashboard, label: 'Vue d\'ensemble', path: '/caisse/dashboard' },
    { icon: Receipt, label: 'Scolarités', path: '/caisse/paiements' },
    { icon: ShoppingBag, label: 'Ventes', path: '/caisse/ventes' },
  ]},
};

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const user = getUser();
  const role = user?.role;
  const [open, setOpen] = useState(true);

  const meta = ROLE_META[role] || { label: role, color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', icon: LayoutDashboard };
  const menuCfg = MENU_CONFIGS[role];

  const RoleIcon = meta.icon;

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : (role || 'U').slice(0, 2).toUpperCase();

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-deep)', overflow: 'hidden' }}>
      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 260,
        minWidth: 260,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Decorative top glow */}
        <div style={{
          position: 'absolute', top: -40, left: '50%',
          transform: 'translateX(-50%)',
          width: 160, height: 80,
          background: meta.color,
          filter: 'blur(50px)',
          opacity: 0.18,
          pointerEvents: 'none',
        }} />

        {/* Logo / Brand */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="/marie.png"
              alt="NDTG Logo"
              style={{
                width: 42, height: 42, objectFit: 'contain', flexShrink: 0,
                filter: 'drop-shadow(0 2px 8px rgba(99,102,241,0.3))',
              }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                Notre Dame de
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                Toutes Grâces
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>
                Portail Admin
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: `linear-gradient(135deg, ${meta.color}88, ${meta.color})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: 'white',
              border: `2px solid ${meta.color}55`,
              boxShadow: `0 0 12px ${meta.color}33`,
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Utilisateur'}
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '2px 8px', borderRadius: 99,
                background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
              }}>
                <RoleIcon size={9} />
                {meta.label}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
          {menuCfg && (
            <>
              <div className="section-title" style={{ paddingLeft: 4, marginBottom: 6 }}>
                {menuCfg.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {menuCfg.items.map((item, i) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <Link
                      key={i}
                      to={item.path}
                      className="sidebar-nav-item"
                      style={isActive ? {
                        color: 'white',
                        background: `rgba(${hexToRgb(menuCfg.accentColor)}, 0.15)`,
                        border: `1px solid rgba(${hexToRgb(menuCfg.accentColor)}, 0.25)`,
                      } : {}}
                    >
                      {isActive && (
                        <div style={{
                          position: 'absolute', left: 0, top: '20%', height: '60%',
                          width: 3, background: menuCfg.accentColor,
                          borderRadius: '0 4px 4px 0',
                          boxShadow: `0 0 8px ${menuCfg.accentColor}`,
                        }} />
                      )}
                      <Icon size={15} style={{ color: isActive ? menuCfg.accentColor : 'inherit', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.83rem' }}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 14px', borderRadius: 8,
              background: 'transparent', border: '1px solid transparent',
              color: 'var(--text-secondary)', fontSize: '0.83rem', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(244,63,94,0.1)';
              e.currentTarget.style.color = '#fb7185';
              e.currentTarget.style.borderColor = 'rgba(244,63,94,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <LogOut size={15} />
            Déconnexion
          </button>
        </div>

        {/* Filigrane sidebar */}
        <div className="sidebar-watermark" />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{
        flex: 1, overflowY: 'auto',
        background: 'var(--bg-deep)',
      }}>
        {children}
      </main>
    </div>
  );
};

// Helper: hex to rgb components string
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

const DashboardRedirect = () => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'admin':       return <Navigate to="/admin/dashboard" replace />;
    case 'directeur':   return <Navigate to="/directeur/dashboard" replace />;
    case 'censeur':     return <Navigate to="/censeur/dashboard" replace />;
    case 'surveillant': return <Navigate to="/surveillant/dashboard" replace />;
    case 'secretariat': return <Navigate to="/secretariat/dashboard" replace />;
    case 'comptable':   return <Navigate to="/comptabilite/dashboard" replace />;
    case 'caisse':      return <Navigate to="/caisse/dashboard" replace />;
    default:            return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={
        <ProtectedRoute allowedRoles={['directeur']}>
          <DashboardLayout><Register /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={<DashboardRedirect />} />

      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/users"     element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><UserManagement /></DashboardLayout></ProtectedRoute>} />

      <Route path="/secretariat/dashboard"    element={<ProtectedRoute allowedRoles={['secretariat']}><DashboardLayout><SecretariatDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/secretariat/eleves"       element={<ProtectedRoute allowedRoles={['secretariat']}><DashboardLayout><Eleves /></DashboardLayout></ProtectedRoute>} />
      <Route path="/secretariat/bulletins"    element={<ProtectedRoute allowedRoles={['secretariat']}><DashboardLayout><Bulletins /></DashboardLayout></ProtectedRoute>} />
      <Route path="/secretariat/professeurs"  element={<ProtectedRoute allowedRoles={['secretariat']}><DashboardLayout><Professeurs /></DashboardLayout></ProtectedRoute>} />
      <Route path="/secretariat/classes"      element={<ProtectedRoute allowedRoles={['secretariat']}><DashboardLayout><Classes /></DashboardLayout></ProtectedRoute>} />
      <Route path="/secretariat/communiques"  element={<ProtectedRoute allowedRoles={['secretariat']}><DashboardLayout><Communiques /></DashboardLayout></ProtectedRoute>} />
      <Route path="/secretariat/events"       element={<ProtectedRoute allowedRoles={['secretariat']}><DashboardLayout><SecretariatEvents /></DashboardLayout></ProtectedRoute>} />
      <Route path="/secretariat/epreuves"     element={<ProtectedRoute allowedRoles={['secretariat']}><DashboardLayout><GestionEpreuves /></DashboardLayout></ProtectedRoute>} />
      <Route path="/secretariat/notes-examens" element={<ProtectedRoute allowedRoles={['secretariat']}><DashboardLayout><NotesExamens /></DashboardLayout></ProtectedRoute>} />

      <Route path="/censeur/dashboard"        element={<ProtectedRoute allowedRoles={['censeur']}><DashboardLayout><CenseurDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/censeur/programmation"    element={<ProtectedRoute allowedRoles={['censeur']}><DashboardLayout><Programmation /></DashboardLayout></ProtectedRoute>} />
      <Route path="/censeur/cours"            element={<ProtectedRoute allowedRoles={['censeur']}><DashboardLayout><GestionCours /></DashboardLayout></ProtectedRoute>} />
      <Route path="/censeur/cahiers-texte"    element={<ProtectedRoute allowedRoles={['censeur']}><DashboardLayout><CahiersTexte /></DashboardLayout></ProtectedRoute>} />
      <Route path="/censeur/validation"       element={<ProtectedRoute allowedRoles={['censeur']}><DashboardLayout><ValidationNotes /></DashboardLayout></ProtectedRoute>} />
      <Route path="/censeur/modification-notes" element={<ProtectedRoute allowedRoles={['censeur']}><DashboardLayout><ModificationNotes /></DashboardLayout></ProtectedRoute>} />
      <Route path="/censeur/epreuves"         element={<ProtectedRoute allowedRoles={['censeur']}><DashboardLayout><GestionEpreuves /></DashboardLayout></ProtectedRoute>} />
      <Route path="/censeur/suivi"            element={<ProtectedRoute allowedRoles={['censeur']}><DashboardLayout><SuiviPedagogique /></DashboardLayout></ProtectedRoute>} />
      <Route path="/censeur/contacts"         element={<ProtectedRoute allowedRoles={['censeur']}><DashboardLayout><Contacts /></DashboardLayout></ProtectedRoute>} />

      <Route path="/surveillant/dashboard"    element={<ProtectedRoute allowedRoles={['surveillant']}><DashboardLayout><SurveillantDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/surveillant/presences"    element={<ProtectedRoute allowedRoles={['surveillant']}><DashboardLayout><Presence /></DashboardLayout></ProtectedRoute>} />
      <Route path="/surveillant/discipline"   element={<ProtectedRoute allowedRoles={['surveillant']}><DashboardLayout><Discipline /></DashboardLayout></ProtectedRoute>} />

      <Route path="/directeur/dashboard"      element={<ProtectedRoute allowedRoles={['directeur']}><DashboardLayout><DirecteurDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/directeur/personnel"      element={<ProtectedRoute allowedRoles={['directeur']}><DashboardLayout><Personnel /></DashboardLayout></ProtectedRoute>} />
      <Route path="/directeur/personnel/:id/performance" element={<ProtectedRoute allowedRoles={['directeur']}><DashboardLayout><TeacherPerformance /></DashboardLayout></ProtectedRoute>} />
      <Route path="/directeur/rapports"       element={<ProtectedRoute allowedRoles={['directeur']}><DashboardLayout><Rapports /></DashboardLayout></ProtectedRoute>} />
      <Route path="/directeur/epreuves"       element={<ProtectedRoute allowedRoles={['directeur']}><DashboardLayout><GestionEpreuves /></DashboardLayout></ProtectedRoute>} />
      <Route path="/directeur/cloture-annee"  element={<ProtectedRoute allowedRoles={['directeur']}><DashboardLayout><ClotureAnnee /></DashboardLayout></ProtectedRoute>} />
      <Route path="/directeur/settings"       element={<ProtectedRoute allowedRoles={['directeur']}><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />

      <Route path="/comptabilite/dashboard"   element={<ProtectedRoute allowedRoles={['comptable']}><DashboardLayout><ComptabiliteDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/comptabilite"             element={<Navigate to="/comptabilite/dashboard" replace />} />
      <Route path="/comptabilite/depenses"    element={<ProtectedRoute allowedRoles={['comptable']}><DashboardLayout><Depenses /></DashboardLayout></ProtectedRoute>} />
      <Route path="/comptabilite/inventaire"  element={<ProtectedRoute allowedRoles={['comptable']}><DashboardLayout><Inventaire /></DashboardLayout></ProtectedRoute>} />
      <Route path="/comptabilite/tranches"    element={<ProtectedRoute allowedRoles={['comptable']}><DashboardLayout><Tranches /></DashboardLayout></ProtectedRoute>} />
      <Route path="/comptabilite/paie-config" element={<ProtectedRoute allowedRoles={['comptable']}><DashboardLayout><PaieConfig /></DashboardLayout></ProtectedRoute>} />
      <Route path="/comptabilite/generer-paie" element={<ProtectedRoute allowedRoles={['comptable']}><DashboardLayout><GenererPaie /></DashboardLayout></ProtectedRoute>} />

      <Route path="/caisse/dashboard"         element={<ProtectedRoute allowedRoles={['caisse']}><DashboardLayout><CaisseDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/caisse"                   element={<Navigate to="/caisse/dashboard" replace />} />
      <Route path="/caisse/paiements"         element={<ProtectedRoute allowedRoles={['caisse']}><DashboardLayout><CaissePaiements /></DashboardLayout></ProtectedRoute>} />
      <Route path="/caisse/ventes"            element={<ProtectedRoute allowedRoles={['caisse']}><DashboardLayout><CaisseVentes /></DashboardLayout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
