import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { MapIcon } from "lucide-react";
import type { SelectOption } from "../../../shared/components/selects/types";
import { changeBaseMap } from "../slice/baseMapPopupSlice";
import { setSelectedBoundary, setSelectedBoundaryType } from "../../../shared/slice/boundarySlice";
import { memo, lazy, useState } from "react";

const SimpleSelect = lazy(() => import('../../../shared/components/selects/SimpleSelect'));
const OptionPopover = lazy(() => import('../../../shared/components/popups/option/OptionPopover'));



const MapbasePopup = () => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // redux 
  const {
    mapBaseOptions, 
    selectedMapBase, 
  } = useAppSelector(state => state.basemappopup);
  const dispatch = useAppDispatch();
  const { boundaryOptions, boundaryTypes, selectedBoundary, selectedBoundaryType } = useAppSelector(state => state.boundary);
  


  //#region  handlers
  const handleChangeBase = (option: SelectOption) => {
    dispatch(changeBaseMap(option));
    setIsPopupOpen(false);

  }

  // Coverage
  const handleChangeCoverageGenre = (option: SelectOption) => {
    dispatch(setSelectedBoundary(option));
  }
  const handleChangeCoverageType = (option: SelectOption) => {
    dispatch(setSelectedBoundaryType(option));
    setIsPopupOpen(false);
  }
  
  //#endregion


    // ---  Controls of the popup ---
  const handleTooglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
  }
  const closePopup = () => {
        setIsPopupOpen(false);
  }

  return (
    <OptionPopover
      customIcon={<MapIcon className={`w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4`}/>}
      hoverText="Change Base Map"
      isPrimary
      isOpen={isPopupOpen}
      onOpen={handleTooglePopup}
      onClose={closePopup}
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
        
    </OptionPopover>
  )
}

export default memo(MapbasePopup);
