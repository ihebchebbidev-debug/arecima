import { DollarSign, ShoppingCart, Users, Eye, TrendingUp, Package, AlertTriangle, Calendar, Clock, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { api } from '@/lib/api';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const Dashboard = () => {
  const { user } = useAdminAuth();
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Bonjour' : now.getHours() < 18 ? 'Bon après-midi' : 'Bonsoir';
  const firstName = (user?.full_name || 'Admin').split(' ')[0];

  const stats = useQuery({ queryKey: ['dashboard-stats'], queryFn: () => api.dashboardStats() });
  const recentOrders = useQuery({ queryKey: ['dashboard-recent'], queryFn: () => api.dashboardRecentOrders() });
  const topProducts = useQuery({ queryKey: ['dashboard-top-products'], queryFn: () => api.dashboardTopProducts() });
  const revenue = useQuery({ queryKey: ['dashboard-revenue', '12months'], queryFn: () => api.dashboardRevenueChart('12months') });
  const lowStock = useQuery({ queryKey: ['dashboard-low-stock'], queryFn: () => api.dashboardLowStock() });
  const overview = useQuery({ queryKey: ['analytics-overview'], queryFn: () => api.analyticsOverview('30') });
  const devices = useQuery({ queryKey: ['analytics-devices'], queryFn: () => api.analyticsDevices() });
  const countries = useQuery({ queryKey: ['analytics-countries'], queryFn: () => api.analyticsCountries() });
  const referrers = useQuery({ queryKey: ['analytics-referrers'], queryFn: () => api.analyticsReferrers() });

  const s = stats.data?.data || {};
  const ov = overview.data?.data || {};
  const orders = recentOrders.data?.data || [];
  const products = topProducts.data?.data || [];
  const revenueChart: any[] = revenue.data?.data || [];
  const lowStockItems: any[] = lowStock.data?.data || [];
  const devList: any[] = devices.data?.data || [];
  const countryList: any[] = countries.data?.data || [];
  const referrerList: any[] = referrers.data?.data || [];

  const totalDevices = devList.reduce((sum, d) => sum + Number(d.count || 0), 0) || 1;
  const totalReferrers = referrerList.reduce((sum, r) => sum + Number(r.count || 0), 0) || 1;
  const maxRevenue = Math.max(...revenueChart.map(r => Number(r.revenue || 0)), 1);

  const quickActions = [
    { label: 'Ajouter un produit', path: '/admin/products', icon: Package },
    { label: 'Voir les commandes', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Gérer les clients', path: '/admin/customers', icon: Users },
    { label: 'Statistiques', path: '/admin/analytics', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold mb-1.5">Tableau de bord</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            {greeting}, {firstName} <span className="text-gold">✦</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">Voici un résumé de votre boutique aujourd'hui</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground rounded-full border border-border bg-card px-3 py-1.5">
          <Calendar className="h-4 w-4" />
          {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map(action => (
          <Link key={action.path} to={action.path} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 hover:border-gold/40 hover:shadow-card transition-all group">
            <div className="p-2 rounded-md bg-muted group-hover:bg-gold/10 transition-colors">
              <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors" />
            </div>
            <span className="text-sm font-medium text-foreground">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Hero KPIs — 4 most important numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          variant="hero"
          title="Chiffre d'affaires"
          value={`${Number(s.total_revenue || 0).toLocaleString()} TND`}
          hint="Total cumulé"
          icon={DollarSign}
        />
        <StatCard
          variant="hero"
          title="CA aujourd'hui"
          value={`${Number(s.today_revenue || 0).toLocaleString()} TND`}
          hint={now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          icon={TrendingUp}
        />
        <StatCard
          variant="hero"
          title="Commandes"
          value={String(s.total_orders || 0)}
          hint={`${s.pending_orders || 0} en attente`}
          icon={ShoppingCart}
        />
        <StatCard
          variant="hero"
          title="Visiteurs (30j)"
          value={Number(ov.unique_visitors || 0).toLocaleString()}
          hint="30 derniers jours"
          icon={Eye}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard variant="compact" title="Clients" value={String(s.total_customers || 0)} icon={Users} />
        <StatCard variant="compact" title="En attente" value={String(s.pending_orders || 0)} icon={Clock} />
        <StatCard variant="compact" title="Stock faible" value={String(lowStockItems.length)} icon={AlertTriangle} />
        <StatCard variant="compact" title="Pages vues (30j)" value={Number(ov.page_views || 0).toLocaleString()} icon={Eye} />
      </div>

      {/* Needs Attention — unified action feed */}
      {(Number(s.pending_orders || 0) > 0 || lowStockItems.length > 0) && (
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <h3 className="font-medium text-foreground">À traiter en priorité</h3>
            <span className="ml-auto text-xs text-muted-foreground">
              {Number(s.pending_orders || 0) + lowStockItems.length} élément(s)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Number(s.pending_orders || 0) > 0 && (
              <Link
                to="/admin/orders?status=pending"
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 hover:bg-muted/60 hover:border-primary/30 transition-colors p-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-yellow-500/10 flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.pending_orders} commande(s) en attente</p>
                    <p className="text-xs text-muted-foreground">À confirmer ou préparer</p>
                  </div>
                </div>
                <span className="text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            )}
            {lowStockItems.length > 0 && (
              <Link
                to="/admin/products"
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 hover:bg-muted/60 hover:border-primary/30 transition-colors p-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-destructive/10 flex items-center justify-center">
                    <Package className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{lowStockItems.length} produit(s) stock bas</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {lowStockItems.slice(0, 2).map(p => p.name_fr).join(', ')}{lowStockItems.length > 2 ? '…' : ''}
                    </p>
                  </div>
                </div>
                <span className="text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-foreground">Tendance du chiffre d'affaires (12 mois)</h3>
          </div>
          {revenueChart.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">{revenue.isLoading ? 'Chargement...' : 'Pas encore de données'}</p>
          ) : (
            <div className="flex items-end gap-3 h-52">
              {revenueChart.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-xs text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {Number(d.revenue).toLocaleString()} TND
                  </span>
                  <div
                    className="w-full rounded-t transition-all duration-300 bg-primary/70 group-hover:bg-primary"
                    style={{ height: `${(Number(d.revenue) / maxRevenue) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{String(d.date).slice(-2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top devices */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">Appareils visiteurs</h3>
          </div>
          {devList.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Aucune donnée</p>
          ) : (
            <div className="space-y-3">
              {devList.map((d) => {
                const pct = Math.round((Number(d.count) / totalDevices) * 100);
                return (
                  <div key={d.device || 'unknown'}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground capitalize">{d.device || 'Inconnu'}</span>
                      <span className="text-muted-foreground">{d.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary/70" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Traffic sources */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-medium text-foreground mb-4">Sources de trafic</h3>
          {referrerList.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Aucune donnée</p>
          ) : (
            <div className="space-y-3">
              {referrerList.slice(0, 6).map(s => {
                const pct = Math.round((Number(s.count) / totalReferrers) * 100);
                return (
                  <div key={s.referrer_source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{s.referrer_source}</span>
                      <span className="text-muted-foreground">{s.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary/70" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Commandes récentes</h3>
            <Link to="/admin/orders" className="text-xs text-primary hover:underline">Voir tout →</Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">{recentOrders.isLoading ? 'Chargement...' : 'Aucune commande'}</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o: any) => (
                <Link to={`/admin/orders/${o.id}`} key={o.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:bg-muted/30 rounded px-1 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{o.order_number}</p>
                    <p className="text-xs text-muted-foreground">{o.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{Number(o.total).toFixed(2)} TND</p>
                    <StatusBadge status={o.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top countries */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-medium text-foreground mb-3">Top pays</h3>
          {countryList.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Aucune donnée</p>
          ) : (
            <div className="space-y-2">
              {countryList.slice(0, 6).map((c: any) => (
                <div key={c.country} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                  <span className="text-foreground">{c.country}</span>
                  <span className="text-muted-foreground font-medium">{c.count} visiteurs</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top products */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">Produits les plus vendus</h3>
          <Link to="/admin/products" className="text-xs text-primary hover:underline">Gérer les produits →</Link>
        </div>
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">{topProducts.isLoading ? 'Chargement...' : 'Aucune vente enregistrée'}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 8).map((p: any) => (
              <div key={p.id} className="rounded-lg border border-border p-4 text-center hover:border-primary/30 hover:shadow-sm transition-all group">
                <div className="h-10 w-10 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Package className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm font-medium text-foreground line-clamp-2">{p.name_fr}</p>
                <p className="text-xs text-muted-foreground mt-1">{Number(p.price).toFixed(2)} TND</p>
                <p className="text-xs text-muted-foreground mt-0.5">Vendus : {p.total_sold || 0} • Stock : {p.stock}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
