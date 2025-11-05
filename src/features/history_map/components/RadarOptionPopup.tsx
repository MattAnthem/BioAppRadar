import { useLayoutEffect, useRef, useState } from 'react'
import { useTheme } from '../../../shared/hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useClickOutside } from '../../../shared/hooks/useClickOutside';
import { changeSelectedParameter, changeSelectedRadarOption, hideRadarParamsOptions, toggleShowRadarParamsOptions } from '../slice/radarOptionSlice';
import type { SelectOption } from '../../../shared/components/selects/types';
import Tooltip from '../../../shared/components/popups/tooltip/Tooltip';
import { Radar } from 'lucide-react';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';

type RadarOptionPopupProps = {
    onChangeRadarType?: (type: SelectOption) => void;
    onChangeRadarParameter?: (parameter: SelectOption) => void;
}


const RadarOptionPopup = ({ onChangeRadarParameter, onChangeRadarType }: RadarOptionPopupProps) => {

    const popupContentRef = useRef<HTMLDivElement>(null);
    const [popupPosition, setPopupPosition] = useState<"top" | "bottom">("bottom");

    const themes = useTheme();
    const { bg, border, hover, options_bg } = themes.theme.simpleSelect;

    // Redux
    const { isPopupOpen, radarOptions, radarParameters, selectedParameter, selectedRadarOption } = useAppSelector(state => state.radaroption);
    const paramPopupRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();

    // autohide 
    useClickOutside(paramPopupRef, () => {
        if (isPopupOpen) {
            dispatch(hideRadarParamsOptions());
        }
    })


    const handleSelectedRadarOption = (option: SelectOption) => {
        onChangeRadarType?.(option)
        dispatch(changeSelectedRadarOption(option));
    }
  
  
    const handleSelectedParameter = (option: SelectOption) => {
        onChangeRadarParameter?.(option);
        dispatch(changeSelectedParameter(option));
    }
  
      useLayoutEffect(() => {
        if (!isPopupOpen || !popupContentRef.current || !paramPopupRef.current) return;
    
        const triggerRect = paramPopupRef.current.getBoundingClientRect();
        const popupRect = popupContentRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;
    
        
        if (spaceBelow < popupRect.height && spaceAbove > popupRect.height) {
          setPopupPosition("top");
        } else {
          setPopupPosition("bottom");
        }
      }, [isPopupOpen]); 

  return (
    <div ref={paramPopupRef} className='relative'>

        <Tooltip
            position='bottom'
            display_condition={!isPopupOpen}
            text='Change Radar options'
        >

            <button onClick={() => dispatch(toggleShowRadarParamsOptions())} className={`${bg} ${border} ${hover} p-1 rounded-sm`}>
                <Radar/>
            </button>

        </Tooltip>

        {/* Menu */}
        <div 
          ref={popupContentRef}
          className={`
          ${options_bg} ${border} border shadow-sm flex flex-col gap-2 justify-center w-90
          absolute right-0
          ${popupPosition === "bottom" ? "top-full mt-2" : "bottom-full mb-2"}
          p-2 rounded-sm
          ${isPopupOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
          transition-all duration-150 ease-out
          origin-top-right
        `}
        >


            {/* Select option */}
            <SimpleSelect
                onSelectValue={handleSelectedRadarOption}
                options={radarOptions}
                width="w-80"
                value={selectedRadarOption.displayText}
                title="Select Type"
                className="border-0! bg-none!"
            />

            {/* Sub element of selected */}
            <div className="w-full flex flex-col">
                <small>Select parameter</small>
                <SimpleSelect
                    width="w-85"
                    options={radarParameters}
                    onSelectValue={handleSelectedParameter}
                    value={selectedParameter?.displayText}
                />
            </div>
            {/* Time interval select */}
            <div className="w-full mb-2">
                <small>Select Start Time</small>
                <input onChange={() => console.log('object')} value={'2020-01-01 00:00:00'} step={1} className="w-full p-2 border rounded-sm" type="datetime-local" name="date" id="" />
                <small>Select End Time</small>
                <input onChange={() => console.log('object')} value={'2020-01-01 00:00:00'} step={1} className="w-full p-2 border rounded-sm" type="datetime-local" name="date" id="" />
            </div>

        </div>
      
    </div>
  )
}

export default RadarOptionPopup
