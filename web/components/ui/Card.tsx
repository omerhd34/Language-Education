type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface/90 p-6 shadow-sm dark:bg-brand-900/90 ${className}`}
    >
      {children}
    </div>
  );
}
