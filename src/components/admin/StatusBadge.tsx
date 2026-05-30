import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  super_admin: 'bg-purple-100 text-purple-800',
  admin: 'bg-blue-100 text-blue-800',
  manager: 'bg-indigo-100 text-indigo-800',
  viewer: 'bg-gray-100 text-gray-800',
  new: 'bg-blue-100 text-blue-800',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  processing: 'En préparation',
  shipped: 'Expédié',
  delivered: 'Livré',
  cancelled: 'Annulé',
  refunded: 'Remboursé',
  paid: 'Payé',
  failed: 'Échoué',
  active: 'Actif',
  inactive: 'Inactif',
  super_admin: 'Super Admin',
  admin: 'Administrateur',
  manager: 'Gestionnaire',
  viewer: 'Lecteur',
  new: 'Nouveau',
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={cn(
    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
    statusStyles[status] || 'bg-muted text-muted-foreground'
  )}>
    {statusLabels[status] || status}
  </span>
);

export default StatusBadge;
