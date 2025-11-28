import { memo, type ReactNode } from "react";
import { useTheme } from "../../../hooks/useTheme";

type Position = "top" | "left" | "right" | "bottom";


type TooltipProps = {
  children: ReactNode;
  text: string;
  display_condition?: boolean;
  position: Position;
}

/**
 * Tooltip showing text on hover of an element.
 * @param children: The element to atach the tooltip on
 * @param Text: The text to show inside the tooltip
 * @param display_condition: Control the tooltip display by this condition
 * @param position: Control the tooltip position 
 * @returns React.JSX.Element
 */
const Tooltip = (
    { children, 
      text, 
      display_condition, 
      position }: TooltipProps
  ) => {

    // Define positions classes
    const pos_classes: Record<Position, string> = {
            bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
            top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
            right: "left-full top-1/2 -translate-y-1/2 ml-4",
            left: "right-full top-1/2 -translate-y-1/2 mr-2",
    }
      
    // arrow classes
    const arrow_classes: Record<Position, string> = {
            bottom: "-top-1 left-1/2 -translate-x-1/2",
            top: "-bottom-1 left-1/2 -translate-x-1/2",
            right: "-left-1 top-1/2 -translate-y-1/2",
            left: "-right-1 top-1/2 -translate-y-1/2",
    };
      
    const themes = useTheme();
    const { bg, text_color } = themes.theme.tooltip;

    const shouldDisplay = display_condition ?? true;

  return (
    <div className='group relative'>
      {/* Place the children here */}
      { children }
      {/* The tooltip message */}
      {
        shouldDisplay && (
          <span role='tooltip' className={`
            absolute z-50 w-max px-2 py-1 rounded text-xs select-none
            ${bg} ${text_color} ${pos_classes[position]}
            opacity-0 scale-95 group-hover:scale-100 group-hover:opacity-100
            transition-all duration-150 pointer-events-none
          `}>
            
            {text}
            {/* arrow */}
            <span
            className={`
              absolute w-2 h-2 rotate-45 ${bg}
              ${arrow_classes[position]}
            `}
          />

          </span>
        )
      }
    </div>
  )
}

export default memo(Tooltip);
