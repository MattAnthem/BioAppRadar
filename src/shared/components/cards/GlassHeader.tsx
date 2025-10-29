import { type ReactNode } from 'react';

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
            absolute z-40 rounded-t-sm p-2 w-full flex justify-between isolate
            border-white/20 bg-gray-900/55 shadow-md ring-2 ring-black/5
            backdrop-blur-sm
        `}
        >
            {children}
      </div>
    </div>
  )
}

export default GlassHeader;