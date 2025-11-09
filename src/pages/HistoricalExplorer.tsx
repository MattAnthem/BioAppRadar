
import VpHistChart from '../features/history_charts/components/VpHistChart';
import VptsHistChart from '../features/history_charts/components/VptsHistChart';
import VtipHistChart from '../features/history_charts/components/VtipHistChart';
import HistoryMap from '../features/history_map/HistoryMap';
import MainLayout from '../shared/layouts/MainLayout';

const HistoricalExplorer = () => {
  return (
    <MainLayout>


      <div className="w-full h-full px-4 lg:px-8 xl:px-10 py-2 flex flex-col lg:grid lg:grid-rows-[auto_1fr] gap-1.5">

            <div className="xl:grid grid-cols-1 flex flex-col xl:grid-cols-8 gap-2 h-[55vh]">
              <div className="col-span-1 xl:col-span-6 min-h-[55vh] ">
                <HistoryMap />
              </div>

              <div className="col-span-1 xl:col-span-2 min-h-[55vh]">
                <VpHistChart className="w-full h-full" />
              </div>
            </div>


            <div className="xl:grid flex flex-col grid-cols-1 lg:grid-cols-2 gap-2 lg:min-h-[10vh]">
              <VtipHistChart className="col-span-1 w-full h-full" />
              <VptsHistChart className="col-span-1 w-full h-full" />
            </div>

        </div>
        

    </MainLayout>
  )
}

export default HistoricalExplorer;
