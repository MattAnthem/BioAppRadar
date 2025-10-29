import type { ReactNode } from "react";
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
            bottom: "absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45",
            top: "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45",
            right: "absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45",
            left: "absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45",
    };
      
    const themes = useTheme();
    const { bg, text_color } = themes.theme.tooltip;

  return (
    <div className='group relative'>
      {/* Place the children here */}
      { children }
      {/* The tooltip message */}
      {
        display_condition && (
          <span role='tooltip' className={`
            z-20 absolute w-max ${pos_classes[position]}
            ${bg} ${text_color} px-2 py-1 rounded text-xs
            opacity-0 hidden group-hover:opacity-100 group-hover:block transition-opacity
          `}>
            
            {text}
            {/* arrow */}
            <span className={`${arrow_classes[position]} ${bg}`} />

          </span>
        )
      }
    </div>
  )
}

export default Tooltip;
