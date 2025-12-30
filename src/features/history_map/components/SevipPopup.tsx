import { FlipHorizontal, ImageIcon, ImagePlayIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { SelectOption } from '../../../shared/components/selects/types';
import { setHistSevipTimeEnd, setHistSevipTimeStart, setHistTimeSevip, setSelectedHistSevipOption } from '../slice/histSevipPopup';
import { useEffect, useState, memo, lazy } from 'react';
import { setSevipGifPayloadHist, setSevipPayloadHist } from '../slice/historyMapSlice';
import Tooltip from '../../../shared/components/popups/tooltip/Tooltip';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useFreshDates } from '../../../shared/hooks/dates/useFreshDates';
import { useSevipTemporalCovQuery } from '../../../shared/hooks/useQuery/useSevipTemporalCovQuery';

const OptionPopover = lazy(() => import('../../../shared/components/popups/option/OptionPopover'));
const SimpleSelect = lazy(() => import('../../../shared/components/selects/SimpleSelect'));
const ButtonBorder = lazy(() => import('../../../shared/components/buttons/borderedbtn/ButtonBorder'));
const ReactDatetimePicker = lazy(() => import('../../../shared/components/input/ReactDatetime'));



const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const SevipPopup = () => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Themes 
    const themes = useTheme();
    const { active_border, active_text, border, hover } = themes.theme.displayTogglerBtn;

    // --- Read only redux states ---
    const { selectedVariable, availableVariables, histTimeSevip, startTimeSevip, endTimeSevip, selectedSpecie, speciesOptions, radars, selectedRadar } = useAppSelector(state => state.hist_sevippopup);

    const dispatch = useAppDispatch();

    // --- Temporal coverages to restrict time selects ---
    const { data: temporal, isSuccess } = useSevipTemporalCovQuery(selectedRadar.id as number, {
        staleTime: 0,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        enabled: true,
    });

    const { adjustedStartEndTime: adjustedTimes } = useFreshDates(temporal);

    // --- Sync store to the temporal coverage ---
    useEffect(() => {
 
        if (!isSuccess || !adjustedTimes) return;

        dispatch(setHistSevipTimeStart(adjustedTimes.fresh_start));
        dispatch(setHistSevipTimeEnd(adjustedTimes.fresh_end));
        dispatch(setHistTimeSevip(adjustedTimes.fresh_end));

        dispatch(setSevipPayloadHist({
            time: adjustedTimes.fresh_end,
            startTime: adjustedTimes.fresh_start,
            endTime: adjustedTimes.fresh_end,
        }));

    }, [adjustedTimes, dispatch, isSuccess])

    // --- Local states for the inputs ---
    const [locAvailableVars, setLocAvailableVars] = useState(availableVariables);
    const [locSelectedVar, setLocSelectedVar] = useState(selectedVariable);
    const [locRadars, setLocRadars] = useState(radars);
    const [locSelectedRadar, setLocSelectedRadar] = useState(selectedRadar);
    const [availableSpecies, setAvailableSpecies] = useState(speciesOptions);
    const [locSelectedSpecie, setLocSelectedSpecie] = useState(selectedSpecie);
    const [locTime, setLocTime] = useState(histTimeSevip);
    const [locStartTime, setLocStartTime] = useState(startTimeSevip);
    const [locEndTime, setLocEndTime] = useState(endTimeSevip);
    const [overlayMode, setOverlayMode] = useState<'gif' | 'png'>('png');

    // --- Sync local states with redux when the popup opens ---
    useEffect(() => {
        if (isPopupOpen) {
            setLocAvailableVars(availableVariables);
            setAvailableSpecies(speciesOptions);
            setLocSelectedSpecie(selectedSpecie);
            setLocSelectedVar(selectedVariable);
            setLocTime(histTimeSevip);
            setLocStartTime(startTimeSevip);
            setLocEndTime(endTimeSevip);
            setLocRadars(radars);
        }
    }, [availableVariables, endTimeSevip, histTimeSevip, isPopupOpen, selectedVariable, startTimeSevip, speciesOptions, selectedSpecie, radars])

     // --- Toggle overlay mode handlers --- 
     const handleSetToPngMode = () => {
        setOverlayMode("png");
     }
     const handleSetToGifMode = () => {
        setOverlayMode("gif");
     }

    // --- Local states handlers for input edits ---
    const handleInputVarChange = (variable: SelectOption) => {
        setLocSelectedVar(variable);
    }
    const handleTimeChange = (time: string) => {
        setLocTime(time);
    }
    const handleTogglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    }
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    }
    const handleSpecieChange = (specie: SelectOption) => {
        setLocSelectedSpecie(specie);
    }
    const handleRadarChange = (radar: SelectOption) => {
        setLocSelectedRadar(radar);
    }


    // --- Gif animated handlers ---
    const handleGifStartTimeChange = (time: string) => {
        setLocStartTime(time);
    }
    const handleGifEndTimeChange = (time: string) => {
        setLocEndTime(time);
    }

    


    // --- Submit handler:  ---
    const handleSubmit = () => {
        // --- sent payload according to overlay mode ---
        if (overlayMode === 'png') {
            dispatch(setSevipPayloadHist({
                time: locTime,
                parameter: locSelectedVar.id as string,
                species: locSelectedSpecie.id as string,
                radarID: Number(locSelectedRadar.id),
            }))
            // --- update the sevip slice states ---
            dispatch(setHistTimeSevip(locTime));
            dispatch(setSelectedHistSevipOption(locSelectedVar));
        }  
        if (overlayMode === 'gif') {
            dispatch(setSevipGifPayloadHist({
                parameter: locSelectedVar.id as string,
                startTime: locStartTime,
                species: locSelectedSpecie.id as string,
                endTime: locEndTime,
                radarID: Number(locSelectedRadar.id),
            }));
            // --- Update slices ---
            dispatch(setSelectedHistSevipOption(locSelectedVar));
            dispatch(setHistSevipTimeStart(locStartTime));
            dispatch(setHistSevipTimeEnd(locEndTime));
        }
        setIsPopupOpen(false);
    }

  return (
    <OptionPopover
        hoverText='Vertical Integrated Profile Data'
        customIcon={<FlipHorizontal className={iconSize}/>}   
        isOpen={isPopupOpen}
        onOpen={handleTogglePopup}
        onClose={handleClosePopup}
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
            options={locRadars}
            value={locSelectedRadar.displayText}
            width='w-full'
            onSelectValue={handleRadarChange}
        />
        {/* Species select */}
        <div className="flex flex-col gap-0.5">
            <small className='font-semibold'>Specie</small>
            <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={availableSpecies}
            value={locSelectedSpecie.displayText}
            width='w-full'
            onSelectValue={handleSpecieChange}
        />

        <div className="flex flex-col gap-0.5">
            <small className='font-semibold'>Variable</small>
            <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={locAvailableVars}
            value={locSelectedVar.displayText}
            width='w-full'
            onSelectValue={handleInputVarChange}
        />

        {/* Time for still image */}
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

        {/* Time range for animated gif */}
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

        {/* Display data button */}
        <ButtonBorder
            ariaLabel='Display Sevip data on map'
            onClick={handleSubmit}
            className='py-2 mt-2'
            isPrimary
        >
             Display data
        </ButtonBorder>

    </OptionPopover>
  )
}

export default memo(SevipPopup);
