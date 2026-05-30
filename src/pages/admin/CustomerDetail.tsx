import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingCart, CreditCard, Star, Loader2 } from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import { api } from '@/lib/api';

const CustomerDetail = () => {
  const { id } = useParams();
  const customerQ = useQuery({ queryKey: ['customer', id], queryFn: () => api.getCustomer(id!), enabled: !!id });

  if (customerQ.isLoading) return <div className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;
  if (!customerQ.data?.success) return <div className="text-center py-12 text-destructive">{customerQ.data?.error || 'Client introuvable'}</div>;

  const c = customerQ.data.data;
  const orders: any[] = c.recent_orders || [];
  const tags: string[] = c.tags || [];
  const totalOrders = Number(c.total_orders || 0);
  const totalSpent = Number(c.total_spent || 0);
  const avgOrder = totalOrders > 0 ? (totalSpent / totalOrders).toFixed(0) : '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Link to="/admin/customers" className="p-1 rounded hover:bg-muted shrink-0"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground truncate min-w-0">{c.first_name} {c.last_name}</h1>
        {tags.map(t => (<span key={t} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{t}</span>))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-3">
            <h3 className="font-medium">Informations de contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground min-w-0"><Mail className="h-4 w-4 shrink-0" /> <span className="truncate">{c.email}</span></div>
              {c.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4 shrink-0" /> {c.phone}</div>}
              {(c.city || c.country) && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" /> {[c.city, c.country].filter(Boolean).join(', ')}</div>}
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 shrink-0" /> Membre depuis le {c.created_at?.slice(0, 10)}</div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h3 className="font-medium mb-3">Statistiques du client</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50"><ShoppingCart className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className="text-xl sm:text-2xl font-semibold">{totalOrders}</p><p className="text-[11px] sm:text-xs text-muted-foreground">Commandes</p></div>
              <div className="text-center p-3 rounded-lg bg-muted/50"><CreditCard className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className="text-xl sm:text-2xl font-semibold">{totalSpent.toLocaleString()}</p><p className="text-[11px] sm:text-xs text-muted-foreground">TND dépensés</p></div>
              <div className="text-center p-3 rounded-lg bg-muted/50"><Star className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className="text-xl sm:text-2xl font-semibold">{avgOrder}</p><p className="text-[11px] sm:text-xs text-muted-foreground">TND panier moyen</p></div>
              <div className="text-center p-3 rounded-lg bg-muted/50"><Mail className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className="text-xl sm:text-2xl font-semibold">{Number(c.is_subscribed) ? '✓' : '✗'}</p><p className="text-[11px] sm:text-xs text-muted-foreground">Newsletter</p></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h3 className="font-medium mb-4">Historique des commandes ({orders.length})</h3>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Aucune commande pour ce client.</p>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-muted-foreground border-b border-border"><th className="pb-2">N°</th><th className="pb-2 text-right">Total</th><th className="pb-2">Statut</th><th className="pb-2">Date</th><th className="pb-2"></th></tr></thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id} className="border-b border-border last:border-0">
                          <td className="py-3 font-medium">{o.order_number}</td>
                          <td className="py-3 text-right font-medium">{Number(o.total).toFixed(2)} TND</td>
                          <td className="py-3"><StatusBadge status={o.status} /></td>
                          <td className="py-3 text-muted-foreground">{o.created_at?.slice(0, 10)}</td>
                          <td className="py-3"><Link to={`/admin/orders/${o.id}`} className="text-xs text-primary hover:underline">Détails →</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3">
                  {orders.map(o => (
                    <Link key={o.id} to={`/admin/orders/${o.id}`} className="block p-3 rounded-lg border border-border hover:border-primary/40 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-medium text-sm">{o.order_number}</span>
                        <StatusBadge status={o.status} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{o.created_at?.slice(0, 10)}</span>
                        <span className="font-medium text-foreground">{Number(o.total).toFixed(2)} TND</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
