import Icon from './Icon';

const SIZES = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-base'
};

const VARIANTS = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-navy-900 hover:bg-navy-800 text-cream-50',
  tertiary: 'bg-transparent border border-sea-500 text-sea-700 hover:bg-sea-50',
  ghost: 'bg-transparent text-navy-900 hover:bg-cream-200',
  destructive: 'bg-red-600 hover:bg-red-700 text-white'
};

export default function Btn({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPos = 'right',
  disabled,
  className = '',
  ...rest
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full font-bold transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-cream-50 disabled:opacity-40 disabled:cursor-not-allowed ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {icon && iconPos === 'left' && <Icon name={icon} size={16} />}
      {children}
      {icon && iconPos === 'right' && <Icon name={icon} size={16} />}
    </button>
  );
}
