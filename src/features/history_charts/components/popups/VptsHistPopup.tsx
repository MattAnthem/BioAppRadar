import ButtonBorder from "../../../../shared/components/buttons/borderedbtn/ButtonBorder"
import OptionPopover from "../../../../shared/components/popups/option/OptionPopover"
import SimpleSelect from "../../../../shared/components/selects/SimpleSelect"
import type { SelectOption } from "../../../../shared/components/selects/types";
import { formatChartDateParam } from "../../../../shared/utils/date_format";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { closeVptsHistPopup, setSelectedVptsHistParameterOption, setVptsHistEndTime, setVptsHistStartTime, toggleVptsHistPopup } from "../../slices/vptsHistChartSlice";

type Props = {
    onSubmitPopup?: () => void;
}

const VptsHistPopup = ({onSubmitPopup}: Props) => {

    const { parameterOptions, selectedParameter, vptsStartTime, isPopupOpen, vptsEndTime } = useAppSelector(state => state.vpts_histchart);
    const dispatch = useAppDispatch();

    const handleStartTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const raw = evt.target.value; 
        const formatted = formatChartDateParam(raw);
        dispatch(setVptsHistEndTime(formatted));
        dispatch(setVptsHistStartTime(formatted));
    }
    
    const handleEndTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const raw = evt.target.value; 
        const formatted = formatChartDateParam(raw);
        dispatch(setVptsHistEndTime(formatted));
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
                      <input max={vptsEndTime} onChange={handleStartTimeChange} value={vptsStartTime} step={1} className="w-full p-2 mb-2 rounded-sm border" type="datetime-local" name="date" id="start-time" />
                      <small>Select end Time</small>
                      <input min={vptsStartTime} onChange={handleEndTimeChange} value={vptsEndTime} step={1} className="w-full p-2 rounded-sm border" type="datetime-local" name="date" id="end-time" />
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

export default VptsHistPopup
