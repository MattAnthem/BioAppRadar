import LiveMap from "../features/livemap/LiveMap"
import VpChart from "../features/vp_chart/VpChart"
import VptsChart from "../features/vpts_chart/VptsChart"
import VtipChart from "../features/vtip_chart/VtipChart"
import MainLayout from "../shared/layouts/MainLayout"


const OverviewDashboard = () => {
  return (
    <MainLayout>

        
      <div className="w-full h-screen px-4 py-4 grid grid-rows-[auto_1fr] gap-2">

        {/* Première ligne : LiveMap + VpChart */}
        <div className="grid grid-cols-1 xl:grid-cols-8 gap-2 h-1/2">
          {/* Carte */}
          <div className="col-span-1 xl:col-span-6 h-full">
            <LiveMap drawable={false} enableLineDraw={false} />
          </div>

          {/* Graphique vertical */}
          <div className="col-span-1 xl:col-span-2 h-full">
            <VpChart className="w-full h-full" />
          </div>
        </div>

        {/* Deuxième ligne : deux graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-1/2">
          <div className="h-full">
            <VtipChart className="w-full h-full" />
          </div>
          <div className="h-full">
            <VptsChart className="w-full h-full" />
          </div>
        </div>

      </div>


    </MainLayout>
  )
}

export default OverviewDashboard
