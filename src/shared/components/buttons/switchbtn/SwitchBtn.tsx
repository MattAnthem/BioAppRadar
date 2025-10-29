import { useTheme } from "../../../hooks/useTheme";


type SwitchBtnProps = {
  width?: number;     
  height?: number;
  handler_func: () => void; 
  isActive: boolean;
  ariaLabel?: string;
  ariaControls?: string;
  isDisabled?: boolean;
}
/**
 * Stateless custom switch button
 * @param handler_func : callback function to handle interaction with the button
 * @param height : button height
 * @param width : button width
 * @param isActive : track the state of the button from its parent
 * @returns React.JSX.Element
 */
const SwitchBtn = ({ handler_func, height = 24, width = 48, isActive, ariaLabel, ariaControls, isDisabled }: SwitchBtnProps) => {
  const themes = useTheme();
  const { bg, border, cursor_bg } = themes.theme.switchBtn;
  return (
    <button
      name="switch-btn"
      aria-label={ariaLabel}
      aria-controls={ariaControls}
      onClick={handler_func}
      style={{ width, height }}
      disabled={isDisabled}
      className={`
        ${bg} ${border} border-2
        relative rounded-full cursor-pointer
        flex items-center
        aria-disabled:bg-gray-500
        aria-disabled:border-gray-600
        focus-visible:outline-2 
        outline-offset-1 
        outline-blue-800
      `}
    >
      <div
        className={`
          ${cursor_bg}
          absolute top-0 left-0
          w-1/2 h-full
          rounded-full
          transition-transform duration-300 ease-in-out
        `}
        style={{ transform: isActive ? "translateX(100%)" : "translateX(0)" }}
      />
    </button>
  );
};

export default SwitchBtn;

