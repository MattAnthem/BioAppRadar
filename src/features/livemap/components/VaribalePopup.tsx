import { Settings2 } from "lucide-react";
import { useTheme } from "../../../shared/hooks/useTheme"
import Tooltip from "../../../shared/components/popups/tooltip/Tooltip";
import { useLayoutEffect, useRef, useState } from "react";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../../shared/components/selects/types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useClickOutside } from "../../../shared/hooks/useClickOutside";
import { changeSelectedMapOption, changeSelectedSubOption, hideVarPopup, toggleShowVarPopup } from "../slice/mappopupsSlice";


type VariablePopupProps = {
  onChangeMapVariable?: (variable: SelectOption) => void
}


const VaribalePopup = ({ onChangeMapVariable }: VariablePopupProps) => {

    const popupContentRef = useRef<HTMLDivElement>(null);
    const [popupPosition, setPopupPosition] = useState<"top" | "bottom">("bottom");

    // Redux
    const { isVarPopupOpen } = useAppSelector(state => state.mappopups);
    const varpopupRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();


    const { selectedMapOption, mapOptions, selectedSubOption, subOptions } = useAppSelector(state => state.mappopups);

    // autohide 
    useClickOutside(varpopupRef, () => {
      if (isVarPopupOpen) {
        dispatch(hideVarPopup())
      }
    })


    const themes = useTheme();
    const { bg, border, hover, options_bg } = themes.theme.simpleSelect;

    const handleSelectedData = (option: SelectOption) => {
      dispatch(changeSelectedMapOption(option));
    }


    const handleSelectedMap = (option: SelectOption) => {
      onChangeMapVariable?.(option);
      dispatch(changeSelectedSubOption(option));
    }

    useLayoutEffect(() => {
      if (!isVarPopupOpen || !popupContentRef.current || !varpopupRef.current) return;
  
      const triggerRect = varpopupRef.current.getBoundingClientRect();
      const popupRect = popupContentRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
  
      
      if (spaceBelow < popupRect.height && spaceAbove > popupRect.height) {
        setPopupPosition("top");
      } else {
        setPopupPosition("bottom");
      }
    }, [isVarPopupOpen]);

  return (
    <div ref={varpopupRef} className="relative">

      <Tooltip 
        position="bottom" 
        display_condition={!isVarPopupOpen}  // is popup open
        text="Variable to display"
      >
        
        <button onClick={() => dispatch(toggleShowVarPopup())} className={`${bg} ${border} ${hover} p-1 rounded-sm`}>
            <Settings2/>
        </button>

      </Tooltip>

      {/* Pop-over menu */}
      
      <div         
          ref={popupContentRef}
          className={`
          ${options_bg} ${border} border shadow-sm flex flex-col gap-2 justify-center w-90
          absolute right-0
          ${popupPosition === "bottom" ? "top-full mt-2" : "bottom-full mb-2"}
          p-2 rounded-sm
          ${isVarPopupOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
          transition-all duration-150 ease-out
          origin-top-right
        `}
      >

        {/* Select map  */}
        <SimpleSelect
          onSelectValue={handleSelectedData}
          options={mapOptions}
          width="w-80"
          value={selectedMapOption.displayText}
          title="Select map data"
          className="border-0! bg-none!"
        />

        {/* Sub element of selected */}
     
          <div className="w-full flex flex-col">
            <p>Select a variable</p>
            <SimpleSelect
              width="w-85"
              options={subOptions}
              onSelectValue={handleSelectedMap}
              value={selectedSubOption.displayText}
            />
          </div>

      </div>

    </div>
  )
}

export default VaribalePopup;
