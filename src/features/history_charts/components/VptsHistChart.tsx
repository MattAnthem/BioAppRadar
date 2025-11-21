import {lazy, Suspense} from "react";
import SectionCard from "../../../shared/components/cards/SectionCard";
import { Unplug } from "lucide-react";
import loader from '../../../assets/loader.webp';
import VptsHeatmapChart from "../../../shared/components/charts/HighchartsVpts";
import { useVptsHistData } from "../hooks/useData/useVptsHistData";
import { capitalize } from "../../../shared/utils/text_format";

const VptsHistPopup = lazy(() => import('./popups/VptsHistPopup'));
const VptsHistModal = lazy(() => import('./modals/VptsHistModal'))

type VptsChartProps = {
  className?: string;
}

const VptsHistChart = ({className}: VptsChartProps) => {

  // Tanstack
  const { isLoading, data, error } = useVptsHistData();

  return (
    <SectionCard className={`${className} w-full h-full flex flex-col`}>

        {/* Heading */}
        <div className="p-1 w-full flex justify-between items-center">
            <h3 className='tracking-wider text-xs font-semibold'>{`${capitalize(data?.query_spec)} - ${data?.name ?? '--'} (${data?.units ?? '--'}) `}</h3>
            
            <div className="flex gap-2">
              
                {/* Controls */}
                <Suspense>
                  <VptsHistPopup />
                </Suspense>

                {/* Modal */}
                <Suspense>
                  <VptsHistModal />
                </Suspense>

            </div>
        </div>           

        {/* Chart */}
        <div className="h-full grid px-2 pb-2">
          {
            (data && !error) && (
              <VptsHeatmapChart data={data}/>
            )
          }
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

export default VptsHistChart;
