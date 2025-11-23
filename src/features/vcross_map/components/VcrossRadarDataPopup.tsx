import { RadarIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import type { SelectOption } from "../../../shared/components/selects/types";
import { closeVcrossRadarPopup, setSelectedVcrossRadarParameter, setSelectedVcrossRadarTime, setSelectedVcrossRadarType, setVcrossRadarSegment, toggleVcrossRadarPopup } from "../slice/vcrossPopupSlice";
import { useEffect, useState, memo, lazy } from "react";
import { setOverlayRadarPayload, setVcrossRadarPayload } from "../slice/vcrossMapSlice";

const OptionPopover = lazy(() => import('../../../shared/components/popups/option/OptionPopover'));
const SimpleSelect = lazy(() => import('../../../shared/components/selects/SimpleSelect'));
const ButtonBorder = lazy(() => import('../../../shared/components/buttons/borderedbtn/ButtonBorder'));
const ReactDatetimePicker = lazy(() => import('../../../shared/components/input/ReactDatetime'));

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
        <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>Projection type</small>
              <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={locAvailableTypes}
            onSelectValue={handleRadarTypeChange}
            width="w-full"
            value={locSelectedType.displayText}
        />
        <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>Variable</small>
              <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={locAvailableParams}
            onSelectValue={handleRadarParamChange}
            width="w-full"
            value={locSelectedParam.displayText}
        />

        {/* Segment */}
        <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>Segment</small>
              <div className="border-b border-b-gray-400"/>
        </div>
        <div className="w-full flex px-2 space-x-2 justify-start items-center">
            <input type="checkbox" checked={locSegment} onChange={handleToggleRadarSegment} name="segment-radar-vcross" id="segm_radar_vcross" />
            <small>Toggle on/off segment</small>
        </div>

        {/* Time */}
        <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>Time</small>
              <div className="border-b border-b-gray-400"/>
        </div>

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
