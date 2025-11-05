import SectionCard from '../shared/components/cards/SectionCard';
import MainLayout from '../shared/layouts/MainLayout';
import Vcrossmap from '../features/vcross_map/Vcrossmap';

const CrossSection = () => {



  return (
    <MainLayout className=''>
        
        <div className="xl:grid flex flex-col grid-cols-9 h-[80vh] w-full gap-2">

          <div className="col-span-5">

            {/* Vcross Map */}
            <Vcrossmap/>

          </div>


          {/* Generated cross section */}
          <SectionCard className='col-span-4 p-1 flex justify-center items-center'>
            <p>Select transect Line</p>
          </SectionCard>

        </div>

        


    </MainLayout>
  )
}

export default CrossSection
