import SectionCard from '../shared/components/cards/SectionCard';
import MainLayout from '../shared/layouts/MainLayout';
import Vcrossmap from '../features/vcross_map/Vcrossmap';
import VcrossHeatmap from '../features/vcross_map/VcrossHeatmap';

const CrossSection = () => {



  return (
    <MainLayout className='h-full min-h-screen'>
        

        <div 
            className={`
              w-full h-full
              lg:px-4 lg:py-8 py-4
              flex flex-col
              lg:grid lg:grid-cols-4
              gap-2
            `}
          >


              <div className={`
                  w-full h-full
                  lg:col-span-2 col-span-1
                `}
              >

                <SectionCard className='w-full h-full'>
                    <Vcrossmap/>
                </SectionCard>

              </div>

              <div className={`
                  w-full h-full
                  lg:col-span-2 col-span-1
                `}
              >

                <SectionCard className='w-full h-full flex items-center justify-center p-1'>
                    <VcrossHeatmap/>
                </SectionCard>

              </div>


          </div>
        


    </MainLayout>
  )
}

export default CrossSection
