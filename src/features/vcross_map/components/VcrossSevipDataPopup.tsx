import { FlipHorizontal } from 'lucide-react';
import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { closeVcrossSevipPopup, setSelectedVcrossSevipVariable, setVcrossSevipTime, toggleVcrossSevipPopup } from '../slice/vcrossPopupSlice';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import type { SelectOption } from '../../../shared/components/selects/types';
import ReactDatetimePicker from '../../../shared/components/input/ReactDatetime';
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder';

type Props = {
  onSubmitPopup?: () => void;
}

const VcrossSevipDataPopup = ({ onSubmitPopup }:Props) => {

  const { sevipTime, sevipVariables, selectedSevipVar, isSevipPopupOpen } = useAppSelector(state => state.vcrosspopup);
  const dispatch = useAppDispatch();


  const handleVariableChange = (variable: SelectOption) => {
    dispatch(setSelectedVcrossSevipVariable(variable));
  }

  const handleTimeChange = (date: string) => {
    dispatch(setVcrossSevipTime(date));
  }

  const handleSubmitPopup = () => {
    dispatch(closeVcrossSevipPopup());
    onSubmitPopup?.();
  }

  return (
    <OptionPopover
      isOpen={isSevipPopupOpen}
      onClose={() => dispatch(closeVcrossSevipPopup())}
      onOpen={() => dispatch(toggleVcrossSevipPopup())}
      customIcon={<FlipHorizontal className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4"/>}
      hoverText='Vertical Integrated Profile Data'
    >

      {/* Variable */}
      <small className="font-semibold">Select a variable</small>
      <div className="border-b border-b-gray-400"/>
      <SimpleSelect
        onSelectValue={handleVariableChange}
        options={sevipVariables}
        width='w-95'
        value={selectedSevipVar.displayText}
      />

      {/* Time */}
      <small className="font-semibold">Select time</small>
      <div className="border-b border-b-gray-400"/>
      <ReactDatetimePicker
        value={sevipTime}
        onChange={handleTimeChange}
      />

      <ButtonBorder
            onClick={handleSubmitPopup}
            className="p-2 mt-2"
      >

            Display Data

      </ButtonBorder>

    </OptionPopover>
  )
}

export default VcrossSevipDataPopup
