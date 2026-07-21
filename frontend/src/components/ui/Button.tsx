import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'padding: 8px 16px; font-size: 13px;',
    md: 'padding: 12px 24px; font-size: 15px;',
    lg: 'padding: 16px 32px; font-size: 16px;'
  }[size];

  return (
    <button
      className={`btn btn-${variant} ${className}`}
      style={{
        padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 32px' : '12px 24px',
        fontSize: size === 'sm' ? '13px' : size === 'lg' ? '16px' : '15px'
      }}
      {...props}
    >
      {children}
      {icon && <span className="btn-icon">{icon}</span>}
    </button>
  );
};
