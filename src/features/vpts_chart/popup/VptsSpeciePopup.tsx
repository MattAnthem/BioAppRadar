import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import SimpleSelect from '../../../shared/components/selects/SimpleSelect'
import type { SelectOption } from '../../../shared/components/selects/types'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { changeVptsPayload, closeSpeciesPopup, setSelectedVptsSPecie, toggleSpeciesPopup } from '../vptsChartSlice'

const VptsSpeciePopup = () => {

    const { isSpeciesPopupOpen, speciesOptions, selectedSpecie } = useAppSelector(state => state.vptschart)


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
        dispatch(changeVptsPayload({
            species: option.id as string 
        }))
        dispatch(setSelectedVptsSPecie(option));
    }

  return (
    <OptionPopover
        isOpen={isSpeciesPopupOpen}
        onOpen={togglePopup}
        onClose={closePopup}
        hoverText='Change species'
        isSimpleSelect
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

export default VptsSpeciePopup
