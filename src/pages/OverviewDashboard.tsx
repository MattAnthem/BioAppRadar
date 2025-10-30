import LiveMap from "../features/livemap/LiveMap"
import VpChart from "../features/vp_chart/VpChart"
import VptsChart from "../features/vpts_chart/VptsChart"
import VtipChart from "../features/vtip_chart/VtipChart"
import MainLayout from "../shared/layouts/MainLayout"


const OverviewDashboard = () => {
  return (
    <MainLayout>

        {/* Live map + charts (VP and VPTS) section */}
        <div id='livemap' className="mb-2 lg:h-[90vh] flex-col w-full ">

            {/* Live Map */}
            <div className="lg:h-full h-[60vh] lg:col-span-4">
                <LiveMap
                  drawable={false}
                />
            </div>



        </div>

        <div className="xl:grid xl:grid-cols-3 gap-4 ">
          <VtipChart/>
          <VpChart/>
          <VptsChart/>
        </div>


    </MainLayout>
  )
}

export default OverviewDashboard
