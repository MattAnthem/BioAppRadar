import LiveMap from "../features/livemap/LiveMap"
import VpChart from "../features/vp_chart/VpChart"
import VptsChart from "../features/vpts_chart/VptsChart"
import VtipChart from "../features/vtip_chart/VtipChart"
import MainLayout from "../shared/layouts/MainLayout"


const OverviewDashboard = () => {
  return (
    <MainLayout>


        <div className="w-full h-full px-4 py-2 grid grid-rows-[auto_1fr] gap-4">

            <div className="grid grid-cols-1 xl:grid-cols-8 gap-4 h-[54vh]">

              <div className="col-span-1 xl:col-span-6 h-[54vh]">
                <LiveMap drawable={false} enableLineDraw={false}/>
              </div>

              <div className="col-span-1 xl:col-span-2 h-[54vh]">
                <VpChart className="w-full h-full" />
              </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[15vh]">
              <VtipChart className="w-full h-full" />
              <VptsChart className="w-full h-full" />
            </div>

        </div>
        

    </MainLayout>
  )
}

export default OverviewDashboard;
