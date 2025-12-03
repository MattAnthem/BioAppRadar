import React, { Suspense } from "react";
import MainLayout from "../shared/layouts/MainLayout"
import SectionCard from "../shared/components/cards/SectionCard";
const LiveMap = React.lazy(() => import("../features/livemap/LiveMap"));
const VpChartDashboard = React.lazy(() => import("../features/charts/vp/VpChartDashboard"));
const VptsChartDashboard = React.lazy(() => import("../features/charts/vpts/VptsChartDashboard"));
const VtipChartDashboard = React.lazy(() => import("../features/charts/vtip/VtipChartDashboard"));

const OverviewDashboard = () => {
  return (
    <MainLayout id="overview-dashboard" className="w-full min-h-screen">
      
      <div 
        className={`
          lg:h-full lg:w-full
          lg:px-4 lg:py-5 py-4
          flex flex-col  
          lg:grid lg:grid-rows-[7fr_4fr] gap-2.5   
        `}
      >

            {/* Top GRID */}
            <div 
              className={`
                lg:h-full lg:w-full 
                lg:row-span-[7fr] row-span-1

                flex flex-col
                lg:grid lg:grid-cols-8 gap-2.5
              `}
            >

              {/* Map */}
              <div 
                className={`
                  lg:w-full lg:h-full h-[60vh]
                  lg:col-span-6
                `}
              >
                  <Suspense fallback={<SectionCard className='w-full h-full animate-pulse'/>}>
                    <LiveMap/>
                  </Suspense>
              </div>

              {/* VP chart */}
              <div 
                className={`
                  lg:w-full lg:h-full 
                  lg:col-span-2
                `}
              >
                 <Suspense fallback={<SectionCard className='w-full h-full animate-pulse'/>}>
                  <VpChartDashboard/>
                 </Suspense>
              </div>

            </div>

            {/* Bottom GRID */}
            <div 
              className={`
                lg:h-full lg:w-full 
                lg:row-span-[4fr] row-span-1

                flex flex-col 
                lg:grid lg:grid-cols-2 gap-2.5
              `}
            >

              {/* Vtip chart */}
              <div className={`
                lg:w-full lg:h-full
                lg:col-span-1
                `}
              >
                 <Suspense fallback={<SectionCard className='w-full h-full animate-pulse'/>}>
                  <VtipChartDashboard/>
                 </Suspense>
              </div>

              {/* Vpts Chart */}
              <div className={`
                lg:w-full lg:h-full 
                lg:col-span-1
                `}>
                 <Suspense fallback={<SectionCard className='w-full h-full animate-pulse'/>}>
                  <VptsChartDashboard/>
                 </Suspense>
              </div>

            </div>


      </div>

    </MainLayout>
  )
}

export default OverviewDashboard;
