import { useEffect, useMemo, lazy } from 'react';
import { useVpTemporalCoverageQuery } from '../../../shared/hooks/useQuery/useVpTemporalCoverageQuery';
import { useAppDispatch } from '../../../store/hooks';
import dayjs from 'dayjs';
import { changeVtipPayload } from './slices/vtipChartSlice';
import { useVtipData } from './hooks/useData/useVtipData';

const VtipMdlDashboard = lazy(() => import('./modals/VtipMdlDashboard'));
const VtipSpeciePopup = lazy(() => import('./popups/VtipSpeciePopup'));
const VtipChart = lazy(() => import('../../../shared/components/charts/HighchartsVTIP'));
const VtipChartWrapper = lazy(() => import('../common/wrappers/VtipChartWrapper'));

const VtipChartDashboard = () => {
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
      if( s === undefined) return "";
      return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
    }
  
    const title = data ? `${capitalize(data?.query_spec)} - ${data?.name ?? ''} (${data?.units ?? ''})` : '';

  return (
    <VtipChartWrapper
        ModalComponent={VtipMdlDashboard}
        PopupComponent={VtipSpeciePopup}
        data={data}
        error={error}
        isLoading={(isLoading || isRefetching)}
        title={title} 
        ChartComponent={VtipChart}
    />
  )
}

export default VtipChartDashboard;
