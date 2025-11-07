import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { BirdIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import SimpleSelect from '../../../shared/components/selects/SimpleSelect'
import type { SelectOption } from '../../../shared/components/selects/types'
import { useRef } from 'react'
import { setHistClassificationColorZero, setSelectedHistClassificationOption, setHistClassificationColorOne } from '../slice/histClassificationPopupSlice'
import { formatChartDateParam } from '../../../shared/utils/date_format'
import { setHistClassifTime } from '../../livemap/slice/classificationPopupSlice'



type ClassificationPopupProps = {
  onChangeClassifVariable?: (option: SelectOption) => void;
  onChangeClassifColorZero?: (color: string) => void;
  onChangeClassifColorOne?: (color: string) => void;
  color0Legend?: string;
  color1Legend?: string;
  onChangeClassifTime?: (time: string) => void;
  toggleMode?: () => void;
}

const ClassificationPopup = ({ onChangeClassifVariable, onChangeClassifColorOne, onChangeClassifColorZero, color0Legend, color1Legend, onChangeClassifTime, toggleMode }: ClassificationPopupProps) => {

  const { availableVariables, selectedVariable, color_0, color_1, histClassifTime } = useAppSelector(state=> state.classificationpopup);

  const dispatch = useAppDispatch();

    // Refs pour stocker les timers de debounce
    const colorZeroTimeout = useRef<number | null>(null);
    const colorOneTimeout = useRef<number | null>(null);

  const handleClassificationVariableChange = (option: SelectOption) => {
      onChangeClassifVariable?.(option);
      dispatch(setSelectedHistClassificationOption(option));
  }

  const handleColorZeroChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const color = evt.target.value;
      dispatch(setHistClassificationColorZero(color)); 
      if (colorZeroTimeout.current) window.clearTimeout(colorZeroTimeout.current);
      colorZeroTimeout.current = window.setTimeout(() => {
        onChangeClassifColorZero?.(color);
      }, 900);
  };

  const handleColorOneChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const color = evt.target.value;
      dispatch(setHistClassificationColorOne(color));

      if (colorOneTimeout.current) window.clearTimeout(colorOneTimeout.current);
      colorOneTimeout.current = window.setTimeout(() => {
      onChangeClassifColorOne?.(color);
      }, 900);
  };

  const handleClassifTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const raw = evt.target.value; 
    const formatted = formatChartDateParam(raw);
    onChangeClassifTime?.(formatted);
    dispatch(setHistClassifTime(formatted))
  }



return (

  <OptionPopover
      hoverText='Classification Data'
      customIcon={<BirdIcon/>}
      onClickEvent={toggleMode}
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

      <div className="flex gap-2 justify-start capitalize items-center">
          <small>{color0Legend ?? availableVariables[0].id} :</small>
          <input onChange={handleColorZeroChange} value={color_0} className='w-10 h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm' type="color" name="color_0" id="color_0" />
      </div>
      <div className="flex items-center capitalize gap-2">
          <small>{color1Legend ?? availableVariables[1].id}</small>
          <input onChange={handleColorOneChange} value={color_1} className='w-10 h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm'  type="color" name="color_1" id="color_0" />
      </div>

              {/* Time */}
        <small className='font-semibold'>Select time</small>
        <div className="border-b border-b-gray-400"/>
        <input onChange={handleClassifTimeChange} value={histClassifTime} step={1} className="w-full p-2 border rounded-sm" type="datetime-local" name="classifHistTime" id="classifHistTime" />


  </OptionPopover>

)
}

export default ClassificationPopup;
