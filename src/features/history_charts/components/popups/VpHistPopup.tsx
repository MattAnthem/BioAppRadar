import ButtonBorder from "../../../../shared/components/buttons/borderedbtn/ButtonBorder";
import ReactDatetimePicker from "../../../../shared/components/input/ReactDatetime";
import OptionPopover from "../../../../shared/components/popups/option/OptionPopover";
import SimpleSelect from "../../../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../../../shared/components/selects/types";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { closeVpHistPopup, setSelectedVpHistParameterOption, setVpHistTime, toggleVpHistPopup } from "../../slices/vpHistChartSlice";

type Props = {
    onSubmitPopup?: () => void;
}
const VpHistPopup = ({ onSubmitPopup }:Props) => {

// Redux
  const { parameterOptions, selectedParameter, isPopupOpen, vpTime } = useAppSelector(state => state.vp_histchart);
  const dispatch = useAppDispatch()

  const handleDateChange = (date: string) => {
    dispatch(setVpHistTime(date))
  }

  const handleVariableChange = (option: SelectOption) => {
    dispatch(setSelectedVpHistParameterOption(option));
  }

  const handleSubmitPopupData = () => {
    onSubmitPopup?.();
    dispatch(closeVpHistPopup())
    }
  return (
    <OptionPopover
         hoverText="Select Options"
         isOpen={isPopupOpen}
         onOpen={() => dispatch(toggleVpHistPopup())}
         onClose={() => dispatch(closeVpHistPopup())}
    >


                    <small className="font-semibold">Select Variable</small>
                    <div className="border-b border-b-gray-400"/>
                    <SimpleSelect
                      options={parameterOptions}
                      value={selectedParameter.displayText}
                      onSelectValue={handleVariableChange}
                      width="w-full"
                    />


                    <small className="font-semibold">Select Time</small>
                    <div className="border-b border-b-gray-400"/>
                    <ReactDatetimePicker
                      onChange={handleDateChange}
                      value={vpTime}
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

export default VpHistPopup
