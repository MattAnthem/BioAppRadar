import { RadarIcon } from "lucide-react"
import OptionPopover from "../../../shared/components/popups/option/OptionPopover"
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import type { SelectOption } from "../../../shared/components/selects/types";
import { closeVcrossRadarPopup, setSelectedVcrossRadarParameter, setSelectedVcrossRadarTime, setSelectedVcrossRadarType, toggleVcrossRadarPopup, toggleVcrossRadarSegment } from "../slice/vcrossPopupSlice";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import ButtonBorder from "../../../shared/components/buttons/borderedbtn/ButtonBorder";
import ReactDatetimePicker from "../../../shared/components/input/ReactDatetime";

type Props = {
    onSubmitPopup?: () => void;
}   


const VcrossRadarDataPopup = ({ onSubmitPopup }: Props) => {

    // Redux states
    const {  availableRadarParameters, avalaibleRadarTypes, selectedRadarParameter, selectedRadarType, timeRadar, isRadarPopupOpen, segmentRadar } = useAppSelector(state => state.vcrosspopup);
    const dispatch = useAppDispatch();

    // handlers
    const handleRadarTypeChange = (type: SelectOption) => {
        dispatch(setSelectedVcrossRadarType(type));
    }
    const handleRadarParamChange = (param: SelectOption) => {
        dispatch(setSelectedVcrossRadarParameter(param));
    }

    const handleRadarTimeChange = (date: string) => {
        dispatch(setSelectedVcrossRadarTime(date));
    }

    const handleToggleRadarSegment = () => {
        dispatch(toggleVcrossRadarSegment())
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

        {/* Segment */}
        <small className="font-semibold">Segment</small>
        <div className="border-b border-b-gray-400"/>
        <div className="w-full flex px-2 space-x-2 justify-start items-center">
            <input type="checkbox" checked={segmentRadar} onChange={handleToggleRadarSegment} name="segment-radar-vcross" id="segm_radar_vcross" />
            <small>Toggle on/off segment</small>
        </div>

        {/* Time */}
        <small className="font-semibold">Select time</small>
        <div className="border-b border-b-gray-400"/>

        <ReactDatetimePicker
            onChange={handleRadarTimeChange}
            value={timeRadar}
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

export default VcrossRadarDataPopup;
