import SectionCard from '../shared/components/cards/SectionCard';
import MainLayout from '../shared/layouts/MainLayout';
import Vcrossmap from '../features/vcross_map/Vcrossmap';
import VcrossHeatmap from '../features/vcross_map/VcrossHeatmap';

const CrossSection = () => {



  return (
    <MainLayout className='w-full h-full'>
        
        <div className="xl:grid flex flex-col xl:grid-cols-9 px-4 lg:px-8 xl:px-10 py-2 grid-cols-1 lg:h-[80vh] h-full w-full gap-2">

          <div className="lg:col-span-5 h-[50vh] lg:h-full">

            {/* Vcross Map */}
            <Vcrossmap/>

          </div>


          {/* Generated cross section */}
          <SectionCard className='col-span-4 w-full h-full p-1 flex justify-center items-center'>
            <VcrossHeatmap/>
          </SectionCard>

        </div>

        


    </MainLayout>
  )
}

export default CrossSection
