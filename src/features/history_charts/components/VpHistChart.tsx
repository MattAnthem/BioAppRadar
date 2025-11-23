import { useAppSelector } from "../../../store/hooks";
import { useVpHistData } from "../hooks/useData/useVpHistData";
import loader from '../../../assets/loader.webp';
import { Fullscreen, Settings2, Unplug } from "lucide-react";
import { lazy, Suspense, useMemo } from "react";
import dayjs from "dayjs";

const VpHistPopup = lazy(() => import('./popups/VpHistPopup'));
const VpHistModal = lazy(() => import('./modals/VpHistModal'));
const VpChartHighcharts = lazy(() => import('../../../shared/components/charts/HighchartsVP'));
const SectionCard = lazy(() => import('../../../shared/components/cards/SectionCard'));


type VpChartProps = {
  className?: string;
}

const VpHistChart = ({ className }: VpChartProps) => {

  // Redux
  const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.hist_altitude);
  const currentHeight = altitudeOptions[currentAltitudeIndex];

  // Chart data fetching
  const { isLoading, data, error } = useVpHistData();

  const chartTime = useMemo(() => {
    if (!data) return null;
    const vp_time = dayjs(data.time).add(2, 'hour').format("YYYY-MM-DD HH:mm:ss");
    return { vp_time }
  }, [data]);

  
  const capitalize = (s: string | undefined) => {
    if( s === undefined) return "--";
    return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
  }

  return (
    <SectionCard className={`${className} h-full items-center flex flex-col gap-0.5`}>

        {/* Heading */}
        <div className="p-1 relative w-full flex justify-between items-center">
            <h3 className='tracking-wider text-xs font-semibold'>{`${capitalize(data?.query_spec) ?? '--'} - ${data?.name ?? '--'} (${data?.units ?? '--'})`}</h3>
            
            <div className="flex justify-center gap-2">

              {/* controls */}
              <Suspense fallback={
                <div className=" p-1 rounded-sm">
                  <Settings2 width={15} height={15} />
                </div>}
              >
                <VpHistPopup />
              </Suspense>

              {/* Modal  */}
              <Suspense fallback={
                <div className=" p-1 rounded-sm">
                  <Fullscreen width={15} height={15}/>
                </div> }
              >
                <VpHistModal />
              </Suspense>

            </div>
            
        </div>           

        {/* Chart */}
        <div className="h-full grid px-2 ">
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
        <small className="font-semibold">{chartTime?.vp_time.split(' ')[0] ?? ' '} <span className="font-normal">{`${chartTime?.vp_time.split(' ')[1] ?? ' '}`}</span> </small>

    </SectionCard>
  )
}

export default VpHistChart;
