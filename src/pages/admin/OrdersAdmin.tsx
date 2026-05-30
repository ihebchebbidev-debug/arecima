import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Eye, Download, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/admin/StatusBadge';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusLabels: Record<string, string> = {
  all: 'Toutes', pending: 'En attente', confirmed: 'Confirmée', processing: 'En préparation',
  shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée', refunded: 'Remboursée',
};
const statuses = Object.keys(statusLabels);
const statusOptions = statuses.filter(s => s !== 'all');

const OrdersAdmin = () => {
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  // Sync status filter with URL (so /admin/orders?status=pending from dashboard works)
  useEffect(() => {
    const fromUrl = searchParams.get('status');
    if (fromUrl && fromUrl !== statusFilter) setStatusFilter(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const setStatus = (s: string) => {
    setStatusFilter(s);
    if (s === 'all') searchParams.delete('status');
    else searchParams.set('status', s);
    setSearchParams(searchParams, { replace: true });
  };

  const ordersQ = useQuery({
    queryKey: ['orders-admin', statusFilter, search],
    queryFn: () => api.listOrders({
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: search || undefined,
      limit: 100,
    }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateOrderStatus(id, status),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Statut mis à jour');
        qc.invalidateQueries({ queryKey: ['orders-admin'] });
      } else {
        toast.error(res.error || 'Échec de la mise à jour');
      }
    },
  });

  const orders: any[] = ordersQ.data?.data || [];
  const totalRevenue = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total), 0);

  const exportCsv = () => {
    const rows = [
      ['Order #', 'Client', 'Email', 'Statut', 'Paiement', 'Méthode', 'Total', 'Date'],
      ...orders.map(o => [o.order_number, o.customer_name, o.customer_email, o.status, o.payment_status, o.payment_method || '', Number(o.total).toFixed(2), o.created_at]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `arecima-commandes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Gestion des commandes</h1>
        <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> <span className="hidden xs:inline">Exporter</span> CSV</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4"><p className="text-xs sm:text-sm text-muted-foreground">Total commandes</p><p className="text-lg sm:text-xl font-semibold">{orders.length}</p></div>
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4"><p className="text-xs sm:text-sm text-muted-foreground">Revenus encaissés</p><p className="text-lg sm:text-xl font-semibold">{totalRevenue.toFixed(2)} TND</p></div>
        {(['pending', 'processing', 'shipped'] as const).map(s => {
          const count = orders.filter(o => o.status === s).length;
          return (
            <div key={s} className="rounded-lg border border-border bg-card p-3 sm:p-4 cursor-pointer hover:bg-muted/30" onClick={() => setStatus(s)}>
              <p className="text-xs sm:text-sm text-muted-foreground">{statusLabels[s]}</p>
              <p className="text-lg sm:text-xl font-semibold">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher par n° ou client..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatus(s)} className={cn("px-3 py-1.5 text-xs rounded-md whitespace-nowrap shrink-0", statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
              {statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {ordersQ.isLoading ? (
          <div className="p-12 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Chargement...</div>
        ) : ordersQ.error || !ordersQ.data?.success ? (
          <div className="p-8 text-center text-sm text-destructive">Erreur API : {ordersQ.data?.error || 'Backend inaccessible.'}</div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="md:hidden divide-y divide-border">
              {orders.map(o => (
                <div key={o.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm">{o.order_number}</p>
                      <p className="text-sm text-foreground truncate">{o.customer_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{o.customer_email}</p>
                    </div>
                    <Link to={`/admin/orders/${o.id}`} className="p-2 rounded hover:bg-muted shrink-0"><Eye className="h-4 w-4 text-primary" /></Link>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">{Number(o.total).toFixed(2)} TND</span>
                    <StatusBadge status={o.payment_status} />
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <select
                      value={o.status}
                      disabled={updateStatus.isPending}
                      onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value })}
                      className="text-xs bg-background border border-border rounded px-2 py-1 focus:outline-none focus:border-primary"
                    >
                      {statusOptions.map(s => (<option key={s} value={s}>{statusLabels[s]}</option>))}
                    </select>
                    <span className="text-xs text-muted-foreground">{o.created_at?.slice(0, 10)}</span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <div className="p-12 text-center text-muted-foreground text-sm">Aucune commande</div>}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block max-h-[70vh] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card z-10 shadow-[inset_0_-1px_0_hsl(var(--border))]">
                  <tr className="text-left text-muted-foreground">
                    <th className="p-3">N° Commande</th><th className="p-3">Client</th><th className="p-3 text-right">Total</th>
                    <th className="p-3">Statut</th><th className="p-3">Paiement</th><th className="p-3">Méthode</th>
                    <th className="p-3">Date</th><th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-medium text-foreground">{o.order_number}</td>
                      <td className="p-3"><p className="text-foreground">{o.customer_name}</p><p className="text-xs text-muted-foreground">{o.customer_email}</p></td>
                      <td className="p-3 text-right font-medium">{Number(o.total).toFixed(2)} TND</td>
                      <td className="p-3">
                        <select
                          value={o.status}
                          disabled={updateStatus.isPending}
                          onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value })}
                          className="text-xs bg-background border border-border rounded px-2 py-1 focus:outline-none focus:border-primary cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {statusOptions.map(s => (
                            <option key={s} value={s}>{statusLabels[s]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3"><StatusBadge status={o.payment_status} /></td>
                      <td className="p-3 text-muted-foreground">{o.payment_method || '—'}</td>
                      <td className="p-3 text-muted-foreground">{o.created_at?.slice(0, 10)}</td>
                      <td className="p-3"><Link to={`/admin/orders/${o.id}`} className="p-1.5 rounded hover:bg-muted inline-flex"><Eye className="h-4 w-4 text-primary" /></Link></td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan={8} className="p-12 text-center text-muted-foreground">Aucune commande</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersAdmin;
