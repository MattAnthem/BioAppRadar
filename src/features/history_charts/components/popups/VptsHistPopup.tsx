import { useEffect, useState, memo, useMemo, lazy } from "react";
import type { SelectOption } from "../../../../shared/components/selects/types";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { changeVptsHistPayload, closeVptsHistPopup, setSelectedVptsHistParameterOption, setSelectedVptsHistSpecie, setVptsHistEndTime, setVptsHistStartTime, toggleVptsHistPopup } from "../../slices/vptsHistChartSlice";
import { useVpTemporalCoverageQuery } from "../../../../shared/hooks/useQuery/useVpTemporalCoverageQuery";
import dayjs from "dayjs";

const ButtonBorder = lazy(() => import('../../../../shared/components/buttons/borderedbtn/ButtonBorder'));
const ReactDatetimePicker = lazy(() => import('../../../../shared/components/input/ReactDatetime'));
const OptionPopover = lazy(() => import('../../../../shared/components/popups/option/OptionPopover'));
const SimpleSelect = lazy(() => import('../../../../shared/components/selects/SimpleSelect'));


const VptsHistPopup = () => {

    // --- read only redux states ----
    const { parameterOptions, selectedParameter, vptsStartTime, isPopupOpen, vptsEndTime, selectedSpecie, speciesOptions } = useAppSelector(state => state.vpts_histchart);
    const dispatch = useAppDispatch();

    // --- Temporal coverages to restrict time selects only on mount  ---
    const { data: temporal, isSuccess } = useVpTemporalCoverageQuery(1, {
      staleTime: 0,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      enabled: true,
    });

    const adjustedTimes = useMemo(() => {
      if (!temporal) return null;
    
      const fresh_end = dayjs(temporal.end_time).add(2, "hour").format("YYYY-MM-DD HH:mm:ss");
      const fresh_start = dayjs(fresh_end).subtract(1, "hour").format("YYYY-MM-DD HH:mm:ss");
    
      return { fresh_start, fresh_end };
    }, [temporal]);



    // --- Hydrate Redux slice if the query succeed ----
    useEffect(() => {
      if (!isSuccess || !adjustedTimes) return;

      dispatch(setVptsHistStartTime(adjustedTimes.fresh_start));
      dispatch(setVptsHistEndTime(adjustedTimes.fresh_end));
    
      dispatch(changeVptsHistPayload({
        startTime: adjustedTimes.fresh_start,
        endTime: adjustedTimes.fresh_end,
      }));

    }, [adjustedTimes, dispatch, isSuccess]);

    // --- Local states for the inputs ---
    const [locParams, setLocParams] = useState(parameterOptions);
    const [locSelectedParam, setLocSelectedParam] = useState(selectedParameter);
    const [locSpecies, setLocSpecies] = useState(speciesOptions);
    const [locSelectedSpecie, setLocSelectedSpecie] = useState(selectedSpecie);
    const [locStartTime, setLocStartTime] = useState(vptsStartTime);
    const [locEndTime, setLocEndTime] = useState(vptsEndTime);

    // ---- Synch with redux states on mount ---
    useEffect(() => {
      if (isPopupOpen) {
        setLocParams(parameterOptions);
        setLocSelectedParam(selectedParameter);
        setLocStartTime(vptsStartTime);
        setLocEndTime(vptsEndTime);
        setLocSpecies(speciesOptions);
        setLocSelectedSpecie(selectedSpecie);
      }
    }, [isPopupOpen, parameterOptions, selectedParameter, selectedSpecie, speciesOptions, vptsEndTime, vptsStartTime]);

    //  --- local handlers to update the inputs
    const handleStartTimeChange = (date: string) => {
      setLocStartTime(date);
    }
    const handleEndTimeChange = (date: string) => {
      setLocEndTime(date);
    }
    const handleVariableChange = (option: SelectOption) => {
      setLocSelectedParam(option);
    }

    const handleSpecieChange = (option: SelectOption) => {
      setLocSelectedSpecie(option);
    }

    // --- Popup togglers ---
    const handleTogglePopup = () => {
      dispatch(toggleVptsHistPopup())
    }
    const handleClosePopup = () => {
      dispatch(closeVptsHistPopup())
    }

    


    const handleSubmitPopupData = () => {
      dispatch(changeVptsHistPayload(
        {
          startTime: locStartTime,
          endTime: locEndTime,
          parameter: locSelectedParam.id as string,
          species: locSelectedSpecie.id as string,
        }
      ));

      // --- update Redux store ---
      dispatch(setVptsHistStartTime(locStartTime));
      dispatch(setVptsHistEndTime(locEndTime));
      dispatch(setSelectedVptsHistSpecie(locSelectedSpecie));
      dispatch(setSelectedVptsHistParameterOption(locSelectedParam));

      
      dispatch(closeVptsHistPopup());
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
              <small className='font-semibold'>Start</small>
              <div className="border-b border-b-gray-400"/>
          </div>
          <ReactDatetimePicker
                onChange={handleStartTimeChange}
                value={locStartTime}
                minDate={temporal?.start_time}
                maxDate={temporal?.end_time}
          />

          <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>End</small>
              <div className="border-b border-b-gray-400"/>
          </div>
          <ReactDatetimePicker 
                onChange={handleEndTimeChange}
                value={locEndTime}
                minDate={locStartTime}
                maxDate={temporal?.end_time}
          />

        {/* Display data button */}
        <ButtonBorder
            ariaLabel="Display VPTS data"
            onClick={handleSubmitPopupData}
            className='py-2 mt-2'
            isPrimary
        >
            Display data
        </ButtonBorder>

    </OptionPopover>
  )
}

export default memo(VptsHistPopup);
