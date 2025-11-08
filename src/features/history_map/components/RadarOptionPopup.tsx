import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setRadarTimeHist, setSelectedHistRadarParameter, setSelectedHistRadarType } from '../slice/histRadarPopupSlice';
import type { SelectOption } from '../../../shared/components/selects/types';
import { RadarIcon } from 'lucide-react';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import OptionPopover from '../../../shared/components/popups/option/OptionPopover';
import { formatChartDateParam } from '../../../shared/utils/date_format';
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder';

type RadarOptionPopupProps = {
    onSubmitPopup?: () => void;
}


const RadarOptionPopup = ({ onSubmitPopup }: RadarOptionPopupProps) => {

    // Redux
    const { availableTypes, selectedType, availableParameters, selectedParameter, radarTimeHist } = useAppSelector(state => state.hist_radarpopup);
    const dispatch = useAppDispatch();


    const handleRadarTypeChange = (option: SelectOption) => {
        dispatch(setSelectedHistRadarType(option));
    }

    const handleRadarParameterChange = (option: SelectOption) => {
        dispatch(setSelectedHistRadarParameter(option));
    }

    const handleRadarTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const raw = evt.target.value; 
        const formatted = formatChartDateParam(raw);
        dispatch(setRadarTimeHist(formatted));
    }
  

  return (
    <OptionPopover
        hoverText='Radar Data'
        customIcon={<RadarIcon/>}
    >
        <small className='font-semibold'>Select Radar Type</small>
        <div className="border-b border-b-gray-400"/>

        {/* Type Select */}
        <SimpleSelect
            options={availableTypes}
            value={selectedType.displayText}
            width='w-95'
            onSelectValue={handleRadarTypeChange}
        />
        
        <small className='font-semibold'>Select parameter</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={availableParameters}
            value={selectedParameter.displayText}
            width='w-95'
            onSelectValue={handleRadarParameterChange}
        />

        {/* Time */}
        <small className='font-semibold'>Select time</small>
        <div className="border-b border-b-gray-400"/>
        <input onChange={handleRadarTimeChange} value={radarTimeHist} step={1} className="w-full p-2 border rounded-sm" type="datetime-local" name="sevipHistTime" id="sevipHistTime" />

        {/* Display data  */}
        <ButtonBorder
            onClick={onSubmitPopup!}
            className='py-2 mt-2'
        >
             Display data
        </ButtonBorder>

    </OptionPopover>
  )
}

export default RadarOptionPopup
