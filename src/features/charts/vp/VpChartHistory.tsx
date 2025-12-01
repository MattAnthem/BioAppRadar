import  { useMemo, lazy } from 'react'
import { useAppSelector } from '../../../store/hooks';
import dayjs from 'dayjs';
import { useVpHistData } from './hooks/useData/useVpHistData';

const VpMdlHistory = lazy(() => import('./modals/VpMdlHistory'));
const VpChartWrapper = lazy(() => import('../common/wrappers/VpChartWrapper'));
const VpHistPopup = lazy(() => import('./popups/VpHistPopup'));
const VpChartHighcharts = lazy(() => import('../../../shared/components/charts/HighchartsVP'));

const VpChartHistory = () => {
      // Redux
  const { currentAltitude } = useAppSelector(state => state.hist_altitude);

  // Chart data fetching
  const { isLoading, data, error } = useVpHistData();

  const chartTime = useMemo(() => {
    if (!data) return null;
    const vp_time = dayjs(data.time).add(2, 'hour').format("YYYY-MM-DD HH:mm:ss");
    return { vp_time }
  }, [data]);

  
  const capitalize = (s: string | undefined) => {
    if( s === undefined) return "";
    return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
  }

  const title = data ? `${capitalize(data?.query_spec)} - ${data?.name ?? ''} (${data?.units ?? ''})` : '';
  
  return (
    <VpChartWrapper
        title={title}
        ModalComponent={VpMdlHistory}
        PopupComponent={VpHistPopup}
        selectedHeight={currentAltitude}
        data={data}
        error={error}
        isLoading={isLoading}
        time={chartTime?.vp_time}
        ChartComponent={VpChartHighcharts}
    />
  )
}

export default VpChartHistory
