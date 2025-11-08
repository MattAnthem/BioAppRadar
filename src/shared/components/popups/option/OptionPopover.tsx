import React,{ useRef, useState, type ReactNode } from "react";
import { useTheme } from "../../../hooks/useTheme";
import { useClickOutside } from "../../../hooks/useClickOutside";
import Tooltip from "../tooltip/Tooltip";
import { Settings2 } from "lucide-react";

type ChartParamsPopupProps = {
  children?: ReactNode;
  hoverText?: string;
  customIcon?: ReactNode;
  onClickEvent?: () => void;

  isOpen?: boolean;  
  onOpen?: () => void;
  onClose?: () => void;
};

const OptionPopover = ({
  children,
  hoverText,
  customIcon,
  onClickEvent,
  isOpen,
  onOpen,
  onClose
}: ChartParamsPopupProps) => {
  const [localOpen, setLocalOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const themes = useTheme();
  const { bg, border, hover, options_bg, text } = themes.theme.simpleSelect;

  const isPopupOpen = isOpen ?? localOpen;

  const handleSetOpen = (open: boolean) => {
    if (isOpen !== undefined) {
      if (open) {
        onOpen?.();
      } else {
        onClose?.();
      }
    } else {
      setLocalOpen(open);
    }
  };
  

  // autohide
  useClickOutside(popupRef, () => {
    if (isPopupOpen) handleSetOpen(false);
  });

  const handleBtnClick = () => {
    onClickEvent?.();
    handleSetOpen(!isPopupOpen);
  };

  return (
    <div ref={popupRef} className={text}>
      <Tooltip
        position="bottom"
        display_condition={!isPopupOpen}
        text={hoverText ?? ""}
      >
        <button
          onClick={handleBtnClick}
          className={`${bg} ${border} ${hover} p-1 rounded-sm`}
        >
          {customIcon || <Settings2 width={15} height={15} />}
        </button>
      </Tooltip>

      {/* Pop-over menu */}
      <div
        className={`
          ${options_bg} ${border} z-30 border shadow-sm flex flex-col gap-2 justify-center w-[400px] absolute right-0 top-full p-2 rounded-sm
          ${
            isPopupOpen
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          }
          transition-all duration-75 ease-out origin-top-right
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default React.memo(OptionPopover);
