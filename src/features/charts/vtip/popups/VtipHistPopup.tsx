import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import type { SelectOption } from '../../../../shared/components/selects/types';
import { useEffect, useState, memo, useMemo, lazy } from 'react';
import { useVpTemporalCoverageQuery } from '../../../../shared/hooks/useQuery/useVpTemporalCoverageQuery';
import dayjs from 'dayjs';
import { changeVtipHistPayload, setSelectedVtipHistParameterOption, setSelectedVtipHistSpecie, setVtipHistEndTime, setVtipHistStartTime } from '../slices/vtipHistChartSlice';

const SimpleSelect = lazy(() => import('../../../../shared/components/selects/SimpleSelect'));
const ButtonBorder = lazy(() => import('../../../../shared/components/buttons/borderedbtn/ButtonBorder'));
const OptionPopover = lazy(() => import('../../../../shared/components/popups/option/OptionPopover'));
const ReactDatetimePicker = lazy(() => import('../../../../shared/components/input/ReactDatetime'));


const VtipHistPopup = () => {

    // Control the popup so that we can close it select value 
     const [isPopupOpen, setIsPopupOpen] = useState(false);

    // --- Read only state from Redux store
    const { parameterOptions, selectedParameter, vtipStartTime, vtipEndTime, selectedSpecie, speciesOptions } = useAppSelector(state => state.vtip_histchart);
    const dispatch = useAppDispatch();

    // --- Temporal coverages to restrict time selects only on mount ---
    const { data: temporal, isSuccess } = useVpTemporalCoverageQuery(1, {
        staleTime: 0,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        enabled: true,
    });

    // --Adjust time to use fresh timerange from the time coverage ---
    const adjustedTimes = useMemo(() => {
        if (!temporal) return null;
      
        const fresh_end = dayjs(temporal.end_time).add(2, "hour").format("YYYY-MM-DD HH:mm:ss");
        const fresh_start = dayjs(fresh_end).subtract(1, "hour").format("YYYY-MM-DD HH:mm:ss");
      
        return { fresh_start, fresh_end };
    }, [temporal]);

    // --- Hydrate Redux Slice if the query succeed
    useEffect(() => {
        if(!isSuccess || !adjustedTimes) return;

        dispatch(setVtipHistStartTime(adjustedTimes.fresh_start));
        dispatch(setVtipHistEndTime(adjustedTimes.fresh_end));

        dispatch(changeVtipHistPayload(
            {
              startTime: adjustedTimes.fresh_start,
              endTime: adjustedTimes.fresh_end,
            }
        ));

    }, [adjustedTimes, dispatch, isSuccess])

    // --- Local state variables for controlling popup form inputs ---
    const [locParameters, setLocParameters] = useState<SelectOption[]>(parameterOptions ?? []);
    const [locSelectedParameter, setLocSelectedParameter] = useState<SelectOption>(selectedParameter ?? null);
    const [locSpecies, setLocSpecies] = useState(speciesOptions ?? []);
    const [locSelectedSpecie, setLocSelectedSpecie] = useState(selectedSpecie ?? null);
    const [locStartTime, setLocStartTime] = useState<string>(vtipStartTime ?? '');
    const [locEndTime, setLocEndTime] = useState<string>(vtipEndTime ?? '');

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
        setIsPopupOpen(!isPopupOpen);
    }
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    }



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

        setIsPopupOpen(false);
    }

  return (
    <OptionPopover
        hoverText="Select Options"
        isOpen={isPopupOpen}
        onOpen={handleTogglePopup}
        onClose={handleClosePopup}
    >

 
        <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>Specie</small>
              <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={locSpecies}
            value={locSelectedSpecie.displayText}
            onSelectValue={handleSpecieChange}
            width='w-full'
        />


        <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>Variable</small>
              <div className="border-b border-b-gray-400"/>
        </div>
        <SimpleSelect
            options={locParameters}
            value={locSelectedParameter.displayText}
            onSelectValue={handleVariableChange}
            width="w-full"
        />


            <div className="flex flex-col gap-0.5">
                <small className='font-semibold'>Start</small>
                <div className="border-b border-b-gray-400"/>
            </div>

            <ReactDatetimePicker
                onChange={handleStartTimeChange}
                value={locStartTime}
                minDate={temporal?.start_time}
                maxDate={adjustedTimes?.fresh_end}
            />

            <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>End</small>
              <div className="border-b border-b-gray-400"/>
            </div>
            <ReactDatetimePicker 
                onChange={handleEndTimeChange}
                value={locEndTime}
                minDate={locStartTime}
                maxDate={adjustedTimes?.fresh_end}
            />


        {/* Display data button */}
        <ButtonBorder
            ariaLabel='Display VTIP data'
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
