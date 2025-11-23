import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { changeVpPayload, setSelectedVpSpecie } from '../vpChartSlice';
import type { SelectOption } from '../../../shared/components/selects/types';
import { lazy } from 'react';

const OptionPopover = lazy(() => import("../../../shared/components/popups/option/OptionPopover"));
const SimpleSelect = lazy(() => import("../../../shared/components/selects/SimpleSelect"));

const VpSpeciePopup = () => {
    // Redux readOnly states
    const { speciesOptions, selectedSpecie } = useAppSelector(state => state.vpchart);

    const dispatch = useAppDispatch();


    // Input handler
    const handleSpecieChange = (option: SelectOption) => {
        dispatch(changeVpPayload({
            species: option.id as string 
        }))
        dispatch(setSelectedVpSpecie(option));
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

export default VpSpeciePopup
