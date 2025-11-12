import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { FlipVerticalIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import type { SelectOption } from '../../../shared/components/selects/types';
import { closeSevipPopup, setHistTimeSevip, setSelectedHistSevipOption, toggleSevipPopup } from '../slice/histSevipPopup';
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder';
import  ReactDatetimePicker  from '../../../shared/components/input/ReactDatetime';

type SevipPopupProps = {
    onSubmitPopup?: () => void;
}

const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const SevipPopup = ({ onSubmitPopup }: SevipPopupProps) => {

    const { selectedVariable, availableVariables, histTimeSevip, isPopupOpen } = useAppSelector(state => state.hist_sevippopup);
    const dispatch = useAppDispatch();

    const handleSevipVaribleChange = (option: SelectOption) => {
        dispatch(setSelectedHistSevipOption(option))
    }

    const handleSevipTimeChange = (time: string) => {
        console.log('PICKED TIME ', time)
        dispatch(setHistTimeSevip(time));
    }

    const handleSubmit = () => {
        onSubmitPopup?.();
        dispatch(closeSevipPopup())
    }

  return (
    <OptionPopover
        hoverText='Vertical Integrated Profile Data'
        customIcon={<FlipVerticalIcon className={iconSize}/>}   
        isOpen={isPopupOpen}
        onOpen={() => dispatch(toggleSevipPopup())}
        onClose={() => dispatch(closeSevipPopup())}
    >

        <small className='font-semibold'>Select a variable</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={availableVariables}
            value={selectedVariable.displayText}
            width='w-95'
            onSelectValue={handleSevipVaribleChange}
        />

        {/* Time */}
        <small className='font-semibold'>Select time</small>
        <div className="border-b border-b-gray-400"/>
        <ReactDatetimePicker
            onChange={handleSevipTimeChange}
            value={histTimeSevip}
        />

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
