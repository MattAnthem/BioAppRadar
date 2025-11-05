import { RadarIcon } from 'lucide-react'
import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import type { SelectOption } from '../../../shared/components/selects/types';
import { setSelectedRadarParameter, setSelectedRadarType } from '../slice/radarPopupSlice';

type RadarPopupProps = {
    onChangeRadarType?: (option: SelectOption) => void;
    onChangeRadarParameter?: (option: SelectOption) => void;
}

const RadarPopup = ({ onChangeRadarParameter, onChangeRadarType }: RadarPopupProps) => {

    const { availableTypes, selectedType, availableParameters, selectedParameter } = useAppSelector(state => state.radarpopup);
    const dispatch = useAppDispatch();

    const handleRadarTypeChange = (option: SelectOption) => {
        onChangeRadarType?.(option);
        dispatch(setSelectedRadarType(option));
    }

    const handleRadarParameterChange = (option: SelectOption) => {
        onChangeRadarParameter?.(option);
        dispatch(setSelectedRadarParameter(option))
    }


  return (
    <OptionPopover
        hoverText='Radar Data'
        customIcon={<RadarIcon/>}
    >
        <p>Select Radar Type</p>

        {/* Type Select */}
        <SimpleSelect
            options={availableTypes}
            value={selectedType.displayText}
            width='w-95'
            onSelectValue={handleRadarTypeChange}
        />
        
        <small>Select parameter</small>
        <SimpleSelect
            options={availableParameters}
            value={selectedParameter.displayText}
            width='w-95'
            onSelectValue={handleRadarParameterChange}
        />

    </OptionPopover>
  )
}

export default RadarPopup;
