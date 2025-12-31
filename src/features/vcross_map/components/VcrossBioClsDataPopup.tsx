import { BirdIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import type { SelectOption } from '../../../shared/components/selects/types';
import { setSelectedBioclassTime, setSelectedVcrossBioCls, setVcrossBioclassSegment, setVcrossClassificationColorOne, setVcrossClassificationColorZero } from '../slice/vcrossPopupSlice';
import { useEffect, useState, memo, lazy } from 'react';
import { setOverlayClassificationPayload, setVcrossBioClassPayload } from '../slice/vcrossMapSlice';
import { useBioclassCovQuery } from '../../../shared/hooks/useQuery/useBioclassTemporalCov';
import { useFreshDates } from '../../../shared/hooks/dates/useFreshDates';

const OptionPopover = lazy(() => import('../../../shared/components/popups/option/OptionPopover'));
const SimpleSelect = lazy(() => import('../../../shared/components/selects/SimpleSelect'));
const ReactDatetimePicker = lazy(() => import('../../../shared/components/input/ReactDatetime'));
const ButtonBorder = lazy(() => import('../../../shared/components/buttons/borderedbtn/ButtonBorder'));
const ColorInput = lazy(() => import('../../../shared/components/input/ColorInput'))

const VcrossBioClsDataPopup = () => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // --- Redux read only states ----
    const { availableBioClass, selectedBioClass, timeBioClass, color_0, color_1, segmentBioclass, radars, selectedRadar } = useAppSelector(state => state.vcrosspopup);
    const dispatch = useAppDispatch();

    // --- Local state variables for editions on the input ---
    const [locAvailableBioclass, setLocAvailableBioclass] = useState(availableBioClass);
    const [locRadars, setLocRadars] = useState(radars);
    const [locSelectedRadar, setLocSelectedRadar] = useState(selectedRadar);
    const [locSelectedBioclass, setLocSelectedBioclass] = useState(selectedBioClass);
    const [locTime, setLocTime] = useState(timeBioClass);
    const [locColor0, setLocColor0] = useState(color_0);
    const [locColor1, setLocColor1] = useState(color_1);
    const [locSegment, setLocSegment] = useState(segmentBioclass);


    // fetch temporal coverage 
    const { data: temporal, isSuccess } = useBioclassCovQuery(1, {
      staleTime: 0,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      enabled: true,
    })

    const { adjustedStartEndTime: adjustedTimes } = useFreshDates(temporal);

        // --- Sync store to the temporal coverage ---
    useEffect(() => {
 
        if (!isSuccess || !adjustedTimes) return;

        dispatch(setSelectedBioclassTime(adjustedTimes.fresh_end));

        dispatch(setVcrossBioClassPayload({
            time: adjustedTimes.fresh_end,
            class: locSelectedBioclass.id as string,
            segment: locSegment,
            radarID: Number(locSelectedRadar.id),
        }));
        // Dispatch popup data to the leaflet map
        dispatch(setOverlayClassificationPayload({
            class: locSelectedBioclass.id as string,
            time: adjustedTimes.fresh_end,
            color_0: locColor0,
            color_1: locColor1,
            radarID: Number(locSelectedRadar.id),
        }));

    }, [adjustedTimes, dispatch, isSuccess, locColor0, locColor1, locSegment, locSelectedBioclass.id, locSelectedRadar.id, locTime])

    // --- Sync with redux when the popup opens or the Redux states changes ---
    useEffect(() => {
      if(isPopupOpen) {
        setLocAvailableBioclass(availableBioClass)
        setLocSelectedBioclass(selectedBioClass)
        setLocTime(timeBioClass)
        setLocColor0(color_0)
        setLocColor1(color_1)
        setLocSegment(segmentBioclass)
        setLocRadars(radars);
      }
    }, [availableBioClass, color_0, color_1, isPopupOpen, radars, segmentBioclass, selectedBioClass, timeBioClass])


    // --- Local input handlers for when the user edits ---
    const handleBioClassChange = (option: SelectOption) => {
      setLocSelectedBioclass(option);
    }


    const handleBioClassTimeChange = (date: string) => {
      setLocTime(date);
    }
    const handleToggleSegment = () => {
      setLocSegment(!locSegment);
    }

    // Popup opening/closing
    const handleTogglePopup = () => {
      setIsPopupOpen(!isPopupOpen);
    }
    const handleClosePopup = () => {
      setIsPopupOpen(false);
    }

    const handleRadarChange = (radar: SelectOption) => {
        setLocSelectedRadar(radar);
    }

    



    const handleSubmitPopup = () => {
        // Dispatch popup data to the heatmap
        dispatch(setVcrossBioClassPayload({
            time: locTime,
            class: locSelectedBioclass.id as string,
            segment: locSegment,
            radarID: Number(locSelectedRadar.id),
        }));
        // Dispatch popup data to the leaflet map
        dispatch(setOverlayClassificationPayload({
            class: locSelectedBioclass.id as string,
            time: locTime,
            color_0: locColor0,
            color_1: locColor1,
            radarID: Number(locSelectedRadar.id),
        }));


        // --- Update the redux store ---
        dispatch(setSelectedVcrossBioCls(locSelectedBioclass));
        dispatch(setVcrossClassificationColorZero(locColor0)); 
        dispatch(setVcrossClassificationColorOne(locColor1));
        dispatch(setSelectedBioclassTime(locTime));
        dispatch(setVcrossBioclassSegment(locSegment))

        setIsPopupOpen(false);
        
    }

  return (
    <OptionPopover
        hoverText='Select Classification Data'
        customIcon={<BirdIcon className='w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4'/>}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onOpen={handleTogglePopup}
    >

        {/* Radar select */}
        <div className="flex flex-col gap-0.5">
            <small className='font-semibold'>Radar ID</small>
            <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={locRadars}
            value={locSelectedRadar.displayText}
            width='w-full'
            onSelectValue={handleRadarChange}
        />

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


      <ColorInput
        initialColor={locColor0}
        onColorCommit={setLocColor0}
        label={locSelectedBioclass['type0'] as string}
      />

      <ColorInput
        initialColor={locColor1}
        onColorCommit={setLocColor1}
        label={locSelectedBioclass['type1'] as string}
      />

      {/* Toggle on/off segment */}
      <div className="flex flex-col gap-0.5">
          <small className='font-semibold'>Segment</small>
          <div className="border-b border-b-gray-400"/>
      </div>
      <div className="flex items-center justify-start gap-2 px-2">
        <input  type="checkbox" checked={locSegment} onChange={handleToggleSegment} name="vcross-bioclass-segment" id="vcross_bioclass_segment" />
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
        minDate={temporal?.start_time}
        maxDate={adjustedTimes?.fresh_end}
      />
      <ButtonBorder
        ariaLabel='Display Bioclass Data on map'
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
