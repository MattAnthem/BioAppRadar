import SimpleSelect from '../../../../shared/components/selects/SimpleSelect'
import ButtonBorder from '../../../../shared/components/buttons/borderedbtn/ButtonBorder'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { changeVtipHistPayload, closeVtipHistPopup, setSelectedVtipHistParameterOption, setVtipHistEndTime, setVtipHistStartTime, toggleVtipHistPopup } from '../../slices/vtipHistChartSlice';
import type { SelectOption } from '../../../../shared/components/selects/types';
import OptionPopover from '../../../../shared/components/popups/option/OptionPopover';
import ReactDatetimePicker from '../../../../shared/components/input/ReactDatetime';
import { useEffect, useState, memo } from 'react';



const VtipHistPopup = () => {
    // --- Read only state from Redux store
    const { parameterOptions, selectedParameter, vtipStartTime, vtipEndTime, isPopupOpen } = useAppSelector(state => state.vtip_histchart);

    // --- Local state variables for controlling popup visibility and form inputs ---
    const [locParameters, setLocParameters] = useState<SelectOption[]>(parameterOptions);
    const [locSelectedParameter, setLocSelectedParameter] = useState<SelectOption>(selectedParameter);
    const [locStartTime, setLocStartTime] = useState<string>(vtipStartTime);
    const [locEndTime, setLocEndTime] = useState<string>(vtipEndTime);

    // ---Sync with Redux store---
    useEffect(() => {
        if (isPopupOpen) {
            setLocParameters(parameterOptions);
            setLocSelectedParameter(selectedParameter);
            setLocStartTime(vtipStartTime);
            setLocEndTime(vtipEndTime);
        }
    }, [parameterOptions, selectedParameter, vtipStartTime, vtipEndTime, isPopupOpen]);

    //  --- local input handlers to handle input changes ---
    const handleStartTimeChange = (date: string) => {
        setLocStartTime(date);
        setLocEndTime(date); // Ensure end time is not before start time
    }
    const handleEndTimeChange = (date: string) => {
        setLocEndTime(date);
    }
    const handleVariableChange = (option: SelectOption) => {
        setLocSelectedParameter(option);
    }

    //  --- Popup toggler handlers ---
    const handleTogglePopup = () => {
        dispatch(toggleVtipHistPopup());
    }
    const handleClosePopup = () => {
        dispatch(closeVtipHistPopup());
    }

    const dispatch = useAppDispatch()




    const handleSubmitPopupData = () => {

        dispatch(changeVtipHistPayload(
            {
              startTime: locStartTime,
              endTime: locEndTime,
              parameter: locSelectedParameter.id as string
            }
          ));
        //   --- update the store
        dispatch(setVtipHistStartTime(locStartTime));
        dispatch(setVtipHistEndTime(locEndTime));
        dispatch(setSelectedVtipHistParameterOption(locSelectedParameter));
        
        dispatch(closeVtipHistPopup());
    }

  return (
    <OptionPopover
        hoverText="Select Options"
        isOpen={isPopupOpen}
        onOpen={handleTogglePopup}
        onClose={handleClosePopup}
    >

 
        <small className='font-semibold'>Select variable</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={locParameters}
            value={locSelectedParameter.displayText}
            onSelectValue={handleVariableChange}
            width="w-full"
        />


            <small className='font-semibold'>Select start Time</small>
            <div className="border-b border-b-gray-400"/>

            <ReactDatetimePicker
                onChange={handleStartTimeChange}
                value={locStartTime}
            />

            <small className='font-semibold'>Select end Time</small>
            <div className="border-b border-b-gray-400"/>
            <ReactDatetimePicker 
                onChange={handleEndTimeChange}
                value={locEndTime}
                minDate={locStartTime}
            />


        {/* Display data button */}
        <ButtonBorder
            onClick={handleSubmitPopupData}
            className='py-2 mt-2'
            isPrimary
        >
            Display data
        </ButtonBorder>

    </OptionPopover>
  )
}

export default memo(VtipHistPopup);
