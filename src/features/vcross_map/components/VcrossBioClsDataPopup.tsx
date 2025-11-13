import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { BirdIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import type { SelectOption } from '../../../shared/components/selects/types';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import { closeVcrossBioclassPopup, setSelectedBioclassTime, setSelectedVcrossBioCls, toggleVcrossBioclassPopup, toggleVcrossBioclassSegment } from '../slice/vcrossPopupSlice';
import ReactDatetimePicker from '../../../shared/components/input/ReactDatetime';
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder';

type Props = {
  onSubmitPopup?: () => void;
}

const VcrossBioClsDataPopup = ({ onSubmitPopup }: Props) => {

    const { availableBioClass, selectedBioClass, timeBioClass, segmentBioclass, isClassifPopupOpen } = useAppSelector(state => state.vcrosspopup);
    const dispatch = useAppDispatch();

    const handleBioClassChange = (option: SelectOption) => {
      dispatch(setSelectedVcrossBioCls(option));
    }

    const handleBioClassTimeChange = (date: string) => {
      dispatch(setSelectedBioclassTime(date));
    }

    const handleToggleSegment = () => {
      dispatch(toggleVcrossBioclassSegment());
    }


    const handleSubmitPopup = () => {
      dispatch(closeVcrossBioclassPopup());
      onSubmitPopup?.();
    }

  return (
    <OptionPopover
        hoverText='Select Classification Data'
        customIcon={<BirdIcon className='w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4'/>}
        isOpen={isClassifPopupOpen}
        onClose={() => dispatch(closeVcrossBioclassPopup())}
        onOpen={() => dispatch(toggleVcrossBioclassPopup())}
    >

      {/* Select class data to display */}
      <small className='font-semibold'>Available classification data</small>
      <div className="border-b border-b-gray-400"/>
      <SimpleSelect
        onSelectValue={handleBioClassChange}
        options={availableBioClass}
        width='w-95'
        value={selectedBioClass.displayText}
      />

      {/* Toggle on/off segment */}
      <small className='font-semibold'>Segment</small>
      <div className="border-b border-b-gray-400"/>
      <div className="flex items-center justify-start gap-2 px-2">
        <input type="checkbox" checked={segmentBioclass} onChange={handleToggleSegment} name="vcross-bioclass-segment" id="vcross_bioclass_segment" />
        <small>Toggle on/off segement</small>
      </div>

      {/* Select Time */}
      <small className='font-semibold'>Select time</small>
      <div className="border-b border-b-gray-400"/>
      <ReactDatetimePicker
        value={timeBioClass}
        onChange={handleBioClassTimeChange}
      />
      <ButtonBorder
            onClick={handleSubmitPopup}
            className="p-2 mt-2"
            isPrimary
      >

            Display Data

      </ButtonBorder>
        
    </OptionPopover>
  )
}

export default VcrossBioClsDataPopup;
