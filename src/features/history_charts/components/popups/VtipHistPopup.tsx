import SimpleSelect from '../../../../shared/components/selects/SimpleSelect'
import ButtonBorder from '../../../../shared/components/buttons/borderedbtn/ButtonBorder'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { closeVtipHistPopup, setSelectedVtipHistParameterOption, setVtipHistEndTime, setVtipHistStartTime, toggleVtipHistPopup } from '../../slices/vtipHistChartSlice';
import type { SelectOption } from '../../../../shared/components/selects/types';
import OptionPopover from '../../../../shared/components/popups/option/OptionPopover';
import ReactDatetimePicker from '../../../../shared/components/input/ReactDatetime';

type Props = {
    onSubmitPopup?: () => void;
}

const VtipHistPopup = ({ onSubmitPopup }:Props) => {
    const { parameterOptions, selectedParameter, vtipStartTime, vtipEndTime, isPopupOpen } = useAppSelector(state => state.vtip_histchart);
    const dispatch = useAppDispatch()



    const handleStartTimeChange = (date: string) => {
        dispatch(setVtipHistStartTime(date));
    }
    
    const handleEndTimeChange = (date: string) => {
        dispatch(setVtipHistEndTime(date));
    }
    
    const handleVariableChange = (option: SelectOption) => {
        dispatch(setSelectedVtipHistParameterOption(option));
    }

    const handleSubmitPopupData = () => {
        onSubmitPopup?.();
        dispatch(closeVtipHistPopup())
    }

  return (
    <OptionPopover
        hoverText="Select Options"
        isOpen={isPopupOpen}
        onOpen={() => dispatch(toggleVtipHistPopup())}
        onClose={() => dispatch(closeVtipHistPopup())}
    >

 
        <small className='font-semibold'>Select variable</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={parameterOptions}
            value={selectedParameter.displayText}
            onSelectValue={handleVariableChange}
            width="w-full"
        />


            <small className='font-semibold'>Select start Time</small>
            <div className="border-b border-b-gray-400"/>

            <ReactDatetimePicker
                onChange={handleStartTimeChange}
                value={vtipStartTime}
            />

            <small className='font-semibold'>Select end Time</small>
            <div className="border-b border-b-gray-400"/>
            <ReactDatetimePicker 
                onChange={handleEndTimeChange}
                value={vtipEndTime}
                minDate={vtipStartTime}
            />


        {/* Display data button */}
        <ButtonBorder
            onClick={handleSubmitPopupData}
            className='py-2 mt-2'
        >
            Display data
        </ButtonBorder>

    </OptionPopover>
  )
}

export default VtipHistPopup
