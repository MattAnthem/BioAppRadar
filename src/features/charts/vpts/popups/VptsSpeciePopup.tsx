
import { lazy } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import type { SelectOption } from '../../../../shared/components/selects/types';
import { changeVptsPayload, setSelectedVptsSPecie } from '../slices/vptsChartSlice';

const OptionPopover = lazy(() => import("../../../../shared/components/popups/option/OptionPopover"));
const SimpleSelect = lazy(() => import("../../../../shared/components/selects/SimpleSelect"));

const VptsSpeciePopup = () => {

    const { speciesOptions, selectedSpecie } = useAppSelector(state => state.vptschart)


    const dispatch = useAppDispatch();


    // Input handler
    const handleSpecieChange = (option: SelectOption) => {
        dispatch(changeVptsPayload({
            species: option.id as string 
        }))
        dispatch(setSelectedVptsSPecie(option));
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

export default VptsSpeciePopup
