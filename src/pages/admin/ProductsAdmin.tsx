import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Plus, Search, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/admin/StatusBadge';
import ProductFormDialog from '@/components/admin/ProductFormDialog';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ProductsAdmin = () => {
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const cats = useQuery({ queryKey: ['categories'], queryFn: () => api.listCategories() });
  const productsQ = useQuery({
    queryKey: ['products-admin', search, categoryFilter],
    queryFn: () => api.listProducts({
      search: search || undefined,
      category_id: categoryFilter === 'all' ? undefined : categoryFilter,
      limit: 100,
    }),
  });

  const products: any[] = productsQ.data?.data || [];
  const categories: any[] = cats.data?.data || [];

  const totalValue = products.reduce((s, p) => s + Number(p.price) * Number(p.stock), 0);
  const totalStock = products.reduce((s, p) => s + Number(p.stock), 0);
  const outOfStock = products.filter(p => Number(p.stock) === 0).length;
  const lowStock = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= Number(p.low_stock_threshold)).length;

  const toggleActive = useMutation({
    mutationFn: (p: any) => api.updateProduct({ id: p.id, is_active: p.is_active ? 0 : 1 }),
    onSuccess: (res) => {
      if (res.success) { toast.success('Produit mis à jour'); qc.invalidateQueries({ queryKey: ['products-admin'] }); }
      else toast.error(res.error || 'Échec de la mise à jour');
    },
  });

  const removeProduct = useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: (res) => {
      if (res.success) { toast.success('Produit supprimé'); qc.invalidateQueries({ queryKey: ['products-admin'] }); }
      else toast.error(res.error || 'Échec de la suppression');
    },
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Gestion des produits</h1>
        <Button size="sm" onClick={() => { setEditProduct(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-1" /> <span className="hidden xs:inline">Ajouter un produit</span><span className="xs:hidden">Ajouter</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4"><p className="text-xs sm:text-sm text-muted-foreground">Total produits</p><p className="text-lg sm:text-xl font-semibold">{products.length}</p></div>
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4"><p className="text-xs sm:text-sm text-muted-foreground">Stock total</p><p className="text-lg sm:text-xl font-semibold">{totalStock.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">unités</span></p></div>
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4"><p className="text-xs sm:text-sm text-muted-foreground">Valeur du stock</p><p className="text-lg sm:text-xl font-semibold">{totalValue.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">TND</span></p></div>
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4"><p className="text-xs sm:text-sm text-muted-foreground">Alertes</p><p className="text-base sm:text-xl font-semibold leading-tight"><span className="text-destructive">{outOfStock} rupture</span>{lowStock > 0 && <span className="text-yellow-600 block sm:inline sm:ml-1">• {lowStock} faible</span>}</p></div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un produit..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
          <button onClick={() => setCategoryFilter('all')} className={cn("px-3 py-1.5 text-xs rounded-md whitespace-nowrap shrink-0", categoryFilter === 'all' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>Toutes</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setCategoryFilter(c.id)} className={cn("px-3 py-1.5 text-xs rounded-md whitespace-nowrap shrink-0", categoryFilter === c.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>{c.name_fr}</button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {productsQ.isLoading ? (
          <div className="p-12 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Chargement...</div>
        ) : productsQ.error || !productsQ.data?.success ? (
          <div className="p-8 text-center text-sm text-destructive">Erreur API : {productsQ.data?.error || 'Backend inaccessible. Vérifie http://la7ni.com/arecima/api/products.php'}</div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="md:hidden divide-y divide-border">
              {products.map(p => (
                <div key={p.id} className="p-3 flex gap-3">
                  <div className="h-16 w-16 rounded bg-muted overflow-hidden flex items-center justify-center shrink-0">
                    {p.primary_image ? <img src={p.primary_image} alt={p.name_fr} className="h-full w-full object-cover" /> : <Package className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{p.name_fr}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.category_name || '—'} • {p.size || '—'}</p>
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm">{Number(p.price).toFixed(2)} TND</span>
                        <span className={cn("text-xs", Number(p.stock) === 0 ? 'text-destructive' : Number(p.stock) <= Number(p.low_stock_threshold) ? 'text-yellow-600' : 'text-muted-foreground')}>Stock: {p.stock}</span>
                      </div>
                      <StatusBadge status={Number(p.is_active) ? 'active' : 'inactive'} />
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <button className="p-1.5 rounded hover:bg-muted" onClick={() => { setEditProduct(p); setShowForm(true); }} aria-label="Modifier"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                      <button className="p-1.5 rounded hover:bg-muted" onClick={() => toggleActive.mutate(p)} aria-label="Activer/Désactiver">
                        {Number(p.is_active) ? <EyeOff className="h-3.5 w-3.5 text-muted-foreground" /> : <Eye className="h-3.5 w-3.5 text-muted-foreground" />}
                      </button>
                      <button className="p-1.5 rounded hover:bg-destructive/10 ml-auto" onClick={() => { if (confirm(`Supprimer "${p.name_fr}" ?`)) removeProduct.mutate(p.id); }} aria-label="Supprimer">
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {products.length === 0 && <div className="p-12 text-center text-muted-foreground text-sm">Aucun produit. Cliquez sur "Ajouter".</div>}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block max-h-[70vh] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card z-10 shadow-[inset_0_-1px_0_hsl(var(--border))]">
                  <tr className="text-left text-muted-foreground">
                    <th className="p-3">Produit</th><th className="p-3">Catégorie</th><th className="p-3 text-right">Prix</th>
                    <th className="p-3 text-right">Stock</th><th className="p-3">Statut</th><th className="p-3 text-right">Note</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-muted overflow-hidden flex items-center justify-center shrink-0">
                            {p.primary_image ? <img src={p.primary_image} alt={p.name_fr} className="h-full w-full object-cover" /> : <Package className="h-5 w-5 text-muted-foreground" />}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{p.name_fr}</p>
                            <p className="text-xs text-muted-foreground">{p.size || '—'} • {p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{p.category_name || '—'}</td>
                      <td className="p-3 text-right">{Number(p.price).toFixed(2)} TND</td>
                      <td className="p-3 text-right">
                        <span className={cn("font-medium", Number(p.stock) === 0 ? 'text-destructive' : Number(p.stock) <= Number(p.low_stock_threshold) ? 'text-yellow-600' : 'text-foreground')}>{p.stock}</span>
                      </td>
                      <td className="p-3"><div className="flex gap-1 flex-wrap"><StatusBadge status={Number(p.is_active) ? 'active' : 'inactive'} />{Number(p.is_new) ? <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Nouveau</span> : null}{Number(p.is_best_seller) ? <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Best-seller</span> : null}</div></td>
                      <td className="p-3 text-right">⭐ {Number(p.rating || 0).toFixed(1)} <span className="text-muted-foreground">({p.review_count || 0})</span></td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 rounded hover:bg-muted" title="Modifier" onClick={() => { setEditProduct(p); setShowForm(true); }}><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                          <button className="p-1.5 rounded hover:bg-muted" title={Number(p.is_active) ? 'Désactiver' : 'Activer'} onClick={() => toggleActive.mutate(p)}>
                            {Number(p.is_active) ? <EyeOff className="h-3.5 w-3.5 text-muted-foreground" /> : <Eye className="h-3.5 w-3.5 text-muted-foreground" />}
                          </button>
                          <button className="p-1.5 rounded hover:bg-destructive/10" title="Supprimer" onClick={() => { if (confirm(`Supprimer "${p.name_fr}" ?`)) removeProduct.mutate(p.id); }}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && <tr><td colSpan={7} className="p-12 text-center text-muted-foreground">Aucun produit. Cliquez sur "Ajouter un produit".</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <p className="text-xs text-muted-foreground text-right">{products.length} produit(s) affiché(s)</p>

      <ProductFormDialog
        open={showForm}
        product={editProduct || undefined}
        onClose={() => { setShowForm(false); setEditProduct(null); qc.invalidateQueries({ queryKey: ['products-admin'] }); }}
      />
    </div>
  );
};

export default ProductsAdmin;
