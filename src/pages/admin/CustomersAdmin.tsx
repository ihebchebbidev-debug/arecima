import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Eye, Download, Mail, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

const CustomersAdmin = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const customersQ = useQuery({
    queryKey: ['customers-admin', search],
    queryFn: () => api.listCustomers({ search: search || undefined, limit: 100 }),
  });

  const customers: any[] = customersQ.data?.data || [];
  const totalRevenue = customers.reduce((s, c) => s + Number(c.total_spent || 0), 0);
  const avgSpent = customers.length > 0 ? totalRevenue / customers.length : 0;
  const subscribed = customers.filter(c => Number(c.is_subscribed)).length;

  const exportCsv = () => {
    const rows = [
      ['Email', 'Prénom', 'Nom', 'Téléphone', 'Pays', 'Ville', 'Commandes', 'Dépensé', 'Newsletter', 'Inscrit'],
      ...customers.map(c => [c.email, c.first_name, c.last_name, c.phone || '', c.country || '', c.city || '', c.total_orders || 0, Number(c.total_spent || 0).toFixed(2), c.is_subscribed ? 'Oui' : 'Non', c.created_at]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `arecima-clients-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">CRM — Gestion des clients</h1>
        <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> <span className="hidden xs:inline">Exporter</span> CSV</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4"><p className="text-xs sm:text-sm text-muted-foreground">Total clients</p><p className="text-lg sm:text-xl font-semibold">{customers.length}</p></div>
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4"><p className="text-xs sm:text-sm text-muted-foreground">Abonnés newsletter</p><p className="text-lg sm:text-xl font-semibold">{subscribed}</p></div>
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4"><p className="text-xs sm:text-sm text-muted-foreground">Revenus totaux</p><p className="text-lg sm:text-xl font-semibold">{totalRevenue.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">TND</span></p></div>
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4"><p className="text-xs sm:text-sm text-muted-foreground">Dépense moyenne</p><p className="text-lg sm:text-xl font-semibold">{avgSpent.toFixed(0)} <span className="text-xs font-normal text-muted-foreground">TND</span></p></div>
      </div>

      <div className="relative max-w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher un client..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {customersQ.isLoading ? (
          <div className="p-12 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Chargement...</div>
        ) : customersQ.error || !customersQ.data?.success ? (
          <div className="p-8 text-center text-sm text-destructive">Erreur API : {customersQ.data?.error || 'Backend inaccessible.'}</div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="md:hidden divide-y divide-border">
              {customers.map(c => (
                <Link key={c.id} to={`/admin/customers/${c.id}`} className="flex items-start gap-3 p-3 hover:bg-muted/30 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium shrink-0">
                    {(c.first_name || '?')[0]}{(c.last_name || '?')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{c.first_name} {c.last_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <span className="text-xs text-muted-foreground">{c.total_orders || 0} cmd</span>
                      <span className="text-sm font-semibold">{Number(c.total_spent || 0).toLocaleString()} TND</span>
                    </div>
                    {Number(c.is_subscribed) ? <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1"><Mail className="h-3 w-3" /> Abonné newsletter</span> : null}
                  </div>
                </Link>
              ))}
              {customers.length === 0 && <div className="p-12 text-center text-muted-foreground text-sm">Aucun client</div>}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block max-h-[70vh] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card z-10 shadow-[inset_0_-1px_0_hsl(var(--border))]">
                  <tr className="text-left text-muted-foreground">
                    <th className="p-3">Client</th><th className="p-3">Téléphone</th><th className="p-3">Localisation</th>
                    <th className="p-3 text-right">Commandes</th><th className="p-3 text-right">Total dépensé</th>
                    <th className="p-3">Newsletter</th><th className="p-3">Inscrit le</th><th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium shrink-0">
                            {(c.first_name || '?')[0]}{(c.last_name || '?')[0]}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{c.first_name} {c.last_name}</p>
                            <p className="text-xs text-muted-foreground">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{c.phone || '—'}</td>
                      <td className="p-3 text-muted-foreground">{[c.city, c.country].filter(Boolean).join(', ') || '—'}</td>
                      <td className="p-3 text-right">{c.total_orders || 0}</td>
                      <td className="p-3 text-right font-medium">{Number(c.total_spent || 0).toLocaleString()} TND</td>
                      <td className="p-3">{Number(c.is_subscribed) ? <span className="flex items-center gap-1 text-xs text-green-600"><Mail className="h-3 w-3" /> Abonné</span> : <span className="text-xs text-muted-foreground">Non</span>}</td>
                      <td className="p-3 text-muted-foreground">{c.created_at?.slice(0, 10)}</td>
                      <td className="p-3"><Link to={`/admin/customers/${c.id}`} className="p-1.5 rounded hover:bg-muted inline-flex"><Eye className="h-4 w-4 text-primary" /></Link></td>
                    </tr>
                  ))}
                  {customers.length === 0 && <tr><td colSpan={8} className="p-12 text-center text-muted-foreground">Aucun client</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomersAdmin;
