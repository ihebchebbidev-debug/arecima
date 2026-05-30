import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import SEOHead from '@/components/SEOHead';

const AdminLogin = () => {
  const [email, setEmail] = useState('Admin');
  const [password, setPassword] = useState('Admin@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isAuthenticated } = useAdminAuth();

  // Already logged in → straight to dashboard
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
    navigate(from, { replace: true });
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.error || 'Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ivory via-champagne to-background p-4">
      <SEOHead title="Administration" noindex />
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-border bg-card/95 backdrop-blur p-8 shadow-luxury">
          <div className="text-center mb-8">
            <div className="h-16 w-16 mx-auto mb-5 rounded-full gradient-gold flex items-center justify-center shadow-gold ring-1 ring-gold/30">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Arecima</h1>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold mt-1">Espace Administration</p>
            <div className="h-px w-12 mx-auto mt-4 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            <p className="text-sm text-muted-foreground mt-4">Connectez-vous pour gérer votre boutique</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Identifiant</label>
              <Input type="text" placeholder="Admin" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Identifiants :<br />
              <span className="font-mono text-foreground">Admin</span> / <span className="font-mono text-foreground">Admin@2026</span>
            </p>
            <p className="text-[10px] text-muted-foreground/70 text-center mt-2">
              Arecima · Beauté Rituelle
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
