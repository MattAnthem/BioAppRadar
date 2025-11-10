import SimpleSelect from '../../../../shared/components/selects/SimpleSelect'
import ButtonBorder from '../../../../shared/components/buttons/borderedbtn/ButtonBorder'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { closeVtipHistPopup, setSelectedVtipHistParameterOption, setVtipHistEndTime, setVtipHistStartTime, toggleVtipHistPopup } from '../../slices/vtipHistChartSlice';
import type { SelectOption } from '../../../../shared/components/selects/types';
import OptionPopover from '../../../../shared/components/popups/option/OptionPopover';
import { useKigaliDate } from '../../../../shared/hooks/dates/useKigaliDate';

type Props = {
    onSubmitPopup?: () => void;
}

const VtipHistPopup = ({ onSubmitPopup }:Props) => {
    const { parameterOptions, selectedParameter, vtipStartTime, vtipEndTime, isPopupOpen } = useAppSelector(state => state.vtip_histchart);
    const dispatch = useAppDispatch()

    // Format the input values to locale Kigali
    const { toInputValue, formatInputValue } = useKigaliDate();

    const handleStartTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const raw = evt.target.value; 
        const formatted = formatInputValue(raw);
        dispatch(setVtipHistEndTime(formatted));
        dispatch(setVtipHistStartTime(formatted));
    }
    
    const handleEndTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const raw = evt.target.value; 
        const formatted = formatInputValue(raw);
        dispatch(setVtipHistEndTime(formatted));
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

        <div className="w-ful">
        <small>Select variable</small>
        <SimpleSelect
            options={parameterOptions}
            value={selectedParameter.displayText}
            onSelectValue={handleVariableChange}
            width="w-full"
        />
        </div>

        <div className="w-full mb-2 flex flex-col">
            <small>Select start Time</small>
            <input 
                onChange={handleStartTimeChange} 
                value={toInputValue(vtipStartTime)} 
                step={1} 
                className="w-full p-2 mb-2 rounded-sm border" 
                type="datetime-local" 
                name="date" 
                id="start-time-vtiph" 
                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
            />
            <small>Select end Time</small>
            <input 
                min={toInputValue(vtipStartTime)} 
                onChange={handleEndTimeChange} 
                value={toInputValue(vtipEndTime)} 
                step={1} 
                className="w-full p-2 rounded-sm border" 
                type="datetime-local" 
                name="date" 
                id="end-time-vtiph" 
                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
            />
        </div>


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
