import { forwardRef, type HTMLAttributes } from 'react';

const variants = {
  default: 'border border-gray-200 bg-white shadow-[var(--shadow-card)]',
  elevated: 'border border-gray-100 bg-white shadow-[var(--shadow-elevated)]',
  ghost: 'border border-transparent bg-gray-50',
  khatu: 'border border-amber-200/50 bg-[var(--khatu-ivory)] shadow-[var(--shadow-card)]',
} as const;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className = '', variant = 'default', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`rounded-lg ${variants[variant]} ${className}`.trim()}
      {...props}
    />
  );
});

export default Card;
