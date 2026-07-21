import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  className = '',
  style,
  ...props
}) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div style={{ position: 'relative', width: '100%' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            zIndex: 2,
            pointerEvents: 'none'
          }}>
            {icon}
          </div>
        )}
        <input
          className={`input-field ${className}`}
          style={{
            ...style,
            paddingLeft: icon ? '48px' : '16px'
          }}
          {...props}
        />
      </div>
      {error && <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '2px' }}>{error}</span>}
    </div>
  );
};
