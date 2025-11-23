import {lazy, Suspense} from "react";
import { Fullscreen, Settings2, Unplug } from "lucide-react";
import loader from '../../../assets/loader.webp';
import { useVptsHistData } from "../hooks/useData/useVptsHistData";

const VptsHistPopup = lazy(() => import('./popups/VptsHistPopup'));
const VptsHistModal = lazy(() => import('./modals/VptsHistModal'))
const VptsHeatmapChart = lazy(() => import('../../../shared/components/charts/HighchartsVpts'));
const SectionCard = lazy(() => import('../../../shared/components/cards/SectionCard'));

type VptsChartProps = {
  className?: string;
}

const VptsHistChart = ({className}: VptsChartProps) => {

  // Tanstack
  const { isLoading, data, error } = useVptsHistData();

  const capitalize = (s: string | undefined) => {
    if( s === undefined) return "--";
    return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
  }

  return (
    <SectionCard className={`${className} w-full h-full flex flex-col`}>

        {/* Heading */}
        <div className="p-1 relative w-full flex justify-between items-center">
            <h3 className='tracking-wider text-xs font-semibold'>{`${capitalize(data?.query_spec)} - ${data?.name ?? '--'} (${data?.units ?? '--'}) `}</h3>
            
            <div className="flex gap-2">
              
                {/* Controls */}
                <Suspense fallback={
                  <div className=" p-1 rounded-sm">
                    <Settings2 width={15} height={15} />
                  </div>}
                >
                  <VptsHistPopup />
                </Suspense>

                {/* Modal */}
                <Suspense fallback={
                  <div className=" p-1 rounded-sm">
                    <Fullscreen width={15} height={15}/>
                  </div> }
                >
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
