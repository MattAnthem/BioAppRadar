import LiveMap from "../features/livemap/LiveMap"
import VpChart from "../features/vp_chart/VpChart"
import VptsChart from "../features/vpts_chart/VptsChart"
import MainLayout from "../shared/layouts/MainLayout"


const OverviewDashboard = () => {
  return (
    <MainLayout>

        {/* Live map + charts (VP and VPTS) section */}
        <div id='livemap' className="xl:grid lg:h-full flex-col w-full grid-cols-1 xl:grid-cols-6 gap-4">

            {/* Live Map */}
            <div className="lg:h-full h-[60vh] lg:col-span-4">
                <LiveMap
                  drawable={false}
                />
            </div>

            {/* VP and VPTS charts */}
            <div className="w-full h-full lg:col-span-2 col-span-4 grid lg:grid-rows-2 gap-4">

              {/* VP */}
              <VpChart/>

              {/* VPTS */}
              <VptsChart/>

            </div>

        </div>

    </MainLayout>
  )
}

export default OverviewDashboard
