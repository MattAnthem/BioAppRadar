import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { MapIcon } from "lucide-react";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../../shared/components/selects/types";
import Colorbar from "./Colorbar";
import { setSevipPayload } from "../slice/livemapSlice";
import { changeBaseMap, changeColormap } from "../slice/baseMapPopupSlice";
import OptionPopover from "../../../shared/components/popups/option/OptionPopover";
import { setSelectedBoundary, setSelectedBoundaryType } from "../../../shared/slice/boundarySlice";
import { memo } from "react";



type BaseMapProps = {
  displayColorbarOption?: boolean;
  onChangeColormap?: () => void;
}

const MapbasePopup = ({ displayColorbarOption, onChangeColormap }: BaseMapProps) => {

  // redux 
  const {
    mapBaseOptions, 
    colormapOptions, 
    selectedMapBase, 
    selectedColormap 
  } = useAppSelector(state => state.basemappopup);
  const dispatch = useAppDispatch();
  const { boundaryOptions, boundaryTypes, selectedBoundary, selectedBoundaryType } = useAppSelector(state => state.boundary);
  


  //#region  handlers
  const handleChangeBase = (option: SelectOption) => {
    dispatch(changeBaseMap(option))
  }

  // Coverage
  const handleChangeCoverageGenre = (option: SelectOption) => {
    dispatch(setSelectedBoundary(option));
  }
  const handleChangeCoverageType = (option: SelectOption) => {
    dispatch(setSelectedBoundaryType(option));
  }
  
  const handleChangeColormap = (option: SelectOption) => {
    onChangeColormap?.();
    dispatch(changeColormap(option));
    dispatch(setSevipPayload({colorbar: option.id as string}))
  }
  //#endregion



  return (
    <OptionPopover
      customIcon={<MapIcon className={`w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4`}/>}
      hoverText="Change Base Map"
      isPrimary
    >
       {/* Select map base */}
       <small className="font-semibold">Base Map</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
          onSelectValue={handleChangeBase}
          options={mapBaseOptions}
          width="w-full"
          value={selectedMapBase.displayText}
          className="border-0! bg-none!"
        />


        <small className="font-semibold">Coverages</small>
        <div className="border-b border-b-gray-400"/>

        {/* Select coverage Genre */}
        <SimpleSelect
          onSelectValue={handleChangeCoverageGenre}
          options={boundaryOptions}
          width="w-full"
          value={selectedBoundary.displayText}
          className="border-0! bg-none!"
        />
        {/* Select coverage Types */}
        <SimpleSelect
          onSelectValue={handleChangeCoverageType}
          options={boundaryTypes}
          width="w-full"
          value={selectedBoundaryType.displayText}
          className="border-0! bg-none!"
        />
        


        {/* Colormap preview */}
        {
          displayColorbarOption && (
            <>
              <small className="font-semibold">Colorbar</small>
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
    </OptionPopover>
  )
}

export default memo(MapbasePopup);
