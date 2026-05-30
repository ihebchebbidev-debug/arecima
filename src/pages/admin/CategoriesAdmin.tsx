import { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, X, Upload, FolderTree, Search, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Category {
  id: string;
  slug: string;
  name_fr: string;
  name_en?: string;
  name_ar?: string;
  description_fr?: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string;
  sort_order?: number;
  is_active?: number;
  product_count?: number;
}

const emptyForm: Partial<Category> = {
  slug: '',
  name_fr: '',
  name_en: '',
  name_ar: '',
  description_fr: '',
  description_en: '',
  description_ar: '',
  image_url: '',
  sort_order: 0,
  is_active: 1,
};

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Partial<Category>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const res = await api.listCategories();
    if (res.success && Array.isArray(res.data)) setCategories(res.data as Category[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm(cat);
    setOpen(true);
  };

  const close = () => { setOpen(false); setEditing(null); setForm(emptyForm); };

  const update = (k: keyof Category, v: any) => {
    setForm(prev => {
      const next = { ...prev, [k]: v };
      if (k === 'name_fr' && !editing) {
        next.slug = String(v).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      return next;
    });
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const res = await api.uploadFile(file);
    setUploading(false);
    if (res.success && res.data?.url) {
      update('image_url', res.data.url);
      toast.success('Image téléchargée');
    } else {
      toast.error(res.error || 'Échec du téléchargement');
    }
  };

  const save = async () => {
    if (!form.name_fr || !form.slug) {
      toast.error('Nom (FR) et slug sont obligatoires');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active ? 1 : 0,
      ...(editing ? { id: editing.id } : {}),
    };
    const res = editing ? await api.updateCategory(payload) : await api.createCategory(payload);
    setSaving(false);
    if (res.success) {
      toast.success(editing ? 'Catégorie mise à jour' : 'Catégorie créée');
      close();
      load();
    } else {
      toast.error(res.error || 'Échec');
    }
  };

  const remove = async (cat: Category) => {
    if (!confirm(`Supprimer la catégorie « ${cat.name_fr} » ?`)) return;
    const res = await api.deleteCategory(cat.id);
    if (res.success) {
      toast.success('Catégorie supprimée');
      load();
    } else {
      toast.error(res.error || 'Échec');
    }
  };

  const filtered = categories.filter(c =>
    !search || c.name_fr?.toLowerCase().includes(search.toLowerCase()) || c.slug?.includes(search.toLowerCase())
  );

  // Drag-and-drop reorder (HTML5 native)
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);

  const handleDrop = async (from: number, to: number) => {
    setDragIndex(null);
    setOverIndex(null);
    if (from === to || from < 0 || to < 0) return;
    if (search) {
      toast.error('Effacez la recherche pour réorganiser');
      return;
    }
    // Optimistic local reorder
    const next = [...categories];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const withOrder = next.map((c, i) => ({ ...c, sort_order: i }));
    setCategories(withOrder);

    // Persist — only update categories whose order actually changed
    setReordering(true);
    const changed = withOrder.filter((c, i) => categories[i]?.id !== c.id || categories[i]?.sort_order !== c.sort_order);
    const results = await Promise.all(
      changed.map(c => api.updateCategory({ id: c.id, sort_order: c.sort_order }))
    );
    setReordering(false);
    const failed = results.filter(r => !r.success).length;
    if (failed) {
      toast.error(`${failed} catégorie(s) n'ont pas pu être réordonnées`);
      load();
    } else {
      toast.success('Ordre mis à jour');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <FolderTree className="h-6 w-6" /> Catégories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Gérez les catégories de produits (multilingue).</p>
        </div>
        <Button onClick={openNew} className="shrink-0">
          <Plus className="h-4 w-4 mr-1" /> Nouvelle catégorie
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="pl-9" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
          Aucune catégorie. Créez-en une pour commencer.
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <GripVertical className="h-3.5 w-3.5" />
            {search
              ? 'Effacez la recherche pour réorganiser par glisser-déposer'
              : 'Glissez les cartes par la poignée pour changer l\'ordre d\'affichage'}
            {reordering && <span className="text-primary">— enregistrement…</span>}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((cat) => {
              // Use index in full categories array for drag (search disables drag)
              const idx = categories.findIndex(c => c.id === cat.id);
              const isDragging = dragIndex === idx;
              const isOver = overIndex === idx && dragIndex !== idx;
              return (
                <div
                  key={cat.id}
                  draggable={!search}
                  onDragStart={() => setDragIndex(idx)}
                  onDragOver={(e) => { e.preventDefault(); setOverIndex(idx); }}
                  onDragLeave={() => setOverIndex(prev => (prev === idx ? null : prev))}
                  onDrop={(e) => { e.preventDefault(); if (dragIndex !== null) handleDrop(dragIndex, idx); }}
                  onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
                  className={`bg-card border rounded-lg overflow-hidden transition-all ${
                    isDragging ? 'opacity-40 border-primary' :
                    isOver ? 'border-primary ring-2 ring-primary/30 shadow-md' :
                    'border-border hover:shadow-md'
                  }`}
                >
                  <div className="relative h-32 bg-muted overflow-hidden">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name_fr} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <FolderTree className="h-10 w-10" />
                      </div>
                    )}
                    {!search && (
                      <div className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm rounded p-1 cursor-grab active:cursor-grabbing shadow-sm" title="Glisser pour réorganiser">
                        <GripVertical className="h-4 w-4 text-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-medium text-foreground truncate">{cat.name_fr}</h3>
                        <p className="text-xs text-muted-foreground truncate">/{cat.slug}</p>
                      </div>
                      <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${cat.is_active ? 'bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                        {cat.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{cat.product_count || 0} produit{(cat.product_count || 0) !== 1 ? 's' : ''}</span>
                      <span>Ordre : {cat.sort_order ?? 0}</span>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(cat)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" /> Modifier
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => remove(cat)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl my-8 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card rounded-t-lg z-10">
              <h2 className="text-lg font-semibold text-foreground">
                {editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <button onClick={close} className="p-1.5 rounded hover:bg-muted">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <Tabs defaultValue="fr" className="w-full">
                <TabsList>
                  <TabsTrigger value="fr">🇫🇷 FR</TabsTrigger>
                  <TabsTrigger value="en">🇬🇧 EN</TabsTrigger>
                  <TabsTrigger value="ar">🇹🇳 AR</TabsTrigger>
                </TabsList>
                {(['fr', 'en', 'ar'] as const).map(lang => (
                  <TabsContent key={lang} value={lang} className="space-y-3 mt-3">
                    <div className="space-y-2">
                      <Label>Nom ({lang.toUpperCase()}) {lang === 'fr' && '*'}</Label>
                      <Input
                        value={(form as any)[`name_${lang}`] || ''}
                        onChange={e => update(`name_${lang}` as keyof Category, e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description ({lang.toUpperCase()})</Label>
                      <Textarea
                        value={(form as any)[`description_${lang}`] || ''}
                        onChange={e => update(`description_${lang}` as keyof Category, e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input value={form.slug || ''} onChange={e => update('slug', e.target.value)} placeholder="face-care" />
                </div>
                <div className="space-y-2">
                  <Label>Ordre d'affichage</Label>
                  <Input type="number" value={form.sort_order ?? 0} onChange={e => update('sort_order', Number(e.target.value))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image de la catégorie</Label>
                <div className="flex gap-2">
                  <Input value={form.image_url || ''} onChange={e => update('image_url', e.target.value)} placeholder="URL de l'image..." />
                  <Button variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-1" />
                    {uploading ? '…' : 'Téléverser'}
                  </Button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(f);
                      e.target.value = '';
                    }}
                  />
                </div>
                {form.image_url && (
                  <div className="h-32 w-32 rounded border border-border overflow-hidden bg-muted">
                    <img src={form.image_url} alt="Aperçu" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Switch checked={!!form.is_active} onCheckedChange={v => update('is_active', v ? 1 : 0)} />
                <Label>Catégorie active</Label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-border sticky bottom-0 bg-card rounded-b-lg">
              <Button variant="outline" onClick={close}>Annuler</Button>
              <Button onClick={save} disabled={saving}>
                {saving ? 'Enregistrement…' : editing ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesAdmin;
