import {type ReactNode} from 'react';
import { useTheme } from '../../../hooks/useTheme';


type ButtonBorderProps = {
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
  isDisabled?: boolean;
  ariaHasPopup?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  stopPropagation?: boolean;
}

/**
 * Themed bordered button 
 * @param children 
 * @param className  
 * @returns 
 */
const ButtonBorder = ({ children, className, onClick, ariaLabel, isDisabled=false, ariaControls, ariaExpanded, ariaHasPopup, stopPropagation=false }: ButtonBorderProps) => {
  const themes = useTheme();
  const { border, hover_bg, text, bg } = themes.theme.btnBorder;
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) e.stopPropagation(); 
    if (!isDisabled && onClick) onClick(e);
  };
  return (
    <button 
      type='button' 
      aria-label={ariaLabel} 
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      disabled={isDisabled}
      onClick={handleClick}  
      className={`${className} ${border} ${hover_bg} ${text} ${bg}  text-sm border-2 rounded-sm focus-visible:outline-2 outline-offset-1 outline-blue-800`}
    >
      { children }
    </button>
  )
}

export default ButtonBorder;