import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { closeRadarPopup, setRadarTimeHist, setSelectedHistRadarParameter, setSelectedHistRadarType, toggleRadarPopup } from '../slice/histRadarPopupSlice';
import type { SelectOption } from '../../../shared/components/selects/types';
import { RadarIcon } from 'lucide-react';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import OptionPopover from '../../../shared/components/popups/option/OptionPopover';
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder';
import ReactDatetimePicker from '../../../shared/components/input/ReactDatetime';

type RadarOptionPopupProps = {
    onSubmitPopup?: () => void;
}
const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const RadarOptionPopup = ({ onSubmitPopup }: RadarOptionPopupProps) => {

    // Redux
    const { availableTypes, selectedType, availableParameters, selectedParameter, radarTimeHist, isPopupOpen } = useAppSelector(state => state.hist_radarpopup);
    const dispatch = useAppDispatch();


    const handleRadarTypeChange = (option: SelectOption) => {
        dispatch(setSelectedHistRadarType(option));
    }

    const handleRadarParameterChange = (option: SelectOption) => {
        dispatch(setSelectedHistRadarParameter(option));
    }

    const handleRadarTimeChange = (date: string) => {

        dispatch(setRadarTimeHist(date));
    }
  
    const handleSubmit = () => {
        onSubmitPopup?.();
        dispatch(closeRadarPopup())
    }

  return (
    <OptionPopover
        hoverText='Radar Data'
        customIcon={<RadarIcon className={iconSize}/>}
        isOpen={isPopupOpen}
        onOpen={() => dispatch(toggleRadarPopup())}
        onClose={() => dispatch(closeRadarPopup())}
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
        <ReactDatetimePicker
            onChange={handleRadarTimeChange}
            value={radarTimeHist}
        />


        {/* Display data  */}
        <ButtonBorder
            onClick={handleSubmit}
            className='py-2 mt-2'
        >
             Display data
        </ButtonBorder>

    </OptionPopover>
  )
}

export default RadarOptionPopup
