import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Map } from "lucide-react";
import type { SelectOption } from "../../../shared/components/selects/types";
import { changeHistBaseMap, changeHistColormap, setSelectedBoundaryHist, setSelectedBoundaryTypeHist } from "../slice/histBaseMapPopupSlice";
import { memo, lazy } from "react";

const SimpleSelect = lazy(() => import("../../../shared/components/selects/SimpleSelect"));
const Colorbar = lazy(() => import("../../../shared/components/legends/Colorbar"));
const OptionPopover = lazy(() => import("../../../shared/components/popups/option/OptionPopover"));


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
          <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>Basemap</small>
              <div className="border-b border-b-gray-400"/>
          </div>
          <SimpleSelect
            onSelectValue={handleChangeBase}
            options={mapBaseOptions}
            width="w-full"
            value={selectedMapBase.displayText}
          />


          <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>Coverages</small>
              <div className="border-b border-b-gray-400"/>
          </div>

          {/* Select coverage */}
          {/* Select coverage Genre */}
          <SimpleSelect
            onSelectValue={handleChangeCoverageGenre}
            options={boundaryOptions}
            width="w-full"
            value={selectedBoundary.displayText}
        
          />
          {/* Select coverage Types */}
          <SimpleSelect
            onSelectValue={handleChangeCoverageType}
            options={boundaryTypes}
            width="w-full"
            value={selectedBoundaryType.displayText}
          />

          {/* Select colormap */}
          {
            displayColorbarOption && (
              <>
                <div className="flex flex-col gap-0.5">
                    <small className='font-semibold'>Colorbar</small>
                    <div className="border-b border-b-gray-400"/>
                </div>
                <SimpleSelect
                  onSelectValue={handleChangeColormap}
                  options={colormapOptions}
                  width="w-full"
                  value={selectedColormap.displayText}
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

export default memo(MapbasePopup);
