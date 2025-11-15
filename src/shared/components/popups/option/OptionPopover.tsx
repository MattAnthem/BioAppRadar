import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { Settings2 } from "lucide-react";
import { useClickOutside } from "../../../hooks/useClickOutside";
import Tooltip from "../tooltip/Tooltip";
import { useTheme } from "../../../hooks/useTheme";


type ChartParamsPopupProps = {
  children?: ReactNode;
  hoverText?: string;
  customIcon?: ReactNode;
  onClickEvent?: () => void;

  isPrimary?: boolean;

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
  onClose,
  isPrimary=false
}: ChartParamsPopupProps) => {
  const [localOpen, setLocalOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);  
  const popupRef = useRef<HTMLDivElement | null>(null);
  const themes = useTheme();
  const { primary_bg, primary_hover, primary_text, seconcondary_bg, secondary_hover, secondary_text } = themes.theme.popupBtn;
  const { options_bg, border } = themes.theme.simpleSelect;

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

  useClickOutside(popupRef, () => {
    if (isPopupOpen) handleSetOpen(false);
  });

  const handleBtnClick = () => {
    onClickEvent?.();
    handleSetOpen(!isPopupOpen);
  };

  useEffect(() => {
    if (isPopupOpen && popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      const popupHeight = 300; 
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpwards(spaceBelow < popupHeight); 
    }
  }, [isPopupOpen]);

  return (
    <div ref={popupRef} className={`relative inline-block`}>
      <Tooltip
        position="bottom"
        display_condition={!isPopupOpen}
        text={hoverText ?? ""}
      >
        <button
          onClick={handleBtnClick}
          className={`
            ${isPrimary ? primary_bg : seconcondary_bg}  
            ${isPrimary ? primary_text : secondary_text} 
            ${isPrimary ? primary_hover : secondary_hover}
            p-1 rounded-sm
          `}
        >
          {customIcon || <Settings2 width={15} height={15} />}
        </button>
      </Tooltip>

      {/* Pop-over menu */}
    <div
      className={`
        ${options_bg} ${border} z-20 border shadow-sm flex flex-col gap-2 justify-center w-[400px]
        absolute right-0 ${openUpwards ? "bottom-full mb-1 origin-bottom-right" : "top-full origin-top-right"}
        p-2 rounded-sm transition-transform duration-100 ease-ou
        ${isPopupOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none hidden"}
      `}
    >
      {children}
      </div>
      </div>
  );
};

export default React.memo(OptionPopover);
