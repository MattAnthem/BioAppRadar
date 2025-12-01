import { useEffect, useMemo, lazy } from 'react';
import { useVpTemporalCoverageQuery } from '../../../shared/hooks/useQuery/useVpTemporalCoverageQuery';
import { useAppDispatch } from '../../../store/hooks';
import dayjs from 'dayjs';
import { changeVptsPayload } from './slices/vptsChartSlice';
import { useVptsData } from './hooks/useData/useVptsData';

const VptsMdlDashboard = lazy(() => import('./modals/VptsMdlDashboard'));
const VptsSpeciePopup = lazy(() => import('./popups/VptsSpeciePopup'));
const VptsHeatmapChart = lazy(() => import('../../../shared/components/charts/HighchartsVpts'));
const VptsChartWrapper = lazy(() => import('../common/wrappers/VptsChartWrapper'));

const VptsChartDashboard = () => {
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
    if( s === undefined) return "";
    return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
  }

  const title = data ? `${capitalize(data?.query_spec)} - ${data?.name ?? ''} (${data?.units ?? ''})` : '';

  return (
    <VptsChartWrapper
        title={title}
        ModalComponent={VptsMdlDashboard}
        PopupComponent={VptsSpeciePopup}
        data={data}
        error={error}
        isLoading={(isLoading || isRefetching)}
        ChartComponent={VptsHeatmapChart} 
    />
  )
}

export default VptsChartDashboard;
