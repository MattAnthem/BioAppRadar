import { useEffect, lazy,memo } from "react";
import { useVpTemporalCoverageQuery } from "../../../shared/hooks/useQuery/useVpTemporalCoverageQuery";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { changeVpPayload } from "./slices/vpChartSlice";
import { useVpData } from "./hooks/useData/useVpData";
import { useFreshDates } from "../../../shared/hooks/dates/useFreshDates";


const VpChartWrapper = lazy(() => import('../common/wrappers/VpChartWrapper'));
const VpMdlDashboard = lazy(() => import('./modals/VpMdlDashboard'));
const VpSpeciePopup = lazy(() => import('./popups/VpSpeciePopup'));
const VpChartHighcharts = lazy(() => import('../../../shared/components/charts/HighchartsVP'));

type VpChartDashProps = {
  className?: string;
}

const VpChartDashboard = ({ className }: VpChartDashProps) => {
    // Redux
    const { currentAltitude } = useAppSelector(state => state.altitude);
    const dispatch = useAppDispatch();
  
    // --- Temporal coverages to restrict time selects  ---
    const { data: temporal, isSuccess, isRefetching } = useVpTemporalCoverageQuery(1, {
      staleTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      enabled: true,
    });
  
    // --Adjust time to use fresh timerange from the time coverage ---
    const { adjustedStartEndTime: adjustedTimes } = useFreshDates( temporal );
  
      // --- Hydrate Redux Slice if the query succeed
    useEffect(() => {
        if(!isSuccess || !adjustedTimes) return;
        dispatch(changeVpPayload(
          {
            time: adjustedTimes.fresh_end,
          }
        ));
  
    }, [adjustedTimes, dispatch, isSuccess]);
  
    // Chart data fetching
    const { isLoading, data, error } = useVpData();
  
    const capitalize = (s: string | undefined) => {
      if( s === undefined) return "";
      return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
    }

    const title = data ? `${capitalize(data?.query_spec)} - ${data?.name ?? ''} (${data?.units ?? ''})` : '';
  
  return (
    <VpChartWrapper
      title={title}
      ModalComponent={VpMdlDashboard}
      PopupComponent={VpSpeciePopup}
      selectedHeight={currentAltitude}
      data={data}
      error={error}
      isLoading={(isLoading || isRefetching )}
      time={adjustedTimes?.fresh_end}
      className={className}
      ChartComponent={VpChartHighcharts}
    />
  )
}

export default memo(VpChartDashboard);
