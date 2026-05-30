import { useQuery } from '@tanstack/react-query';
import { Globe, Clock, Eye, TrendingUp, ArrowDownUp, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

const AnalyticsAdmin = () => {
  const overview = useQuery({ queryKey: ['analytics-overview-30'], queryFn: () => api.analyticsOverview('30') });
  const visitors = useQuery({ queryKey: ['analytics-visitors-30'], queryFn: () => api.analyticsVisitors('30') });
  const pages = useQuery({ queryKey: ['analytics-pages'], queryFn: () => api.analyticsPages() });
  const devices = useQuery({ queryKey: ['analytics-devices-list'], queryFn: () => api.analyticsDevices() });
  const countries = useQuery({ queryKey: ['analytics-countries-list'], queryFn: () => api.analyticsCountries() });
  const referrers = useQuery({ queryKey: ['analytics-referrers-list'], queryFn: () => api.analyticsReferrers() });

  const ov = overview.data?.data || {};
  const dailyVisitors: any[] = visitors.data?.data || [];
  const pagesList: any[] = pages.data?.data || [];
  const devList: any[] = devices.data?.data || [];
  const countryList: any[] = countries.data?.data || [];
  const referrerList: any[] = referrers.data?.data || [];

  const totalDevices = devList.reduce((s, d) => s + Number(d.count || 0), 0) || 1;
  const totalReferrers = referrerList.reduce((s, r) => s + Number(r.count || 0), 0) || 1;
  const maxVisitors = Math.max(...dailyVisitors.map(d => Number(d.visitors || 0)), 1);

  const avgDuration = Number(ov.avg_duration || 0);
  const minutes = Math.floor(avgDuration / 60);
  const seconds = Math.round(avgDuration % 60);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Analytique & Visiteurs</h1>
        <span className="text-xs sm:text-sm text-muted-foreground">30 derniers jours</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: 'Sessions totales', value: Number(ov.total_sessions || 0).toLocaleString(), icon: Globe },
          { label: 'Visiteurs uniques', value: Number(ov.unique_visitors || 0).toLocaleString(), icon: Eye },
          { label: 'Taux de rebond', value: `${Number(ov.bounce_rate || 0).toFixed(1)}%`, icon: ArrowDownUp },
          { label: 'Durée moyenne', value: `${minutes}m ${seconds}s`, icon: Clock },
          { label: 'Pages / session', value: Number(ov.avg_pages || 0).toFixed(1), icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2"><s.icon className="h-4 w-4 text-muted-foreground shrink-0" /><span className="text-xs sm:text-sm text-muted-foreground truncate">{s.label}</span></div>
            <p className="text-lg sm:text-xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Daily visitors chart */}
      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <h3 className="font-medium text-foreground mb-4 text-sm sm:text-base">Visiteurs quotidiens (30 jours)</h3>
        {visitors.isLoading ? (
          <div className="py-12 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>
        ) : dailyVisitors.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Pas encore de données — le tracking enregistre maintenant chaque visite</p>
        ) : (
          <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
            <div className="flex items-end gap-1 h-44 min-w-[480px]">
              {dailyVisitors.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group min-w-[12px]">
                  <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100">{d.visitors}</span>
                  <div className="w-full bg-primary/70 rounded-t hover:bg-primary transition-colors" style={{ height: `${(Number(d.visitors) / maxVisitors) * 100}%` }} />
                  <span className="text-[9px] text-muted-foreground mt-1">{String(d.date).slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-medium text-foreground mb-4">Répartition par appareil</h3>
          {devList.length === 0 ? <p className="text-sm text-muted-foreground py-6 text-center">Aucune donnée</p> : (
            <div className="space-y-3">
              {devList.map(d => {
                const pct = Math.round((Number(d.count) / totalDevices) * 100);
                return (
                  <div key={d.device || 'unknown'}>
                    <div className="flex justify-between text-sm mb-1"><span className="capitalize">{d.device || 'Inconnu'}</span><span className="text-muted-foreground">{d.count} ({pct}%)</span></div>
                    <div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary/70" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-medium text-foreground mb-4">Sources de trafic</h3>
          {referrerList.length === 0 ? <p className="text-sm text-muted-foreground py-6 text-center">Aucune donnée</p> : (
            <div className="space-y-2">
              {referrerList.map((s, i) => {
                const pct = Math.round((Number(s.count) / totalReferrers) * 100);
                return (
                  <div key={s.referrer_source} className="flex justify-between items-center text-sm py-1.5 border-b border-border last:border-0">
                    <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground w-4">{i + 1}.</span><span>{s.referrer_source}</span></div>
                    <div className="flex items-center gap-3"><span className="text-muted-foreground">{s.count}</span><span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full min-w-[40px] text-center">{pct}%</span></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-medium text-foreground mb-4">Top pays</h3>
          {countryList.length === 0 ? <p className="text-sm text-muted-foreground py-6 text-center">Aucune donnée</p> : (
            <div className="space-y-2">
              {countryList.map((c, i) => (
                <div key={c.country} className="flex justify-between items-center text-sm py-1.5 border-b border-border last:border-0">
                  <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground w-4">{i + 1}.</span><span>{c.country}</span></div>
                  <span className="text-muted-foreground">{c.count} sessions</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
        <h3 className="font-medium text-foreground mb-4 text-sm sm:text-base">Pages les plus visitées</h3>
        {pages.isLoading ? <div className="py-8 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div> : pagesList.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Aucune donnée</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[420px]">
              <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="pb-2">Page</th><th className="pb-2 text-right">Vues</th><th className="pb-2 text-right">Temps moyen</th></tr></thead>
              <tbody>
                {pagesList.map(p => (
                  <tr key={p.page_path} className="border-b border-border last:border-0">
                    <td className="py-2 font-mono text-xs truncate max-w-[180px]">{p.page_path}</td>
                    <td className="py-2 text-right">{p.views}</td>
                    <td className="py-2 text-right text-muted-foreground">{Math.round(Number(p.avg_time || 0))}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsAdmin;
