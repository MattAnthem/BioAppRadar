import { lazy } from "react";
import { useVtipHistData } from "./hooks/useData/useVtipHistData";

const VtipChartWrapper = lazy(() => import('../common/wrappers/VtipChartWrapper'));
const VtipMdlHistory = lazy(() => import('./modals/VtipMdlHistory'));
const VtipHistPopup = lazy(() => import('./popups/VtipHistPopup'));
const VtipChart = lazy(() => import('../../../shared/components/charts/HighchartsVTIP'));

const VtipChartHistory = () => {
  // Tanstack
  const { isLoading, data, error } = useVtipHistData();

  const capitalize = (s: string | undefined) => {
    if( s === undefined) return "";
    return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
  }

  const title = data ? `${capitalize(data?.query_spec)} - ${data?.name ?? ''} (${data?.units ?? ''})` : '';

  return (
    <VtipChartWrapper
        title={title}
        ModalComponent={VtipMdlHistory}
        PopupComponent={VtipHistPopup}
        data={data}
        error={error}
        isLoading={isLoading}
        ChartComponent={VtipChart}
    />
  )
}

export default VtipChartHistory
