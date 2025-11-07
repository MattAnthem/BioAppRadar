import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { FlipVerticalIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import type { SelectOption } from '../../../shared/components/selects/types';
import { setHistTimeSevip, setSelectedHistSevipOption } from '../slice/histSevipPopup';
import { formatChartDateParam } from '../../../shared/utils/date_format';

type SevipPopupProps = {
    onSevipVariableChange?: (type: SelectOption) => void;
    onSevipTimeChange?: (time: string) => void;
}

const SevipPopup = ({ onSevipVariableChange, onSevipTimeChange }: SevipPopupProps) => {

    const { selectedVariable, availableVariables, histTimeSevip } = useAppSelector(state => state.hist_sevippopup);
    const dispatch = useAppDispatch();

    const handleSevipVaribleChange = (option: SelectOption) => {
        onSevipVariableChange?.(option);
        dispatch(setSelectedHistSevipOption(option))
    }

    const handleSevipTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const raw = evt.target.value; 
        const formatted = formatChartDateParam(raw);
        onSevipTimeChange?.(formatted);
        dispatch(setHistTimeSevip(formatted));
      }

  return (
    <OptionPopover
        hoverText='Vertical Integrated Profile Data'
        customIcon={<FlipVerticalIcon/>}   
    >

        <p>Select a variable</p>
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


    </OptionPopover>
  )
}

export default SevipPopup
