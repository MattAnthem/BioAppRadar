import { BirdIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { SelectOption } from '../../../shared/components/selects/types'
import { setClassificationColorOne, setClassificationColorZero, setSelectedClassificationOption } from '../slice/classificationPopupSlice';
import { useEffect, useState, memo, lazy} from 'react'
import { setClassificationPayload } from '../slice/livemapSlice';

const OptionPopover = lazy(() => import('../../../shared/components/popups/option/OptionPopover'));
const SimpleSelect = lazy(() => import('../../../shared/components/selects/SimpleSelect'));
const ButtonBorder = lazy(() => import('../../../shared/components/buttons/borderedbtn/ButtonBorder'));
const ColorInput = lazy(() => import('../../../shared/components/input/ColorInput'));



const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const ClassificationPopup = () => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // redux read only states
    const { availableVariables, selectedVariable, color_0, color_1 } = useAppSelector(state=> state.classificationpopup);

    // Local states for the inputs
    const [locAvailableVars, setLocAvailableVars] = useState(availableVariables); 
    const [locSelectedVar, setLocSelectedVar] = useState(selectedVariable);
    const [locColor0, setLocColor0] = useState(color_0);
    const [locColor1, setLocColor1] = useState(color_1);


    // --- Sync local states with redux states on mount and when redux states change ---
    useEffect(() => {
        if (isPopupOpen) {
        setLocAvailableVars(availableVariables);
        setLocSelectedVar(selectedVariable);
        setLocColor0(color_0);
        setLocColor1(color_1);
        }
    }, [availableVariables, color_0, color_1, selectedVariable, isPopupOpen])

    // --- Local input handlers (for edition : proper to the popup only) ---
    const handleInputVarChange = (variable: SelectOption) => {
        setLocSelectedVar(variable);
    }

    // ---  Controls of the popup ---
    const handleTooglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    }
    const closePopup = () => {
        setIsPopupOpen(false);
    }

    const dispatch = useAppDispatch();


    // Submit popup
    const submitPopupData = () => {
        dispatch(setClassificationPayload({
            class: locSelectedVar.id as string,
            color_0: locColor0,
            color_1: locColor1,
        }))
        // --- Update redux states ---
        dispatch(setSelectedClassificationOption(locSelectedVar));
        dispatch(setClassificationColorZero(locColor0));
        dispatch(setClassificationColorOne(locColor1));

        // ---- close on submit ---
        setIsPopupOpen(false);
    }

  return (

    <OptionPopover
        hoverText='Classification Data'
        customIcon={<BirdIcon className={iconSize}/>}
        isOpen={isPopupOpen}
        onClose={closePopup}
        onOpen={handleTooglePopup}
    >
        <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>Variable</small>
              <div className="border-b border-b-gray-400"/>
        </div>

        <SimpleSelect
            options={locAvailableVars}
            value={locSelectedVar.displayText}
            width='w-full'
            onSelectValue={handleInputVarChange}
        />

        <div className="flex flex-col gap-0.5">
              <small className='font-semibold'>Colors</small>
              <div className="border-b border-b-gray-400"/>
          </div>


        {/* color 1 */}
        <ColorInput
            label={locSelectedVar['type0'] as string}
            initialColor={locColor0}
            onColorCommit={setLocColor0}
        />
        <ColorInput
            label={locSelectedVar['type1'] as string}
            initialColor={locColor1}
            onColorCommit={setLocColor1}
        />


        <ButtonBorder
            ariaLabel='Display classification data on map'
            onClick={submitPopupData}
            className='py-2 mt-2'
            isPrimary
        >
            Display data
        </ButtonBorder>

    </OptionPopover>

  )
}

export default memo(ClassificationPopup);
