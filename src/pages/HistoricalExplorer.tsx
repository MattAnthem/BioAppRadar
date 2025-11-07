
import VpHistChart from '../features/history_charts/components/VpHistChart';
import VptsHistChart from '../features/history_charts/components/VptsHistChart';
import VtipHistChart from '../features/history_charts/components/VtipHistChart';
import HistoryMap from '../features/history_map/HistoryMap';
import MainLayout from '../shared/layouts/MainLayout';

const HistoricalExplorer = () => {
  return (
    <MainLayout>

        <div id='livemap' className="xl:grid mb-4 h-full lg:h-[60vh] flex flex-col w-full grid-cols-1 xl:grid-cols-8 gap-2 overflow-y-hidden">

                    
          <div className="h-full lg:col-span-6">
              <HistoryMap/>
          </div>

          <VpHistChart showControls className="w-full lg:h-full xl:h-full  lg:col-span-2"/>

        </div>

        <div className="xl:grid lg:grid lg:grid-cols-2 grid-cols-1 w-full lg:h-1/3 gap-2">

          <VtipHistChart showControls className="lg:col-span-1 w-full lg:h-full xl:h-full h-[60vh]"/>

          <VptsHistChart showControls className="lg:col-span-1 w-full lg:h-full xl:h-full h-[60vh]"/>

        </div>
        

    </MainLayout>
  )
}

export default HistoricalExplorer;
