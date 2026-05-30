import { useEffect, useState } from 'react';
import { Facebook, Loader2, Save, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export interface FacebookPixelSettings {
  enabled: boolean;
  pixel_id: string;
  track_page_view: boolean;
  track_view_content: boolean;
  track_add_to_cart: boolean;
  track_initiate_checkout: boolean;
  track_purchase: boolean;
  track_add_to_wishlist: boolean;
  test_event_code: string;
}

const DEFAULT_PIXEL: FacebookPixelSettings = {
  enabled: false,
  pixel_id: '',
  track_page_view: true,
  track_view_content: true,
  track_add_to_cart: true,
  track_initiate_checkout: true,
  track_purchase: true,
  track_add_to_wishlist: true,
  test_event_code: '',
};

const EVENT_TOGGLES: { key: keyof FacebookPixelSettings; label: string; desc: string }[] = [
  { key: 'track_page_view', label: 'PageView', desc: 'Chaque page visitée (navigation SPA incluse)' },
  { key: 'track_view_content', label: 'ViewContent', desc: 'Page produit consultée' },
  { key: 'track_add_to_cart', label: 'AddToCart', desc: 'Ajout au panier' },
  { key: 'track_initiate_checkout', label: 'InitiateCheckout', desc: 'Arrivée sur la page checkout' },
  { key: 'track_purchase', label: 'Purchase', desc: 'Commande confirmée (valeur TND + IDs produits)' },
  { key: 'track_add_to_wishlist', label: 'AddToWishlist', desc: 'Ajout aux favoris' },
];

const IntegrationsAdmin = () => {
  const [pixel, setPixel] = useState<FacebookPixelSettings>(DEFAULT_PIXEL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await api.getSettings();
      if (res.success && res.data?.facebook_pixel) {
        setPixel({ ...DEFAULT_PIXEL, ...res.data.facebook_pixel });
      }
      setLoading(false);
    })();
  }, []);

  const update = <K extends keyof FacebookPixelSettings>(key: K, value: FacebookPixelSettings[K]) => {
    setPixel(prev => ({ ...prev, [key]: value }));
  };

  const pixelDigits = pixel.pixel_id.replace(/\D/g, '');
  const pixelValid = !pixel.enabled || (pixelDigits.length >= 15 && pixelDigits.length <= 16);

  const handleSave = async () => {
    if (!pixelValid) {
      toast.error('Le Pixel ID doit contenir 15 ou 16 chiffres');
      return;
    }

    setSaving(true);
    const payload: FacebookPixelSettings = {
      ...pixel,
      pixel_id: pixelDigits,
      test_event_code: pixel.test_event_code.trim(),
    };
    const res = await api.updateSetting('facebook_pixel', payload);
    setSaving(false);

    if (res.success) {
      toast.success('Facebook Pixel enregistré — actif sur la boutique');
      setPixel(payload);
      const verify = await api.getTrackingConfig();
      if (payload.enabled && verify.data?.enabled && verify.data.pixel_id === payload.pixel_id) {
        toast.success('Vérification OK — le pixel est visible côté boutique');
      } else if (payload.enabled) {
        toast.error('Enregistré mais non détecté côté public — vérifiez tracking.php sur le serveur');
      }
    } else {
      toast.error(res.error || 'Erreur lors de l\'enregistrement');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Intégrations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configurez le suivi Meta (Facebook) pour vos campagnes publicitaires et le retargeting.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/30">
          <div className="h-10 w-10 rounded-lg bg-[#1877F2]/10 flex items-center justify-center">
            <Facebook className="h-5 w-5 text-[#1877F2]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-foreground">Facebook Pixel (Meta)</h2>
            <p className="text-xs text-muted-foreground">Events Manager → Pixels → votre ID numérique</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Label htmlFor="pixel-enabled" className="text-sm text-muted-foreground hidden sm:inline">
              {pixel.enabled ? 'Actif' : 'Inactif'}
            </Label>
            <Switch
              id="pixel-enabled"
              checked={pixel.enabled}
              onCheckedChange={v => update('enabled', v)}
            />
          </div>
        </div>

        <div className="p-5 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pixel-id">Pixel ID *</Label>
            <Input
              id="pixel-id"
              placeholder="Ex: 1234567890123456"
              value={pixel.pixel_id}
              onChange={e => update('pixel_id', e.target.value.replace(/[^\d]/g, ''))}
              maxLength={16}
              disabled={!pixel.enabled}
            />
            {pixel.enabled && (
              <p className={`text-xs flex items-center gap-1.5 ${pixelValid ? 'text-emerald-600' : 'text-destructive'}`}>
                {pixelValid ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                {pixelValid
                  ? `${pixelDigits.length} chiffres — format valide`
                  : 'Entrez un ID de 15 à 16 chiffres depuis Meta Events Manager'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-code">Code test événements (optionnel)</Label>
            <Input
              id="test-code"
              placeholder="TEST12345"
              value={pixel.test_event_code}
              onChange={e => update('test_event_code', e.target.value.toUpperCase())}
              disabled={!pixel.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Copiez le code depuis Meta → Events Manager → Test Events pour vérifier en temps réel avant de lancer vos pubs.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Événements e-commerce suivis</h3>
            <div className="space-y-3">
              {EVENT_TOGGLES.map(ev => (
                <div key={ev.key} className="flex items-start justify-between gap-4 py-2 border-b border-border/60 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{ev.label}</p>
                    <p className="text-xs text-muted-foreground">{ev.desc}</p>
                  </div>
                  <Switch
                    checked={Boolean(pixel[ev.key])}
                    onCheckedChange={v => update(ev.key, v)}
                    disabled={!pixel.enabled}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-muted/50 p-4 text-xs text-muted-foreground space-y-2">
            <p className="font-medium text-foreground text-sm">Comment tester</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Activez le pixel et enregistrez avec votre Pixel ID.</li>
              <li>Installez l&apos;extension <strong>Meta Pixel Helper</strong> (Chrome).</li>
              <li>Visitez la boutique : vous devez voir PageView + ViewContent sur un produit.</li>
              <li>Ajoutez au panier → AddToCart ; checkout → InitiateCheckout ; commande → Purchase.</li>
            </ol>
            <a
              href="https://business.facebook.com/events_manager"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline mt-2"
            >
              Ouvrir Meta Events Manager
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <Button onClick={handleSave} disabled={saving || (pixel.enabled && !pixelValid)} className="w-full sm:w-auto">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Enregistrer le Facebook Pixel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsAdmin;
