import { useEffect, useState, memo } from "react";
import ButtonBorder from "../../../../shared/components/buttons/borderedbtn/ButtonBorder";
import ReactDatetimePicker from "../../../../shared/components/input/ReactDatetime";
import OptionPopover from "../../../../shared/components/popups/option/OptionPopover";
import SimpleSelect from "../../../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../../../shared/components/selects/types";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { changeVpHistPayload, closeVpHistPopup, setSelectedVpHistParameterOption, setVpHistTime, toggleVpHistPopup } from "../../slices/vpHistChartSlice";

const VpHistPopup = () => {

  // Redux read only states
  const { parameterOptions, selectedParameter, isPopupOpen, vpTime } = useAppSelector(state => state.vp_histchart);

  // Local state variables for the inputs 
  const [locParams, setLocParams] = useState(parameterOptions);
  const [locSelectedParam, setLocSelectedParam] = useState(selectedParameter);
  const [locTime, setLocTime] = useState(vpTime);

  // --- Sync Local states with redux state on mount ----
  useEffect(() => {
    if (isPopupOpen) {
      setLocParams(parameterOptions);
      setLocSelectedParam(selectedParameter);
      setLocTime(vpTime);
    }
  }, [isPopupOpen, parameterOptions, selectedParameter, vpTime]);

  // --- local input handlers ---
  const handleDateChange = (date: string) => {
    setLocTime(date);
  }
  const handleVariableChange = (option: SelectOption) => {
    setLocSelectedParam(option);
  }

  // --- popup controls ---
  const handleTogglePopup = () => {
    dispatch(toggleVpHistPopup())
  }
  const handleClosePopup = () => {
    dispatch(closeVpHistPopup())
  }

  const dispatch = useAppDispatch()


  const handleSubmitPopupData = () => {
    dispatch(changeVpHistPayload({
      parameter: locSelectedParam.id as string,
      time: locTime,
    }))

    // update redux states 
    dispatch(setVpHistTime(locTime));
    dispatch(setSelectedVpHistParameterOption(locSelectedParam));


    dispatch(closeVpHistPopup())
  }

  return (
    <OptionPopover
         hoverText="Select Options"
         isOpen={isPopupOpen}
         onOpen={handleTogglePopup}
         onClose={handleClosePopup}
    >


                    <small className="font-semibold">Select Variable</small>
                    <div className="border-b border-b-gray-400"/>
                    <SimpleSelect
                      options={locParams}
                      value={locSelectedParam.displayText}
                      onSelectValue={handleVariableChange}
                      width="w-full"
                    />


                    <small className="font-semibold">Select Time</small>
                    <div className="border-b border-b-gray-400"/>
                    <ReactDatetimePicker
                      onChange={handleDateChange}
                      value={locTime}
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

export default memo(VpHistPopup);
