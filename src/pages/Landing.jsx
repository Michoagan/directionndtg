import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, ArrowRight,
  BarChart3, Users, BookOpen, Landmark, Lock, Zap
} from 'lucide-react';

export default function Landing() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      fontFamily: 'Inter, sans-serif',
      color: 'var(--text-primary)',
      overflow: 'hidden',
    }}>
      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px',
        background: 'rgba(7,11,18,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-glass)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src="/marie.png"
            alt="Logo NDTG"
            style={{ width: 40, height: 40, objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(99,102,241,0.3))' }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              Notre Dame de Toutes Grâces
            </div>
            <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              In God We Trust
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" style={{
            padding: '8px 20px', borderRadius: 99,
            color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500,
            textDecoration: 'none', transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            Connexion
          </Link>
          <Link to="/login" style={{
            padding: '9px 22px', borderRadius: 99,
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            color: 'white', fontSize: '0.85rem', fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.35)'; }}
          >
            Accéder au portail
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', paddingTop: 80, paddingBottom: 80, padding: '120px 40px 80px',
        textAlign: 'center',
      }}>
        {/* Background glows */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%',
          transform: 'translateX(-50%)',
          width: 700, height: 400,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '30%', left: '5%',
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none', animation: 'float 9s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '5%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
          pointerEvents: 'none', animation: 'float 11s ease-in-out infinite reverse',
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 860, margin: '0 auto' }}>
          {/* Logo Hero */}
          <div className="animate-slide-up" style={{ marginBottom: 24 }}>
            <img
              src="/marie.png"
              alt="Notre Dame de Toutes Grâces"
              style={{
                width: 100, height: 100, objectFit: 'contain',
                filter: 'drop-shadow(0 4px 20px rgba(99,102,241,0.25))',
                animation: 'float 5s ease-in-out infinite',
                margin: '0 auto',
              }}
            />
          </div>

          {/* Badge */}
          <div className="animate-slide-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 99,
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            marginBottom: 24,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
              animation: 'pulseGlow 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#818cf8', letterSpacing: '0.04em' }}>
              Portail Administratif Sécurisé — NDTG
            </span>
          </div>

          {/* Title */}
          <h1 className="animate-slide-up-d1" style={{
            fontSize: 'clamp(2.2rem, 6vw, 4.2rem)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: 24,
          }}>
            Gérez votre établissement
            <br />
            <span className="text-shimmer">avec excellence</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-slide-up-d2" style={{
            fontSize: '1.05rem', color: 'var(--text-secondary)',
            maxWidth: 560, margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            La plateforme centralisée pour la direction, la comptabilité et la gestion scolaire.
            Tous vos outils en un seul endroit.
          </p>

          {/* CTA Buttons */}
          <div className="animate-slide-up-d3" style={{
            display: 'flex', gap: 14, justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: 80,
          }}>
            <Link to="/login"
              className="btn-premium btn-primary"
              style={{ textDecoration: 'none', fontSize: '0.95rem', padding: '14px 32px' }}
            >
              Accéder au portail
              <ArrowRight size={18} />
            </Link>
            <Link to="/login"
              className="btn-premium btn-ghost"
              style={{ textDecoration: 'none', fontSize: '0.95rem', padding: '14px 32px' }}
            >
              En savoir plus
            </Link>
          </div>

          {/* Stats row */}
          <div className="animate-slide-up-d4" style={{
            display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap',
            marginBottom: 80,
          }}>
            {[
              { value: '1,200+', label: 'Élèves suivis' },
              { value: '7', label: 'Rôles administratifs' },
              { value: '100%', label: 'Sécurisé & Chiffré' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.8rem', fontWeight: 800,
                  background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16, textAlign: 'left',
          }}>
            {[
              { icon: ShieldCheck, color: '#6366f1', bg: 'rgba(99,102,241,0.12)', title: 'Sécurité Maximale', desc: 'Accès contrôlés par rôles, données chiffrées, sessions sécurisées.' },
              { icon: BarChart3,   color: '#10b981', bg: 'rgba(16,185,129,0.12)', title: 'Analyses & Rapports', desc: 'Statistiques en temps réel, performances et bilans financiers.' },
              { icon: Users,       color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', title: 'Gestion du Personnel', desc: 'Professeurs, absences, évaluations et suivi pédagogique.' },
              { icon: Landmark,    color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', title: 'Comptabilité', desc: 'Scolarités, dépenses, paies et inventaire centralisés.' },
              { icon: BookOpen,    color: '#22d3ee', bg: 'rgba(6,182,212,0.12)',  title: 'Gestion Scolaire', desc: 'Classes, bulletins, notes et emplois du temps.' },
              { icon: Zap,         color: '#fb923c', bg: 'rgba(249,115,22,0.12)', title: 'Rapide & Fiable', desc: 'Interface réactive, déployée sur infrastructure cloud robuste.' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i}
                  className="glass-card glass-card-hover"
                  style={{ padding: '22px 20px' }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, marginBottom: 14,
                    background: f.bg, border: `1px solid ${f.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color={f.color} />
                  </div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px 40px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.78rem',
      }}>
        © {new Date().getFullYear()} École Notre Dame de Grâce — Tous droits réservés
        <span style={{ margin: '0 12px', opacity: 0.3 }}>|</span>
        <Lock size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
        Accès sécurisé
      </footer>
    </div>
  );
}
