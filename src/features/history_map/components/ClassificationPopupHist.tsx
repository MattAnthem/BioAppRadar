import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { BirdIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import SimpleSelect from '../../../shared/components/selects/SimpleSelect'
import type { SelectOption } from '../../../shared/components/selects/types'
import { setHistClassificationColorZero, setSelectedHistClassificationOption, setHistClassificationColorOne, setHistClassifTime, closeClassifPopup, toggleClassifPopup } from '../slice/histClassificationPopupSlice'
import { formatChartDateParam } from '../../../shared/utils/date_format'
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder'



type ClassificationPopupProps = {
  onSubmitPopup?: () => void;
}

const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const ClassificationPopup = ({ onSubmitPopup }: ClassificationPopupProps) => {


  const { availableVariables, selectedVariable, color_0, color_1, histClassifTime, isPopupOpen } = useAppSelector(state=> state.hist_classifpopup);

  const dispatch = useAppDispatch();


  //#region  Handlers to update REDUX popup State
  const handleClassificationVariableChange = (option: SelectOption) => {
      dispatch(setSelectedHistClassificationOption(option));
  }

  const handleColorZeroChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const color = evt.target.value;
      dispatch(setHistClassificationColorZero(color)); 

  };

  const handleColorOneChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const color = evt.target.value;
      dispatch(setHistClassificationColorOne(color));
  };

  const handleClassifTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const raw = evt.target.value; 
    const formatted = formatChartDateParam(raw);
    dispatch(setHistClassifTime(formatted))
  }
  //#endregion

  const handleSubmit = () => {
    onSubmitPopup?.();
    dispatch(closeClassifPopup());
}

return (

  <OptionPopover
      hoverText='Classification Data'
      customIcon={<BirdIcon className={iconSize}/>}
      isOpen={isPopupOpen}
      onOpen={() => dispatch(toggleClassifPopup())}
      onClose={() => dispatch(closeClassifPopup())}
  >
      <small className='font-semibold'>Select a variable</small>
      <div className="border-b border-b-gray-400"/>

      <SimpleSelect
          options={availableVariables}
          value={selectedVariable.displayText}
          width='w-95'
          onSelectValue={handleClassificationVariableChange}
      />

      <small className='font-semibold'>Select colors </small>
      <div className="border-b border-b-gray-400"/>

      <div className="grid grid-cols-2 w-1/2 gap-0.5 justify-center capitalize items-center">
          <small className='w-fit'>{ selectedVariable['type0'] as string}:</small>
          <input onChange={handleColorZeroChange} value={color_0} className='w-10 h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm' type="color" name="color_0" id="color_0" />
      </div>
      <div className="grid grid-cols-2 w-1/2 gap-0.5 justify-start items-center capitalize">
          <small className='w-fit'>{ selectedVariable['type1'] as string}:</small>
          <input onChange={handleColorOneChange} value={color_1} className='w-10 h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm'  type="color" name="color_1" id="color_0" />
      </div>

      {/* Time */}
      <small className='font-semibold'>Select time</small>
      <div className="border-b border-b-gray-400"/>
      <input onChange={handleClassifTimeChange} value={histClassifTime} step={1} className="w-full p-2 border rounded-sm" type="datetime-local" name="classifHistTime" id="classifHistTime" />

      {/* Display data btn */}
      <ButtonBorder
        onClick={handleSubmit}
        className='py-2 mt-2'
      >
        Display Data
      </ButtonBorder>

  </OptionPopover>

)
}

export default ClassificationPopup;
