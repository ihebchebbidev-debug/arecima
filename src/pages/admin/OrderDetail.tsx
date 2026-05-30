import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ArrowLeft, Truck, CreditCard, MapPin, Printer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatusBadge from '@/components/admin/StatusBadge';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const statusLabels: Record<string, string> = {
  pending: 'En attente', confirmed: 'Confirmée', processing: 'En préparation',
  shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée', refunded: 'Remboursée',
};

const OrderDetail = () => {
  const { id } = useParams();
  const qc = useQueryClient();
  const [newStatus, setNewStatus] = useState<string>('');

  const orderQ = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.getOrder(id!),
    enabled: !!id,
  });

  const updateStatus = useMutation({
    mutationFn: () => api.updateOrderStatus(id!, newStatus),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Statut mis à jour');
        qc.invalidateQueries({ queryKey: ['order', id] });
        setNewStatus('');
      } else toast.error(res.error || 'Erreur');
    },
  });

  if (orderQ.isLoading) return <div className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;
  if (!orderQ.data?.success) return <div className="text-center py-12 text-destructive">{orderQ.data?.error || 'Commande introuvable'}</div>;

  const order = orderQ.data.data;
  const items: any[] = order.items || [];
  const timeline: any[] = order.timeline || [];

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          <Link to="/admin/orders" className="p-1 rounded hover:bg-muted shrink-0"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground truncate">{order.order_number}</h1>
          <StatusBadge status={order.status} />
        </div>
        {/* Desktop actions */}
        <div className="hidden sm:flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" /> Imprimer</Button>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger className="w-[180px] h-9 text-xs"><SelectValue placeholder="Changer le statut..." /></SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" disabled={!newStatus || updateStatus.isPending} onClick={() => updateStatus.mutate()}>
            {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Appliquer'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h3 className="font-medium text-foreground mb-4">Articles commandés</h3>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-muted-foreground border-b border-border"><th className="pb-2">Produit</th><th className="pb-2 text-right">Qté</th><th className="pb-2 text-right">Prix unitaire</th><th className="pb-2 text-right">Total</th></tr></thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          {item.product_image && <img src={item.product_image} alt="" className="h-10 w-10 rounded object-cover" />}
                          <span className="text-foreground">{item.product_name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right text-muted-foreground">{Number(item.unit_price).toFixed(2)} TND</td>
                      <td className="py-3 text-right">{Number(item.total).toFixed(2)} TND</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex gap-3 pb-3 border-b border-border last:border-0">
                  {item.product_image && <img src={item.product_image} alt="" className="h-14 w-14 rounded object-cover shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.quantity} × {Number(item.unit_price).toFixed(2)} TND</p>
                  </div>
                  <p className="text-sm font-medium shrink-0">{Number(item.total).toFixed(2)} TND</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-border space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{Number(order.subtotal).toFixed(2)} TND</span></div>
              {Number(order.discount) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Remise</span><span className="text-green-600">-{Number(order.discount).toFixed(2)} TND</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{Number(order.shipping) === 0 ? 'Gratuite' : `${Number(order.shipping).toFixed(2)} TND`}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Taxe</span><span>{Number(order.tax).toFixed(2)} TND</span></div>
              <div className="flex justify-between font-semibold pt-2 border-t border-border text-base"><span>Total</span><span>{Number(order.total).toFixed(2)} TND</span></div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h3 className="font-medium text-foreground mb-4">Chronologie</h3>
            {timeline.length === 0 ? <p className="text-sm text-muted-foreground">Aucun événement</p> : (
              <div className="space-y-4">
                {timeline.map((t: any, i: number) => (
                  <div key={t.id || i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5" />
                      {i < timeline.length - 1 && <div className="flex-1 w-px bg-border" />}
                    </div>
                    <div className="pb-4 min-w-0">
                      <p className="text-sm font-medium capitalize">{statusLabels[t.status] || t.status}</p>
                      {t.note && <p className="text-xs text-muted-foreground break-words">{t.note}</p>}
                      <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString('fr-FR')} {t.created_by_name ? `— ${t.created_by_name}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h3 className="font-medium mb-3 flex items-center gap-2"><CreditCard className="h-4 w-4" /> Paiement</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-2"><span className="text-muted-foreground">Méthode</span><span className="text-right break-words">{order.payment_method || '—'}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Statut</span><StatusBadge status={order.payment_status} /></div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
            <h3 className="font-medium mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> Adresse de livraison</h3>
            <p className="text-sm break-words">{order.customer_name}</p>
            <p className="text-sm text-muted-foreground break-all">{order.customer_email}</p>
            <p className="text-sm text-muted-foreground mt-2 break-words">{order.shipping_address}</p>
            <p className="text-sm text-muted-foreground break-words">{[order.shipping_city, order.shipping_postal_code, order.shipping_country].filter(Boolean).join(', ')}</p>
            {order.tracking_number && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">N° de suivi</p>
                <div className="flex items-center gap-2 text-sm"><Truck className="h-4 w-4 text-muted-foreground shrink-0" /><span className="font-mono break-all">{order.tracking_number}</span></div>
              </div>
            )}
          </div>
          {order.notes && (
            <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
              <h3 className="font-medium mb-3">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur-md border-t border-border p-3 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => window.print()} className="shrink-0">
          <Printer className="h-4 w-4" />
        </Button>
        <Select value={newStatus} onValueChange={setNewStatus}>
          <SelectTrigger className="flex-1 h-9 text-xs"><SelectValue placeholder="Statut..." /></SelectTrigger>
          <SelectContent>
            {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" disabled={!newStatus || updateStatus.isPending} onClick={() => updateStatus.mutate()}>
          {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'OK'}
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
