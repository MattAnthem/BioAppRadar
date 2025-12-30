import { useEffect, useState, memo, useMemo, lazy } from "react";
import type { SelectOption } from "../../../../shared/components/selects/types";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { useVpTemporalCoverageQuery } from "../../../../shared/hooks/useQuery/useVpTemporalCoverageQuery";
import dayjs from 'dayjs';
import { changeVpHistPayload, setSelectedVpHistParameterOption, setSelectedVpHistSpecie, setVpHistTime } from "../slices/vpHistChartSlice";

const SimpleSelect = lazy(() => import('../../../../shared/components/selects/SimpleSelect'));
const ReactDatetimePicker = lazy(() => import('../../../../shared/components/input/ReactDatetime'));
const OptionPopover = lazy(() => import('../../../../shared/components/popups/option/OptionPopover'));
const ButtonBorder = lazy(() => import('../../../../shared/components/buttons/borderedbtn/ButtonBorder'));

const VpHistPopup = () => {
  // Control the popup so that we can close it on submit 
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Redux read only states
  const { parameterOptions, selectedParameter, vpTime, speciesOptions, selectedSpecie } = useAppSelector(state => state.vp_histchart);
  const dispatch = useAppDispatch()

  // --- Temporal coverages to restrict time selects ---
  const { data: temporal, isSuccess } = useVpTemporalCoverageQuery(1,{
    staleTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  // --- Adjust date to get the latest in temporal range
  const adjustedTime = useMemo(() => {
    if (!temporal) return null;
    const fresh_time = dayjs(temporal.end_time).add(2, 'hour').format('YYYY-MM-DD HH:mm:ss');
    return {fresh_time};
  }, [temporal]);

  // --- Hydrate redux slice
  useEffect(() => {
    if(!isSuccess || !adjustedTime) return;
    dispatch(setVpHistTime(adjustedTime.fresh_time));
    dispatch(changeVpHistPayload({
      time: adjustedTime.fresh_time
    }))
  }, [adjustedTime, dispatch, isSuccess])

  // Local state variables for the inputs 
  const [locParams, setLocParams] = useState(parameterOptions ?? []);
  const [locSpecies, setLocSpecies] = useState(speciesOptions ?? []);
  const [locSelectedSpecie, setLocSelectedSpecie] = useState(selectedSpecie ?? null);
  const [locSelectedParam, setLocSelectedParam] = useState(selectedParameter ?? null);
  const [locTime, setLocTime] = useState(vpTime ?? '');

  // --- Sync Local states with redux state on mount ----
  useEffect(() => {
    if (isPopupOpen) {
      setLocParams(parameterOptions);
      setLocSelectedParam(selectedParameter);
      setLocTime(vpTime);
      setLocSpecies(speciesOptions);
      setLocSelectedSpecie(selectedSpecie);
    }
  }, [isPopupOpen, parameterOptions, selectedParameter, vpTime, speciesOptions, selectedSpecie]);

  // --- local input handlers ---
  const handleDateChange = (date: string) => {
    setLocTime(date);
  }
  const handleVariableChange = (option: SelectOption) => {
    setLocSelectedParam(option);
  }
  const handleSpecieChange = (option: SelectOption) => {
    setLocSelectedSpecie(option);
  }

  // --- popup controls ---
  const handleTogglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  }
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  }

  


  const handleSubmitPopupData = () => {
    dispatch(changeVpHistPayload({
      parameter: locSelectedParam.id as string,
      time: locTime,
      species: locSelectedSpecie.id as string
    }))

    // update redux states 
    dispatch(setVpHistTime(locTime));
    dispatch(setSelectedVpHistParameterOption(locSelectedParam));
    dispatch(setSelectedVpHistSpecie(locSelectedSpecie));


    setIsPopupOpen(false);
  }

  return (
    <OptionPopover
         hoverText="Select Options"
         isOpen={isPopupOpen}
         onOpen={handleTogglePopup}
         onClose={handleClosePopup}
    >

                    {/* Select specie */}
                    <div className="flex flex-col gap-0.5">
                        <small className='font-semibold'>Specie</small>
                        <div className="border-b border-b-gray-400"/>
                    </div>
                    <SimpleSelect
                      options={locSpecies}
                      onSelectValue={handleSpecieChange}
                      value={locSelectedSpecie.displayText}
                      width="w-full"
                    />

                    <div className="flex flex-col gap-0.5">
                        <small className='font-semibold'>Variable</small>
                        <div className="border-b border-b-gray-400"/>
                    </div>
                    <SimpleSelect
                      options={locParams}
                      value={locSelectedParam.displayText}
                      onSelectValue={handleVariableChange}
                      width="w-full"
                    />


                    <div className="flex flex-col gap-0.5">
                        <small className='font-semibold'>Time</small>
                        <div className="border-b border-b-gray-400"/>
                    </div>
                    <ReactDatetimePicker
                      onChange={handleDateChange}
                      value={locTime}
                      minDate={temporal?.start_time}
                      maxDate={adjustedTime?.fresh_time}
                    />

        {/* Display data button */}
        <ButtonBorder
            ariaLabel="Display VP data"
            onClick={handleSubmitPopupData}
            className='py-2 mt-2'
            isPrimary
        >
            Display data
        </ButtonBorder>
      
    </OptionPopover>
  )
}

export default memo(VpHistPopup);
