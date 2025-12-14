import { BirdIcon, ImageIcon, ImagePlayIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { SelectOption } from '../../../shared/components/selects/types';
import { useEffect, useState, memo, useMemo, lazy } from 'react';
import { setHistClassifEndTime, setHistClassificationColorOne, setHistClassificationColorZero, setHistClassifStartTime, setHistClassifTime, setSelectedHistClassificationOption } from '../slice/histClassificationPopupSlice'
import { setClassifGifPayloadHist, setClassifPayloadHist } from '../slice/historyMapSlice'
import Tooltip from '../../../shared/components/popups/tooltip/Tooltip'
import { useVpTemporalCoverageQuery } from '../../../shared/hooks/useQuery/useVpTemporalCoverageQuery'
import { useTheme } from '../../../shared/hooks/useTheme';
import dayjs from 'dayjs';

const OptionPopover = lazy(() => import('../../../shared/components/popups/option/OptionPopover'));
const SimpleSelect = lazy(() => import('../../../shared/components/selects/SimpleSelect'));
const ButtonBorder = lazy(() => import('../../../shared/components/buttons/borderedbtn/ButtonBorder'));
const ReactDatetimePicker = lazy(() => import('../../../shared/components/input/ReactDatetime'));
const ColorInput = lazy(() => import('../../../shared/components/input/ColorInput'));


const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const ClassificationPopup = () => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Themes 
  const themes = useTheme();
  const { active_border, active_text, border, hover } = themes.theme.displayTogglerBtn;

  // Read only redux states
  const { availableVariables, selectedVariable, color_0, color_1, histClassifTime, endTimeClassif, startTimeClassif } = useAppSelector(state=> state.hist_classifpopup);
  const dispatch = useAppDispatch();

  // --- Temporal coverages to restrict time selects ---
  const { data: temporal, isSuccess } = useVpTemporalCoverageQuery(1,{
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

    dispatch(setHistClassifStartTime(adjustedTimes.fresh_start));
    dispatch(setHistClassifEndTime(adjustedTimes.fresh_end));
    dispatch(setHistClassifTime(adjustedTimes.fresh_end));
    
  }, [adjustedTimes, dispatch, isSuccess])
  
  // --- Local state for the inputs
  const [locAvailableVars, setLocAvailableVars] = useState(availableVariables ?? []);
  const [locSelectedVar, setLocSelectedVar] = useState(selectedVariable ?? null);
  const [locColor0, setLocColor0] = useState(color_0 ?? '');
  const [locColor1, setLocColor1] = useState(color_1 ?? '');
  const [locTime, setLocTime] = useState(histClassifTime ?? '');
  const [locStartTime, setLocStartTime] = useState(startTimeClassif ?? '');
  const [locEndTime, setLocEndTime] = useState(endTimeClassif ?? '');
  const [overlayMode, setOverlayMode] = useState<'gif' | 'png'>('png');

  // --- Sync local states with redux states on mount and when redux states change ---
  useEffect(() => {
    if (isPopupOpen) {
      setLocAvailableVars(availableVariables);
      setLocSelectedVar(selectedVariable);
      setLocColor0(color_0);
      setLocColor1(color_1);
      setLocTime(histClassifTime);
      setLocStartTime(startTimeClassif);
      setLocEndTime(endTimeClassif);
    }
  }, [availableVariables, color_0, color_1, histClassifTime, selectedVariable, isPopupOpen, startTimeClassif, endTimeClassif])

  // --- Toggle overlay mode handlers --- 
  const handleSetToPngMode = () => {
        setOverlayMode("png");
  }
  const handleSetToGifMode = () => {
        setOverlayMode("gif");
  }

  // --- Local input handlers (for edition : proper to the popup only) ---
  const handleInputVarChange = (variable: SelectOption) => {
    setLocSelectedVar(variable);
  }

  const handleTimeChange = (date: string) => {
    setLocTime(date);
  }

      // --- Gif animated handlers ---
  const handleGifStartTimeChange = (time: string) => {
        setLocStartTime(time);
  }
  const handleGifEndTimeChange = (time: string) => {
        setLocEndTime(time);
  }

  // --- Redux controls of the popup ---
  const handleTooglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  }
  const closePopup = () => {
    setIsPopupOpen(false);
  }

  // --- Submit handler:  ---
  const handleSubmit = () => {
    //  --- Changing payload according to the overlay mode to display ---
    if (overlayMode === 'png') {
      dispatch(setClassifPayloadHist({
          class: locSelectedVar.id as string,
          color_0: locColor0,
          color_1: locColor1,
          time: locTime
      }))
      // --- Update slice states ---
      dispatch(setHistClassifTime(locTime));
      dispatch(setHistClassificationColorOne(locColor1));
      dispatch(setHistClassificationColorZero(locColor0));
      dispatch(setSelectedHistClassificationOption(locSelectedVar));
  
      // --- close on submit (only if the fields are validated) ---
      setIsPopupOpen(false)

    } else if (overlayMode === 'gif') {
      dispatch(setClassifGifPayloadHist({
        class: locSelectedVar.id as string,
        color_0: locColor0,
        color_1: locColor1,
        startTime: locStartTime,
        endTime: locEndTime
      }));
      // --- update states of the popups slice
      dispatch(setHistClassificationColorOne(locColor1));
      dispatch(setHistClassificationColorZero(locColor0));
      dispatch(setSelectedHistClassificationOption(locSelectedVar));
      dispatch(setHistClassifStartTime(locStartTime));
      dispatch(setHistClassifEndTime(locEndTime));

      setIsPopupOpen(false);
    }

    
}

return (

  <OptionPopover
      hoverText='Classification Data'
      customIcon={<BirdIcon className={iconSize}/>}
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

      {/* Variable selection */}
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

      {/* Colors selections */}
      <div className="flex flex-col gap-0.5">
            <small className='font-semibold'>Colors</small>
            <div className="border-b border-b-gray-400"/>
      </div>


      <ColorInput
        label={locSelectedVar['type0'] as string}
        initialColor={locColor0}
        onColorCommit={setLocColor0}
      />
      
      <ColorInput
        label={ locSelectedVar['type1'] as string}
        initialColor={locColor1}
        onColorCommit={setLocColor1}
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
      {/* Time for animated gif */}
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
                maxDate={temporal?.end_time}
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

      {/* Display data btn */}
      <ButtonBorder
        ariaLabel='Display Classification Data on map'
        onClick={handleSubmit}
        className='py-2 mt-2'
        isPrimary
      >
        Display Data
      </ButtonBorder>

  </OptionPopover>

)
}

export default memo(ClassificationPopup);
