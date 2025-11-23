import { useEffect, useMemo, lazy } from "react";
import { useAppDispatch } from "../../store/hooks";
import { useVptsData } from "./hooks/useVptsData";
import { Unplug } from "lucide-react";
import loader from '../../assets/loader.webp';
import dayjs from "dayjs";
import { useVpTemporalCoverageQuery } from "../../shared/hooks/useQuery/useVpTemporalCoverageQuery";
import { changeVptsPayload } from "./vptsChartSlice";

const VptsModal = lazy(() => import('./modal/VptsModal'));
const VptsHeatmapChart = lazy(() => import('../../shared/components/charts/HighchartsVpts'));
const VptsSpeciePopup = lazy(() => import('./popup/VptsSpeciePopup'));
const SectionCard = lazy(() => import('../../shared/components/cards/SectionCard'));

type VptsChartProps = {
  className?: string;
}

const VptsChart = ({className}: VptsChartProps) => {

  // Redux
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
    dispatch(changeVptsPayload(
        {
          startTime: adjustedTimes.fresh_start,
          endTime: adjustedTimes.fresh_end,
        }
    ));

  }, [adjustedTimes, dispatch, isSuccess])

  // Tanstack
  const { isLoading, data, error } = useVptsData();

  const capitalize = (s: string | undefined) => {
    if( s === undefined) return "--";
    return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
  }


  return (
    <SectionCard className={`${className} w-full h-full flex flex-col`}>


        {/* Heading */}
        <div className="p-1 relative w-full flex items-center justify-between">
            <h3 className='tracking-wider text-xs font-semibold'>{`${capitalize(data?.query_spec)} - ${data?.name ?? '--'} (${data?.units ?? '--'})`}</h3>
            {/* Controls */}
            
            <div className="flex justify-center gap-1 5">

              <VptsSpeciePopup/>
              {/* Modal */}
              <VptsModal/>

            </div>
        </div>           

        {/* Chart */}
        <div className="h-full grid px-2 pb-2">
          {
            (data && !isRefetching && !error) && (
              <VptsHeatmapChart data={data}/>
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
              <div className=" flex items-center justify-center">
                <Unplug width={25} height={25} className='text-red-500'/>
              </div> 
          )}
        </div>

    </SectionCard>
  )
}

export default VptsChart;
