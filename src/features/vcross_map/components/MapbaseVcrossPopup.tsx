import { MapIcon } from 'lucide-react'
import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import { changeVcrossColormap, changeVcrossBaseMap, setSelectedBoundaryTypeVcross, setSelectedBoundaryVcross } from '../slice/vcrossMapbaseSlice';
import Colorbar from '../../livemap/components/Colorbar';
import type { SelectOption } from '../../../shared/components/selects/types';

const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

type MapbaseProps = {
    displayColorbarOption?: boolean;
    onChangeOverlayColor?: (colorname: string) => void
}

const MapbaseVcrossPopup = ({ displayColorbarOption, onChangeOverlayColor }: MapbaseProps) => {
    // Redux states 
    const { boundaryOptions, boundaryTypes, colormapOptions, mapBaseOptions, selectedBoundary, selectedBoundaryType, selectedColormap, selectedMapBase } = useAppSelector(state => state.vcross_basemap);
    const dispatch = useAppDispatch();

    // Coverage
    const handleChangeCoverageGenre = (option: SelectOption) => {
        dispatch(setSelectedBoundaryVcross(option));
    }

    const handleChangeCoverageType = (option: SelectOption) => {
        dispatch(setSelectedBoundaryTypeVcross(option));
    }
      
    // handlers
    const handleChangeBase = (option: SelectOption) => {
        dispatch(changeVcrossBaseMap(option))
    }
      
      
        
    const handleChangeColormap = (option: SelectOption) => {
          dispatch(changeVcrossColormap(option));
          onChangeOverlayColor?.(option.id as string)
    }
  return (
    <OptionPopover
        customIcon={<MapIcon className={iconSize}/>}
        hoverText='Change Base Map'
        isPrimary
    >

        <small className='font-semibold'>Base Map</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
          onSelectValue={handleChangeBase}
          options={mapBaseOptions}
          width="w-95"
          value={selectedMapBase.displayText}
          className="border-0! bg-none!"
        />

        <small className='font-semibold'>Coverages</small>
        <div className="border-b border-b-gray-400"/>
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

export default MapbaseVcrossPopup
