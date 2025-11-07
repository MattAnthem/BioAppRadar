import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useClickOutside } from "../../../shared/hooks/useClickOutside";
import Tooltip from "../../../shared/components/popups/tooltip/Tooltip";
import { useTheme } from "../../../shared/hooks/useTheme";
import { Map } from "lucide-react";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../../shared/components/selects/types";
import { changeHistBaseMap, changeHistColormap, changeHistCoverage, hideHistMapBasePopup, toggleShowHistMapBasePopup } from "../slice/histBaseMapPopupSlice";
import Colorbar from "../../livemap/components/Colorbar";


type BaseMapProps = {
  displayColorbarOption?: boolean;
  onChangeOverlayColor?: (colorname: string) => void;
}

const MapbasePopup = ({ displayColorbarOption=true, onChangeOverlayColor }: BaseMapProps) => {

  // redux 
  const { isMapBasePopupOpen, mapBaseOptions, colormapOptions, selectedMapBase, selectedColormap, coverageOptions, selectedCoverage } = useAppSelector(state => state.hist_basemap);
 
  const mapBasepopupRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();


  // autohide 
  useClickOutside(mapBasepopupRef, () => {
    if (isMapBasePopupOpen) {
      dispatch(hideHistMapBasePopup())
    }
  })


  // handlers
  const handleChangeBase = (option: SelectOption) => {
    dispatch(changeHistBaseMap(option))
  }

  const handleChangeCoverage = (option: SelectOption) => {
    dispatch(changeHistCoverage(option.id));
  }
  
  const handleChangeColormap = (option: SelectOption) => {
    dispatch(changeHistColormap(option));
    onChangeOverlayColor?.(option.id as string)
  }

  // theme
  const themes = useTheme();
  const { bg, border, hover, options_bg } = themes.theme.simpleSelect;

  return (
    <div ref={mapBasepopupRef} className="">

      <Tooltip 
        position="bottom" 
        display_condition={!isMapBasePopupOpen}  // is popup open
        text="Change Base Map"
      >
        
        <button onClick={() => dispatch(toggleShowHistMapBasePopup())} className={`${bg} ${border} ${hover} p-1 rounded-sm`}>
            <Map/>
        </button>

      </Tooltip>

      {/* Pop-over menu */}
      <div className={`
          ${options_bg} ${border} z-30 border shadow-sm flex flex-col gap-2 justify-center  w-90 absolute right-0 top-full p-2 rounded-sm
          ${isMapBasePopupOpen ? 
              "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
          }
          transition-all duration-75 ease-out
          origin-top-right
        `}
      >

        {/* Select map base */}
        <small>Base Map</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
          onSelectValue={handleChangeBase}
          options={mapBaseOptions}
          width="w-85"
          value={selectedMapBase.displayText}
          className="border-0! bg-none!"
        />


        <small>Coverages</small>
        <div className="border-b border-b-gray-400"/>

        {/* Select coverage */}
        <SimpleSelect
          onSelectValue={handleChangeCoverage}
          options={coverageOptions}
          width="w-85"
          value={selectedCoverage.displayText}
          className="border-0! bg-none!"
        />

        {/* Select colormap */}
        {
          displayColorbarOption && (
            <>
              <small>Colorbar</small>
              <div className="border-b border-b-gray-400"/>
              <SimpleSelect
                onSelectValue={handleChangeColormap}
                options={colormapOptions}
                width="w-85"
                value={selectedColormap.displayText}
                className="border-0! bg-none!"
              />

              {/* Colormap preview */}
              <div className="w-full flex flex-col">
                <small>Preview</small>
                <Colorbar
                  colorCodes={selectedColormap.colors as string[]}
                  valueScale={[0,1,2,3,4]}
                  className="w-full rounded-none!"
                />
              </div>
            </>
          )
        }

      </div>

    </div>
  )
}

export default MapbasePopup;
