import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { BirdIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import type { SelectOption } from '../../../shared/components/selects/types';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import { closeVcrossBioclassPopup, setSelectedBioclassTime, setSelectedVcrossBioCls, setVcrossBioclassSegment, setVcrossClassificationColorOne, setVcrossClassificationColorZero, toggleVcrossBioclassPopup } from '../slice/vcrossPopupSlice';
import ReactDatetimePicker from '../../../shared/components/input/ReactDatetime';
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder';
import { useEffect, useState, memo } from 'react';
import { setOverlayClassificationPayload, setVcrossBioClassPayload } from '../slice/vcrossMapSlice';


const VcrossBioClsDataPopup = () => {

    // --- Redux read only states ----
    const { availableBioClass, selectedBioClass, timeBioClass, color_0, color_1, segmentBioclass, isClassifPopupOpen } = useAppSelector(state => state.vcrosspopup);
    
    // --- Local state variables for editions on the input ---
    const [locAvailableBioclass, setLocAvailableBioclass] = useState(availableBioClass);
    const [locSelectedBioclass, setLocSelectedBioclass] = useState(selectedBioClass);
    const [locTime, setLocTime] = useState(timeBioClass);
    const [locColor0, setLocColor0] = useState(color_0);
    const [locColor1, setLocColor1] = useState(color_1);
    const [locSegment, setLocSegment] = useState(segmentBioclass);

    // --- Sync with redux when the popup opens or the Redux states changes ---
    useEffect(() => {
      if(isClassifPopupOpen) {
        setLocAvailableBioclass(availableBioClass)
        setLocSelectedBioclass(selectedBioClass)
        setLocTime(timeBioClass)
        setLocColor0(color_0)
        setLocColor1(color_1)
        setLocSegment(segmentBioclass)
      }
    }, [availableBioClass, color_0, color_1, isClassifPopupOpen, segmentBioclass, selectedBioClass, timeBioClass])


    // --- Local input handlers for when the user edits ---
    const handleBioClassChange = (option: SelectOption) => {
      setLocSelectedBioclass(option);
    }
    const handleColorZeroChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const color = evt.target.value;
      setLocColor0(color);
    }
    const handleColorOneChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const color = evt.target.value;
      setLocColor1(color)
    };
    const handleBioClassTimeChange = (date: string) => {
      setLocTime(date);
    }
    const handleToggleSegment = () => {
      setLocSegment(!locSegment);
    }

    // Popup opening/closing
    const handleTogglePopup = () => {
      dispatch(toggleVcrossBioclassPopup())
    }
    const handleClosePopup = () => {
      dispatch(closeVcrossBioclassPopup())
    }

    const dispatch = useAppDispatch();



    const handleSubmitPopup = () => {
        // Dispatch popup data to the heatmap
        dispatch(setVcrossBioClassPayload({
            time: locTime,
            class: locSelectedBioclass.id as string,
            segment: locSegment,
        }));
        // Dispatch popup data to the leaflet map
        dispatch(setOverlayClassificationPayload({
            class: locSelectedBioclass.id as string,
            time: locTime,
            color_0: locColor0,
            color_1: locColor1,
        }));


        // --- Update the redux store ---
        dispatch(setSelectedVcrossBioCls(locSelectedBioclass));
        dispatch(setVcrossClassificationColorZero(locColor0)); 
        dispatch(setVcrossClassificationColorOne(locColor1));
        dispatch(setSelectedBioclassTime(locTime));
        dispatch(setVcrossBioclassSegment(locSegment))

      dispatch(closeVcrossBioclassPopup());
    }

  return (
    <OptionPopover
        hoverText='Select Classification Data'
        customIcon={<BirdIcon className='w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4'/>}
        isOpen={isClassifPopupOpen}
        onClose={handleClosePopup}
        onOpen={handleTogglePopup}
    >

      {/* Select class data to display */}
      <div className="flex flex-col gap-0.5">
          <small className='font-semibold'>Variable</small>
          <div className="border-b border-b-gray-400"/>
      </div>
      <SimpleSelect
        onSelectValue={handleBioClassChange}
        options={locAvailableBioclass}
        width='w-full'
        value={locSelectedBioclass.displayText}
      />

      {/* Colors for classification targets */}
      <div className="flex flex-col gap-0.5">
          <small className='font-semibold'>Colors</small>
          <div className="border-b border-b-gray-400"/>
      </div>

      <div className="grid px-2 grid-cols-2 w-1/2 gap-0.5 justify-center capitalize items-center">
          <small className='w-fit'>{ locSelectedBioclass['type0'] as string}:</small>
          <input onChange={handleColorZeroChange} value={locColor0} className='w-10 h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm' type="color" name="color_0" id="color_0" />
      </div>
      <div className="grid px-2 grid-cols-2 w-1/2 gap-0.5 justify-start items-center capitalize">
          <small className='w-fit'>{ locSelectedBioclass['type1'] as string}:</small>
          <input onChange={handleColorOneChange} value={locColor1} className='w-10 h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm'  type="color" name="color_1" id="color_0" />
      </div>

      {/* Toggle on/off segment */}
      <div className="flex flex-col gap-0.5">
          <small className='font-semibold'>Segment</small>
          <div className="border-b border-b-gray-400"/>
      </div>
      <div className="flex items-center justify-start gap-2 px-2">
        <input type="checkbox" checked={locSegment} onChange={handleToggleSegment} name="vcross-bioclass-segment" id="vcross_bioclass_segment" />
        <small>Toggle on/off segement</small>
      </div>

      {/* Select Time */}
      <div className="flex flex-col gap-0.5">
          <small className='font-semibold'>Time</small>
          <div className="border-b border-b-gray-400"/>
      </div>
      <ReactDatetimePicker
        value={locTime}
        onChange={handleBioClassTimeChange}
      />
      <ButtonBorder
            onClick={handleSubmitPopup}
            className="p-2 mt-2"
            isPrimary
      >

            Display Data

      </ButtonBorder>
        
    </OptionPopover>
  )
}

export default memo(VcrossBioClsDataPopup);
