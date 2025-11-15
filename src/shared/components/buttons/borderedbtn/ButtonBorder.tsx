import {type ReactNode, memo} from 'react';
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
  isPrimary?: boolean;  
}

/**
 * Themed bordered button 
 * @param children 
 * @param className  
 * @returns 
 */
const ButtonBorder = ({ children, className, onClick, ariaLabel, isDisabled=false, ariaControls, ariaExpanded, ariaHasPopup, stopPropagation=false, isPrimary=false }: ButtonBorderProps) => {
  const themes = useTheme();
  const { border, hover_bg, text, bg, primary_bg, primary_text, primary_hover } = themes.theme.btnBorder;
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
      className={`${className} ${border} ${isPrimary ? primary_hover : hover_bg} ${isPrimary ? primary_text : text} ${isPrimary ? primary_bg : bg}  text-sm ${isPrimary ? 'border' : 'border-2'} rounded-sm focus-visible:outline-2 outline-offset-1 outline-blue-800`}
    >
      { children }
    </button>
  )
}

export default memo(ButtonBorder);