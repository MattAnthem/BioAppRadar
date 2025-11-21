import SectionCard from "../../../shared/components/cards/SectionCard";
import VpChartHighcharts from "../../../shared/components/charts/HighchartsVP";
import { useAppSelector } from "../../../store/hooks";
import { useVpHistData } from "../hooks/useData/useVpHistData";
import loader from '../../../assets/loader.webp';
import { Unplug } from "lucide-react";
import { lazy, Suspense } from "react";
import { capitalize } from "../../../shared/utils/text_format";

const VpHistPopup = lazy(() => import('./popups/VpHistPopup'));
const VpHistModal = lazy(() => import('./modals/VpHistModal'));


type VpChartProps = {
  className?: string;
}

const VpHistChart = ({ className }: VpChartProps) => {

  // Redux
  const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.hist_altitude);
  const currentHeight = altitudeOptions[currentAltitudeIndex];

  // Chart data fetching
  const { isLoading, data, error } = useVpHistData();


  return (
    <SectionCard className={`${className} h-full flex flex-col`}>

        {/* Heading */}
        <div className="p-1 w-full flex justify-between items-center">
            <h3 className='tracking-wider text-xs font-semibold'>{`${capitalize(data?.query_spec) ?? '--'} - ${data?.name ?? '--'} (${data?.units ?? '--'})`}</h3>
            
            <div className="flex justify-center gap-2">

              {/* controls */}
              <Suspense>
                <VpHistPopup />
              </Suspense>

              {/* Modal  */}
              <Suspense>
                <VpHistModal />
              </Suspense>

            </div>
            
        </div>           

        {/* Chart */}
        <div className="h-full flex-col grid px-2 pb-2">
          {(data && !error) && (

            <VpChartHighcharts
              data={data}
              selectedHeight={currentHeight}
            />

          )}
          {
              isLoading && (
                  <div className="w-full h-full flex items-center justify-center">
                      <img src={loader} alt="loading-vphist" width={25} height={25}  />
                  </div>
              )
          }
          {         
            error && (
              <div className="flex items-center justify-center">
                <Unplug width={25} height={25} className='text-red-500'/>
              </div> 
          )}
        </div>

    </SectionCard>
  )
}

export default VpHistChart;
