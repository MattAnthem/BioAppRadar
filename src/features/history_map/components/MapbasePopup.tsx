import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Map } from "lucide-react";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../../shared/components/selects/types";
import { changeHistBaseMap, changeHistColormap, setSelectedBoundaryHist, setSelectedBoundaryTypeHist } from "../slice/histBaseMapPopupSlice";
import Colorbar from "../../livemap/components/Colorbar";
import OptionPopover from "../../../shared/components/popups/option/OptionPopover";


type BaseMapProps = {
  displayColorbarOption?: boolean;
  onChangeOverlayColor?: (colorname: string) => void;
}
const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const MapbasePopup = ({ displayColorbarOption=true, onChangeOverlayColor }: BaseMapProps) => {

  // redux 
  const {  mapBaseOptions, colormapOptions, selectedMapBase, selectedColormap, selectedBoundary, boundaryTypes, selectedBoundaryType, boundaryOptions } = useAppSelector(state => state.hist_basemap);
 

  const dispatch = useAppDispatch();

    // Coverage
    const handleChangeCoverageGenre = (option: SelectOption) => {
      dispatch(setSelectedBoundaryHist(option));
    }
    const handleChangeCoverageType = (option: SelectOption) => {
      dispatch(setSelectedBoundaryTypeHist(option));
    }

  // handlers
  const handleChangeBase = (option: SelectOption) => {
    dispatch(changeHistBaseMap(option))
  }


  
  const handleChangeColormap = (option: SelectOption) => {
    dispatch(changeHistColormap(option));
    onChangeOverlayColor?.(option.id as string)
  }



  return (
    <OptionPopover
      customIcon={<Map className={iconSize}/>}
      hoverText='Change Base Map'
      isPrimary
    >

          {/* Select map base */}
          <small className="font-semibold">Base Map</small>
          <div className="border-b border-b-gray-400"/>
          <SimpleSelect
            onSelectValue={handleChangeBase}
            options={mapBaseOptions}
            width="w-95"
            value={selectedMapBase.displayText}
            className="border-0! bg-none!"
          />


          <small className="font-semibold">Coverages</small>
          <div className="border-b border-b-gray-400"/>

          {/* Select coverage */}
          {/* Select coverage Genre */}
          <SimpleSelect
            onSelectValue={handleChangeCoverageGenre}
            options={boundaryOptions}
            width="w-95"
            value={selectedBoundary.displayText}
            className="border-0! bg-none!"
          />
          {/* Select coverage Types */}
          <SimpleSelect
            onSelectValue={handleChangeCoverageType}
            options={boundaryTypes}
            width="w-95"
            value={selectedBoundaryType.displayText}
            className="border-0! bg-none!"
          />

          {/* Select colormap */}
          {
            displayColorbarOption && (
              <>
                <small className="font-semibold">Colorbar</small>
                <div className="border-b border-b-gray-400"/>
                <SimpleSelect
                  onSelectValue={handleChangeColormap}
                  options={colormapOptions}
                  width="w-95"
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

    </OptionPopover>
  )
}

export default MapbasePopup;
