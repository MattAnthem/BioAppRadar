import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setRadarEndTimeHist, setRadarStartTimeHist, setRadarTimeHist, setSelectedHistRadarParameter, setSelectedHistRadarType } from '../slice/histRadarPopupSlice';
import type { SelectOption } from '../../../shared/components/selects/types';
import { ImageIcon, ImagePlayIcon, RadarIcon } from 'lucide-react';
import { useEffect, useState, memo, lazy } from 'react';
import { setRadarGifPayloadHist, setRadarPayloadHist } from '../slice/historyMapSlice';
import Tooltip from '../../../shared/components/popups/tooltip/Tooltip';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useFreshDates } from '../../../shared/hooks/dates/useFreshDates';
import { useRadarPolarTemporalCov } from '../../../shared/hooks/useQuery/useRadarPolarTemporalCov';
import { useRadarGridTemporalCov } from '../../../shared/hooks/useQuery/useRadarGridTemporalCov';
import type { TemporalCovResponse } from '../../../api/endpoints/verical_profile/verticalProfilesAPI';
import { radar_options, radar_ParameterOptions, radar_TypeOptions } from '../../../shared/static/select-options';

const SimpleSelect = lazy(() => import('../../../shared/components/selects/SimpleSelect'));
const OptionPopover = lazy(() => import('../../../shared/components/popups/option/OptionPopover'));
const ButtonBorder = lazy(() => import('../../../shared/components/buttons/borderedbtn/ButtonBorder'));
const ReactDatetimePicker = lazy(() => import('../../../shared/components/input/ReactDatetime'));

const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const RadarOptionPopup = () => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Themes 
    const themes = useTheme();
    const { active_border, active_text, border, hover } = themes.theme.displayTogglerBtn;


    // Redux read only states
    const {  radarTimeHist, endTimeRadar, startTimeRadar, selectedParameter, selectedRadar, selectedType } = useAppSelector(state => state.hist_radarpopup);
    
    const dispatch = useAppDispatch();


    // --- Local state for the inputs
    const [locSelectedType, setLocSelectedType] = useState(radar_TypeOptions[0]);
    const [locSelectedParam, setLocSelectedParam] = useState(radar_ParameterOptions[0]);
    const [locSelectedRadar, setLocSelectedRadar] = useState(radar_options[0]);
    const [locTime, setLocTime] = useState('2020-11-10 12:00:33');
    const [locStartTime, setLocStartTime] = useState('2020-11-10 12:00:33');
    const [locEndTime, setLocEndTime] = useState('2020-11-10 12:50:00');
    const [overlayMode, setOverlayMode] = useState<'gif' | 'png'>('png');


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

    // --- Sync store to the temporal coverage ---
    useEffect(() => {

        if (!isSuccess || !adjustedTimes) return;

        dispatch(setRadarStartTimeHist(adjustedTimes.fresh_start));
        dispatch(setRadarEndTimeHist(adjustedTimes.fresh_end));
        dispatch(setRadarTimeHist(adjustedTimes.fresh_end));

        setLocTime(radarTimeHist);
        setLocStartTime(startTimeRadar);
        setLocEndTime(endTimeRadar);

    }, [adjustedTimes, dispatch, endTimeRadar, isSuccess, radarTimeHist, startTimeRadar])



    

    // --- Sync local states with redux state on mount or when the popup opens
    useEffect(() => {
        if (!isPopupOpen) return;
        setLocSelectedType(selectedType);
        setLocSelectedParam(selectedParameter);
        setLocSelectedRadar(selectedRadar);
    }, [isPopupOpen, selectedParameter, selectedRadar, selectedType]);


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
    const handleRadarChange = (radar: SelectOption) => {
        setLocSelectedRadar(radar);
    }


    // --- popup toggle open/close --- 
    const handleTooglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    }
    const closePopup = () => {
        setIsPopupOpen(false);
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
                radarID: Number(locSelectedRadar.id),
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
                endTime: locEndTime,
                radarID: Number(locSelectedRadar.id),
            }));
            // -- update the slices
            dispatch(setRadarStartTimeHist(locStartTime));
            dispatch(setRadarEndTimeHist(locEndTime));
            dispatch(setSelectedHistRadarParameter(locSelectedParam));
            dispatch(setSelectedHistRadarType(locSelectedType));
        }

        setIsPopupOpen(false);
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

        <div className="flex flex-col gap-0.5">
            <small className='font-semibold'>Projection type</small>
            <div className="border-b border-b-gray-400"/>
        </div>

        {/* Type Select */}
        <SimpleSelect
            options={radar_TypeOptions}
            value={locSelectedType.displayText}
            width='w-full'
            onSelectValue={handleTypeChange}
        />
        
        <div className="flex flex-col gap-0.5">
            <small className='font-semibold'>Parameter</small>
            <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={radar_ParameterOptions}
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
                        maxDate={adjustedTimes?.fresh_end}
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
                    maxDate={adjustedTimes?.fresh_end}
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
                    maxDate={adjustedTimes?.fresh_end}
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
