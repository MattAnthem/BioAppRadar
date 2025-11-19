import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { closeRadarPopup, setRadarEndTimeHist, setRadarStartTimeHist, setRadarTimeHist, setSelectedHistRadarParameter, setSelectedHistRadarType, toggleRadarPopup } from '../slice/histRadarPopupSlice';
import type { SelectOption } from '../../../shared/components/selects/types';
import { ImageIcon, ImagePlayIcon, RadarIcon } from 'lucide-react';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import OptionPopover from '../../../shared/components/popups/option/OptionPopover';
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder';
import ReactDatetimePicker from '../../../shared/components/input/ReactDatetime';
import { useEffect, useState, memo } from 'react';
import { setRadarGifPayloadHist, setRadarPayloadHist } from '../slice/historyMapSlice';
import Tooltip from '../../../shared/components/popups/tooltip/Tooltip';


const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const RadarOptionPopup = () => {

    // Redux read only states
    const { availableTypes, selectedType, availableParameters, selectedParameter, radarTimeHist, isPopupOpen, endTimeRadar, startTimeRadar } = useAppSelector(state => state.hist_radarpopup);
    
    // --- Local state for the inputs
    const [locAvailableTypes, setLocAvailableTypes] = useState(availableTypes);
    const [locAvailableParams, setLocAvailableParams] = useState(availableParameters);
    const [locSelectedType, setLocSelectedType] = useState(selectedType);
    const [locSelectedParam, setLocSelectedParam] = useState(selectedParameter);
    const [locTime, setLocTime] = useState(radarTimeHist);
    const [locStartTime, setLocStartTime] = useState(startTimeRadar);
    const [locEndTime, setLocEndTime] = useState(endTimeRadar);
    const [overlayMode, setOverlayMode] = useState<'gif' | 'png'>('png');
    

    // --- Sync local states with redux state on mount or when the popup opens
    useEffect(() => {
        if (isPopupOpen) {
            setLocAvailableParams(availableParameters);
            setLocAvailableTypes(availableTypes);
            setLocSelectedType(selectedType);
            setLocSelectedParam(selectedParameter);
            setLocTime(radarTimeHist);
            setLocStartTime(startTimeRadar);
            setLocEndTime(endTimeRadar);
        }
    }, [availableParameters, availableTypes, endTimeRadar, isPopupOpen, radarTimeHist, selectedParameter, selectedType, startTimeRadar])


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


    // --- popup toggle open/close --- 
    const handleTooglePopup = () => {
        dispatch(toggleRadarPopup())
    }
    const closePopup = () => {
        dispatch(closeRadarPopup());
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

    const handleSubmit = () => {
        if (overlayMode === 'png') {            
            dispatch(setRadarPayloadHist({
                type: locSelectedType.id as 'polar' | 'grid',
                parameter: locSelectedParam.id as string,
                time: locTime,
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
                endTime: locEndTime
            }));
            // -- update the slices
            dispatch(setRadarStartTimeHist(locStartTime));
            dispatch(setRadarEndTimeHist(locEndTime));
            dispatch(setSelectedHistRadarParameter(locSelectedParam));
            dispatch(setSelectedHistRadarType(locSelectedType));
        }

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

        {/* Display mode toggle */}
        <small className='font-semibold'>Display mode</small>
        <div className="border-b border-b-gray-400"/>
        <div className="w-full flex justify-start items-center gap-1">
                <Tooltip
                  display_condition={isPopupOpen}
                  position="bottom"
                  text="Display as image"
                >
                  <button onClick={handleSetToPngMode} className={`w-25 flex gap-1 justify-center items-center px-2 py-0.5 ${overlayMode === 'png' ? 'bg-sky-800 border-sky-900 text-white hover:bg-sky-900' : 'border-gray-400 hover:bg-gray-300'} rounded-sm cursor-pointer border-2`}>
                      <ImageIcon className="w-4"/>
                      <h1>PNG</h1>
                  </button>
                </Tooltip>

                <Tooltip
                  display_condition={isPopupOpen}
                  position="bottom"
                  text="Display as gif"
                >
                  <button onClick={handleSetToGifMode} className={`w-25 flex gap-1 justify-center items-center  px-2 py-0.5 ${overlayMode === 'gif' ? 'bg-sky-800 border-sky-900 text-white hover:bg-sky-900' : 'border-gray-400 hover:bg-gray-300'}  rounded-sm cursor-pointer border-2`}>
                      <ImagePlayIcon className="w-4"/>
                      <h1>GIF</h1>
                  </button>
                </Tooltip>


        </div>

        <small className='font-semibold'>Projection type</small>
        <div className="border-b border-b-gray-400"/>

        {/* Type Select */}
        <SimpleSelect
            options={locAvailableTypes}
            value={locSelectedType.displayText}
            width='w-full'
            onSelectValue={handleTypeChange}
        />
        
        <small className='font-semibold'>Parameter</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            options={locAvailableParams}
            value={locSelectedParam.displayText}
            width='w-full'
            onSelectValue={handleParamChange}
        />

        {/* time for still image */}
        {
            (overlayMode === 'png') && (
                <>
                    <small className='font-semibold'>Time</small>
                    <div className="border-b border-b-gray-400"/>
                    <ReactDatetimePicker
                        onChange={handleTimeChange}
                        value={locTime}
                    />
                </>
            )
        }

        {/* Time range for a gif */}
        {
            (overlayMode === 'gif') && (
                <>
                {/* Start time for the gif */}
                <small className='font-semibold'>Start</small>
                <div className="border-b border-b-gray-400"/>
                <ReactDatetimePicker
                    onChange={handleGifStartTimeChange}
                    value={locStartTime}
                />

                {/* End time for the gif */}
                <small className='font-semibold'>End</small>
                <div className="border-b border-b-gray-400"/>
                <ReactDatetimePicker
                    onChange={handleGifEndTimeChange}
                    value={locEndTime}
                    minDate={locStartTime}
                />
            </>
            )
        }


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
