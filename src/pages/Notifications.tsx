import SectionCard from '../shared/components/cards/SectionCard';
import  ReactDatetimePicker  from '../shared/components/input/ReactDatetime';
import MainLayout from '../shared/layouts/MainLayout';

const Notifications = () => {
  return (
    <MainLayout className='h-full min-h-screen '>

      <SectionCard className='p-8'>
        <ReactDatetimePicker
          value={'2020-10-11 12:00:00'}
        />
      </SectionCard>

    </MainLayout>
  )
}

export default Notifications;
