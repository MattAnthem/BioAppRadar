import { useEffect, useMemo, lazy, Suspense } from "react";
import { useAppDispatch } from "../../store/hooks"
import { useVtipData } from "./hooks/useVtipData";
import { Fullscreen, Settings2, Unplug } from "lucide-react";
import loader from '../../assets/loader.webp';
import dayjs from "dayjs";
import { useVpTemporalCoverageQuery } from "../../shared/hooks/useQuery/useVpTemporalCoverageQuery";
import { changeVtipPayload } from "./vtipChartSlice";

const VtipModal = lazy(() => import("./modal/VtipModal"));
const VtipSpeciePopup = lazy(() => import('./popup/VtipSpeciePopup'));
const HighchartVtip = lazy(() => import('../../shared/components/charts/HighchartsVTIP'));
const SectionCard = lazy(() => import('../../shared/components/cards/SectionCard'));

type VtipChartProps = {
  className?: string;
}

const VtipChart = ({ className }: VtipChartProps) => {

  const dispatch = useAppDispatch();

  // --- Temporal coverages to restrict time selects  ---
  const { data: temporal, isSuccess, isRefetching } = useVpTemporalCoverageQuery(1, {
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  // --Adjust time to use fresh timerange from the time coverage ---
  const adjustedTimes = useMemo(() => {
        if (!temporal) return null;
      
        const fresh_end = dayjs(temporal.end_time).add(2, "hour").format("YYYY-MM-DD HH:mm:ss");
        const fresh_start = dayjs(fresh_end).subtract(1, "hour").format("YYYY-MM-DD HH:mm:ss");
      
        return { fresh_start, fresh_end };
  }, [temporal]);

  // --- Hydrate Redux Slice if the query succeed
  useEffect(() => {
      if(!isSuccess || !adjustedTimes) return;
      dispatch(changeVtipPayload(
          {
            startTime: adjustedTimes.fresh_start,
            endTime: adjustedTimes.fresh_end,
          }
  ));

  }, [adjustedTimes, dispatch, isSuccess]);

  // Tanstack
  const { isLoading, data, error } = useVtipData();

  const capitalize = (s: string | undefined) => {
    if( s === undefined) return "--";
    return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
  }


  return (
    <SectionCard className={`${className} w-full h-full flex flex-col`}>
  
          {/* Heading */}
          <div className="p-1 relative w-full flex items-center justify-between">
              <h1 className='tracking-wider text-xs font-semibold'>{`${capitalize(data?.query_spec)} - ${data?.name ?? '--'} (${data?.units ?? '--'})`}</h1>

                <div className="z-5 flex justify-center gap-1.5">

                    {/* Species selection */}
                    <Suspense fallback={
                      <div className=" p-1 rounded-sm">
                        <Settings2 width={15} height={15} />
                      </div>}
                    >
                      <VtipSpeciePopup/>
                    </Suspense>

                    {/* Modal chart */}
                    <Suspense fallback={
                      <div className=" p-1 rounded-sm">
                        <Fullscreen width={15} height={15}/>
                      </div> }
                    >
                      <VtipModal/>
                    </Suspense>

                </div>
                
          </div>

          {/* Chart */}
          <div className="h-full grid px-2 pb-2">
            {
              (data && !isRefetching && !error) && (
                <HighchartVtip
                  data={data}
                />
              )
            }
            {
                (isRefetching || isLoading) && (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <img src={loader} alt="loading-vp" width={25} height={25}  />
                        <small>Updating data...</small>
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

export default VtipChart;
