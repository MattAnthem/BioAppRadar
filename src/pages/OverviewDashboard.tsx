import LiveMap from "../features/livemap/LiveMap"
import VpChart from "../features/vp_chart/VpChart"
import VptsChart from "../features/vpts_chart/VptsChart"
import VtipChart from "../features/vtip_chart/VtipChart"
import MainLayout from "../shared/layouts/MainLayout"


const OverviewDashboard = () => {
  return (
    <MainLayout>

        {/* Live map  */}
        <div id='livemap' className="xl:grid lg:h-full flex-col w-full grid-cols-1 xl:grid-cols-6 gap-4">

            {/* Live Map */}
            <div className="lg:h-full h-[60vh] lg:col-span-4">
                <LiveMap
                  drawable={false}
                  enableLineDraw={false}
                  displayTimeline={true}
                />
            </div>

            <div className="w-full h-full lg:col-span-2 col-span-4 grid lg:grid-rows-3 gap-2">

                <VtipChart className="row-span-1 w-full lg:h-full xl:h-full h-[60vh]"/>
                <VpChart className="row-span-1 w-full lg:h-full xl:h-full h-[60vh]"/>
                <VptsChart className="row-span-1 w-full lg:h-full xl:h-full h-[60vh]"/>

            </div>
  

        </div>


    </MainLayout>
  )
}

export default OverviewDashboard
