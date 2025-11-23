import { FlipHorizontal, ImageIcon, ImagePlayIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { SelectOption } from '../../../shared/components/selects/types';
import { closeSevipPopup, setHistSevipTimeEnd, setHistSevipTimeStart, setHistTimeSevip, setSelectedHistSevipOption, toggleSevipPopup } from '../slice/histSevipPopup';
import { useEffect, useState, memo, useMemo, lazy } from 'react';
import { setSevipGifPayloadHist, setSevipPayloadHist } from '../slice/historyMapSlice';
import Tooltip from '../../../shared/components/popups/tooltip/Tooltip';
import { useVpTemporalCoverageQuery } from '../../../shared/hooks/useQuery/useVpTemporalCoverageQuery';
import { useTheme } from '../../../shared/hooks/useTheme';
import dayjs from 'dayjs';

const OptionPopover = lazy(() => import('../../../shared/components/popups/option/OptionPopover'));
const SimpleSelect = lazy(() => import('../../../shared/components/selects/SimpleSelect'));
const ButtonBorder = lazy(() => import('../../../shared/components/buttons/borderedbtn/ButtonBorder'));
const ReactDatetimePicker = lazy(() => import('../../../shared/components/input/ReactDatetime'));



const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const SevipPopup = () => {

    // Themes 
    const themes = useTheme();
    const { active_border, active_text, border, hover } = themes.theme.displayTogglerBtn;

    // --- Read only redux states ---
    const { selectedVariable, availableVariables, histTimeSevip, isPopupOpen,  startTimeSevip, endTimeSevip, selectedSpecie, speciesOptions } = useAppSelector(state => state.hist_sevippopup);

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

        dispatch(setHistSevipTimeStart(adjustedTimes.fresh_start));
        dispatch(setHistSevipTimeEnd(adjustedTimes.fresh_end));
        dispatch(setHistTimeSevip(adjustedTimes.fresh_end));

    }, [adjustedTimes, dispatch, isSuccess])

    // --- Local states for the inputs ---
    const [locAvailableVars, setLocAvailableVars] = useState(availableVariables);
    const [locSelectedVar, setLocSelectedVar] = useState(selectedVariable);
    const [locTime, setLocTime] = useState(histTimeSevip);
    const [locStartTime, setLocStartTime] = useState(startTimeSevip);
    const [locEndTime, setLocEndTime] = useState(endTimeSevip);
    const [overlayMode, setOverlayMode] = useState<'gif' | 'png'>('png');

    // --- Sync local states with redux when the popup opens ---
    useEffect(() => {
        if (isPopupOpen) {
            setLocAvailableVars(availableVariables);
            setLocSelectedVar(selectedVariable);
            setLocTime(histTimeSevip);
            setLocStartTime(startTimeSevip);
            setLocEndTime(endTimeSevip);
        }
    }, [availableVariables, endTimeSevip, histTimeSevip, isPopupOpen, selectedVariable, startTimeSevip])

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
        dispatch(toggleSevipPopup())
    }
    const handleClosePopup = () => {
        dispatch(closeSevipPopup())
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
                parameter: locSelectedVar.id as string
            }))
            // --- update the sevip slice states ---
            dispatch(setHistTimeSevip(locTime));
            dispatch(setSelectedHistSevipOption(locSelectedVar));
        }  
        if (overlayMode === 'gif') {
            dispatch(setSevipGifPayloadHist({
                parameter: locSelectedVar.id as string,
                startTime: locStartTime,
                endTime: locEndTime,
            }));
            // --- Update slices ---
            dispatch(setSelectedHistSevipOption(locSelectedVar));
            dispatch(setHistSevipTimeStart(locStartTime));
            dispatch(setHistSevipTimeEnd(locEndTime));
        }
        dispatch(closeSevipPopup());
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


        {/* Species select */}
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
                        maxDate={temporal?.end_time}
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
                        maxDate={temporal?.end_time}
                        minDate={temporal?.start_time}
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
