import { RadarIcon } from "lucide-react"
import OptionPopover from "../../../shared/components/popups/option/OptionPopover"
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import type { SelectOption } from "../../../shared/components/selects/types";
import { closeVcrossRadarPopup, setSelectedVcrossRadarParameter, setSelectedVcrossRadarTime, setSelectedVcrossRadarType, toggleVcrossRadarPopup } from "../slice/vcrossPopupSlice";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import { formatChartDateParam } from "../../../shared/utils/date_format";
import ButtonBorder from "../../../shared/components/buttons/borderedbtn/ButtonBorder";

type Props = {
    onSubmitPopup?: () => void;
}   


const VcrossRadarDataPopup = ({ onSubmitPopup }: Props) => {

    // Redux states
    const {  availableRadarParameters, avalaibleRadarTypes, selectedRadarParameter, selectedRadarType, timeRadar, isRadarPopupOpen } = useAppSelector(state => state.vcrosspopup);
    const dispatch = useAppDispatch();

    // handlers
    const handleRadarTypeChange = (type: SelectOption) => {
        dispatch(setSelectedVcrossRadarType(type));
    }
    const handleRadarParamChange = (param: SelectOption) => {
        dispatch(setSelectedVcrossRadarParameter(param));
    }

    const handleRadarTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const raw = evt.target.value; 
        const formatted = formatChartDateParam(raw);
        dispatch(setSelectedVcrossRadarTime(formatted));
    }


    const handleSubmitPopup = () => {
        dispatch(closeVcrossRadarPopup());
        onSubmitPopup?.();
    }
  

  return (
    <OptionPopover
        hoverText="Select Radar Data"
        customIcon={<RadarIcon className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4"/>}
        isOpen={isRadarPopupOpen}
        onClose={() => dispatch(closeVcrossRadarPopup())}
        onOpen={() => dispatch(toggleVcrossRadarPopup())}
    >

        {/* Data */}
        <small className="font-semibold">Available Radar data</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={avalaibleRadarTypes}
            onSelectValue={handleRadarTypeChange}
            width="w-95"
            value={selectedRadarType.displayText}
        />
        <SimpleSelect
            options={availableRadarParameters}
            onSelectValue={handleRadarParamChange}
            width="w-95"
            value={selectedRadarParameter.displayText}
        />

        {/* Time */}
        <small className="font-semibold">Select time</small>
        <div className="border-b border-b-gray-400"/>
        <input onChange={handleRadarTimeChange} value={timeRadar} step={1} className="w-full p-2 border rounded-sm" type="datetime-local" name="bioclassTime" id="bioclassTime" />

        <ButtonBorder
            onClick={handleSubmitPopup}
            className="p-2 mt-2"
        >

            Display Data

        </ButtonBorder>
      
    </OptionPopover>
  )
}

export default VcrossRadarDataPopup;
