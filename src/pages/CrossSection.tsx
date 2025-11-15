import React, { Suspense } from 'react';
import SectionCard from '../shared/components/cards/SectionCard';
import MainLayout from '../shared/layouts/MainLayout';
const Vcrossmap = React.lazy(() => import("../features/vcross_map/Vcrossmap"));
const VcrossHeatmap = React.lazy(() => import("../features/vcross_map/VcrossHeatmap"));

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
                  lg:w-full lg:h-full h-screen
                  lg:col-span-2 col-span-1
                `}
              >

                <Suspense fallback={<SectionCard className='w-full h-full animate-pulse'/>}>
                  <Vcrossmap/>
                </Suspense>


              </div>

              <div className={`
                  w-full h-full
                  lg:col-span-2 col-span-1
                `}
              >
                 <Suspense fallback={<SectionCard className='w-full h-full animate-pulse'/>}>
                  <SectionCard className='w-full h-full flex items-center justify-center p-1'>    
                      <VcrossHeatmap/>
                  </SectionCard>
                 </Suspense>

              </div>


          </div>
        


    </MainLayout>
  )
}

export default CrossSection
