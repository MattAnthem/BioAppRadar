import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { closeRadarPopup, setRadarTimeHist, setSelectedHistRadarParameter, setSelectedHistRadarType, toggleRadarPopup } from '../slice/histRadarPopupSlice';
import type { SelectOption } from '../../../shared/components/selects/types';
import { RadarIcon } from 'lucide-react';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import OptionPopover from '../../../shared/components/popups/option/OptionPopover';
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder';
import ReactDatetimePicker from '../../../shared/components/input/ReactDatetime';
import { useEffect, useState, memo } from 'react';
import { setRadarPayloadHist } from '../slice/historyMapSlice';


const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const RadarOptionPopup = () => {

    // Redux read only states
    const { availableTypes, selectedType, availableParameters, selectedParameter, radarTimeHist, isPopupOpen } = useAppSelector(state => state.hist_radarpopup);
    
    // --- Local state for the inputs
    const [locAvailableTypes, setLocAvailableTypes] = useState(availableTypes);
    const [locAvailableParams, setLocAvailableParams] = useState(availableParameters);
    const [locSelectedType, setLocSelectedType] = useState(selectedType);
    const [locSelectedParam, setLocSelectedParam] = useState(selectedParameter);
    const [locTime, setLocTime] = useState(radarTimeHist);
    

    // --- Sync local states with redux state on mount or when the popup opens
    useEffect(() => {
        if (isPopupOpen) {
            setLocAvailableParams(availableParameters);
            setLocAvailableTypes(availableTypes);
            setLocSelectedType(selectedType);
            setLocSelectedParam(selectedParameter);
            setLocTime(radarTimeHist);
        }
    }, [availableParameters, availableTypes, isPopupOpen, radarTimeHist, selectedParameter, selectedType])


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
    

    const dispatch = useAppDispatch();

    const handleSubmit = () => {
        dispatch(setRadarPayloadHist({
            type: locSelectedType.id as 'polar' | 'grid',
            parameter: locSelectedParam.id as string,
            time: locTime,
        }))

        // --- Update slice states ---
        dispatch(setSelectedHistRadarType(locSelectedType));
        dispatch(setSelectedHistRadarParameter(locSelectedParam));
        dispatch(setRadarTimeHist(locTime));

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
        <small className='font-semibold'>Select projection type</small>
        <div className="border-b border-b-gray-400"/>

        {/* Type Select */}
        <SimpleSelect
            options={locAvailableTypes}
            value={locSelectedType.displayText}
            width='w-95'
            onSelectValue={handleTypeChange}
        />
        
        <small className='font-semibold'>Select parameter</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={locAvailableParams}
            value={locSelectedParam.displayText}
            width='w-95'
            onSelectValue={handleParamChange}
        />

        {/* Time */}
        <small className='font-semibold'>Select time</small>
        <div className="border-b border-b-gray-400"/>
        <ReactDatetimePicker
            onChange={handleTimeChange}
            value={locTime}
        />


        {/* Display data  */}
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

export default memo(RadarOptionPopup);
