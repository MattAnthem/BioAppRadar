import ButtonBorder from "../../../../shared/components/buttons/borderedbtn/ButtonBorder"
import ReactDatetimePicker from "../../../../shared/components/input/ReactDatetime";
import OptionPopover from "../../../../shared/components/popups/option/OptionPopover"
import SimpleSelect from "../../../../shared/components/selects/SimpleSelect"
import type { SelectOption } from "../../../../shared/components/selects/types";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { closeVptsHistPopup, setSelectedVptsHistParameterOption, setVptsHistEndTime, setVptsHistStartTime, toggleVptsHistPopup } from "../../slices/vptsHistChartSlice";

type Props = {
    onSubmitPopup?: () => void;
}

const VptsHistPopup = ({onSubmitPopup}: Props) => {

    const { parameterOptions, selectedParameter, vptsStartTime, isPopupOpen, vptsEndTime } = useAppSelector(state => state.vpts_histchart);
    const dispatch = useAppDispatch();

    const handleStartTimeChange = (date: string) => {
        dispatch(setVptsHistStartTime(date));
    }
    
    const handleEndTimeChange = (date: string) => {
        dispatch(setVptsHistEndTime(date));
    }
    
    const handleVariableChange = (option: SelectOption) => {
        dispatch(setSelectedVptsHistParameterOption(option));
    }

    const handleSubmitPopupData = () => {
        onSubmitPopup?.();
        dispatch(closeVptsHistPopup())
    }

  return (
    <OptionPopover
        hoverText="Select Options"
        isOpen={isPopupOpen}
        onOpen={() => dispatch(toggleVptsHistPopup())}
        onClose={() => dispatch(closeVptsHistPopup())}
    >


          <small className="font-semibold">Select variable</small>
          <div className="border-b border-b-gray-400"/>
          <SimpleSelect
            options={parameterOptions}
            value={selectedParameter.displayText}
            onSelectValue={handleVariableChange}
            width="w-full"
          />



          <small className="font-semibold">Select start Time</small>
          <div className="border-b border-b-gray-400"/>
          <ReactDatetimePicker
            onChange={handleStartTimeChange}
            value={vptsStartTime}
          />

          <small className="font-semibold">Select end Time</small>
          <div className="border-b border-b-gray-400"/>
          <ReactDatetimePicker
            onChange={handleEndTimeChange}
            value={vptsEndTime}
            minDate={vptsStartTime}
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

export default VptsHistPopup
