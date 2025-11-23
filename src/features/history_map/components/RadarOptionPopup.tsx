import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { closeRadarPopup, setRadarEndTimeHist, setRadarStartTimeHist, setRadarTimeHist, setSelectedHistRadarParameter, setSelectedHistRadarType, toggleRadarPopup } from '../slice/histRadarPopupSlice';
import type { SelectOption } from '../../../shared/components/selects/types';
import { ImageIcon, ImagePlayIcon, RadarIcon } from 'lucide-react';
import { useEffect, useState, memo, useMemo, lazy } from 'react';
import { setRadarGifPayloadHist, setRadarPayloadHist } from '../slice/historyMapSlice';
import Tooltip from '../../../shared/components/popups/tooltip/Tooltip';
import { useVpTemporalCoverageQuery } from '../../../shared/hooks/useQuery/useVpTemporalCoverageQuery';
import { useTheme } from '../../../shared/hooks/useTheme';
import dayjs from 'dayjs';

const SimpleSelect = lazy(() => import('../../../shared/components/selects/SimpleSelect'));
const OptionPopover = lazy(() => import('../../../shared/components/popups/option/OptionPopover'));
const ButtonBorder = lazy(() => import('../../../shared/components/buttons/borderedbtn/ButtonBorder'));
const ReactDatetimePicker = lazy(() => import('../../../shared/components/input/ReactDatetime'));

const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const RadarOptionPopup = () => {
    // Themes 
    const themes = useTheme();
    const { active_border, active_text, border, hover } = themes.theme.displayTogglerBtn;


    // Redux read only states
    const { availableTypes, selectedType, availableParameters, selectedParameter, radarTimeHist, isPopupOpen, endTimeRadar, startTimeRadar, selectedSpecie, speciesOptions } = useAppSelector(state => state.hist_radarpopup);
    const dispatch = useAppDispatch();

    // --- Temporal coverages to restrict time selects ---
    const { data: temporal, isSuccess } = useVpTemporalCoverageQuery(1, {
        staleTime: 0,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        enabled: true,
    });
    const adjustedTimes = useMemo(() => {
        if (!temporal) return null;
      
        const fresh_end = dayjs(temporal.end_time).add(2, "hour").format("YYYY-MM-DD HH:mm:ss");
        const fresh_start = dayjs(fresh_end).subtract(1, "hour").format("YYYY-MM-DD HH:mm:ss");
      
        return { fresh_start, fresh_end };
    }, [temporal]);

    // --- Sync store to the temporal coverage ---
    useEffect(() => {

        if (!isSuccess || !adjustedTimes) return;

        dispatch(setRadarStartTimeHist(adjustedTimes.fresh_start));
        dispatch(setRadarEndTimeHist(adjustedTimes.fresh_end));
        dispatch(setRadarTimeHist(adjustedTimes.fresh_end));
        
    }, [adjustedTimes, dispatch, isSuccess])


    // --- Local state for the inputs
    const [locAvailableTypes, setLocAvailableTypes] = useState(availableTypes);
    const [locAvailableParams, setLocAvailableParams] = useState(availableParameters);
    const [locSelectedType, setLocSelectedType] = useState(selectedType);
    const [locSelectedParam, setLocSelectedParam] = useState(selectedParameter);
    const [locTime, setLocTime] = useState(radarTimeHist);
    const [locStartTime, setLocStartTime] = useState(startTimeRadar);
    const [locEndTime, setLocEndTime] = useState(endTimeRadar);
    const [overlayMode, setOverlayMode] = useState<'gif' | 'png'>('png');
    

    // --- Sync local states with redux state on mount or when the popup opens
    useEffect(() => {
        if (isPopupOpen) {
            setLocAvailableParams(availableParameters);
            setLocAvailableTypes(availableTypes);
            setLocSelectedType(selectedType);
            setLocSelectedParam(selectedParameter);
            setLocTime(radarTimeHist);
            setLocStartTime(startTimeRadar);
            setLocEndTime(endTimeRadar);
        }
    }, [availableParameters, availableTypes, endTimeRadar, isPopupOpen, radarTimeHist, selectedParameter, selectedType, startTimeRadar])


    // --- Toggle overlay mode handlers --- 
     const handleSetToPngMode = () => {
        setOverlayMode("png");
     }
     const handleSetToGifMode = () => {
        setOverlayMode("gif");
     }


    // -- Local input handlers (for edition: proper to this popup)
    const handleTypeChange = (type: SelectOption) => {
        setLocSelectedType(type)
    }
    const handleParamChange = (param: SelectOption) => {
        setLocSelectedParam(param);
    }
    const handleTimeChange = (date: string) => {
        setLocTime(date);
    }


    // --- popup toggle open/close --- 
    const handleTooglePopup = () => {
        dispatch(toggleRadarPopup())
    }
    const closePopup = () => {
        dispatch(closeRadarPopup());
    }

    // --- Gif animated handlers ---
    const handleGifStartTimeChange = (time: string) => {
        setLocStartTime(time);
        setLocEndTime(time);
    }
    const handleGifEndTimeChange = (time: string) => {
        setLocEndTime(time);
    }
    

    

    const handleSubmit = () => {
        if (overlayMode === 'png') {            
            dispatch(setRadarPayloadHist({
                type: locSelectedType.id as 'polar' | 'grid',
                parameter: locSelectedParam.id as string,
                time: locTime,
            }))
    
            // --- Update slice states ---
            dispatch(setRadarTimeHist(locTime));
            dispatch(setSelectedHistRadarParameter(locSelectedParam));
            dispatch(setSelectedHistRadarType(locSelectedType));
            
        } else if (overlayMode === 'gif') {
            dispatch(setRadarGifPayloadHist({
                type: locSelectedType.id as 'polar' | 'grid',
                parameter: locSelectedParam.id as string,
                startTime: locStartTime,
                endTime: locEndTime
            }));
            // -- update the slices
            dispatch(setRadarStartTimeHist(locStartTime));
            dispatch(setRadarEndTimeHist(locEndTime));
            dispatch(setSelectedHistRadarParameter(locSelectedParam));
            dispatch(setSelectedHistRadarType(locSelectedType));
        }

        dispatch(closeRadarPopup());
    }

  return (
    <OptionPopover
        hoverText='Radar Data'
        customIcon={<RadarIcon className={iconSize}/>}
        isOpen={isPopupOpen}
        onOpen={handleTooglePopup}
        onClose={closePopup}
    >

        {/* Display mode toggle */}
        <div className="w-full grid grid-cols-2 justify-start items-center gap-2">
                <Tooltip
                  display_condition={isPopupOpen}
                  position="bottom"
                  text="Display as image"
                >
                  <button 
                    aria-label='Display as PNG'
                    onClick={handleSetToPngMode} 
                    className={`
                        w-full flex gap-1 justify-center items-center 
                        px-2 py-0.5 cursor-pointer border-b-2 rounded-t-sm
                        ${overlayMode === 'png' ? `${active_border} ${active_text} font-semibold` : border} 
                        ${hover}
                      `}
                  >
                      <ImageIcon className="w-4"/>
                      <h1>PNG</h1>
                  </button>
                </Tooltip>

                <Tooltip
                  display_condition={isPopupOpen}
                  position="bottom"
                  text="Display as gif"
                >
                  <button 
                    aria-label='Display as GIF'
                    onClick={handleSetToGifMode} 
                    className={`
                        w-full flex gap-1 justify-center items-center 
                        px-2 py-0.5 cursor-pointer border-b-2 rounded-t-sm
                        ${overlayMode === 'gif' ? `${active_border} ${active_text} font-semibold` : border} 
                        ${hover}
                      `}
                    >
                      <ImagePlayIcon className="w-4"/>
                      <h1>GIF</h1>
                  </button>
                </Tooltip>
        </div>

        <div className="flex flex-col gap-0.5">
            <small className='font-semibold'>Specie</small>
            <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={speciesOptions}
            value={selectedSpecie.displayText}
            width='w-full'
            onSelectValue={() => {}}
            isDisabled
        />


        <div className="flex flex-col gap-0.5">
            <small className='font-semibold'>Projection type</small>
            <div className="border-b border-b-gray-400"/>
        </div>

        {/* Type Select */}
        <SimpleSelect
            options={locAvailableTypes}
            value={locSelectedType.displayText}
            width='w-full'
            onSelectValue={handleTypeChange}
        />
        
        <div className="flex flex-col gap-0.5">
            <small className='font-semibold'>Parameter</small>
            <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={locAvailableParams}
            value={locSelectedParam.displayText}
            width='w-full'
            onSelectValue={handleParamChange}
        />

        {/* time for still image */}
        {
            (overlayMode === 'png') && (
                <>
                    <div className="flex flex-col gap-0.5">
                        <small className='font-semibold'>Time</small>
                        <div className="border-b border-b-gray-400"/>
                    </div>
                    <ReactDatetimePicker
                        onChange={handleTimeChange}
                        value={locTime}
                        minDate={temporal?.start_time}
                        maxDate={temporal?.end_time}
                    />
                </>
            )
        }

        {/* Time range for a gif */}
        {
            (overlayMode === 'gif') && (
                <>
                {/* Start time for the gif */}
                <div className="flex flex-col gap-0.5">
                    <small className='font-semibold'>Start</small>
                    <div className="border-b border-b-gray-400"/>
                </div>
                <ReactDatetimePicker
                    onChange={handleGifStartTimeChange}
                    value={locStartTime}
                    minDate={temporal?.start_time}
                    maxDate={locEndTime}
                />

                {/* End time for the gif */}
                <div className="flex flex-col gap-0.5">
                    <small className='font-semibold'>End</small>
                    <div className="border-b border-b-gray-400"/>
                </div>
                <ReactDatetimePicker
                    onChange={handleGifEndTimeChange}
                    value={locEndTime}
                    minDate={locStartTime}
                    maxDate={temporal?.end_time}
                />
            </>
            )
        }


        {/* Display data  */}
        <ButtonBorder
            onClick={handleSubmit}
            className='py-2 mt-2'
            isPrimary
            ariaLabel='Display radar data on map'
        >
             Display data
        </ButtonBorder>

    </OptionPopover>
  )
}

export default memo(RadarOptionPopup);
