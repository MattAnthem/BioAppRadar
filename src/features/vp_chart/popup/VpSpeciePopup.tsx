import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { changeVpPayload, setSelectedVpSpecie } from '../vpChartSlice';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import type { SelectOption } from '../../../shared/components/selects/types';

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
