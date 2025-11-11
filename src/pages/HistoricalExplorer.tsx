
import VpHistChart from '../features/history_charts/components/VpHistChart';
import VptsHistChart from '../features/history_charts/components/VptsHistChart';
import VtipHistChart from '../features/history_charts/components/VtipHistChart';
import HistoryMap from '../features/history_map/HistoryMap';
import DashboardLayout from '../shared/layouts/DashboardLayout';

const HistoricalExplorer = () => {
  return (

    <DashboardLayout
      map={<HistoryMap/>}
      vpChart={<VpHistChart/>}
      vtipChart={<VtipHistChart/>}
      vptsChart={<VptsHistChart/>}
    />
  )
}

export default HistoricalExplorer;
