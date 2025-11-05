import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { FlipVerticalIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import type { SelectOption } from '../../../shared/components/selects/types';
import { setSelectedSevipOption } from '../slice/SevipPopupSlice';

type SevipPopupProps = {
    onSevipVariableChange?: (type: SelectOption) => void;
}

const SevipPopup = ({ onSevipVariableChange }: SevipPopupProps) => {

    const { selectedVariable, availableVariables } = useAppSelector(state => state.sevippopup);
    const dispatch = useAppDispatch();

    const handleSevipVaribleChange = (option: SelectOption) => {
        onSevipVariableChange?.(option);
        dispatch(setSelectedSevipOption(option))
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

    </OptionPopover>
  )
}

export default SevipPopup
