import OptionPopover from "../../../shared/components/popups/option/OptionPopover";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../../shared/components/selects/types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { changeVtipPayload, closeSpeciesPopup, setSelectedVtipSpecie, toggleSpeciesPopup } from "../vtipChartSlice";


const VtipSpeciePopup = () => {

    // Redux readOnly states
    const { isSpeciesPopupOpen, speciesOptions, selectedSpecie } = useAppSelector(state => state.vtipchart);

    const dispatch = useAppDispatch();

    // Popup handler
    const togglePopup = () => {
        dispatch(toggleSpeciesPopup())
    }
    const closePopup = () => {
        dispatch(closeSpeciesPopup());
    }

    // Input handler
    const handleSpecieChange = (option: SelectOption) => {
        dispatch(changeVtipPayload({
            species: option.id as string 
        }))
        dispatch(setSelectedVtipSpecie(option));
    }

  return (
    <OptionPopover
        isOpen={isSpeciesPopupOpen}
        onOpen={togglePopup}
        onClose={closePopup}
        hoverText='Change species'
    >
        {/* Select specie */}
        <small className="font-semibold">Species</small>
        <div className="border-b border-b-gray-400"/>
        <SimpleSelect
            onSelectValue={handleSpecieChange}
            options={speciesOptions}
            value={selectedSpecie.displayText}
            width='w-full'
        />

    </OptionPopover>
  )
}

export default VtipSpeciePopup
