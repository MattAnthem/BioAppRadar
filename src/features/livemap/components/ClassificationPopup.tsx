import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { BirdIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import SimpleSelect from '../../../shared/components/selects/SimpleSelect'
import type { SelectOption } from '../../../shared/components/selects/types'
import { closeClassifPopup, setClassificationColorOne, setClassificationColorZero, setSelectedClassificationOption, toggleClassifPopup } from '../slice/classificationPopupSlice';
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder'


type ClassificationPopupProps = {
    onSubmitPopup?: () => void;
}

const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const ClassificationPopup = ({ onSubmitPopup }: ClassificationPopupProps) => {

    const { availableVariables, selectedVariable, color_0, color_1, isPopupOpen } = useAppSelector(state=> state.classificationpopup);

    const dispatch = useAppDispatch();


    const handleClassificationVariableChange = (option: SelectOption) => {
        dispatch(setSelectedClassificationOption(option));
    }

    const handleColorZeroChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const color = evt.target.value;
        dispatch(setClassificationColorZero(color)); 
    };

    const handleColorOneChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const color = evt.target.value;
        dispatch(setClassificationColorOne(color));
    };


    // Submit popup
    const submitPopupData = () => {
        dispatch(closeClassifPopup());
        onSubmitPopup?.();
    }

  return (

    <OptionPopover
        hoverText='Classification Data'
        customIcon={<BirdIcon className={iconSize}/>}
        isOpen={isPopupOpen}
        onClose={() => dispatch(closeClassifPopup())}
        onOpen={() => dispatch(toggleClassifPopup())}
    >
        <small>Select a variable</small>
        <div className="border-b border-b-gray-400"/>

        <SimpleSelect
            options={availableVariables}
            value={selectedVariable.displayText}
            width='w-95'
            onSelectValue={handleClassificationVariableChange}
        />

        <small className='font-semibold'>Select colors </small>
        <div className="border-b border-b-gray-400"/>

        <div className="grid grid-cols-2 w-1/2 gap-0.5 justify-start capitalize items-center">
            <small>{selectedVariable['type0'] as string}:</small>
            <input onChange={handleColorZeroChange} value={color_0} className='w-10 h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm' type="color" name="color_0" id="color_0" />
        </div>
        <div className="grid grid-cols-2 w-1/2 gap-0.5 justify-start capitalize items-center">
            <small>{selectedVariable['type1'] as string}:</small>
            <input onChange={handleColorOneChange} value={color_1} className='w-10 h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm'  type="color" name="color_1" id="color_0" />
        </div>

        <ButtonBorder
            onClick={submitPopupData}
            className='py-2 mt-2'
        >
            Display data
        </ButtonBorder>

    </OptionPopover>

  )
}

export default ClassificationPopup;
