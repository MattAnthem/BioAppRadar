import { FlipHorizontal } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSelectedVcrossSevipVariable, setVcrossSevipTime } from '../slice/vcrossPopupSlice';
import type { SelectOption } from '../../../shared/components/selects/types';
import { useEffect, useState, memo, lazy } from 'react';
import { setVcrossSevipPayload } from '../slice/vcrossMapSlice';
import { useSevipTemporalCovQuery } from '../../../shared/hooks/useQuery/useSevipTemporalCovQuery';
import { useFreshDates } from '../../../shared/hooks/dates/useFreshDates';
import { radar_options } from '../../../shared/static/select-options';

const OptionPopover = lazy(() => import('../../../shared/components/popups/option/OptionPopover'));
const SimpleSelect = lazy(() => import('../../../shared/components/selects/SimpleSelect'));
const ReactDatetimePicker = lazy(() => import('../../../shared/components/input/ReactDatetime'));
const ButtonBorder = lazy(() => import('../../../shared/components/buttons/borderedbtn/ButtonBorder'));

const VcrossSevipDataPopup = () => {


  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // --- Redux read only states ---
  const { sevipTime, sevipVariables, selectedSevipVar, selectedRadar, speciesOptions, selectedSpecie } = useAppSelector(state => state.vcrosspopup);
  const dispatch = useAppDispatch();
      // --- Temporal coverages to restrict time selects ---
    const { data: temporal, isSuccess } = useSevipTemporalCovQuery(selectedRadar.id as number, {
        staleTime: 0,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        enabled: true,
    });

    const { adjustedStartEndTime: adjustedTimes } = useFreshDates(temporal);
    useEffect(() => {
 
      if (!isSuccess || !adjustedTimes) return;


      dispatch(setVcrossSevipTime(adjustedTimes.fresh_end));

      setLocTime(sevipTime);



  }, [isSuccess, adjustedTimes, dispatch, sevipTime]);

  
  // --- Local states for the inputs ---
  const [locTime, setLocTime] = useState(sevipTime);
  const [locVariables, setLocVariables] = useState(sevipVariables);
  const [locSelectedVar, setLocSelectedVar] = useState(selectedSevipVar);
  const [locSelectedRadar, setLocSelectedRadar] = useState(selectedRadar);
  const [availableSpecies, setAvailableSpecies] = useState(speciesOptions);
  const [locSelectedSpecie, setLocSelectedSpecie] = useState(selectedSpecie);
  

  // --- Sync local states when states from redux changes or on mount and if the popup opens ---
  useEffect(() => {
    if (isPopupOpen) {
      setLocTime(sevipTime);
      setLocVariables(sevipVariables);
      setLocSelectedVar(selectedSevipVar);
      setAvailableSpecies(speciesOptions);
      setLocSelectedSpecie(selectedSpecie);
    }
  }, [isPopupOpen, selectedSevipVar, selectedSpecie, sevipTime, sevipVariables, speciesOptions]);

  // --- Local input handlers for edition on this popup ---
  const handleVariableChange = (variable: SelectOption) => {
    setLocSelectedVar(variable);
  }
  const handleTimeChange = (date: string) => {
    setLocTime(date);
  }

  const handleRadarChange = (radar: SelectOption) => {
    setLocSelectedRadar(radar);
  }
  const handleSpecieChange = (specie: SelectOption) => {
    setLocSelectedSpecie(specie);
}

  // --- Redux popup control ---
  const handleTogglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  }
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  }




  const handleSubmitPopup = () => {
    dispatch(setVcrossSevipPayload({
      parameter: locSelectedVar.id as string,
      time: locTime,
      radarID: selectedRadar.id as number,
      species: locSelectedSpecie.id as string,
    }));

    // --- dispatch the new state values to the store
    dispatch(setSelectedVcrossSevipVariable(locSelectedVar));
    dispatch(setVcrossSevipTime(locTime));

    setIsPopupOpen(false);
  }

  return (
    <OptionPopover
      isOpen={isPopupOpen}
      onClose={handleClosePopup}
      onOpen={handleTogglePopup}
      customIcon={<FlipHorizontal className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4"/>}
      hoverText='Vertical Integrated Profile Data'
    >

            {/* Radar select */}
        <div className="flex flex-col gap-0.5">
            <small className='font-semibold'>Radar ID</small>
            <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={radar_options}
            value={locSelectedRadar.displayText}
            width='w-full'
            onSelectValue={handleRadarChange}
        />

              {/* Species select */}
        <div className="flex flex-col gap-0.5">
            <small className='font-semibold'>Specie</small>
            <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={availableSpecies}
            value={locSelectedSpecie.displayText}
            width='w-full'
            onSelectValue={handleSpecieChange}
        />

      {/* Variable */}
      <div className="flex flex-col gap-0.5">
          <small className='font-semibold'>Variable</small>
          <div className="border-b border-b-gray-400"/>
      </div>
      <SimpleSelect
        onSelectValue={handleVariableChange}
        options={locVariables}
        width='w-full'
        value={locSelectedVar.displayText}
      />

      {/* Time */}
      <div className="flex flex-col gap-0.5">
          <small className='font-semibold'>Time</small>
          <div className="border-b border-b-gray-400"/>
      </div>
      <ReactDatetimePicker
        value={locTime}
        onChange={handleTimeChange}
      />

      <ButtonBorder
            ariaLabel='Display Sevip Data on map'
            onClick={handleSubmitPopup}
            className="p-2 mt-2"
            isPrimary
      >

            Display Data

      </ButtonBorder>

    </OptionPopover>
  )
}

export default memo(VcrossSevipDataPopup);
