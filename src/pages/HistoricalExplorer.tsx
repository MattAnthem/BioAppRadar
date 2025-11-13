
import VpHistChart from '../features/history_charts/components/VpHistChart';
import VptsHistChart from '../features/history_charts/components/VptsHistChart';
import VtipHistChart from '../features/history_charts/components/VtipHistChart';
import HistoryMap from '../features/history_map/HistoryMap';
import MainLayout from '../shared/layouts/MainLayout';

const HistoricalExplorer = () => {
  return (
    <MainLayout className="w-full min-h-screen">
      
      <div 
        className={`
          lg:h-full lg:w-full
          lg:px-4 lg:py-8 py-4
          flex flex-col  
          lg:grid lg:grid-rows-[4fr_2fr] gap-2  
        `}
      >

            {/* Top GRID */}
            <div 
              className={`
                lg:h-full lg:w-full 
                lg:row-span-[4fr] row-span-1

                flex flex-col
                lg:grid lg:grid-cols-5 gap-2
              `}
            >

              {/* Map */}
              <div 
                className={`
                  lg:w-full lg:h-full h-[60vh]
                  lg:col-span-4
                `}
              >
                  <HistoryMap/>
              </div>

              {/* VP chart */}
              <div 
                className={`
                  lg:w-full lg:h-full 
                  lg:col-span-1 
                `}
              >
                <VpHistChart/>
              </div>

            </div>

            {/* Bottom GRID */}
            <div 
              className={`
                lg:h-full lg:w-full 
                lg:row-span-[2fr] row-span-1

                flex flex-col 
                lg:grid lg:grid-cols-2 gap-2
              `}
            >

              {/* Vtip chart */}
              <div className={`
                lg:w-full lg:h-full
                lg:col-span-1
                `}
              >
                <VtipHistChart/>
              </div>

              {/* Vpts Chart */}
              <div className={`
                lg:w-full lg:h-full 
                lg:col-span-1
                `}>
                <VptsHistChart/>
              </div>

            </div>


      </div>

    </MainLayout>
  )
}

export default HistoricalExplorer;
