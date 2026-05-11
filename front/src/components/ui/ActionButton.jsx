import { forwardRef } from 'react';

const ActionButton = forwardRef(({ 
  children, 
  variant = 'primary', 
  icon: Icon, 
  className = '', 
  ...props 
}, ref) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`; // primary, ghost, danger
  
  return (
    <button 
      ref={ref}
      className={`${baseClass} ${variantClass} ${className}`.trim()}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
});

ActionButton.displayName = 'ActionButton';

export default ActionButton;
