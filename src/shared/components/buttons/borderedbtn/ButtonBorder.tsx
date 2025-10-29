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
  onClick: () => void;
}

/**
 * Themed bordered button 
 * @param children 
 * @param className  
 * @returns 
 */
const ButtonBorder = ({ children, className, onClick, ariaLabel, isDisabled, ariaControls, ariaExpanded, ariaHasPopup }: ButtonBorderProps) => {
  const themes = useTheme();
  const { border, hover_bg, text } = themes.theme.btnBorder;
  return (
    <button 
      type='button' 
      aria-label={ariaLabel} 
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      disabled={isDisabled}
      onClick={!isDisabled ?  onClick : undefined}  
      className={`${className} ${border} ${hover_bg} ${text} border rounded-sm focus-visible:outline-2 outline-offset-1 outline-blue-800`}
    >
      { children }
    </button>
  )
}

export default ButtonBorder;