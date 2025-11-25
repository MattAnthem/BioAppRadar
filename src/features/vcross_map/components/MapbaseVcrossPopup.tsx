import { MapIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { changeVcrossColormap, changeVcrossBaseMap, setSelectedBoundaryTypeVcross, setSelectedBoundaryVcross } from '../slice/vcrossMapbaseSlice';
import type { SelectOption } from '../../../shared/components/selects/types';
import { memo, lazy } from 'react';

const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const OptionPopover = lazy(() => import('../../../shared/components/popups/option/OptionPopover'));
const SimpleSelect = lazy(() => import('../../../shared/components/selects/SimpleSelect'));
const Colorbar = lazy(() => import('../../../shared/components/legends/Colorbar'));

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

        <div className="flex flex-col gap-0.5">
            <small className='font-semibold'>Basemap</small>
            <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
          onSelectValue={handleChangeBase}
          options={mapBaseOptions}
          width="w-full"
          value={selectedMapBase.displayText}
          className="border-0! bg-none!"
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

export default memo(MapbaseVcrossPopup);
