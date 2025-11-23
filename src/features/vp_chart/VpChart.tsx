import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useVpData } from "./hooks/useVpData";
import loader from '../../assets/loader.webp';
import { Fullscreen, Settings2, Unplug } from "lucide-react";
import { useEffect, useMemo, lazy, Suspense } from "react";
import dayjs from "dayjs";
import { useVpTemporalCoverageQuery } from "../../shared/hooks/useQuery/useVpTemporalCoverageQuery";
import { changeVpPayload } from "./vpChartSlice";

const VpModal = lazy(() => import('./modal/VpModal'));
const VpChartHighcharts = lazy(() => import('../../shared/components/charts/HighchartsVP'));
const VpSpeciePopup = lazy(() => import('./popup/VpSpeciePopup'));
const SectionCard = lazy(() => import('../../shared/components/cards/SectionCard'));

type VpChartProps = {
  className?: string;
}

const VpChart = ({ className }: VpChartProps) => {

  // Redux
  const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.altitude);
  const currentHeight = altitudeOptions[currentAltitudeIndex];
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
      
        const fresh_time = dayjs(temporal.end_time).add(2, "hour").format("YYYY-MM-DD HH:mm:ss");

        return { fresh_time };
  }, [temporal]);

    // --- Hydrate Redux Slice if the query succeed
  useEffect(() => {
      if(!isSuccess || !adjustedTimes) return;
      dispatch(changeVpPayload(
        {
          time: adjustedTimes.fresh_time
        }
      ));

  }, [adjustedTimes, dispatch, isSuccess]);

  // Chart data fetching
  const { isLoading, data, error } = useVpData();

  const capitalize = (s: string | undefined) => {
    if( s === undefined) return "--";
    return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
  }

  return (
    <SectionCard className={`${className} w-full h-full flex flex-col items-center`}>


        {/* Heading */}
        <div className="p-1 relative w-full flex justify-between items-center">
            <h3 className='tracking-wider text-xs font-semibold'>{capitalize(data?.query_spec)} - {data?.name ?? '--'} ({data?.units ?? '--'})</h3>

            {/* Open the modal */}
            <div className="flex justify-center gap-1 5">

              {/* Species select */}
              <Suspense fallback={
                <div className=" p-1 rounded-sm">
                  <Settings2 width={15} height={15} />
                </div>}
              >
                <VpSpeciePopup/>
              </Suspense>

              {/* Modal chart */}
              <Suspense fallback={
                <div className=" p-1 rounded-sm">
                  <Fullscreen width={15} height={15}/>
                </div> }
              >
                <VpModal/>
              </Suspense>

            </div>

        
        </div>           

        {/* Chart */}
        <div className="h-full grid px-2">
          {(data && !isRefetching && !error) && (

                <VpChartHighcharts
                  data={data}
                  selectedHeight={currentHeight}
                />

            )}
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
        <small className="font-semibold">{adjustedTimes?.fresh_time.split(' ')[0] ?? ' '} <span className="font-normal">{`${adjustedTimes?.fresh_time.split(' ')[1] ?? ' '}`}</span> </small>

    </SectionCard>
  )
}

export default VpChart;
