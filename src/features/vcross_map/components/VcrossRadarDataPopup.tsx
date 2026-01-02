import { RadarIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import type { SelectOption } from "../../../shared/components/selects/types";
import { setSelectedVcrossRadarParameter, setSelectedVcrossRadarTime, setSelectedVcrossRadarType, setVcrossRadarSegment } from "../slice/vcrossPopupSlice";
import { useEffect, useState, memo, lazy } from "react";
import { setOverlayRadarPayload, setVcrossRadarPayload } from "../slice/vcrossMapSlice";
import type { TemporalCovResponse } from "../../../api/endpoints/verical_profile/verticalProfilesAPI";
import { useRadarPolarTemporalCov } from "../../../shared/hooks/useQuery/useRadarPolarTemporalCov";
import { useRadarGridTemporalCov } from "../../../shared/hooks/useQuery/useRadarGridTemporalCov";
import { useFreshDates } from "../../../shared/hooks/dates/useFreshDates";
import { radar_options, radar_ParameterOptions, radar_TypeOptions } from "../../../shared/static/select-options";

const OptionPopover = lazy(() => import('../../../shared/components/popups/option/OptionPopover'));
const SimpleSelect = lazy(() => import('../../../shared/components/selects/SimpleSelect'));
const ButtonBorder = lazy(() => import('../../../shared/components/buttons/borderedbtn/ButtonBorder'));
const ReactDatetimePicker = lazy(() => import('../../../shared/components/input/ReactDatetime'));

const VcrossRadarDataPopup = () => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const dispatch = useAppDispatch();
    // Redux states (read only)
    const {  availableRadarParameters, avalaibleRadarTypes, selectedRadarParameter, selectedRadarType, timeRadar, segmentRadar} = useAppSelector(state => state.vcrosspopup);
    
    // Local states for input changes
    const [locSelectedType, setLocSelectedType] = useState(radar_TypeOptions[0]);
    const [locSelectedParam, setLocSelectedParam] = useState(radar_ParameterOptions[0]);
    const [locSegment, setLocSegment] = useState(false);
    const [locTime, setLocTime] = useState(timeRadar);
    const [locSelectedRadar, setLocSelectedRadar] = useState(radar_options[0]);


    let temporal: TemporalCovResponse | undefined;
    let isSuccess = false;

    // --- Temporal coverages to restrict time selects (polar) ---
    const { data: temporalPolar, isSuccess: isSuccessPolar } = useRadarPolarTemporalCov(1, {
        staleTime: 0,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        enabled: locSelectedType.id === 'polar',
    });

    // --- temporal coverage Grid ---
    const { data: temporalGrid, isSuccess: isSuccessGrid } = useRadarGridTemporalCov(1, {
        staleTime: 0,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        enabled: locSelectedType.id === 'grid',
    });

    switch (locSelectedType.id) {
        case 'polar':
            temporal = temporalPolar;
            isSuccess = isSuccessPolar;
            break;
        case 'grid':
            temporal = temporalGrid;
            isSuccess = isSuccessGrid;
            break;
    }

        // always use the latest time (1hour past)
    const { adjustedStartEndTime: adjustedTimes } = useFreshDates(temporal);
    useEffect(() => {

        if (!isSuccess || !adjustedTimes) return;


        dispatch(setSelectedVcrossRadarTime(adjustedTimes.fresh_end));

        setLocTime(timeRadar);

    }, [isSuccess, adjustedTimes, dispatch, timeRadar]);


    //  --- Sync with Redux ---
    useEffect(() => {
        if (isPopupOpen) {
            setLocSelectedType(selectedRadarType);
            setLocSelectedParam(selectedRadarParameter);
            setLocSegment(segmentRadar);
        }
    }, [availableRadarParameters, avalaibleRadarTypes, isPopupOpen, segmentRadar, selectedRadarParameter, selectedRadarType])

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

    const handleRadarChange = (radar: SelectOption) => {
        setLocSelectedRadar(radar);
    }

    // --- popup controls ---
    const handleTooglePopup = () => {
        setIsPopupOpen(!isPopupOpen)
    }

    const closePopup = () => {
        setIsPopupOpen(false)
    }
    
    



    const handleSubmitPopup = () => {
        console.log('radar id selected:', locSelectedRadar.id);
        // Dispatch popup option to the heatmap
        dispatch(setVcrossRadarPayload({
            type: locSelectedType.id as 'polar' | 'grid',
            parameter: locSelectedParam.id as string,
            time: locTime,
            segment: locSegment,
            radarID: locSelectedRadar.id as number,
        }));
        // Dispatch popup data to Leaflet map
        dispatch(setOverlayRadarPayload({
            time: locTime,
            type: locSelectedType.id as 'polar' | 'grid',
            parameter: locSelectedParam.id as string,
            radarID: locSelectedRadar.id as number,
        }))

        // --- Update slice ---
        dispatch(setSelectedVcrossRadarType(locSelectedType));
        dispatch(setSelectedVcrossRadarParameter(locSelectedParam));
        dispatch(setSelectedVcrossRadarTime(locTime));
        dispatch(setVcrossRadarSegment(locSegment));

        // --- Close on submit ---
        setIsPopupOpen(false);
    }
  

  return (
    <OptionPopover
        hoverText="Select Radar Data"
        customIcon={<RadarIcon className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4"/>}
        isOpen={isPopupOpen}
        onClose={closePopup}
        onOpen={handleTooglePopup}
    >
        {/* Radar select */}
        <div className="flex flex-col gap-0.5">
            <small className='font-semibold'>Radar ID</small>
            <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={radar_options}
            value={locSelectedRadar.displayText}
            width='w-full'
            onSelectValue={handleRadarChange}
        />

        {/* Data */}
        <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>Projection type</small>
              <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={radar_TypeOptions}
            onSelectValue={handleRadarTypeChange}
            width="w-full"
            value={locSelectedType.displayText}
        />
        <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>Variable</small>
              <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={radar_ParameterOptions}
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
            ariaLabel="Display Radar Data on map"
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
