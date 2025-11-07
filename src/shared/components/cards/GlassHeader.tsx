import React, { type ReactNode } from 'react';

type GlassHeaderProps = {
    children: ReactNode;
    className?: string; // additional classes if specified
}
/**
 * Renders a nice glass header
 * @param children: Content of the Header 
 * @param className: Additional classes 
 * @returns React.JSX.Element
 */
const GlassHeader = ({ children, className }: GlassHeaderProps) => {
  return (
    <div className='relative w-full'>
      <div 
        className={`
            ${className}
            absolute top-0 left-0 rounded-t-sm  w-full flex justify-between
            border-white/20 bg-gray-900/55
        `}
        >
            {children}
      </div>
    </div>
  )
}

export default React.memo(GlassHeader);