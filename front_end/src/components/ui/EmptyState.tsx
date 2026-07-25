import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  action?: React.ReactNode;
}

export function EmptyState({ message = 'No hay datos disponibles', action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 mb-4">{message}</p>
      {action}
    </div>
  );
}
