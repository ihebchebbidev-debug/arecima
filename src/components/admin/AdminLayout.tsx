import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  UserCog, ChevronLeft, ChevronRight, LogOut, Search, Bell, Menu, X, FolderTree,
  AlertTriangle, Clock, Plug
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { api } from '@/lib/api';

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { path: '/admin/products', icon: Package, label: 'Produits' },
  { path: '/admin/categories', icon: FolderTree, label: 'Catégories' },
  { path: '/admin/orders', icon: ShoppingCart, label: 'Commandes' },
  { path: '/admin/customers', icon: Users, label: 'Clients (CRM)' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytique' },
  { path: '/admin/integrations', icon: Plug, label: 'Intégrations' },
  { path: '/admin/users', icon: UserCog, label: 'Utilisateurs' },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAdminAuth();

  useEffect(() => {
    setMobileOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  // Close notifications when clicking outside.
  useEffect(() => {
    if (!notifOpen) return;
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [notifOpen]);

  // Notifications data — pending orders + low-stock products.
  const pendingOrdersQ = useQuery({
    queryKey: ['notif-pending-orders'],
    queryFn: () => api.listOrders({ status: 'pending', limit: 5 }),
    refetchInterval: 60_000,
  });
  const lowStockQ = useQuery({
    queryKey: ['notif-low-stock'],
    queryFn: () => api.dashboardLowStock(),
    refetchInterval: 120_000,
  });
  const pendingOrders: any[] = pendingOrdersQ.data?.data || [];
  const lowStock: any[] = lowStockQ.data?.data || [];
  const notifCount = pendingOrders.length + lowStock.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    // Route to the most relevant section based on current page; default to orders.
    const target = location.pathname.startsWith('/admin/products') ? '/admin/products'
      : location.pathname.startsWith('/admin/customers') ? '/admin/customers'
      : '/admin/orders';
    navigate(`${target}?search=${encodeURIComponent(q)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const initials = (user?.full_name || 'AA').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const sidebarContent = (isMobile: boolean) => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-border">
        {(isMobile || !collapsed) && (
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-xl font-semibold tracking-tight text-foreground">Arecima</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Admin</span>
          </div>
        )}
        {isMobile ? (
          <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-muted hidden lg:block">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {(isMobile || !collapsed) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-border space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted">
          <LogOut className="h-4 w-4 shrink-0" />
          {(isMobile || !collapsed) && <span>Retour à la boutique</span>}
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-destructive hover:bg-destructive/10">
          <LogOut className="h-4 w-4 shrink-0" />
          {(isMobile || !collapsed) && <span>Déconnexion</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        {sidebarContent(false)}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 h-full bg-card flex flex-col shadow-xl">
            {sidebarContent(true)}
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 py-3 border-b border-border bg-card/95 backdrop-blur-md">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-md hover:bg-muted lg:hidden shrink-0" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-0 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Rechercher commandes, produits, clients..."
              className="pl-9 h-9"
            />
          </form>
          <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="relative p-2 rounded-md hover:bg-muted"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                {notifCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center">
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1rem)] rounded-lg border border-border bg-card shadow-lg overflow-hidden z-40">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Notifications</span>
                    <span className="text-xs text-muted-foreground">{notifCount} en attente</span>
                  </div>
                  <div className="max-h-80 overflow-auto divide-y divide-border">
                    {pendingOrders.length > 0 && (
                      <div className="p-2">
                        <p className="px-2 pt-1 pb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Commandes en attente</p>
                        {pendingOrders.map((o) => (
                          <Link
                            key={o.id}
                            to={`/admin/orders/${o.id}`}
                            onClick={() => setNotifOpen(false)}
                            className="flex items-start gap-2 px-2 py-2 rounded hover:bg-muted/50 transition-colors"
                          >
                            <Clock className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-foreground truncate">{o.order_number} — {o.customer_name}</p>
                              <p className="text-xs text-muted-foreground">{Number(o.total).toFixed(2)} TND</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {lowStock.length > 0 && (
                      <div className="p-2">
                        <p className="px-2 pt-1 pb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Stock faible</p>
                        {lowStock.slice(0, 5).map((p: any) => (
                          <Link
                            key={p.id}
                            to={`/admin/products`}
                            onClick={() => setNotifOpen(false)}
                            className="flex items-start gap-2 px-2 py-2 rounded hover:bg-muted/50 transition-colors"
                          >
                            <AlertTriangle className="h-4 w-4 mt-0.5 text-destructive shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-foreground truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground">Stock : {p.stock}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {notifCount === 0 && (
                      <div className="p-8 text-center text-sm text-muted-foreground">Tout est à jour ✓</div>
                    )}
                  </div>
                  <Link
                    to="/admin/orders"
                    onClick={() => setNotifOpen(false)}
                    className="block px-4 py-2.5 text-xs text-center text-primary hover:bg-muted/50 border-t border-border"
                  >
                    Voir toutes les commandes →
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium shrink-0 ring-2 ring-gold/40">
                {initials}
              </div>
              <span className="text-sm text-foreground hidden md:block truncate max-w-[140px]">{user?.full_name || 'Administrateur'}</span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
