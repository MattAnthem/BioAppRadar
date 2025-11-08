import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { FlipVerticalIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import type { SelectOption } from '../../../shared/components/selects/types';
import { closeSevipPopup, setHistTimeSevip, setSelectedHistSevipOption, toggleSevipPopup } from '../slice/histSevipPopup';
import { formatChartDateParam } from '../../../shared/utils/date_format';
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder';

type SevipPopupProps = {
    onSubmitPopup?: () => void;
}

const SevipPopup = ({ onSubmitPopup }: SevipPopupProps) => {

    const { selectedVariable, availableVariables, histTimeSevip, isPopupOpen } = useAppSelector(state => state.hist_sevippopup);
    const dispatch = useAppDispatch();

    const handleSevipVaribleChange = (option: SelectOption) => {
        dispatch(setSelectedHistSevipOption(option))
    }

    const handleSevipTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const raw = evt.target.value; 
        const formatted = formatChartDateParam(raw);
        dispatch(setHistTimeSevip(formatted));
    }

    const handleSubmit = () => {
        onSubmitPopup?.();
        dispatch(closeSevipPopup())
    }

  return (
    <OptionPopover
        hoverText='Vertical Integrated Profile Data'
        customIcon={<FlipVerticalIcon/>}   
        isOpen={isPopupOpen}
        onOpen={() => dispatch(toggleSevipPopup())}
        onClose={() => dispatch(closeSevipPopup())}
    >

        <small>Select a variable</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={availableVariables}
            value={selectedVariable.displayText}
            width='w-95'
            onSelectValue={handleSevipVaribleChange}
        />

        {/* Time */}
        <small>Select time</small>
        <div className="border-b border-b-gray-400"/>
        <input onChange={handleSevipTimeChange} value={histTimeSevip} step={1} className="w-full p-2 border rounded-sm" type="datetime-local" name="sevipHistTime" id="sevipHistTime" />

        {/* Display data button */}
        <ButtonBorder
            onClick={handleSubmit}
            className='py-2 mt-2'
        >
             Display data
        </ButtonBorder>

    </OptionPopover>
  )
}

export default SevipPopup;
