import { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, ImagePlus, GripVertical, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from './RichTextEditor';
import type { AdminProduct } from '@/data/adminMockData';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface ProductFormDialogProps {
  product?: AdminProduct & {
    descriptionFr?: string;
    descriptionEn?: string;
    descriptionAr?: string;
    shortDescriptionFr?: string;
    shortDescriptionEn?: string;
    shortDescriptionAr?: string;
    ingredientsFr?: string;
    ingredientsEn?: string;
    ingredientsAr?: string;
    howToUseFr?: string;
    howToUseEn?: string;
    howToUseAr?: string;
    benefitsFr?: string[];
    benefitsEn?: string[];
    benefitsAr?: string[];
    images?: string[];
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];
    weight?: number;
    sku?: string;
    barcode?: string;
  };
  open: boolean;
  onClose: () => void;
}

const ProductFormDialog = ({ product, open, onClose }: ProductFormDialogProps) => {
  const isEdit = !!product;
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name_fr: string }>>([]);

  useEffect(() => {
    api.listCategories().then(res => {
      if (res.success && Array.isArray(res.data)) setCategories(res.data as any);
    });
  }, []);

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    category: product?.category || 'Face Care',
    size: product?.size || '',
    weight: product?.weight || 0,
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    costPrice: product?.costPrice || 0,
    stock: product?.stock || 0,
    lowStockThreshold: product?.lowStockThreshold || 10,
    isActive: product?.isActive ?? true,
    isNew: product?.isNew || false,
    isBestSeller: product?.isBestSeller || false,
    descriptionFr: product?.descriptionFr || '',
    descriptionEn: product?.descriptionEn || '',
    descriptionAr: product?.descriptionAr || '',
    shortDescriptionFr: product?.shortDescriptionFr || '',
    shortDescriptionEn: product?.shortDescriptionEn || '',
    shortDescriptionAr: product?.shortDescriptionAr || '',
    ingredientsFr: product?.ingredientsFr || '',
    ingredientsEn: product?.ingredientsEn || '',
    ingredientsAr: product?.ingredientsAr || '',
    howToUseFr: product?.howToUseFr || '',
    howToUseEn: product?.howToUseEn || '',
    howToUseAr: product?.howToUseAr || '',
    benefitsFr: product?.benefitsFr || [''],
    benefitsEn: product?.benefitsEn || [''],
    benefitsAr: product?.benefitsAr || [''],
    images: product?.images || [''],
    metaTitle: product?.metaTitle || '',
    metaDescription: product?.metaDescription || '',
    tags: product?.tags || [],
  });

  const [newTag, setNewTag] = useState('');

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'name' && !isEdit) {
      setForm(prev => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }));
    }
  };

  const updateBenefit = (lang: string, index: number, value: string) => {
    const key = `benefits${lang}` as keyof typeof form;
    const arr = [...(form[key] as string[])];
    arr[index] = value;
    setForm(prev => ({ ...prev, [key]: arr }));
  };

  const addBenefit = (lang: string) => {
    const key = `benefits${lang}` as keyof typeof form;
    setForm(prev => ({ ...prev, [key]: [...(prev[key] as string[]), ''] }));
  };

  const removeBenefit = (lang: string, index: number) => {
    const key = `benefits${lang}` as keyof typeof form;
    setForm(prev => ({ ...prev, [key]: (prev[key] as string[]).filter((_, i) => i !== index) }));
  };

  const addImage = () => setForm(prev => ({ ...prev, images: [...prev.images, ''] }));
  const removeImage = (i: number) => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
  const updateImage = (i: number, val: string) => {
    const imgs = [...form.images];
    imgs[i] = val;
    setForm(prev => ({ ...prev, images: imgs }));
  };

  // Drag-reorder for images (HTML5 native — no extra dependency)
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const reorderImages = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return;
    setForm(prev => {
      const next = [...prev.images];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...prev, images: next };
    });
  };

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      toast.error('Veuillez remplir les champs obligatoires (nom et prix)');
      return;
    }

    const payload: any = {
      name_fr: form.name,
      name_en: form.name,
      name_ar: form.name,
      slug: form.slug,
      sku: form.sku || null,
      barcode: form.barcode || null,
      category_id: form.category && categories.find(c => c.name_fr === form.category)?.id || null,
      size: form.size || null,
      weight_grams: form.weight || null,
      price: form.price,
      original_price: form.originalPrice || null,
      cost_price: form.costPrice || 0,
      stock: form.stock || 0,
      low_stock_threshold: form.lowStockThreshold || 10,
      is_active: form.isActive ? 1 : 0,
      is_new: form.isNew ? 1 : 0,
      is_best_seller: form.isBestSeller ? 1 : 0,
      description_fr: form.descriptionFr,
      description_en: form.descriptionEn,
      description_ar: form.descriptionAr,
      ingredients_fr: form.ingredientsFr,
      ingredients_en: form.ingredientsEn,
      ingredients_ar: form.ingredientsAr,
      seo_title: form.metaTitle || null,
      seo_description: form.metaDescription || null,
      tags: form.tags,
    };
    if (isEdit) payload.id = (product as any).id;

    setSaving(true);
    const res = isEdit ? await api.updateProduct(payload) : await api.createProduct(payload);
    setSaving(false);

    if (!res.success) {
      toast.error(res.error || 'Échec de l\'enregistrement');
      return;
    }

    const productId = isEdit ? (product as any).id : (res.data as any)?.id;

    // Persist image URLs that are real http(s) links to product-images table
    if (productId) {
      for (let i = 0; i < form.images.length; i++) {
        const url = form.images[i];
        if (url && /^https?:\/\//i.test(url)) {
          await api.addProductImage({
            product_id: productId,
            url,
            sort_order: i,
            is_primary: i === 0 ? 1 : 0,
          });
        }
      }
    }

    toast.success(isEdit ? 'Produit mis à jour' : 'Produit créé');
    onClose();
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;
    setUploading(true);
    const uploadedUrls: string[] = [];
    let failures = 0;
    for (const file of list) {
      const res = await api.uploadFile(file);
      if (res.success && res.data?.url) uploadedUrls.push(res.data.url);
      else failures++;
    }
    setUploading(false);
    if (uploadedUrls.length) {
      setForm(prev => ({ ...prev, images: [...prev.images.filter(Boolean), ...uploadedUrls] }));
      toast.success(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's téléchargées' : ' téléchargée'}`);
    }
    if (failures) toast.error(`${failures} échec(s) de téléchargement`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl my-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card rounded-t-lg z-10">
          <h2 className="text-lg font-semibold text-foreground">
            {isEdit ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-muted/50 p-1">
              <TabsTrigger value="general" className="text-xs">Général</TabsTrigger>
              <TabsTrigger value="descriptions" className="text-xs">Descriptions</TabsTrigger>
              <TabsTrigger value="ingredients" className="text-xs">Ingrédients & Utilisation</TabsTrigger>
              <TabsTrigger value="benefits" className="text-xs">Avantages</TabsTrigger>
              <TabsTrigger value="images" className="text-xs">Images</TabsTrigger>
              <TabsTrigger value="pricing" className="text-xs">Prix & Stock</TabsTrigger>
              <TabsTrigger value="seo" className="text-xs">SEO & Tags</TabsTrigger>
            </TabsList>

            {/* GENERAL */}
            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom du produit *</Label>
                  <Input value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="ex: Sérum Éclat Doré" />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input value={form.slug} onChange={e => updateField('slug', e.target.value)} placeholder="serum-eclat-dore" />
                </div>
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input value={form.sku} onChange={e => updateField('sku', e.target.value)} placeholder="AUR-SER-001" />
                </div>
                <div className="space-y-2">
                  <Label>Code-barres (EAN/UPC)</Label>
                  <Input value={form.barcode} onChange={e => updateField('barcode', e.target.value)} placeholder="6191234567890" />
                </div>
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select value={form.category} onValueChange={v => updateField('category', v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner une catégorie" /></SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="__none__" disabled>Aucune catégorie — créez-en une dans Catégories</SelectItem>
                      ) : (
                        categories.map(c => (
                          <SelectItem key={c.id} value={c.name_fr}>{c.name_fr}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contenance / Taille</Label>
                  <Input value={form.size} onChange={e => updateField('size', e.target.value)} placeholder="50ml" />
                </div>
                <div className="space-y-2">
                  <Label>Poids (g)</Label>
                  <Input type="number" value={form.weight || ''} onChange={e => updateField('weight', Number(e.target.value))} placeholder="150" />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Switch checked={form.isActive} onCheckedChange={v => updateField('isActive', v)} />
                  <Label>Produit actif</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.isNew} onCheckedChange={v => updateField('isNew', v)} />
                  <Label>Nouveau produit</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.isBestSeller} onCheckedChange={v => updateField('isBestSeller', v)} />
                  <Label>Best-seller</Label>
                </div>
              </div>
            </TabsContent>

            {/* DESCRIPTIONS */}
            <TabsContent value="descriptions" className="space-y-6 mt-4">
              <Tabs defaultValue="fr" className="w-full">
                <TabsList className="mb-3">
                  <TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
                  <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
                  <TabsTrigger value="ar">🇹🇳 العربية</TabsTrigger>
                </TabsList>
                {['fr', 'en', 'ar'].map(lang => (
                  <TabsContent key={lang} value={lang} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Description courte ({lang.toUpperCase()})</Label>
                      <Textarea
                        value={(form as any)[`shortDescription${lang.charAt(0).toUpperCase() + lang.slice(1)}`]}
                        onChange={e => updateField(`shortDescription${lang.charAt(0).toUpperCase() + lang.slice(1)}`, e.target.value)}
                        placeholder="Brève description pour les listes de produits..."
                        className="min-h-[60px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description complète ({lang.toUpperCase()}) — Éditeur riche</Label>
                      <RichTextEditor
                        value={(form as any)[`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`]}
                        onChange={v => updateField(`description${lang.charAt(0).toUpperCase() + lang.slice(1)}`, v)}
                        placeholder="Description détaillée du produit avec mise en forme..."
                        minHeight="200px"
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>

            {/* INGREDIENTS & HOW TO USE */}
            <TabsContent value="ingredients" className="space-y-6 mt-4">
              <Tabs defaultValue="fr" className="w-full">
                <TabsList className="mb-3">
                  <TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
                  <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
                  <TabsTrigger value="ar">🇹🇳 العربية</TabsTrigger>
                </TabsList>
                {['fr', 'en', 'ar'].map(lang => {
                  const cap = lang.charAt(0).toUpperCase() + lang.slice(1);
                  return (
                    <TabsContent key={lang} value={lang} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Liste des ingrédients ({lang.toUpperCase()})</Label>
                        <RichTextEditor
                          value={(form as any)[`ingredients${cap}`]}
                          onChange={v => updateField(`ingredients${cap}`, v)}
                          placeholder="Liste complète des ingrédients (INCI)..."
                          minHeight="120px"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Mode d'emploi ({lang.toUpperCase()})</Label>
                        <RichTextEditor
                          value={(form as any)[`howToUse${cap}`]}
                          onChange={v => updateField(`howToUse${cap}`, v)}
                          placeholder="Instructions d'utilisation..."
                          minHeight="120px"
                        />
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </TabsContent>

            {/* BENEFITS */}
            <TabsContent value="benefits" className="space-y-6 mt-4">
              <Tabs defaultValue="fr" className="w-full">
                <TabsList className="mb-3">
                  <TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
                  <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
                  <TabsTrigger value="ar">🇹🇳 العربية</TabsTrigger>
                </TabsList>
                {['Fr', 'En', 'Ar'].map(lang => (
                  <TabsContent key={lang} value={lang.toLowerCase()} className="space-y-3">
                    <Label>Avantages / Bénéfices ({lang})</Label>
                    {(form[`benefits${lang}` as keyof typeof form] as string[]).map((b, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                        <Input
                          value={b}
                          onChange={e => updateBenefit(lang, i, e.target.value)}
                          placeholder={`Avantage ${i + 1}...`}
                        />
                        <button onClick={() => removeBenefit(lang, i)} className="p-1.5 rounded hover:bg-destructive/10">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addBenefit(lang)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter un avantage
                    </Button>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>

            {/* IMAGES */}
            <TabsContent value="images" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Glissez-déposez pour réorganiser. La première image est l'image principale affichée sur la fiche produit.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {form.images.map((img, i) => {
                  const isUrl = /^https?:\/\//i.test(img) || img.startsWith('/') || img.startsWith('data:');
                  return (
                    <div
                      key={i}
                      draggable
                      onDragStart={() => setDragIndex(i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.preventDefault(); if (dragIndex !== null) reorderImages(dragIndex, i); setDragIndex(null); }}
                      onDragEnd={() => setDragIndex(null)}
                      className={`flex gap-2 items-start rounded-md border p-2 transition-colors ${
                        dragIndex === i ? 'border-primary bg-primary/5 opacity-50' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <button
                        type="button"
                        className="p-1.5 mt-6 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                        title="Glisser pour réorganiser"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                      <div className="flex-1 space-y-2 min-w-0">
                        <Label className="text-xs flex items-center gap-2">
                          {i === 0 ? <span className="bg-gold/20 text-foreground px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">Principale</span> : <span className="text-muted-foreground">Image {i + 1}</span>}
                        </Label>
                        <Input
                          value={img}
                          onChange={e => updateImage(i, e.target.value)}
                          placeholder="URL de l'image ou nom du fichier..."
                        />
                        <div className="h-24 w-24 rounded bg-muted flex items-center justify-center overflow-hidden">
                          {img && isUrl ? (
                            <img src={img} alt={`Aperçu ${i + 1}`} className="h-full w-full object-cover" onError={(e) => { (e.currentTarget.style.display = 'none'); }} />
                          ) : (
                            <ImagePlus className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      {form.images.length > 1 && (
                        <button onClick={() => removeImage(i)} className="p-1.5 rounded hover:bg-destructive/10 mt-6" title="Supprimer">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={addImage}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter une URL
                </Button>
                <Button variant="outline" size="sm" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5 mr-1" />
                  {uploading ? 'Téléchargement…' : 'Téléverser des fichiers'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length) handleFileUpload(e.target.files);
                    e.target.value = '';
                  }}
                />
              </div>
            </TabsContent>

            {/* PRICING & STOCK */}
            <TabsContent value="pricing" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Prix de vente (TND) *</Label>
                  <Input type="number" value={form.price || ''} onChange={e => updateField('price', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Prix barré (TND)</Label>
                  <Input type="number" value={form.originalPrice || ''} onChange={e => updateField('originalPrice', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Prix de revient (TND)</Label>
                  <Input type="number" value={form.costPrice || ''} onChange={e => updateField('costPrice', Number(e.target.value))} />
                </div>
              </div>

              {form.price > 0 && form.costPrice > 0 && (
                <div className="rounded-lg bg-muted/50 p-3 text-sm">
                  <span className="text-muted-foreground">Marge : </span>
                  <span className="font-semibold text-green-600">
                    {((form.price - form.costPrice) / form.price * 100).toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground ml-2">({(form.price - form.costPrice).toFixed(2)} TND / unité)</span>
                  {form.originalPrice > 0 && (
                    <>
                      <span className="text-muted-foreground ml-4">Remise : </span>
                      <span className="font-semibold text-destructive">
                        -{((1 - form.price / form.originalPrice) * 100).toFixed(0)}%
                      </span>
                    </>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stock actuel</Label>
                  <Input type="number" value={form.stock || ''} onChange={e => updateField('stock', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Seuil d'alerte stock bas</Label>
                  <Input type="number" value={form.lowStockThreshold || ''} onChange={e => updateField('lowStockThreshold', Number(e.target.value))} />
                </div>
              </div>
            </TabsContent>

            {/* SEO & TAGS */}
            <TabsContent value="seo" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Titre SEO (meta title)</Label>
                <Input value={form.metaTitle} onChange={e => updateField('metaTitle', e.target.value)} placeholder="Titre optimisé pour les moteurs de recherche..." />
                <p className={`text-xs ${form.metaTitle.length > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {form.metaTitle.length}/60 caractères {form.metaTitle.length > 60 && '— trop long, sera tronqué'}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Description SEO (meta description)</Label>
                <Textarea value={form.metaDescription} onChange={e => updateField('metaDescription', e.target.value)} placeholder="Description pour les moteurs de recherche..." className="min-h-[80px]" />
                <p className={`text-xs ${form.metaDescription.length > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {form.metaDescription.length}/160 caractères {form.metaDescription.length > 160 && '— trop long, sera tronqué'}
                </p>
              </div>

              {/* Google SERP preview */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Aperçu Google</Label>
                <div className="rounded-md border border-border bg-white p-4 font-sans">
                  <div className="text-xs text-[#202124] mb-1">arecima.tn › product › {form.slug || 'votre-produit'}</div>
                  <div className="text-[#1a0dab] text-lg leading-snug hover:underline cursor-pointer truncate">
                    {(form.metaTitle || form.name || 'Titre du produit').slice(0, 60)}
                    {(form.metaTitle || form.name || '').length > 60 && '…'}
                  </div>
                  <div className="text-sm text-[#4d5156] line-clamp-2">
                    {(form.metaDescription || form.shortDescriptionFr || 'Description de votre produit telle qu\'elle apparaîtra dans les résultats Google.').slice(0, 160)}
                    {(form.metaDescription || form.shortDescriptionFr || '').length > 160 && '…'}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Voilà comment votre produit apparaîtra dans les résultats de recherche Google.</p>
              </div>

              <div className="space-y-2">
                <Label>Tags / Étiquettes</Label>
                <div className="flex gap-2">
                  <Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Ajouter un tag..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                  <Button variant="outline" size="sm" onClick={addTag}>Ajouter</Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full flex items-center gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)}><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-border sticky bottom-0 bg-card rounded-b-lg">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer le produit'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormDialog;
