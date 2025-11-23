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
  isSimpleSelect?: boolean;

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
  isSimpleSelect=false,
  isPrimary=false
}: ChartParamsPopupProps) => {
  const [localOpen, setLocalOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false); 

  const popupRef = useRef<HTMLDivElement | null>(null);
  const popupContentRef = useRef<HTMLDivElement | null>(null);

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
    if (!isPopupOpen || !popupRef.current || !popupContentRef.current) return;

    const popup = popupContentRef.current;
    const containerRect = popupRef.current.getBoundingClientRect();


    popup.style.visibility = "hidden";
    popup.style.opacity = '0';
    popup.style.pointerEvents = 'none';
    popup.style.display = 'block';

    const height = popup.offsetHeight;

    popup.style.visibility = ''
    popup.style.opacity = '';
    popup.style.pointerEvents = '';
    popup.style.display = '';

    const spaceBelow = window.innerHeight - containerRect.bottom;
    const spaceAbove = containerRect.top;

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setOpenUpwards(false);
      return;
    }

    if (spaceBelow >= height) {
      setOpenUpwards(false);
    } else if (spaceAbove >= height) {
      setOpenUpwards(true);
    } else {
      setOpenUpwards(spaceAbove > spaceBelow)
    }

  }, [isPopupOpen]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div ref={popupRef} className={`lg:relative md:relative inline-block`}>
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
        ref={popupContentRef}
        className={`
          ${options_bg} ${border} z-20 border shadow-sm flex flex-col gap-2 justify-center 
          ${isSimpleSelect ? 'lg:w-[10vw] md:w-[25vw]' : 'lg:w-[25vw] md:w-[45vw] w-full'}    
          absolute right-0 
          ${openUpwards ? "bottom-full mb-1 origin-bottom-right" : "top-full origin-top-right"}
          ${
            isMobile ? "top-full left-0 origin-top-right" : '' 
          }
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
