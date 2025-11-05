import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { BirdIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import type { SelectOption } from '../../../shared/components/selects/types';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import { setSelectedBioclassTime, setSelectedVcrossBioCls } from '../slice/vcrossPopupSlice';
import { formatChartDateParam } from '../../../shared/utils/date_format';

type Props = {
  onChangeBioclass?: (option: SelectOption) => void;
}

const VcrossBioClsDataPopup = ({ onChangeBioclass }: Props) => {

    const { availableBioClass, selectedBioClass, timeBioClass } = useAppSelector(state => state.vcrosspopup);
    const dispatch = useAppDispatch();

    const handleBioClassChange = (option: SelectOption) => {
      dispatch(setSelectedVcrossBioCls(option));
      onChangeBioclass?.(option);
    }

    const handleBioClassTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const raw = evt.target.value; 
      const formatted = formatChartDateParam(raw);
      dispatch(setSelectedBioclassTime(formatted));
    }

  return (
    <OptionPopover
        hoverText='Select Classification Data'
        customIcon={<BirdIcon/>}
    >

      <small>Available classification data</small>
      <div className="border-b border-b-gray-400"/>
      <SimpleSelect
        onSelectValue={handleBioClassChange}
        options={availableBioClass}
        width='w-95'
        value={selectedBioClass.displayText}
      />

      {/* Select Time */}
      <small>Select time</small>
      <div className="border-b border-b-gray-400"/>
      <input onChange={handleBioClassTimeChange} value={timeBioClass} step={1} className="w-full p-2 border rounded-sm" type="datetime-local" name="bioclassTime" id="bioclassTime" />

        
    </OptionPopover>
  )
}

export default VcrossBioClsDataPopup;
