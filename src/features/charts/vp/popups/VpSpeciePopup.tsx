
import { lazy, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import type { SelectOption } from '../../../../shared/components/selects/types';
import { changeVpPayload, setSelectedVpSpecie } from '../slices/vpChartSlice';

const OptionPopover = lazy(() => import("../../../../shared/components/popups/option/OptionPopover"));
const SimpleSelect = lazy(() => import("../../../../shared/components/selects/SimpleSelect"));

const VpSpeciePopup = () => {
    // Control the popup so that we can close it select value 
     const [isPopupOpen, setIsPopupOpen] = useState(false);
    // Redux readOnly states
    const { speciesOptions, selectedSpecie } = useAppSelector(state => state.vpchart);

    const dispatch = useAppDispatch();


    // Input handler
    const handleSpecieChange = (option: SelectOption) => {
        dispatch(changeVpPayload({
            species: option.id as string 
        }))
        dispatch(setSelectedVpSpecie(option));

        // Close on change species
        setIsPopupOpen(false);
    }

    // --- popup controls ---
    const handleTogglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    }
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    }

  return (
    <OptionPopover
        hoverText='Change species'
        isSimpleSelect
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onOpen={handleTogglePopup}
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
