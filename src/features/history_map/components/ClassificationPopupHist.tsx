import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { BirdIcon, ImageIcon, ImagePlayIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import SimpleSelect from '../../../shared/components/selects/SimpleSelect'
import type { SelectOption } from '../../../shared/components/selects/types'
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder'
import ReactDatetimePicker from '../../../shared/components/input/ReactDatetime'
import { useEffect, useState, memo } from 'react';
import { closeClassifPopup, setHistClassifEndTime, setHistClassificationColorOne, setHistClassificationColorZero, setHistClassifStartTime, setHistClassifTime, setSelectedHistClassificationOption, toggleClassifPopup } from '../slice/histClassificationPopupSlice'
import { setClassifGifPayloadHist, setClassifPayloadHist } from '../slice/historyMapSlice'
import Tooltip from '../../../shared/components/popups/tooltip/Tooltip'



const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const ClassificationPopup = () => {

  // Read only redux states
  const { availableVariables, selectedVariable, color_0, color_1, histClassifTime, isPopupOpen, endTimeClassif, startTimeClassif } = useAppSelector(state=> state.hist_classifpopup);

  // --- Local state for the inputs
  const [locAvailableVars, setLocAvailableVars] = useState(availableVariables);
  const [locSelectedVar, setLocSelectedVar] = useState(selectedVariable);
  const [locColor0, setLocColor0] = useState(color_0);
  const [locColor1, setLocColor1] = useState(color_1);
  const [locTime, setLocTime] = useState(histClassifTime);
  const [locStartTime, setLocStartTime] = useState(startTimeClassif);
  const [locEndTime, setLocEndTime] = useState(endTimeClassif);
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

  const handleInputColor0Change = (evt: React.ChangeEvent<HTMLInputElement>)  => {
    const color = evt.target.value;
    setLocColor0(color);
  }
  const handleInputColor1Change = (evt: React.ChangeEvent<HTMLInputElement>)  => {
    const color = evt.target.value;
    setLocColor1(color);
  }
  const handleTimeChange = (date: string) => {
    setLocTime(date);
  }

      // --- Gif animated handlers ---
  const handleGifStartTimeChange = (time: string) => {
        setLocStartTime(time);
        setLocEndTime(time);
  }
  const handleGifEndTimeChange = (time: string) => {
        setLocEndTime(time);
  }

  // --- Redux controls of the popup ---
  const handleTooglePopup = () => {
    dispatch(toggleClassifPopup())
  }
  const closePopup = () => {
    dispatch(closeClassifPopup());
  }

  const dispatch = useAppDispatch();



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
      dispatch(closeClassifPopup());
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

      dispatch(closeClassifPopup());
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
        <small className='font-semibold'>Choose a display mode</small>
        <div className="border-b border-b-gray-400"/>
        <div className="w flex justify-start items-center gap-1">
                <Tooltip
                  display_condition={isPopupOpen}
                  position="bottom"
                  text="Display as image"
                >
                  <button onClick={handleSetToPngMode} className={`w-full px-2 py-0.5 ${overlayMode === 'png' ? 'bg-sky-800 border-sky-900 text-white hover:bg-sky-900' : 'border-gray-400 hover:bg-gray-300'} rounded-sm cursor-pointer border-2`}>
                      <ImageIcon className="w-4"/>
                  </button>
                </Tooltip>

                <Tooltip
                  display_condition={isPopupOpen}
                  position="bottom"
                  text="Display as gif"
                >
                  <button onClick={handleSetToGifMode} className={`w-full px-2 py-0.5 ${overlayMode === 'gif' ? 'bg-sky-800 border-sky-900 text-white hover:bg-sky-900' : 'border-gray-400 hover:bg-gray-300'}  rounded-sm cursor-pointer border-2`}>
                      <ImagePlayIcon className="w-4"/>
                  </button>
                </Tooltip>


        </div>

      {/* Variable selection */}
      <small className='font-semibold'>Select a variable</small>
      <div className="border-b border-b-gray-400"/>

      <SimpleSelect
          options={locAvailableVars}
          value={locSelectedVar.displayText}
          width='w-full'
          onSelectValue={handleInputVarChange}
      />

      {/* Colors selections */}
      <small className='font-semibold'>Select colors </small>
      <div className="border-b border-b-gray-400"/>

      <div className="grid grid-cols-2 w-1/2 gap-0.5 justify-center capitalize items-center">
          <small className='w-fit'>{ locSelectedVar['type0'] as string}:</small>
          <input onChange={handleInputColor0Change} value={locColor0} className='w-10 h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm' type="color" name="color_0" id="color_0" />
      </div>
      <div className="grid grid-cols-2 w-1/2 gap-0.5 justify-start items-center capitalize">
          <small className='w-fit'>{ locSelectedVar['type1'] as string}:</small>
          <input onChange={handleInputColor1Change} value={locColor1} className='w-10 h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm'  type="color" name="color_1" id="color_0" />
      </div>

      {/* Time for still image */}
      {
        (overlayMode === 'png') && (
          <>
            <small className='font-semibold'>Select time</small>
            <div className="border-b border-b-gray-400"/>
            <ReactDatetimePicker
              onChange={handleTimeChange}
              value={locTime}
            />
          </>
        )
      }
      {/* Time for animated gif */}
      {
        (overlayMode === 'gif') && (
          <>
            {/* Start time for the gif */}
            <small className='font-semibold'>Select start</small>
            <div className="border-b border-b-gray-400"/>
            <ReactDatetimePicker
                onChange={handleGifStartTimeChange}
                value={locStartTime}
            />

            {/* End time for the gif */}
            <small className='font-semibold'>Select end</small>
            <div className="border-b border-b-gray-400"/>
            <ReactDatetimePicker
                onChange={handleGifEndTimeChange}
                value={locEndTime}
                minDate={locStartTime}
            />
          </>
        )
      }

      {/* Display data btn */}
      <ButtonBorder
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
