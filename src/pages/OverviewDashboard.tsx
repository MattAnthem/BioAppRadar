import LiveMap from "../features/livemap/LiveMap"
import VpChart from "../features/vp_chart/VpChart"
import VptsChart from "../features/vpts_chart/VptsChart"
import VtipChart from "../features/vtip_chart/VtipChart"
import MainLayout from "../shared/layouts/MainLayout"


const OverviewDashboard = () => {
  return (
    <MainLayout className="lg:overflow-y-hidden!">

        <div className="grid grid-rows-2"></div>
        {/* Live map  */}
        <div id='livemap' className="xl:grid mb-2 h-full lg:h-[60vh] flex flex-col w-full grid-cols-1 xl:grid-cols-8 gap-4">

            {/* Live Map */}
            <div className="h-full lg:col-span-6">
                <LiveMap
                  drawable={false}
                  enableLineDraw={false}
                  displayTimeline={true}
                />
            </div>


            {/* Vp Chart */}
            <VpChart  className="w-full lg:h-full xl:h-full  lg:col-span-2"/>

  

        </div>

        <div className="xl:grid lg:grid lg:grid-cols-2 w-full h-full  grid lg:grid-rows-3 gap-2">

            <VtipChart className="lg:col-span-1 w-full lg:h-full xl:h-full h-[60vh]"/>
            
            <VptsChart className="lg:col-span-1 w-full lg:h-full xl:h-full h-[60vh]"/>

        </div>


    </MainLayout>
  )
}

export default OverviewDashboard
