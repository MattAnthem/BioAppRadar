import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setRadarTimeHist, setSelectedHistRadarParameter, setSelectedHistRadarType } from '../slice/histRadarPopupSlice';
import type { SelectOption } from '../../../shared/components/selects/types';
import { RadarIcon } from 'lucide-react';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import OptionPopover from '../../../shared/components/popups/option/OptionPopover';
import { formatChartDateParam } from '../../../shared/utils/date_format';

type RadarOptionPopupProps = {
    onChangeRadarType?: (type: SelectOption) => void;
    onChangeRadarParameter?: (parameter: SelectOption) => void;
    onChangeRadarTime?: (time: string) => void;
}


const RadarOptionPopup = ({ onChangeRadarParameter, onChangeRadarType, onChangeRadarTime }: RadarOptionPopupProps) => {

    // Redux
    const { availableTypes, selectedType, availableParameters, selectedParameter, radarTimeHist } = useAppSelector(state => state.hist_radarpopup);
    const dispatch = useAppDispatch();


    const handleRadarTypeChange = (option: SelectOption) => {
        onChangeRadarType?.(option);
        dispatch(setSelectedHistRadarType(option));
    }

    const handleRadarParameterChange = (option: SelectOption) => {
        onChangeRadarParameter?.(option);
        dispatch(setSelectedHistRadarParameter(option));
    }

    const handleRadarTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const raw = evt.target.value; 
        const formatted = formatChartDateParam(raw);
        dispatch(setRadarTimeHist(formatted));
        onChangeRadarTime?.(formatted);
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

        {/* Time */}
        <small>Select time</small>
        <div className="border-b border-b-gray-400"/>
        <input onChange={handleRadarTimeChange} value={radarTimeHist} step={1} className="w-full p-2 border rounded-sm" type="datetime-local" name="sevipHistTime" id="sevipHistTime" />


    </OptionPopover>
  )
}

export default RadarOptionPopup
