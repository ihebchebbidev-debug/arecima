import { Shield } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import StatusBadge from '@/components/admin/StatusBadge';

const roleLabels: Record<string, string> = {
  super_admin: 'Super admin', admin: 'Administrateur', manager: 'Gestionnaire', viewer: 'Lecteur',
};

const UsersAdmin = () => {
  const { user } = useAdminAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Gestion des utilisateurs</h1>
      </div>

      {user && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-medium text-foreground mb-4">Utilisateur connecté</h3>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-foreground">{user.full_name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-1"><StatusBadge status={user.role} /></div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-medium text-foreground mb-2 flex items-center gap-2"><Shield className="h-4 w-4" /> Gestion multi-utilisateurs</h3>
        <p className="text-sm text-muted-foreground">
          La gestion CRUD des comptes administrateurs (création, modification, suppression) sera disponible prochainement.
          Pour ajouter un nouveau compte admin pour le moment, exécutez directement un INSERT dans la table <code className="text-foreground bg-muted px-1.5 py-0.5 rounded">arecima_admin_users</code> de votre base MySQL.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-medium text-foreground mb-4">Matrice des permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2">Permission</th>
                <th className="pb-2 text-center">Super Admin</th>
                <th className="pb-2 text-center">Administrateur</th>
                <th className="pb-2 text-center">Gestionnaire</th>
                <th className="pb-2 text-center">Lecteur</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Tableau de bord', true, true, true, true],
                ['Gestion des produits (CRUD)', true, true, true, false],
                ['Gestion de l\'inventaire', true, true, true, false],
                ['Gestion des commandes', true, true, true, false],
                ['CRM — Clients', true, true, true, false],
                ['Analytique & Visiteurs', true, true, true, true],
                ['Gestion des utilisateurs', true, true, false, false],
                ['Gestion des coupons', true, true, false, false],
                ['Paramètres système', true, false, false, false],
                ['Suppression de données', true, false, false, false],
              ].map(([perm, ...roles]) => (
                <tr key={perm as string} className="border-b border-border last:border-0">
                  <td className="py-2 text-foreground">{perm as string}</td>
                  {(roles as boolean[]).map((r, i) => (
                    <td key={i} className="py-2 text-center">
                      {r ? <span className="text-green-600 font-medium">✓</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersAdmin;
