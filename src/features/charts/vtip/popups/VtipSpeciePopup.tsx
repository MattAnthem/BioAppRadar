import { memo, lazy } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import type { SelectOption } from "../../../../shared/components/selects/types";
import { changeVtipPayload, setSelectedVtipSpecie } from "../slices/vtipChartSlice";

const OptionPopover = lazy(() => import("../../../../shared/components/popups/option/OptionPopover"));
const SimpleSelect = lazy(() => import("../../../../shared/components/selects/SimpleSelect"));

const VtipSpeciePopup = () => {

    // Redux readOnly states
    const { speciesOptions, selectedSpecie } = useAppSelector(state => state.vtipchart);

    const dispatch = useAppDispatch();


    // Input handler
    const handleSpecieChange = (option: SelectOption) => {
        dispatch(changeVtipPayload({
            species: option.id as string 
        }))
        dispatch(setSelectedVtipSpecie(option));
    }

  return (
    <OptionPopover
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

export default memo(VtipSpeciePopup);
