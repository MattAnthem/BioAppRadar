import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useClickOutside } from "../../../shared/hooks/useClickOutside";
import Tooltip from "../../../shared/components/popups/tooltip/Tooltip";
import { useTheme } from "../../../shared/hooks/useTheme";
import { Map } from "lucide-react";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../../shared/components/selects/types";
import Colorbar from "./Colorbar";
import { setSevipPayload } from "../slice/livemapSlice";
import { changeBaseMap, changeColormap, hideMapBasePopup, setSelectedCoverageGenre, setSelectedCoverageType, toggleShowMapBasePopup } from "../slice/baseMapPopupSlice";



type BaseMapProps = {
  displayColorbarOption?: boolean;
}

const MapbasePopup = ({ displayColorbarOption }: BaseMapProps) => {

  // redux 
  const {selectedCoverage, coverageOptions, coverageTypes, selectedCoverageType, isMapBasePopupOpen, mapBaseOptions, colormapOptions, selectedMapBase, selectedColormap } = useAppSelector(state => state.basemappopup);
  const mapBasepopupRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { boundaryOptions, boundaryTypes, selectedBoundary, selectedBoundaryType } = useAppSelector(state => state.boundary);
  

  // autohide 
  useClickOutside(mapBasepopupRef, () => {
    if (isMapBasePopupOpen) {
      dispatch(hideMapBasePopup())
    }
  })


  // handlers
  const handleChangeBase = (option: SelectOption) => {
    dispatch(changeBaseMap(option))
  }

  // Coverage
  const handleChangeCoverageGenre = (option: SelectOption) => {
    dispatch(setSelectedCoverageGenre(option));
  }
  const handleChangeCoverageType = (option: SelectOption) => {
    dispatch(setSelectedCoverageType(option));
  }
  
  const handleChangeColormap = (option: SelectOption) => {
    dispatch(changeColormap(option));
    dispatch(setSevipPayload({colorbar: option.id as string}))
  }

  // theme
  const themes = useTheme();
  const { bg, border, hover, options_bg } = themes.theme.simpleSelect;

  return (
    <div ref={mapBasepopupRef} className="relative">

      <Tooltip 
        position="bottom" 
        display_condition={!isMapBasePopupOpen}  // is popup open
        text="Change Base Map"
      >
        
        <button onClick={() => dispatch(toggleShowMapBasePopup())} className={`${bg} ${border} ${hover} p-1 rounded-sm`}>
            <Map width={20} height={20}/>
        </button>

      </Tooltip>

      {/* Pop-over menu */}
      <div className={`
          ${options_bg} ${border} z-30 border shadow-sm flex flex-col gap-2 justify-center  w-90 absolute right-0  top-full p-2  rounded-sm
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

        {/* Select coverage Genre */}
        <SimpleSelect
          onSelectValue={handleChangeCoverageType}
          options={coverageOptions}
          width="w-85"
          value={selectedCoverage.displayText}
          className="border-0! bg-none!"
        />
        {/* Select coverage Types */}
        <SimpleSelect
          onSelectValue={handleChangeCoverageGenre}
          options={coverageTypes}
          width="w-85"
          value={selectedCoverageType.displayText}
          className="border-0! bg-none!"
        />
        


        {/* Select colormap */}
        {/* Colormap preview */}
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

              
              
              <div className="w-full flex flex-col">
                <small>Preview</small>
                <Colorbar
                  colorCodes={selectedColormap.colors as string[]}
                  valueScale={[]}
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
