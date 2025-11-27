import SectionCard from '../shared/components/cards/SectionCard';
import CustomSlider from '../shared/components/slider/CustomSlider';
import MainLayout from '../shared/layouts/MainLayout';

const Notifications = () => {

  const onChageAlt = (alt: number) => {
    console.log('Calling API WITH altitude ', alt)
  } 

  return (
    <MainLayout id='notification-center' className='h-full w-full flex items-center justify-center  min-h-screen py-18'>

      <SectionCard  className='w-full h-full flex items-center justify-center'>
        <div className="h-[60vh]">
          <CustomSlider
            maxAltitude={5000}
            onChangeAltitude={onChageAlt}
          />
        </div>


      </SectionCard>

    </MainLayout>
  )
}

export default Notifications;
