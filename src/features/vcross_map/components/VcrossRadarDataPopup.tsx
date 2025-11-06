import { RadarIcon } from "lucide-react"
import OptionPopover from "../../../shared/components/popups/option/OptionPopover"
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import type { SelectOption } from "../../../shared/components/selects/types";
import { setSelectedVcrossRadarParameter, setSelectedVcrossRadarTime, setSelectedVcrossRadarType } from "../slice/vcrossPopupSlice";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import { formatChartDateParam } from "../../../shared/utils/date_format";

type Props = {
    onChangeVcrossRadarType?: (type: SelectOption) => void;
    onChangeVcrossRadarParam?: (param: SelectOption) => void;
    onChangeVcrossRadarTime?: (time: string) => void;
}   

const VcrossRadarDataPopup = ({ onChangeVcrossRadarParam, onChangeVcrossRadarType, onChangeVcrossRadarTime }: Props) => {

    // Redux states
    const { availableRadarParameters, avalaibleRadarTypes, selectedRadarParameter, selectedRadarType, timeRadar } = useAppSelector(state => state.vcrosspopup);
    const dispatch = useAppDispatch();

    // handlers
    const handleRadarTypeChange = (type: SelectOption) => {
        dispatch(setSelectedVcrossRadarType(type));
        onChangeVcrossRadarType?.(type);
    }
    const handleRadarParamChange = (param: SelectOption) => {
        dispatch(setSelectedVcrossRadarParameter(param));
        onChangeVcrossRadarParam?.(param);
    }

    const handleRadarTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const raw = evt.target.value; 
        const formatted = formatChartDateParam(raw);
        dispatch(setSelectedVcrossRadarTime(formatted));
        onChangeVcrossRadarTime?.(formatted);
      }



  return (
    <OptionPopover
        hoverText="Select Radar Data"
        customIcon={<RadarIcon/>}
    >

        {/* Data */}
        <small>Available Radar data</small>
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
        <small>Select time</small>
        <div className="border-b border-b-gray-400"/>
        <input onChange={handleRadarTimeChange} value={timeRadar} step={1} className="w-full p-2 border rounded-sm" type="datetime-local" name="bioclassTime" id="bioclassTime" />


      
    </OptionPopover>
  )
}

export default VcrossRadarDataPopup;
