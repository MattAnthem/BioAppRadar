import { useEffect, lazy } from 'react';
import { useVpTemporalCoverageQuery } from '../../../shared/hooks/useQuery/useVpTemporalCoverageQuery';
import { useAppDispatch } from '../../../store/hooks';
import { changeVptsPayload } from './slices/vptsChartSlice';
import { useVptsData } from './hooks/useData/useVptsData';
import { useFreshDates } from '../../../shared/hooks/dates/useFreshDates';

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
  const {adjustedStartEndTime: adjustedTimes} = useFreshDates( temporal );

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
