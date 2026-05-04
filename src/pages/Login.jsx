import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';
import { KeyRound, User, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(identifier, password);
      const role = data.user.role;
      switch (role) {
        case 'admin':       navigate('/admin/dashboard'); break;
        case 'directeur':   navigate('/directeur/dashboard'); break;
        case 'censeur':     navigate('/censeur/dashboard'); break;
        case 'surveillant': navigate('/surveillant/dashboard'); break;
        case 'secretariat': navigate('/secretariat/dashboard'); break;
        case 'comptable':   navigate('/comptabilite/dashboard'); break;
        case 'caisse':      navigate('/caisse/dashboard'); break;
        default:            navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Animated background blobs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: 450, height: 450, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'float 10s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute', top: '40%', right: '20%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Back to landing */}
      <Link to="/" style={{
        position: 'absolute', top: 24, left: 24,
        display: 'flex', alignItems: 'center', gap: 8,
        color: 'var(--text-muted)', fontSize: '0.83rem', fontWeight: 500,
        textDecoration: 'none', transition: 'color 0.2s',
        zIndex: 10,
      }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} />
        Retour
      </Link>

      {/* Card */}
      <div className="animate-slide-up" style={{
        width: '100%', maxWidth: 420,
        background: 'rgba(13, 21, 38, 0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid var(--border-glass)',
        borderRadius: 20,
        padding: '40px 36px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Top glow line */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)',
          borderRadius: 1,
        }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src="/marie.png"
            alt="Notre Dame de Toutes Grâces"
            style={{
              width: 80, height: 80, objectFit: 'contain',
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 4px 20px rgba(99,102,241,0.3))',
              animation: 'float 5s ease-in-out infinite',
            }}
          />
          <h1 style={{
            fontSize: '1.4rem', fontWeight: 700,
            color: 'var(--text-primary)', marginBottom: 4,
          }}>
            Espace Direction
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
            Notre Dame de Toutes Grâces
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: 20, padding: '12px 14px', borderRadius: 10,
            background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)',
            color: '#fb7185', fontSize: '0.83rem', lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Identifier */}
          <div>
            <label style={{
              display: 'block', marginBottom: 8,
              fontSize: '0.78rem', fontWeight: 600,
              color: 'var(--text-secondary)', letterSpacing: '0.03em',
            }}>
              Email ou Identifiant
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
              }} />
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="input-premium"
                placeholder="admin ou admin@ecole.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block', marginBottom: 8,
              fontSize: '0.78rem', fontWeight: 600,
              color: 'var(--text-secondary)', letterSpacing: '0.03em',
            }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
              }} />
              <input
                type={showPwd ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-premium"
                placeholder="••••••••"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: 'absolute', right: 14, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: 0,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-premium btn-primary"
            style={{
              width: '100%', justifyContent: 'center',
              marginTop: 4, padding: '13px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <><Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} /> Connexion en cours...</>
            ) : 'Se connecter'}
          </button>
        </form>

        {/* Footer note */}
        <p style={{
          textAlign: 'center', marginTop: 24,
          fontSize: '0.75rem', color: 'var(--text-muted)',
        }}>
          Accès réservé au personnel autorisé
        </p>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
