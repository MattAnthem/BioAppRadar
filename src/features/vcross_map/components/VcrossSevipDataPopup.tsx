import { FlipHorizontal } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { closeVcrossSevipPopup, setSelectedVcrossSevipVariable, setVcrossSevipTime, toggleVcrossSevipPopup } from '../slice/vcrossPopupSlice';
import type { SelectOption } from '../../../shared/components/selects/types';
import { useEffect, useState, memo, lazy } from 'react';
import { setVcrossSevipPayload } from '../slice/vcrossMapSlice';

const OptionPopover = lazy(() => import('../../../shared/components/popups/option/OptionPopover'));
const SimpleSelect = lazy(() => import('../../../shared/components/selects/SimpleSelect'));
const ReactDatetimePicker = lazy(() => import('../../../shared/components/input/ReactDatetime'));
const ButtonBorder = lazy(() => import('../../../shared/components/buttons/borderedbtn/ButtonBorder'));

const VcrossSevipDataPopup = () => {

  // --- Redux read only states ---
  const { sevipTime, sevipVariables, selectedSevipVar, isSevipPopupOpen } = useAppSelector(state => state.vcrosspopup);
  
  // --- Local states for the inputs ---
  const [locTime, setLocTime] = useState(sevipTime);
  const [locVariables, setLocVariables] = useState(sevipVariables);
  const [locSelectedVar, setLocSelectedVar] = useState(selectedSevipVar);
  

  // --- Sync local states when states from redux changes or on mount and if the popup opens ---
  useEffect(() => {
    if (isSevipPopupOpen) {
      setLocTime(sevipTime);
      setLocVariables(sevipVariables);
      setLocSelectedVar(selectedSevipVar);
    }
  }, [isSevipPopupOpen, selectedSevipVar, sevipTime, sevipVariables]);

  // --- Local input handlers for edition on this popup ---
  const handleVariableChange = (variable: SelectOption) => {
    setLocSelectedVar(variable);
  }
  const handleTimeChange = (date: string) => {
    setLocTime(date);
  }

  // --- Redux popup control ---
  const handleTogglePopup = () => {
    dispatch(toggleVcrossSevipPopup())
  }
  const handleClosePopup = () => {
    dispatch(closeVcrossSevipPopup());
  }

  const dispatch = useAppDispatch();


  const handleSubmitPopup = () => {
    dispatch(setVcrossSevipPayload({
      parameter: locSelectedVar.id as string,
      time: locTime,
    }));

    // --- dispatch the new state values to the store
    dispatch(setSelectedVcrossSevipVariable(locSelectedVar));
    dispatch(setVcrossSevipTime(locTime));

    dispatch(closeVcrossSevipPopup());
  }

  return (
    <OptionPopover
      isOpen={isSevipPopupOpen}
      onClose={handleClosePopup}
      onOpen={handleTogglePopup}
      customIcon={<FlipHorizontal className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4"/>}
      hoverText='Vertical Integrated Profile Data'
    >

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
