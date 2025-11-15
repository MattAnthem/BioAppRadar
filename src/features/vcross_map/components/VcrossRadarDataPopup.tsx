import { RadarIcon } from "lucide-react"
import OptionPopover from "../../../shared/components/popups/option/OptionPopover"
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import type { SelectOption } from "../../../shared/components/selects/types";
import { closeVcrossRadarPopup, setSelectedVcrossRadarParameter, setSelectedVcrossRadarTime, setSelectedVcrossRadarType, setVcrossRadarSegment, toggleVcrossRadarPopup } from "../slice/vcrossPopupSlice";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import ButtonBorder from "../../../shared/components/buttons/borderedbtn/ButtonBorder";
import ReactDatetimePicker from "../../../shared/components/input/ReactDatetime";
import { useEffect, useState, memo } from "react";
import { setOverlayRadarPayload, setVcrossRadarPayload } from "../slice/vcrossMapSlice";


const VcrossRadarDataPopup = () => {

    // Redux states (read only)
    const {  availableRadarParameters, avalaibleRadarTypes, selectedRadarParameter, selectedRadarType, timeRadar, isRadarPopupOpen, segmentRadar } = useAppSelector(state => state.vcrosspopup);
    
    // Local states for input changes
    const [locAvailableParams, setLocAvailableParams] = useState(availableRadarParameters);
    const [locAvailableTypes, setLocAvailableTypes] = useState(avalaibleRadarTypes);
    const [locSelectedType, setLocSelectedType] = useState(selectedRadarType);
    const [locSelectedParam, setLocSelectedParam] = useState(selectedRadarParameter);
    const [locSegment, setLocSegment] = useState(segmentRadar);
    const [locTime, setLocTime] = useState(timeRadar);


    //  --- Sync with Redux ---
    useEffect(() => {
        if (isRadarPopupOpen) {
            setLocAvailableParams(availableRadarParameters);
            setLocAvailableTypes(avalaibleRadarTypes);
            setLocSelectedType(selectedRadarType);
            setLocSelectedParam(selectedRadarParameter);
            setLocSegment(segmentRadar);
            setLocTime(timeRadar)
        }
    }, [availableRadarParameters, avalaibleRadarTypes, isRadarPopupOpen, segmentRadar, selectedRadarParameter, selectedRadarType, timeRadar])

    //  --- Local input handlers ---
    const handleRadarTypeChange = (type: SelectOption) => {
        setLocSelectedType(type);
    }

    const handleRadarParamChange = (param: SelectOption) => {
        setLocSelectedParam(param);
    }

    const handleRadarTimeChange = (time: string) => {
        setLocTime(time);
    }

    const handleToggleRadarSegment = () => {
        setLocSegment(!locSegment);
    }

    // --- popup controls ---
    const handleTooglePopup = () => {
        dispatch(toggleVcrossRadarPopup())
      }
      const closePopup = () => {
        dispatch(dispatch(closeVcrossRadarPopup()));
      }
    
    const dispatch = useAppDispatch();



    const handleSubmitPopup = () => {
        // Dispatch popup option to the heatmap
        dispatch(setVcrossRadarPayload({
            type: locSelectedType.id as 'polar' | 'grid',
            parameter: locSelectedParam.id as string,
            time: locTime,
            segment: locSegment
        }));
        // Dispatch popup data to Leaflet map
        dispatch(setOverlayRadarPayload({
            time: locTime,
            type: locSelectedType.id as 'polar' | 'grid',
            parameter: locSelectedParam.id as string,
        }))

        // --- Update slice ---
        dispatch(setSelectedVcrossRadarType(locSelectedType));
        dispatch(setSelectedVcrossRadarParameter(locSelectedParam));
        dispatch(setSelectedVcrossRadarTime(locTime));
        dispatch(setVcrossRadarSegment(locSegment));

        // --- Close on submit ---
        dispatch(closeVcrossRadarPopup());
    }
  

  return (
    <OptionPopover
        hoverText="Select Radar Data"
        customIcon={<RadarIcon className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4"/>}
        isOpen={isRadarPopupOpen}
        onClose={closePopup}
        onOpen={handleTooglePopup}
    >

        {/* Data */}
        <small className="font-semibold">Select projection type</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={locAvailableTypes}
            onSelectValue={handleRadarTypeChange}
            width="w-95"
            value={locSelectedType.displayText}
        />
        <small className="font-semibold">Select a variable</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={locAvailableParams}
            onSelectValue={handleRadarParamChange}
            width="w-95"
            value={locSelectedParam.displayText}
        />

        {/* Segment */}
        <small className="font-semibold">Segment</small>
        <div className="border-b border-b-gray-400"/>
        <div className="w-full flex px-2 space-x-2 justify-start items-center">
            <input type="checkbox" checked={locSegment} onChange={handleToggleRadarSegment} name="segment-radar-vcross" id="segm_radar_vcross" />
            <small>Toggle on/off segment</small>
        </div>

        {/* Time */}
        <small className="font-semibold">Select time</small>
        <div className="border-b border-b-gray-400"/>

        <ReactDatetimePicker
            onChange={handleRadarTimeChange}
            value={locTime}
        />

        <ButtonBorder
            onClick={handleSubmitPopup}
            className="p-2 mt-2"
            isPrimary
        >

            Display Data

        </ButtonBorder>
      
    </OptionPopover>
  )
}

export default memo(VcrossRadarDataPopup);
