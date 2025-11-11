import LiveMap from "../features/livemap/LiveMap"
import VpChart from "../features/vp_chart/VpChart"
import VptsChart from "../features/vpts_chart/VptsChart"
import VtipChart from "../features/vtip_chart/VtipChart"
import DashboardLayout from "../shared/layouts/DashboardLayout"


const OverviewDashboard = () => {
  return (
    <DashboardLayout

      map={<LiveMap drawable={false} enableLineDraw={false}/>}
      vpChart={<VpChart/>}
      vtipChart={<VtipChart/>}
      vptsChart={<VptsChart/>}

    />
  )
}

export default OverviewDashboard;
