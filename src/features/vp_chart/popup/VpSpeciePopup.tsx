import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { changeVpPayload, closeSpeciesPopup, setSelectedVpSpecie, toggleSpeciesPopup } from '../vpChartSlice';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import type { SelectOption } from '../../../shared/components/selects/types';

const VpSpeciePopup = () => {
    // Redux readOnly states
    const { isSpeciesPopupOpen, speciesOptions, selectedSpecie } = useAppSelector(state => state.vpchart);

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
        dispatch(changeVpPayload({
            species: option.id as string 
        }))
        dispatch(setSelectedVpSpecie(option));
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

export default VpSpeciePopup
