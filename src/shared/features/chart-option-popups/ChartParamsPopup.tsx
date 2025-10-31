import { useRef, useState, type ReactNode } from 'react'
import Tooltip from '../../components/popups/tooltip/Tooltip';
import { useTheme } from '../../hooks/useTheme';
import { Settings2 } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';


type ChartParamsPopupProps = {
    children?: ReactNode;
}

const ChartParamsPopup = ({ children }: ChartParamsPopupProps) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);

    const themes = useTheme();
    const { bg, border, hover, options_bg } = themes.theme.simpleSelect;

    // autohide 
    useClickOutside(popupRef, () => {
        if (isPopupOpen) {
            setIsPopupOpen(false)
        }
    })

  return (
    <div ref={popupRef} className='relative'>
      
      <Tooltip 
        position="bottom" 
        display_condition={!isPopupOpen}  // is popup open
        text="Chart Parameters"
      >

        <button onClick={() => setIsPopupOpen(!isPopupOpen)} className={`${bg} ${border} ${hover} p-1 rounded-sm`}>
            <Settings2 width={15} height={15}/>
        </button>

        {/* Pop-over menu */}
        <div className={`
          ${options_bg} ${border} z-50 border shadow-sm flex flex-col gap-2 justify-center w-[400px] absolute right-0 top-full p-2 rounded-sm
          ${isPopupOpen ? 
              "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
          }
          transition-all duration-75 ease-out
          origin-top-right
        `}
      >

        {children}

      </div>
        
      </Tooltip>

    </div>
  )
}

export default ChartParamsPopup;
