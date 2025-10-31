import MainLayout from '../shared/layouts/MainLayout';
import LiveMap from '../features/livemap/LiveMap';

const CrossSection = () => {
  return (
    <MainLayout className='lg:flex items-center'>
        
        <div className="xl:grid grid-cols-9 h-[80vh] w-full gap-2">

          {/* Map */}
          <LiveMap
            drawable={false}
            enableLineDraw={true}
            displayTimeline={false}
          />

          {/* Generated cross section */}


        </div>


    </MainLayout>
  )
}

export default CrossSection
