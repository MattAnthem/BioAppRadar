import { lazy, Suspense } from "react";
import SectionCard from "../../../shared/components/cards/SectionCard";
import { Unplug } from "lucide-react";
import loader from '../../../assets/loader.webp';
import HighchartVtip from "../../../shared/components/charts/HighchartsVTIP";
import { useVtipHistData } from "../hooks/useData/useVtipHistData";
import { capitalize } from "../../../shared/utils/text_format";


const VtipHistPopup = lazy(() => import('./popups/VtipHistPopup'));
const VtipHistModal = lazy(() => import('./modals/VtipHistModal'));


type VtipChartProps = {
  className?: string;
}

const VtipHistChart = ({ className }: VtipChartProps) => {

  // Tanstack
  const { isLoading, data, error } = useVtipHistData();

  return (
    <SectionCard className={`${className} w-full h-full flex flex-col`}>
      
          {/* Heading */}
          <div className="p-1 w-full flex items-center justify-between">
              <h3 className='tracking-wider text-xs font-semibold'>{`${capitalize(data?.query_spec)} - ${data?.name ?? '--'} (${data?.units ?? '--'})`}</h3>


              <div className="flex gap-2">

                {/* Controls popup */}
                <Suspense>
                  <VtipHistPopup />
                </Suspense>
                
                {/* Modal */}
                <Suspense>
                  <VtipHistModal />
                </Suspense>

              </div>

          </div>

          {/* Chart */}
          <div className="h-full grid px-2 pb-2">
            {
              (data && !error) && (
                <HighchartVtip
                  data={data}
                />
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

export default VtipHistChart;
