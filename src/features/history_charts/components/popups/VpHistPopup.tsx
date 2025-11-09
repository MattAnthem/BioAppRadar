import ButtonBorder from "../../../../shared/components/buttons/borderedbtn/ButtonBorder";
import OptionPopover from "../../../../shared/components/popups/option/OptionPopover";
import SimpleSelect from "../../../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../../../shared/components/selects/types";
import { formatChartDateParam } from "../../../../shared/utils/date_format";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { closeVpHistPopup, setSelectedVpHistParameterOption, setVpHistTime, toggleVpHistPopup } from "../../slices/vpHistChartSlice";

type Props = {
    onSubmitPopup?: () => void;
}
const VpHistPopup = ({ onSubmitPopup }:Props) => {

// Redux
  const { parameterOptions, selectedParameter, isPopupOpen, vpTime } = useAppSelector(state => state.vp_histchart);
  const dispatch = useAppDispatch()

  const handleDateChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const raw = evt.target.value; 
    const formatted =  formatChartDateParam(raw);

    console.log("FORMATTED ", formatted)
    dispatch(setVpHistTime(formatted))
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

                <div className="w-full">
                    <small>Select Variable</small>
                    <SimpleSelect
                      options={parameterOptions}
                      value={selectedParameter.displayText}
                      onSelectValue={handleVariableChange}
                      width="w-full"
                    />
                  </div>

                  <div className="w-full mb-2">
                    <small>Select Time</small>
                    <input onChange={handleDateChange} value={vpTime} step={1} className="w-full p-2 rounded-sm border" type="datetime-local" name="date" id="end-time" />
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

export default VpHistPopup
