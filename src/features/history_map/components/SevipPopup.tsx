import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { FlipHorizontal } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import type { SelectOption } from '../../../shared/components/selects/types';
import { closeSevipPopup, setHistTimeSevip, setSelectedHistSevipOption, toggleSevipPopup } from '../slice/histSevipPopup';
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder';
import  ReactDatetimePicker  from '../../../shared/components/input/ReactDatetime';
import { useEffect, useState } from 'react';
import { setSevipPayloadHist } from '../slice/historyMapSlice';



const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const SevipPopup = () => {

    // --- Read only redux states ---
    const { selectedVariable, availableVariables, histTimeSevip, isPopupOpen } = useAppSelector(state => state.hist_sevippopup);

    // --- Local states for the inputs ---
    const [locAvailableVars, setLocAvailableVars] = useState(availableVariables);
    const [locSelectedVar, setLocSelectedVar] = useState(selectedVariable);
    const [locTime, setLocTime] = useState(histTimeSevip);

    // --- Sync local states with redux when the popup opens ---
    useEffect(() => {
        if (isPopupOpen) {
            setLocAvailableVars(availableVariables);
            setLocSelectedVar(selectedVariable);
            setLocTime(histTimeSevip);
        }
    }, [availableVariables, histTimeSevip, isPopupOpen, selectedVariable])

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

    const dispatch = useAppDispatch();


    // --- Submit handler:  ---
    const handleSubmit = () => {
        dispatch(setSevipPayloadHist({
            time: locTime,
            parameter: locSelectedVar.id as string
        }))
        // --- update the sevip slice states ---
        dispatch(setHistTimeSevip(locTime));
        dispatch(setSelectedHistSevipOption(locSelectedVar))
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

        <small className='font-semibold'>Select a variable</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={locAvailableVars}
            value={locSelectedVar.displayText}
            width='w-95'
            onSelectValue={handleInputVarChange}
        />

        {/* Time */}
        <small className='font-semibold'>Select time</small>
        <div className="border-b border-b-gray-400"/>
        <ReactDatetimePicker
            onChange={handleTimeChange}
            value={locTime}
        />

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

export default SevipPopup;
