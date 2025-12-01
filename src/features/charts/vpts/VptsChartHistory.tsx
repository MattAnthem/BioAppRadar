import { useVptsHistData } from './hooks/useData/useVptsHistData';
import { lazy } from 'react';

const VptsHeatmapChart = lazy(() => import('../../../shared/components/charts/HighchartsVpts'));
const VptsChartWrapper = lazy(() => import('../common/wrappers/VptsChartWrapper'));
const VptsMdlHistory = lazy(() => import('./modals/VptsMdlHistory'));
const VptsHistPopup = lazy(() => import('./popups/VptsHistPopup'));

const VptsChartHistory = () => {
      // Tanstack
  const { isLoading, data, error } = useVptsHistData();

  const capitalize = (s: string | undefined) => {
    if( s === undefined) return "";
    return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
  }
  return (
    <VptsChartWrapper
        title={`${capitalize(data?.query_spec)} - ${data?.name ?? ''} (${data?.units ?? ''})`}
        ModalComponent={VptsMdlHistory}
        PopupComponent={VptsHistPopup}
        data={data}
        error={error}
        isLoading={isLoading}
        ChartComponent={VptsHeatmapChart}
    />
  )
}

export default VptsChartHistory;
