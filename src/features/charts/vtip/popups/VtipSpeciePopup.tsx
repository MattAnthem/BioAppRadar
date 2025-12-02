import { memo, lazy, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import type { SelectOption } from "../../../../shared/components/selects/types";
import { changeVtipPayload, setSelectedVtipSpecie } from "../slices/vtipChartSlice";

const OptionPopover = lazy(() => import("../../../../shared/components/popups/option/OptionPopover"));
const SimpleSelect = lazy(() => import("../../../../shared/components/selects/SimpleSelect"));

const VtipSpeciePopup = () => {

    // Control the popup so that we can close it select value 
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Redux readOnly states
    const { speciesOptions, selectedSpecie } = useAppSelector(state => state.vtipchart);

    const dispatch = useAppDispatch();


    // Input handler
    const handleSpecieChange = (option: SelectOption) => {
        dispatch(changeVtipPayload({
            species: option.id as string 
        }))
        dispatch(setSelectedVtipSpecie(option));

        // Close the popup on change 
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

export default memo(VtipSpeciePopup);
