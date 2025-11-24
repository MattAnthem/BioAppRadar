import { lazy, Suspense } from "react";
import { Fullscreen, Settings2, Unplug } from "lucide-react";
import loader from '../../../assets/loader.webp';
import { useVtipHistData } from "../hooks/useData/useVtipHistData";


const VtipHistPopup = lazy(() => import('./popups/VtipHistPopup'));
const VtipHistModal = lazy(() => import('./modals/VtipHistModal'));
const HighchartVtip = lazy(() => import('../../../shared/components/charts/HighchartsVTIP'));
const SectionCard = lazy(() => import('../../../shared/components/cards/SectionCard'));

type VtipChartProps = {
  className?: string;
}

const VtipHistChart = ({ className }: VtipChartProps) => {

  // Tanstack
  const { isLoading, data, error } = useVtipHistData();

  const capitalize = (s: string | undefined) => {
    if( s === undefined) return "--";
    return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
  }
  

  return (
    <SectionCard className={`${className} w-full h-full flex flex-col`}>
      
          {/* Heading */}
          <div className="p-1 relative w-full flex items-center justify-between">
              <h1 className='tracking-wider text-xs font-semibold'>{`${capitalize(data?.query_spec)} - ${data?.name ?? '--'} (${data?.units ?? '--'})`}</h1>


              <div className="flex gap-2">

                {/* Controls popup */}
                <Suspense fallback={
                  <div className=" p-1 rounded-sm">
                    <Settings2 width={15} height={15} />
                  </div>}
                >
                  <VtipHistPopup />
                </Suspense>
                
                {/* Modal */}
                <Suspense fallback={
                  <div className=" p-1 rounded-sm">
                    <Fullscreen width={15} height={15}/>
                  </div> }
                >
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
                    <img aria-label="" src={loader} alt="loading-vphist" width={25} height={25}  />
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
