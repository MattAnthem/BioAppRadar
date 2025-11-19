import SimpleSelect from '../../../../shared/components/selects/SimpleSelect'
import ButtonBorder from '../../../../shared/components/buttons/borderedbtn/ButtonBorder'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { changeVtipHistPayload, closeVtipHistPopup, setSelectedVtipHistParameterOption, setSelectedVtipHistSpecie, setVtipHistEndTime, setVtipHistStartTime, toggleVtipHistPopup } from '../../slices/vtipHistChartSlice';
import type { SelectOption } from '../../../../shared/components/selects/types';
import OptionPopover from '../../../../shared/components/popups/option/OptionPopover';
import ReactDatetimePicker from '../../../../shared/components/input/ReactDatetime';
import { useEffect, useState, memo } from 'react';
import { useVpTemporalCoverageQuery } from '../../../../shared/hooks/useQuery/useVpTemporalCoverageQuery';



const VtipHistPopup = () => {
    // --- Read only state from Redux store
    const { parameterOptions, selectedParameter, vtipStartTime, vtipEndTime, isPopupOpen, selectedSpecie, speciesOptions } = useAppSelector(state => state.vtip_histchart);


    // --- Temporal coverages to restrict time selects ---
    const { data: temporal } = useVpTemporalCoverageQuery(1, isPopupOpen);

    // --- Local state variables for controlling popup visibility and form inputs ---
    const [locParameters, setLocParameters] = useState<SelectOption[]>(parameterOptions);
    const [locSelectedParameter, setLocSelectedParameter] = useState<SelectOption>(selectedParameter);
    const [locSpecies, setLocSpecies] = useState(speciesOptions);
    const [locSelectedSpecie, setLocSelectedSpecie] = useState(selectedSpecie);
    const [locStartTime, setLocStartTime] = useState<string>(vtipStartTime);
    const [locEndTime, setLocEndTime] = useState<string>(vtipEndTime);

    // ---Sync with Redux store---
    useEffect(() => {
        if (isPopupOpen) {
            setLocParameters(parameterOptions);
            setLocSelectedParameter(selectedParameter);
            setLocStartTime(vtipStartTime);
            setLocEndTime(vtipEndTime);
            setLocSpecies(speciesOptions);
            setLocSelectedSpecie(selectedSpecie);
        }
    }, [parameterOptions, selectedParameter, vtipStartTime, vtipEndTime, isPopupOpen, speciesOptions, selectedSpecie]);

    //  --- local input handlers to handle input changes ---
    const handleStartTimeChange = (date: string) => {
        setLocStartTime(date);
    }
    const handleEndTimeChange = (date: string) => {
        setLocEndTime(date);
    }
    const handleVariableChange = (option: SelectOption) => {
        setLocSelectedParameter(option);
    }
    const handleSpecieChange = (option: SelectOption) => {
        setLocSelectedSpecie(option);
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
              parameter: locSelectedParameter.id as string,
              species: locSelectedSpecie.id as string,
            }
          ));
        //   --- update the store
        dispatch(setVtipHistStartTime(locStartTime));
        dispatch(setVtipHistEndTime(locEndTime));
        dispatch(setSelectedVtipHistParameterOption(locSelectedParameter));
        dispatch(setSelectedVtipHistSpecie(locSelectedSpecie));


        
        dispatch(closeVtipHistPopup());
    }

  return (
    <OptionPopover
        hoverText="Select Options"
        isOpen={isPopupOpen}
        onOpen={handleTogglePopup}
        onClose={handleClosePopup}
    >

 
        <small className='font-semibold'>Specie</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={locSpecies}
            value={locSelectedSpecie.displayText}
            onSelectValue={handleSpecieChange}
            width='w-full'
        />


        <small className='font-semibold'>Variable</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={locParameters}
            value={locSelectedParameter.displayText}
            onSelectValue={handleVariableChange}
            width="w-full"
        />


            <small className='font-semibold'>Start Time</small>
            <div className="border-b border-b-gray-400"/>

            <ReactDatetimePicker
                onChange={handleStartTimeChange}
                value={locStartTime}
                minDate={temporal?.start_time}
                maxDate={temporal?.end_time}
            />

            <small className='font-semibold'>End Time</small>
            <div className="border-b border-b-gray-400"/>
            <ReactDatetimePicker 
                onChange={handleEndTimeChange}
                value={locEndTime}
                minDate={locStartTime}
                maxDate={temporal?.end_time}
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
