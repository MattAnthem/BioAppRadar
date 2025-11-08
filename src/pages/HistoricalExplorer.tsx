
import VpHistChart from '../features/history_charts/components/VpHistChart';
import VptsHistChart from '../features/history_charts/components/VptsHistChart';
import VtipHistChart from '../features/history_charts/components/VtipHistChart';
import HistoryMap from '../features/history_map/HistoryMap';
import MainLayout from '../shared/layouts/MainLayout';

const HistoricalExplorer = () => {
  return (
    <MainLayout>


      <div className="w-full h-full px-4 py-2 grid grid-rows-[auto_fr] gap-2">

            <div className="grid grid-cols-1 xl:grid-cols-8 gap-2">
              <div className="col-span-1 xl:col-span-6 h-[55vh]">
                <HistoryMap />
              </div>

              <div className="col-span-1 xl:col-span-2">
                <VpHistChart className="w-full h-[55vh]" />
              </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <VtipHistChart className="w-full h-[50vh] lg:h-full" />
              <VptsHistChart className="w-full h-[50vh] lg:h-full" />
            </div>

        </div>
        

    </MainLayout>
  )
}

export default HistoricalExplorer;
