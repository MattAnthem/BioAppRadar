import React from "react";
import MainLayout from "../shared/layouts/MainLayout"
const LiveMap = React.lazy(() => import("../features/livemap/LiveMap"));
const VpChart = React.lazy(() => import("../features/vp_chart/VpChart"));
const VptsChart = React.lazy(() => import("../features/vpts_chart/VptsChart"));
const VtipChart = React.lazy(() => import("../features/vtip_chart/VtipChart"));

const OverviewDashboard = () => {
  return (
    <MainLayout className="w-full min-h-screen">
      
      <div 
        className={`
          lg:h-full lg:w-full
          lg:px-4 lg:py-8 py-4
          flex flex-col  
          lg:grid lg:grid-rows-[4fr_2fr] gap-2  
        `}
      >

            {/* Top GRID */}
            <div 
              className={`
                lg:h-full lg:w-full 
                lg:row-span-[4fr] row-span-1

                flex flex-col
                lg:grid lg:grid-cols-5 gap-2
              `}
            >

              {/* Map */}
              <div 
                className={`
                  lg:w-full lg:h-full h-[60vh]
                  lg:col-span-4
                `}
              >
                  <LiveMap/>
              </div>

              {/* VP chart */}
              <div 
                className={`
                  lg:w-full lg:h-full 
                  lg:col-span-1 
                `}
              >
                <VpChart/>
              </div>

            </div>

            {/* Bottom GRID */}
            <div 
              className={`
                lg:h-full lg:w-full 
                lg:row-span-[2fr] row-span-1

                flex flex-col 
                lg:grid lg:grid-cols-2 gap-2
              `}
            >

              {/* Vtip chart */}
              <div className={`
                lg:w-full lg:h-full
                lg:col-span-1
                `}
              >
                <VtipChart/>
              </div>

              {/* Vpts Chart */}
              <div className={`
                lg:w-full lg:h-full 
                lg:col-span-1
                `}>
                <VptsChart/>
              </div>

            </div>


      </div>

    </MainLayout>
  )
}

export default OverviewDashboard;
