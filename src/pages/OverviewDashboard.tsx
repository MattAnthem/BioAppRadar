import LiveMap from "../features/livemap/LiveMap"
import VpChart from "../features/vp_chart/VpChart"
import VptsChart from "../features/vpts_chart/VptsChart"
import VtipChart from "../features/vtip_chart/VtipChart"
import MainLayout from "../shared/layouts/MainLayout"


const OverviewDashboard = () => {
  return (
    <MainLayout>


        <div className="w-full h-full px-4 py-2 grid grid-rows-[auto_1fr] gap-2">

            <div className="grid grid-cols-1 xl:grid-cols-8 gap-2">
              <div className="col-span-1 xl:col-span-6 h-[55vh] lg:h-full">
                <LiveMap drawable={false} enableLineDraw={false}/>
              </div>

              <div className="col-span-1 xl:col-span-2">
                <VpChart className="w-full h-[55vh]" />
              </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <VtipChart className="w-full h-[50vh] lg:h-full" />
              <VptsChart className="w-full h-[50vh] lg:h-full" />
            </div>

        </div>
        

    </MainLayout>
  )
}

export default OverviewDashboard;
