import SectionCard from '../shared/components/cards/SectionCard';
import MainLayout from '../shared/layouts/MainLayout';
import Vcrossmap from '../features/vcross_map/Vcrossmap';
import VcrossHeatmap from '../features/vcross_map/VcrossHeatmap';

const CrossSection = () => {



  return (
    <MainLayout className=''>
        
        <div className="xl:grid flex flex-col grid-cols-9 lg:h-[80vh] h-full w-full gap-2">

          <div className="col-span-5 h-full">

            {/* Vcross Map */}
            <Vcrossmap/>

          </div>


          {/* Generated cross section */}
          <SectionCard className='col-span-4 h-full p-1 flex justify-center items-center'>
            <VcrossHeatmap/>
          </SectionCard>

        </div>

        


    </MainLayout>
  )
}

export default CrossSection
