import OptionPopover from '../../../shared/components/popups/option/OptionPopover'
import { BirdIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import type { SelectOption } from '../../../shared/components/selects/types';
import SimpleSelect from '../../../shared/components/selects/SimpleSelect';
import { closeVcrossBioclassPopup, setSelectedBioclassTime, setSelectedVcrossBioCls, setVcrossClassificationColorOne, setVcrossClassificationColorZero, toggleVcrossBioclassPopup, toggleVcrossBioclassSegment } from '../slice/vcrossPopupSlice';
import ReactDatetimePicker from '../../../shared/components/input/ReactDatetime';
import ButtonBorder from '../../../shared/components/buttons/borderedbtn/ButtonBorder';

type Props = {
  onSubmitPopup?: () => void;
}

const VcrossBioClsDataPopup = ({ onSubmitPopup }: Props) => {

    const { availableBioClass, selectedBioClass, timeBioClass, color_0, color_1, segmentBioclass, isClassifPopupOpen } = useAppSelector(state => state.vcrosspopup);
    const dispatch = useAppDispatch();

    const handleBioClassChange = (option: SelectOption) => {
      dispatch(setSelectedVcrossBioCls(option));
    }

    const handleColorZeroChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const color = evt.target.value;
      dispatch(setVcrossClassificationColorZero(color)); 

    };

    const handleColorOneChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const color = evt.target.value;
        dispatch(setVcrossClassificationColorOne(color));
    };

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

      {/* Colors for classification targets */}
      <small className='font-semibold'>Select colors </small>
      <div className="border-b border-b-gray-400"/>

      <div className="grid grid-cols-2 w-1/2 gap-0.5 justify-center capitalize items-center">
          <small className='w-fit'>{ selectedBioClass['type0'] as string}:</small>
          <input onChange={handleColorZeroChange} value={color_0} className='w-10 h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm' type="color" name="color_0" id="color_0" />
      </div>
      <div className="grid grid-cols-2 w-1/2 gap-0.5 justify-start items-center capitalize">
          <small className='w-fit'>{ selectedBioClass['type1'] as string}:</small>
          <input onChange={handleColorOneChange} value={color_1} className='w-10 h-8 cursor-pointer hover:ring-1 ring-offset-0 rounded-sm'  type="color" name="color_1" id="color_0" />
      </div>

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
