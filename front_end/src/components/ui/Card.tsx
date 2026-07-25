import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  hover?: boolean;
  icon?: ReactNode;
}

export function Card({ title, subtitle, children, className = '', action, hover, icon }: CardProps) {
  return (
    <div className={`rounded-lg lg:rounded-xl border border-gray-200 bg-white shadow-sm ${hover ? 'hover:border-blue-300 hover:shadow-md transition-all' : ''} ${className}`}>
      {(title || action || icon) && (
        <div className="flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-100">
          {icon && <div>{icon}</div>}
          <div className="flex-1 min-w-0">
            {title && <h3 className="text-sm lg:text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-xs lg:text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="px-4 lg:px-6 py-3 lg:py-4">{children}</div>
    </div>
  );
}
