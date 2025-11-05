import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { BirdIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import SimpleSelect from '../../../shared/components/selects/SimpleSelect'
import type { SelectOption } from '../../../shared/components/selects/types'
import { setClassificationColorOne, setClassificationColorZero, setSelectedClassificationOption } from '../slice/classificationPopupSlice';
import { useRef } from 'react'


type ClassificationPopupProps = {
    onChangeClassifVariable?: (option: SelectOption) => void;
    onChangeClassifColorZero?: (color: string) => void;
    onChangeClassifColorOne?: (color: string) => void;
}

const ClassificationPopup = ({ onChangeClassifVariable, onChangeClassifColorOne, onChangeClassifColorZero }: ClassificationPopupProps) => {

    const { availableVariables, selectedVariable, color_0, color_1 } = useAppSelector(state=> state.classificationpopup);

    const dispatch = useAppDispatch();

      // Refs pour stocker les timers de debounce
      const colorZeroTimeout = useRef<number | null>(null);
      const colorOneTimeout = useRef<number | null>(null);

    const handleClassificationVariableChange = (option: SelectOption) => {
        onChangeClassifVariable?.(option);
        dispatch(setSelectedClassificationOption(option));
    }

    const handleColorZeroChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const color = evt.target.value;
        dispatch(setClassificationColorZero(color)); 
        if (colorZeroTimeout.current) window.clearTimeout(colorZeroTimeout.current);
        colorZeroTimeout.current = window.setTimeout(() => {
          onChangeClassifColorZero?.(color);
        }, 900);
    };

    const handleColorOneChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const color = evt.target.value;
        dispatch(setClassificationColorOne(color));

        if (colorOneTimeout.current) window.clearTimeout(colorOneTimeout.current);
        colorOneTimeout.current = window.setTimeout(() => {
        onChangeClassifColorOne?.(color);
        }, 900);
    };



  return (

    <OptionPopover
        hoverText='Classification Data'
        customIcon={<BirdIcon/>}
    >
        <small>Select a variable</small>
        <div className="border-b border-b-gray-400"/>

        <SimpleSelect
            options={availableVariables}
            value={selectedVariable.displayText}
            width='w-95'
            onSelectValue={handleClassificationVariableChange}
        />

        <small>Select colors </small>
        <div className="border-b border-b-gray-400"/>
        <input onChange={handleColorZeroChange} value={color_0} className='w-full h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm' type="color" name="color_0" id="color_0" />
        <input onChange={handleColorOneChange} value={color_1} className='w-full h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm'  type="color" name="color_1" id="color_0" />
    </OptionPopover>

  )
}

export default ClassificationPopup;
