import { useEffect, useState, memo } from "react";
import ButtonBorder from "../../../../shared/components/buttons/borderedbtn/ButtonBorder"
import ReactDatetimePicker from "../../../../shared/components/input/ReactDatetime";
import OptionPopover from "../../../../shared/components/popups/option/OptionPopover"
import SimpleSelect from "../../../../shared/components/selects/SimpleSelect"
import type { SelectOption } from "../../../../shared/components/selects/types";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { changeVptsHistPayload, closeVptsHistPopup, setSelectedVptsHistParameterOption, setVptsHistEndTime, setVptsHistStartTime, toggleVptsHistPopup } from "../../slices/vptsHistChartSlice";



const VptsHistPopup = () => {

    // --- read only redux states ----
    const { parameterOptions, selectedParameter, vptsStartTime, isPopupOpen, vptsEndTime } = useAppSelector(state => state.vpts_histchart);

    // --- Local states for the inputs ---
    const [locParams, setLocParams] = useState(parameterOptions);
    const [locSelectedParam, setLocSelectedParam] = useState(selectedParameter);
    const [locStartTime, setLocStartTime] = useState(vptsStartTime);
    const [locEndTime, setLocEndTime] = useState(vptsEndTime);

    // ---- Synch with redux states on mount ---
    useEffect(() => {
      if (isPopupOpen) {
        setLocParams(parameterOptions);
        setLocSelectedParam(selectedParameter);
        setLocStartTime(vptsStartTime);
        setLocEndTime(vptsEndTime);
      }
    }, [isPopupOpen, parameterOptions, selectedParameter, vptsEndTime, vptsStartTime]);

    //  --- local handlers to update the inputs
    const handleStartTimeChange = (date: string) => {
      setLocStartTime(date);
      setLocEndTime(date); // ensure end time is not before start time
    }
    const handleEndTimeChange = (date: string) => {
      setLocEndTime(date);
    }
    const handleVariableChange = (option: SelectOption) => {
      setLocSelectedParam(option);
    }

    // --- Popup togglers ---
    const handleTogglePopup = () => {
      dispatch(toggleVptsHistPopup())
    }
    const handleClosePopup = () => {
      dispatch(closeVptsHistPopup())
    }

    const dispatch = useAppDispatch();


    const handleSubmitPopupData = () => {
      dispatch(changeVptsHistPayload(
        {
          startTime: locStartTime,
          endTime: locEndTime,
          parameter: locSelectedParam.id as string
        }
      ));

      // --- update Redux store ---
      dispatch(setVptsHistStartTime(locStartTime));
      dispatch(setVptsHistEndTime(locEndTime));
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


          <small className="font-semibold">Select variable</small>
          <div className="border-b border-b-gray-400"/>
          <SimpleSelect
            options={locParams}
            value={locSelectedParam.displayText}
            onSelectValue={handleVariableChange}
            width="w-full"
          />



          <small className="font-semibold">Select start Time</small>
          <div className="border-b border-b-gray-400"/>
          <ReactDatetimePicker
            onChange={handleStartTimeChange}
            value={locStartTime}
          />

          <small className="font-semibold">Select end Time</small>
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

export default memo(VptsHistPopup);
