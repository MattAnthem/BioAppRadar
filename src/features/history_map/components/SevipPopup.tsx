import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { FlipHorizontal, ImageIcon, ImagePlayIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import type { SelectOption } from '../../../shared/components/selects/types';
import { closeSevipPopup, setHistSevipTimeEnd, setHistSevipTimeStart, setHistTimeSevip, setSelectedHistSevipOption, toggleSevipPopup } from '../slice/histSevipPopup';
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder';
import  ReactDatetimePicker  from '../../../shared/components/input/ReactDatetime';
import { useEffect, useState, memo } from 'react';
import { setSevipGifPayloadHist, setSevipPayloadHist } from '../slice/historyMapSlice';
import Tooltip from '../../../shared/components/popups/tooltip/Tooltip';



const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const SevipPopup = () => {

    // --- Read only redux states ---
    const { selectedVariable, availableVariables, histTimeSevip, isPopupOpen,  startTimeSevip, endTimeSevip } = useAppSelector(state => state.hist_sevippopup);

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
        setLocEndTime(time);
    }
    const handleGifEndTimeChange = (time: string) => {
        setLocEndTime(time);
    }

    const dispatch = useAppDispatch();


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
            dispatch(setSelectedHistSevipOption(locSelectedVar))
            dispatch(closeSevipPopup());
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
            dispatch(closeSevipPopup());
        }
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
        <small className='font-semibold'>Choose a display mode</small>
        <div className="border-b border-b-gray-400"/>
        <div className="w-full flex justify-start items-center p-1 gap-1">
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


        <small className='font-semibold'>Select a variable</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={locAvailableVars}
            value={locSelectedVar.displayText}
            width='w-95'
            onSelectValue={handleInputVarChange}
        />

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

        {/* Time range for animated gif */}
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

        {/* Display data button */}
        <ButtonBorder
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
